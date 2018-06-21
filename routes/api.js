var express = require('express');
var router = express.Router();
let mssql=require('../server/mssql')


router.get('/list',(req,res,next)=>{
	let query=req.query;
	let where={
		size:20,
		page:1,
		keyword:'',
		order:'id',
		orderType:'desc'
	}
	mssql.query('DatingMemberInfo',where,(err,result,count)=>{
		//console.log(result)
		let json={}
		if(err){
			json.success=false
			json.message=err
		}else{
			json.success=true
			json.message='查询成功'
			json.data=result
		}
		res.json(json)
	})
})


module.exports=router