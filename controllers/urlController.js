const UrlMapping = require("../models/UrlMapping");
const Counters = require("../models/Counters");
const moment = require("moment");
const crypto = require('crypto');
const { isEmpty, isString } = require('lodash');
const AsyncWrapper = require("../utils/AsyncWrapper");
const AppError = require("../utils/AppError");


const generateUrlHash = (url) => {
    if (!isString(url)) throw new AppError("Invalid Url", 400);
    let hash = crypto.createHash('sha1').update(url).digest('hex');
    hash = hash.substring(0, 8);
    return hash;
}


const createUrl = AsyncWrapper(async (req, res) => {
    const { url, createdBy = "", updatedBy = "", expiresIn } = req.body;
    const counterResponse = await Counters.findOneAndUpdate(
        { counterName: "UrlCounter" },
        {
            $inc: { counterValue: 1 }
        },
        { returnOriginal: false }
    );
    const urlHash = `${generateUrlHash(url)}${counterResponse.counterValue}`;
    const response = await UrlMapping.create({
        longUrl: url,
        urlHash,
        expiresAt: moment().add(expiresIn, 'seconds'),
        createdBy,
        updatedBy
    })

    res.status(200).json({
        status: "success",
        shortUrl: `http://localhost:3000/surl/${response.urlHash}`
    })
})


const redirectUrl = AsyncWrapper(async (req, res) => {
    const { hash: urlHash } = req.params;
    const response = await UrlMapping.findOneAndUpdate({
        urlHash
    }, { $inc: { hits: 1 } });
    if (!isEmpty(response)) res.redirect(response.longUrl);
    else res.status(400).json({ status: "success", msg: "Invalid Hash" })
    return;
})
module.exports = { createUrl, redirectUrl }