var express = require('express');
let crypto = require('crypto');
let http=require('http');
var router = express.Router();

let aesMethod=(token,callback)=>{
  let key='UNIONFROMZJBYHMS'
  let iv='1234567812345678'
  token=token.replace(' ','+')
  var crypted = new Buffer(token, 'base64').toString('binary')

  var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
  var decoded = decipher.update(crypted, 'binary', 'utf8')
  console.log(decoded.toString())
  decoded += decipher.final('utf8')
  callback(decoded)
}

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.sendFile('index.html');
});


router.get('/union_valid',(req,res,next)=>{

	if(req.query.openid){
		var times=new Date(new Date().setDate(new Date().getDate()+7))

		//res.cookie('union_user',req.query.membercardno,{expires:times,httpOnly:true})
		res.cookie('union_oid',req.query.openid,{expires:times,httpOnly:true})
		res.redirect('/#home')
	}else{
		res.send('获取openid失败')
		res.end()
	}
	
})

router.get('/valid',function(req,res,next){
	var token=req.query.token
	aesMethod(token,(decoded)=>{
		let data=JSON.parse(decoded)

		let opt={
			host:'cj.123zou.com',
			path:'/MobileNews/get_member_info?member_id='+data.memberId,
			method: 'GET'
		}
		console.log(opt.host+opt.path)
		let _req=http.request(opt,(_res)=>{
			let data='';
		    //console.log('headers:'+JSON.stringify(_res.headers));  
		    _res.setEncoding('utf-8');  
		    _res.on('data',function(datas){  
		        data+=datas;
		    });  
		    _res.on('end',function(){
		    	data=JSON.parse(data);
		    	console.log(data);
		    	res.render('index',{url:req.query.return,token:req.query.token,data:data})
		        //console.log('No more data in response.');  
		    });  

		})
		_req.on('error',function(err){  
		    console.error(err)
		})
		_req.write('');
		_req.end();
		//req.write(str)
	})
	
})




module.exports = router;
