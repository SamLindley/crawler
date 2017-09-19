const fetch = require('node-fetch');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

const url = 'https://www.eworkgroup.com/en/eworkid/';
Opportunity = require('../models/opportunity');
OpportunityList = require('../models/opportunity_list_schema');
mongoose.connect('mongodb://localhost/opportunityList');

scrapeEwork = function () {
    fetch('https://www.eworkgroup.com/wp-content/plugins/ework-filters/apirequests.php?' +
        'language_code=sv&competence_group_id=1&competence_area_id=1123&country_id=1350' +
        '&city_id=31740')
        .then((response) => {
            return response.json();
        })
        .then(json => {
            return getIds(json);
        })
        .then(function (idArray) {
            console.log("Starting scraper");
            return crawl(idArray)
        })
};

function getIds(json) {
    return json.data.map(opportunity => {
        return opportunity.id;
    })
}

function crawl(array) {
    let count = 0;
    let newArray = array.map(function (id) {
        return fetch(url + id).then(function (res) {
            return res.text();
        }).then(function (string) {
            const $ = cheerio.load(string);
            console.log("Scraping", id);
            console.log(count++);
            return createOpportunity($);
        })
    });

    Promise.all(newArray).then(function (results) {
        console.log("SCRAPING COMPLETE");
        let count = 0;
        return results.map(function (opportunity) {
            Opportunity.postOpportunity(opportunity);
            console.log(count++);
        });

    }).then(function () {
        console.log("Closing server");
    });
}

function createOpportunity(html) {
    let opportunity = {};
    opportunity.title = html('div.details-description-area > h1').text();
    opportunity.description = html('.description').text();
    opportunity.date = html('table > tbody > tr:nth-child(6)').text();
    return opportunity;
}

getIds();

