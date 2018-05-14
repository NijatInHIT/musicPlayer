var http = require('http');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var queryString=require('querystring');

let head1={
    'content-Type': 'text/html',
    'charset': 'utf-8',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': 'http://localhost:3000'
};
let resData=null;

const parType = {
	songs: 1,
	albums: 10,
	artists: 100,
	playlists: 1000,
	users: 1002,
	mvs: 1004
}

http.createServer((icm,ogm)=>{
    let parArr=(icm.url.slice(2)).split(/[=&]/g);
    let inUrl={
        type:parArr[0],
        id:parArr[1]
    };
    inUrl[parArr[2]]=parArr[3];
    console.log('------------------------');
    console.log(inUrl);
    if(inUrl.type==='detail'){
        http.get(`http://music.163.com/api/song/detail/?id=${inUrl.id}&ids=%5B${inUrl.id}%5D`,res=>{
            let chunks = [];
            res.on('data', chunk => {
                chunks.push(chunk);
            });

            res.on('end',()=>{
                console.log('HAVE FOUND song`s detail ---> '+inUrl.id);
                resData = iconv.decode(Buffer.concat(chunks), 'utf-8');
                ogm.writeHead(200,head1);
                ogm.write(resData.toString());
                ogm.end();   
            });
        });
    }else if(inUrl.type==='mp3'){
        http.get(`http://music.163.com/api/song/enhance/player/url?id=123456&ids=[${inUrl.id}]&br=3200000`,(res)=>{
            let chunks = [];
            res.on('data', chunk => {
                chunks.push(chunk);
            });

            res.on('end',data=>{
                console.log('HAVE FOUND real mp3 address ---> '+inUrl.id);
                resData = iconv.decode(Buffer.concat(chunks), 'utf-8');
                ogm.writeHead(200,head1);
                ogm.write(resData.toString());
                ogm.end();
            });
        });
    }else if(inUrl.type==='songSheet'){
        console.log('new songSheet request');
        http.get(`http://music.163.com/api/playlist/detail?id=${inUrl.id}&updateTime=-1`,res=>{
            let chunks = [];
            res.on('data', chunk => {
                chunks.push(chunk);
            });
            res.on('end',data=>{
                console.log('HAVE FOUND song sheet details ---> '+inUrl.id);
                resData = iconv.decode(Buffer.concat(chunks), 'utf-8');
                ogm.writeHead(200,head1);
                ogm.write(resData.toString());
                ogm.end();
            });
        });
    }else if(inUrl.type==='suggestSearch'){
        let req = http.request({
            hostname:`music.163.com`,
            method:'post',
            path:`/api/search/suggest/web?s=${inUrl.id}`,
            port:80
        },res=>{
            let chunks = [];
            res.on('data', chunk => {
                chunks.push(chunk);
            });
            res.on('end',data=>{
                console.log('HAVE FOUND suggest search of ---> '+inUrl.id);
                resData = iconv.decode(Buffer.concat(chunks), 'utf-8');
                resData=JSON.parse(resData);
                resData.searchValue=inUrl.id;
                ogm.writeHead(200,head1);
                ogm.write(JSON.stringify(resData));
                ogm.end();
            });
        });
        req.write('');  
        req.end();
    }else if(inUrl.type==='typeDetail'){
        console.log(`finding  ${inUrl.searchValue} detail ---->`);
        let req = http.request({
            hostname:`music.163.com`,
            method:'post',
            path:`/api/search/pc?s=${inUrl.searchValue}&type=${parType[inUrl.id]}&limite=20&offset=0`,
            port:80
        },res=>{
            let chunks = [];
            res.on('data', chunk => {
                chunks.push(chunk);
            });
            res.on('end',data=>{
                console.log('have FOUND  ---> '+inUrl.searchValue);
                resData = iconv.decode(Buffer.concat(chunks), 'utf-8');
                ogm.writeHead(200,head1);
                resData=JSON.parse(resData);
                resData.parType=inUrl.id;
                ogm.write(JSON.stringify(resData));
                ogm.end();
            });
        });
        req.write('');  
        req.end();
        
    }
}).listen(3001);

console.log('Server running at http://127.0.0.1:3001/');