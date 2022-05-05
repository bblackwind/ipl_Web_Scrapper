const request = require("request");
const cheerio = require("cheerio");

const scoreCardObj = require("./scorecard");
const xlsx = require("xlsx");

function getAllMatches(url){
    request(url , function(err,res,html){
        if(err){
            console.log("Error");
        }else{
            extractMatchLink(html);
        }
    })
}

function extractMatchLink(html){
    let $ = cheerio.load(html);
    let matchArr = $("a[data-hover='Scorecard']");
    for(let i=0 ; i< matchArr.length ; i++){
        let link = $(matchArr[i]).attr("href");
        let fullLink = "https://www.espncricinfo.com/" + link;
        // console.log(fullLink);

        console.log(fullLink);
        scoreCardObj.ps(fullLink);
    }   
}

module.exports = {
    getAlMatches: getAllMatches
}