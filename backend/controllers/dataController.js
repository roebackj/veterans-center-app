const DummyRFCModel = require('../models/DummyRFCModel'); // Ensure the casing matches the file name

const scanData = async (req, res) => {
    try {
        const data = await DummyRFCModel.find({}, {
            _id: 0,
            "Last Name, First Name (Legal Name)": 1,
            "Student ID # (This is NOT your Social Security Number or SSO ID)": 1,
            "Benefit you plan to utilize this term (check all that apply):": 1
        });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching data' });
    }
};

module.exports = { scanData };



