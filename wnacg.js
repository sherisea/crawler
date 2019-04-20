const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const request=require('request');
const fs=require('fs');

async function download (page,bookNumber)
{
    console.log(page);
    let web='wnacg';
    let dir=createDir(web,bookNumber);
    for(let i=0;i<=page.pageNumber-1;i++)
    {
        await downloadImage(page.galleryNumber,i,page.filetype,dir);
    }
}

//Create comic directory
function createDir(mainDir,targetDir){

    if (!fs.existsSync(`./${mainDir}/`)){
        fs.mkdirSync(`./${mainDir}/`);
    }
    if (!fs.existsSync(`./${mainDir}/${targetDir}/`)){
        fs.mkdirSync(`./${mainDir}/${targetDir}/`);
    }
    return `./${mainDir}/${targetDir}`;
}

function getPages(uri){
    return new Promise(function(resolve,reject){
        request(uri, function(err, res, body){

            console.log('get pages');
            let html=new JSDOM(body);
            let document=html.window.document;
            let imageElement=document.getElementsByTagName('img');
            let pages=document.getElementsByTagName('img').length;
            for(let i=0;i<pages-1;i++){
                let resource="https:"+imageElement[i].getAttribute('src');
                request(resource).pipe(fs.createWriteStream(`${targetDir}/${page}.jpg`)).on('close',function(){
                    console.log(`${page} done`);
                });
            }
        });
    });
}
if(process.argv.length<3){
	console.log('usage: node request.js ehentai_website');
	//console.log('example: node '+__filename+' https://e-hentai.org/g/618395/0439fa3666/');
}
else{
	getImage(process.argv[2]);
}
function downloadImage(number,pages,type,targetDir){

    for(let i=1;i<pages-1;i++)
    {
        //need to adjust array iterate
        //i from 1-25, type from 0-24
        let page = i.toString().padStart('3','0');
        let uri=`http://img2.wnacg.download./${number}/${page}${type}`;
        request(uri).pipe(fs.createWriteStream(`${targetDir}/${page}.jpg`)).on('close',function(){
            console.log(`${page} done`);
        });
    }
}

module.exports={
    download:download,
    getPages:getPages
};
