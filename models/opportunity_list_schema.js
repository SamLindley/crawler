const mongoose = require('mongoose');

const opportunityListSchema = mongoose.Schema({
    opportunities:[{
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }]
});

const OpportunityList = module.exports = mongoose.model('OpportunityList', opportunityListSchema);