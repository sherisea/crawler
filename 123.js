var http = require('http');
var cheerio = require("cheerio");
 
var uri = "http://e-hentai.org";
http.get(uri,function(res){
	var html = "";
	res.on("data",function(chunk){
		html += chunk;
	});
	res.on("end",function(){
		var $ = cheerio.load(html) ;
	        console.log($("#class a").html());
	});

}).on("error",function(e){

	console.log(e.message);//訪問過程中有錯誤產生直接輸出錯誤訊息

});
