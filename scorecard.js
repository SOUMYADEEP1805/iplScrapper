// let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";
let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
let xlsx = require("xlsx");

function processSinglematch(url) {

    request(url, cb);
}

function cb(err,response,html){
    if(err){
        console.log(err);
    }else if(response.statusCode == 404){
        console.log("page not found");
    }else{
        // console.log(html);
        // console.log("html",);

        dataExtractor(html);
    }
}
function dataExtractor(html){
    let searchTool = cheerio.load(html);
    // let infoElem = searchTool(".event .match-info.match-info-MATCH .description");
    let infoElem = searchTool(".header-info .description");
    let matchInfo = infoElem.text().split(",");
    let venue = matchInfo[1].trim();
    let date = matchInfo[2].trim();
    // console.log(venue +" -- "+ date);
    let resultInfo = searchTool(".event .match-info.match-info-MATCH .status-text");
    let result = resultInfo.text().trim();
    // console.log(result);
    //1.team name
    let nameOfTeam = searchTool(".Collapsible h5");
    let batsmanTable = searchTool(".Collapsible .table.batsman");
    for(let i = 0; i < nameOfTeam.length; i++){
        let allRows = searchTool(batsmanTable[i]).find("tbody tr");
            //console.log(allRows);
        for(let j = 0; j < allRows.length; j++){
            let allCols = searchTool(allRows[j]).find("td");
                // console.log(allCols);
            if(allCols.length == 8){
                let myTeam = searchTool(nameOfTeam[i]).text().split("INNINGS")[0].trim();
                // console.log(myTeam);
                myTeam = myTeam.trim();
                let opponent = i == 0 ? searchTool(nameOfTeam[1]).text() : searchTool(nameOfTeam[0]).text();
                opponent = opponent.split("INNINGS")[0].trim();
                // console.log(opponent);
                let name = searchTool(allCols[0]).text();
                // console.log("NAME : " + name);
                let run  = searchTool(allCols[2]).text();
                let ball = searchTool(allCols[3]).text();
                let fours = searchTool(allCols[5]).text();
                let sixers = searchTool(allCols[6]).text();
                let strikeRate = searchTool(allCols[7]).text();

                // console.log(name,"-",run,"-",ball,"-",fours,"-",sixers,"-",strikeRate);
                console.log(`${myTeam} || ${name} || ${venue}  ||  ${date} || ${opponent} || ${result} || ${run} || ${ball} || ${fours} || ${sixers} || ${strikeRate}`);
                console.log("``````````````````````````````````````````````````````````");

                teamFolder(myTeam,name,venue,date,opponent,result,run,ball,fours,sixers,strikeRate);
            }
        }
    }
}



function teamFolder(myTeam,name,venue,date,opponent,result,run,ball,fours,sixers,strikeRate) {
    let teamFolderPath = path.join(__dirname,"ipl",myTeam);
    isDirrectory(teamFolderPath);

    // let filePath = path.join(teamFolderPath,name+".json");
    let filePath = path.join(teamFolderPath,name+".xlsx");
    // let content =[];
    let content  = excelReader(filePath,name);
    let matchObject = {
        myTeam,name,venue,date,opponent,result,run,ball,fours,sixers,strikeRate
    }
    content.push(matchObject);
    // if(fs.existsSync(filePath)) {
    //     let data = fs.readFileSync(filePath);
    //     content = JSON.parse(data);
    // }
    // content.push(matchObject);
    // fs.writeFileSync(filePath, JSON.stringify(content));
    excelWriter(filePath, content, name);

}

function excelReader(filePath, name) {
    if (!fs.existsSync(filePath)) {
        return [];
    } else {
        let wb = xlsx.readFile(filePath);
        let excelData = wb.Sheets[name];
        let ans = xlsx.utils.sheet_to_json(excelData);
        return ans;
    }
}
function excelWriter(filePath, json, name) {
    // console.log(xlsx.readFile(filePath));
    let newWB = xlsx.utils.book_new();
   
    let newWS = xlsx.utils.json_to_sheet(json);
   
    xlsx.utils.book_append_sheet(newWB, newWS, name);
   
    xlsx.writeFile(newWB, filePath);
}







function isDirrectory(teamFolderPath) {
 if(fs.existsSync(teamFolderPath)== false){
     fs.mkdirSync(teamFolderPath);
 }
}

module.exports = {
    psm : processSinglematch
}