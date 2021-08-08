let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
let request = require("request");
let cheerio = require("cheerio");
let scoreCardObj=require("./scorecard")
let fs = require("fs");
let path = require("path");
let dirPath = path.join(__dirname,"ipl");
dirCreater(dirPath)


request(url,cb);
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
    let anchorRep = searchTool('a[data-hover="View All Results"]');
    let link = anchorRep.attr("href");
    //console.log("Link",link);
    let fullMatchPageLink = `https://www.espncricinfo.com${link}`;
    // console.log("Link",fullMatchPageLink)
    request(fullMatchPageLink,allMatchPagecb);
}

function allMatchPagecb(err,response,html){
    if(err){
        console.log(err);
    }else if(response.statusCode == 404){
        console.log("page not found");
    }else{
        // console.log(html);
        // console.log("html",);

        getAllScoreCardLink(html);
    }
}

function getAllScoreCardLink(html){
    let srTool = cheerio.load(html);
    let atagRepo = srTool('a[data-hover="Scorecard"]');
    // let val =1;
    for(let i=0;i<atagRepo.length;i++){
        let link2 = srTool(atagRepo[i]).attr("href");
        let allScoreCardLink = `https://www.espncricinfo.com${link2}`
        // console.log(allScoreCardLink);
        scoreCardObj.psm(allScoreCardLink);
    }
}


function dirCreater(filePath) {

    if (fs.existsSync(filePath) == false) {
        fs.mkdirSync(filePath);
    }

}