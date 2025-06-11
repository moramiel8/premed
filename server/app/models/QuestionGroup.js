const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const QuestionGroupSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true
    },
    path: {
        type: String
    },
    questions: [{
        question: {
            type: String
        },
        answer: {
            type: String
        },
        source_link: {
            type: String
        }
    }],
    read_more: {
        type: String
    }

})

module.exports = mongoose.model('QuestionGroup', QuestionGroupSchema);