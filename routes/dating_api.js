var express = require('express');
var router = express.Router();
let mssql=require('../server/mssql')


router.get('/list',(req,res,next)=>{
	let query=req.query
	let where={
		size:query.size?parseInt(query.size):20,
		page:query.page?parseInt(query.page):1,
		order_type:query.order_type?query.order_type:'desc',
		order:query.order?query.order:'create_time'
	}



	mssql.query('dating_member_info',where,(err,result,count)=>{
		//console.log(result)
		let json={}
		if(err){
			json.success=false
			json.message=err
		}else{
			json.success=true
			json.message='查询成功'
			json.data=result
			console.log(count)
			json.count=count
			json.page=where.page
			json.size=where.size
		}
		res.json(json)
	})
})


router.post('/insert_or_update',(req,res,next)=>{
	let body=req.body
	console.log(req.body)
	let rowsKey=
		{
			id:'id',
			member_cardno:'num',
			mobile:'',
			openid:'',
			head_img:'',
			member_name:'',
			sex:'num',
			day_of_birth:'date',
			domicile:'',
			house_nature:'',
			work_unit:'',
			job:'',
			education:'num',
			annual_income:'num',
			college:'',
			health:'',
			height:'num',
			weight:'num',
			nation:'',
			housing:'',
			car_buying:'',
			hobby:'',
			special:'',
			create_time:'date'
		}
	let rows={}
	for(let i=0;i<Object.keys(rowsKey).length;i++){
		let key=Object.keys(rowsKey)[i]
		rows[key]={}
		rows[key].value=body[key]
		if(key=="create_time"){
			let now=new Date()
			rows[key].value=now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds()
		}
		rows[key].type=rowsKey[key]
	}
	
	if(body.id){

		mssql.update('dating_member_info',rows,`id='${body.id}'`,(err,result,count)=>{
			let json={}
			if(err){
				json.success=false
				json.message=err
			}else{
				json.success=true
				json.message='操作成功'
				json.count=count
			}
			res.json(json)
		})
	}else{
		rows.delete_flag={value:0,type:'bool'}
		mssql.insert('dating_member_info',rows,(err,result,count,newid)=>{
			let json={}
			if(err){
				json.success=false
				json.message=err
			}else{
				json.success=true
				json.message='操作成功'
				json.count=count
				json.id=newid
			}
			res.json(json)
		})
	}
})


router.post('/delete',(req,res,next)=>{
	let body=req.body
	let json={}
	if(!body.id)
	{
		res.json({success:false,message:'请传递用户ID'})
		return
	}
	let where=` id='${body.id}'`
	mssql.delete('dating_member_info',where,(err,result,count)=>{
		if(err){
			json.success=false
			json.message=err
		}else{
			json.success=true
			json.message='操作成功'
			json.count=count
		}
		res.json(json)
	})
})


router.get('/detail',(req,res,next)=>{
	let query=req.query
	if(!query.id)
	{
		res.json({success:false,message:'请传递用户ID'})
		return
	}
	let where=` id='${query.id}'`
	mssql.querySingle('dating_member_info',where,(err,result,count)=>{
		let json={}
		if(err){
			json.success=false
			json.message=err
		}else{
			json.success=true
			json.message='操作成功'
			json.data=result[0]
		}
		res.json(json)
	})
})

module.exports=router