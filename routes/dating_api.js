var express = require('express');
var router = express.Router();
let mssql=require('../server/mssql')


router.get('/list',(req,res,next)=>{
	let memberNo=req.cookies['union_user']
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
	},'',` is_like=(select count(mind_member_cardno) from dating_mind_member where mind_member_cardno=m_table.member_cardno and member_cardno='${memberNo}')`)
})


router.post('/insert_or_update',(req,res,next)=>{
	let body=req.body
	let memberNo=req.cookies['union_user']
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
	
	rows.member_cardno={value:memberNo,type:''}
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
	let where=''
	let memberNo=req.cookies['union_user']
	if(!query.id)
	{
		//res.json({success:false,message:'请传递用户ID'})
		where=` member_cardno=${memberNo}`
		
	}else{
		where=` id='${query.id}'`
	}
	let 
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


router.get('/insert_or_update_standard',(req,res,next)=>{
	let body=req.body
	let memberNo=req.cookies['union_user']

	let rowsKey={
		id:'id',
        member_cardno:'num',
        age_range:'',
        height_range:'',
        weight_range:'',
        job:'',
        income_range:'',
        housing:'',
        car_buying:'',
        house_nature:'',
        delete_flag:'num'
	}
	for(let i=0;i<Object.keys(rowsKey).length;i++){
		let key=Object.keys(rowsKey)[i]
		rows[key]={}
		rows[key].value=body[key]
		rows[key].type=rowsKey[key]
	}
	rows.member_cardno={value:memberNo,type:''}
	

})

router.get('/like',(req,res,next)=>{
	let memberNo=req.cookies['union_user']
	let query=req.query
	if(!query.memberNo)
	{
		res.json({success:false,message:'请传递用户member_cardno'})
		return
	}
	let mindMemberNo=query.memberNo

	let rowsKey={
		id:'id',
		,member_cardno:''
		,mind_member_cardno:''
		,mind_type:'num'
		,mind_degree:'num'
		,send_msg:'bool'
		,delete_flag:'num'
		,'send_time':'date'
	}
	let rows={
		id:{
			type:'id'
		},
		member_cardno:{
			type:'',
			value:memberNo
		},
		mind_member_cardno:{
			type:'',
			value:mindMemberNo
		},
		mind_type:{
			type:'num',
			value:2
		},

	}


	// for(let i=0;i<Object.keys(rowsKey).length;i++){
	// 	let key=Object.keys(rowsKey)[i]
	// 	rows[key]={}
	// 	rows[key].value=body[key]
	// 	if(key=="send_time"){
	// 		let now=new Date()
	// 		rows[key].value=now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds()
	// 	}
	// 	rows[key].type=rowsKey[key]
	// }

	rows.delete_flag={value:0,type:'bool'}
	mssql.insert('dating_mind_member',rows,(err,result,count,newid)=>{
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

})

module.exports=router