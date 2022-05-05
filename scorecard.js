

let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";

const request = require("request");
const cheerio = require("cheerio");
const path = require("path");  
const fs = require("fs");
const xlsx = require("xlsx"); 

function processScoreCard(url){
    request(url,cb);
}

function cb(err,res,html){
    if(err){
        console.log("Error");
    }else{
        extractMatchDetails(html);
    }
}

function extractMatchDetails(html){

    let $ = cheerio.load(html);

    let VenueArr = $(".match-header-info.match-info-MATCH .description");
    let stringArr = VenueArr.text().split(",");
    let date = stringArr[2].trim();
    let venue = stringArr[1].trim();
    let result = $(".match-info.match-info-MATCH.match-info-MATCH-half-width .status-text");
    result = $(result).text();
    // let htmlString = "";
    let inningsArr = $(".card.content-block.match-scorecard-table .Collapsible");
    for(let i=0 ; i< inningsArr.length ; i++){
        // htmlString += $(inningsArr[i]).html();
        let teamName = $(inningsArr[i]).find("h5").text();
        teamName=teamName.split("INNINGS")[0].trim();
        let opponentIndex = i==0?1:0;
        let opponentName = $(inningsArr[i]).find("h5").text();
        opponentName=opponentName.split("INNINGS")[0].trim();
        
        let cInnings = $(inningsArr[i]);

        let allRows = cInnings.find(".table.batsman tbody tr");
        for(let j=0 ;j<allRows.length ; j++){
            let allCols = $(allRows[j]).find("td");
            let isWorthy = $(allCols[0]).hasClass("batsman-cell");
            if(isWorthy==true){
                // console.log(allCols.text());
                let playerName = $(allCols[0]).text().trim();
                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let SR = $(allCols[7]).text().trim();

                console.log(`${playerName}  ${runs}  ${balls}  ${fours}  ${sixes}  ${SR}`);
                processPlayer(teamName,playerName,runs,balls,fours,sixes,SR,opponentName,venue,date,result);
            }
    
        }
    }
}

function processPlayer(teamName,playerName,runs,balls,fours,sixes,SR,opponentName,venue,date,result){
    let teamPath = path.join(__dirname,"ipl",teamName);
    dirCreater(teamPath);
    let filePath = path.join(teamPath,playerName +".xlsx");
    let content = excelReader(filePath,playerName);
    let playerObj = {
        teamName,
        playerName,
        playerName,
        runs,
        balls,
        fours,
        sixes,
        SR,
        opponentName,
        venue,
        date,
        result
    }
    content.push(playerObj);
    excelWriter(filePath,content,playerName);
}

function dirCreater(filePath){
    if(fs.existsSync(filePath) == false){
        fs.mkdirSync(filePath);
    }
}

//write
function excelWriter(filePath,json,sheetName){
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB,newWS,sheetName);
    xlsx.writeFile(newWB,filePath);
}

//read
function excelReader(filePath,sheetName){
    if(fs.existsSync(filePath)==false){
        return [];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}


module.exports = {
    ps : processScoreCard
}

