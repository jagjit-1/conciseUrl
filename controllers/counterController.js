const Counters = require("../models/Counters");
const AsyncWrapper = require("../utils/AsyncWrapper");


const createCounter = AsyncWrapper(async (req, res) => {
    const { name, value = 0, createdBy, updatedBy } = req.body;
    const response = await Counters.create({
        counterName: name,
        counterValue: value,
        createdBy,
        updatedBy
    });
    res.status(200).json({
        status: "success"
    })
});

module.exports = { createCounter };