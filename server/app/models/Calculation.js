const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

// Create schema
const CalculationSchema = new Schema({
    name: {
        type: String
    },
    university: {
        type: ObjectId,
        ref: 'University'
    },
    path: {
        type: ObjectId,
        ref: 'Path'
    },
    calc: {
        type: String
    },
    isSuggestion: {
        type: Boolean
    },
    role: {
        type: String
    }

})

module.exports = mongoose.model('Calculation', CalculationSchema);