const fs = require("fs");
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const path = require("path");

const request = require("request");
const cheerio = require("cheerio");
const AllMatchObj = require("./allMatch")

const iplPath = path.join(__dirname,"ipl");
dirCreater(iplPath);
request(url,cb);

function cb(err,res,html){
    if(err){   
        console.log("Error");
    }else{
        extractLink(html);
    }
}

function extractLink(html){
    let $ = cheerio.load(html);
    let Eurl = $(".widget-items.cta-link").find("a").attr("href");
    let fullLink = "https://www.espncricinfo.com/"+Eurl;
    // console.log(fullLink);
    // getAllMatches(fullLink);

    AllMatchObj.getAlMatches(fullLink);
}

function dirCreater(filePath){
    if(fs.existsSync(filePath) == false){
        fs.mkdirSync(filePath);
    }
}






