const mongoose = require('mongoose');

const DummyRFCModel = new mongoose.Schema({
    "Last Name, First Name (Legal Name)": String,
});

module.exports = mongoose.model('DummyRFC', DummyRFCModel, 'RFC Dummy');