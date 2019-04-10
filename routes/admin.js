var express = require('express');
let http=require('http');
var router = express.Router();
let mssql=require('../server/mssql')
var ver=require('../package.json').version


router.get('/',(req,res,next)=>{
	let openid=req.cookies['admin_oid']
	if(!openid){
		res.redirect(302,'/#system')
		return;
	}
	let query=req.query;
	getDataNum(openid,(results)=>{
		res.render('admin_index',{type:query.type,data:results})
	})
	
})

router.get('/message',(req,res,next)=>{
	let openid=req.cookies['admin_oid']
	if(!openid){
		res.redirect(302,'/#system')
		return
	}
	//let query=req.query
	//mssql.exec('select * from dating_messages',(err,result,count)=>{
	getDataNum(openid,(results)=>{
		res.render('admin_message',{data:results})
	})
	//})
})

router.get('/line',(req,res,next)=>{
	let openid=req.cookies['admin_oid']
	if(!openid){
		res.redirect(302,'/#system')
		return
	}
	getDataNum(openid,(results)=>{
		res.render('admin_line',{data:results})
	})
})

router.get('/notice',(req,res,next)=>{
	let openid=req.cookies['admin_oid']
	if(!openid){
		res.redirect(302,'/#system')
		return;
	}
	//res.render('admin_notice',{})
	getDataNum(openid,(results)=>{
		res.render('admin_notice',{data:results})
	})
})

router.get('/volunteer',(req,res,next)=>{
	let openid=req.cookies['admin_oid']
	if(!openid){
		res.redirect('/#system',{})
		return;
	}
	if(!req.query.type)
		req.query.type=2
	if(!req.query.status)
		req.query.status=0
	//res.render('admin_volunteer',{})
	getDataNum(openid,(results)=>{
		res.render('admin_volunteer',{type:req.query.type,status:req.query.status,data:results})
	})
})

router.get('/banner',(req,res,next)=>{
	let openid=req.cookies['admin_oid']
	if(!openid){
		res.redirect('/#system',{})
		return;
	}
	//res.render('',{})
	getDataNum(openid,(results)=>{
		res.render('admin_banner',{data:results})
	})
})

router.get('/pair',(req,res,next)=>{
	let openid=req.cookies['admin_oid']
	if(!openid){
		res.redirect('/#system',{})
		return;
	}
	if(req.query.type!=1)
		req.query.type=2
	let query=req.query
		getDataNum(openid,(results)=>{
		res.render('admin_pair',{type:query.type,data:results})
	})
})

router.get('/userdetail',(req,res,next)=>{
	let openid=req.cookies["admin_oid"]
	if(!openid){
		res.redirect('/#system',{})
		return;
	}
	let id=req.query.id
	if(!id){
		res.redirect('/admin/?type=2')
		return
	}
	res.render('admin_userdetail',{id:id})
})

router.get('/pop',(req,res,next)=>{
	let openid=req.cookies['admin_oid']
	if(!openid){
		res.redirect('/#system',{})
	}
	res.render('admin_pop',{})
})


function getDataNum(openid,callback){
	let strSql=`
		select * from dating_managers where openid='${openid}';
		select usernum=count(openid) from dating_member_info where review_status=0 and member_name<>'';
		select multinum=count(a.openid) FROM dating_mind_member a,dating_mind_member b where a.mind_openid = b.openid and b.mind_openid = a.openid;
		select volunteernum=count(openid) from dating_managers where usertype=2 and review_status=0;
		select messagenum=count(id) from dating_messages where review_status=0;
	`	
	mssql.exec(strSql,(err,result,count)=>{
		if(callback){
			callback(result)
		}
	})
}

module.exports = router;
