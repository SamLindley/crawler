const fetch = require("node-fetch");
const cheerio = require("cheerio");

function scrapeEwork() {
    const jsonUrl =
        "https://www.eworkgroup.com/wp-content/plugins/ework-filters/apirequests.php?language_code=sv&competence_group_id=1&competence_area_id=1123&country_id=1350&city_id=31740";

//fetch JSON data (currently frontend opertunities in sthml)
    fetch(jsonUrl)
        .then(res => {
            return res.json();
        })
        .then(json => {
            return getIds(json);
        })
        .then(idArray => {
            return getHtml(idArray);
        })
        .then(opportunityPromisesArray => {
            Promise.all(
                opportunityPromisesArray
            ).then(opportunityPromisesArrayResolved => {
                writeToDb(opportunityPromisesArrayResolved);
            });
        })
        //Catch and console.log any errors
        .catch(console.log);
}

//Map through JSON and return Id for all oppertunities
function getIds(json) {
    return json.data.map(opportunity => {
        return opportunity.id;
    });
}



//map through array of Id's and fetch HTML from each subpage
// A new array with promises of JSON data is returned.
function getHtml(idArray) {
    const url = "https://www.eworkgroup.com/en/eworkid";
    return idArray.map(id => {
        return (
            fetch(url + "/" + id)
                .then(res => {
                    return res.text();
                })
                //Parse chosen elements
                .then(string => {
                    const $ = cheerio.load(string, {
                        ignoreWhitespace: true,
                        xmlMode: true
                    });
//construct object with correct properties and return it as JSON
                    return JSON.stringify({
                        title: $("div.details-description-area > h1").text(),
                        description: $("div.details-description-area > .description").html()
                    });
                })
        );
    });
}

//TODO: Write to db etc
function writeToDb(values) {
    console.log(values);
}

scrapeEwork();