const mongoose = require('mongoose');

const opportunitiesSchema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const Opportunity = module.exports = mongoose.model('Opportunity', opportunitiesSchema);

module.exports.getOpportunities = function (callback, limit) {
    Opportunity.find(callback).limit(limit);
};

module.exports.postOpportunity = function (opportunity) {
    Opportunity.create(opportunity, function (err, opp) {
        if(!err){
            console.log("Saved the following opportunity to DB:");
            console.log(opp.title);
        }else {
            console.log(err);
        }
    });
};