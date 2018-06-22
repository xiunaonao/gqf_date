var express = require('express');
var router = express.Router();
let mssql=require('../server/mssql')


router.get('/list',(req,res,next)=>{
	let memberNo=req.cookies['union_user']
	if(!memberNo){
		res.json({success:false,message:'登录已过期'})
		return
	}
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
	},'',` is_like=(select count(mind_member_cardno) from dating_mind_member where mind_member_cardno=m_table.member_cardno and member_cardno=${memberNo})`)
})


router.post('/insert_or_update',(req,res,next)=>{
	let body=req.body
	let memberNo=req.cookies['union_user']
	if(req.query.sys==123){
		memberNo='-1'
	}
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
	
	rows.member_cardno={value:memberNo,type:'num'}
	mssql.exist('dating_member_info',' member_cardno='+rows.member_cardno.value,(err,result,count)=>{
	

		if(count>0){
			rows.id.value=result[0].id
			mssql.update('dating_member_info',rows,`id='${result[0].id}'`,(err,result,count)=>{
				let json={}
				if(err){
					json.success=false
					json.message=err
				}else{
					json.success=true
					json.message='操作成功'
					json.count=count
					json.id=rows.id.value
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
})


router.post('/delete',(req,res,next)=>{
	let json={}
	let memberNo=req.cookies['union_user']
	if(req.query.sys==123){
		memberNo='-1'
	}

	if(!memberNo)
	{
		res.json({success:false,message:'请传递用户member_cardno'})
		return
	}

	let where=` member_cardno='${memberNo}'`
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
		if(!memberNo){
			res.json({success:false,message:'登录已过期'})
			return
		}
		where=` member_cardno=${memberNo}`		
	}else{
		where=` id='${query.id}'`
	}
	mssql.querySingle('dating_member_info',where,(err,result,count)=>{
		let json={}
		if(err){
			json.success=false
			json.message=err
		}else{
			json.success=true
			json.message='操作成功'
			if(result.length==0)
				json.data=null
			else
				json.data=result[0]
		}
		res.json(json)
	})
})

router.get('/standard_detail',(req,res,next)=>{
	let memberNo=req.cookies['union_user']

	if(req.query.sys==123){
		memberNo='-1'
	}

	if(!memberNo)
	{
		res.json({success:false,message:'请传递用户member_cardno'})
		return
	}
	let where=` member_cardno=${memberNo}`		
	mssql.querySingle('dating_mate_standard',where,(err,result,count)=>{
		let json={}
		if(err){
			json.success=false
			json.message=err
		}else{
			json.success=true
			json.message='操作成功'
			if(result.length==0)
				json.data=null
			else
				json.data=result[0]
		}
		res.json(json)
	})

})

router.post('/insert_or_update_standard',(req,res,next)=>{
	let body=req.body
	let memberNo=req.cookies['union_user']

	if(req.query.sys==123){
		memberNo='-1'
	}

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
	let rows={}
	for(let i=0;i<Object.keys(rowsKey).length;i++){
		let key=Object.keys(rowsKey)[i]
		rows[key]={}
		rows[key].value=body[key]
		rows[key].type=rowsKey[key]
	}
	rows.member_cardno={value:memberNo,type:'num'}

	mssql.exist('dating_mate_standard',` member_cardno=${memberNo}`,(err,result,count)=>{

		if(count>0){
			rows.id.value=result[0].id
			mssql.update('dating_mate_standard',rows,`id='${result[0].id}'`,(err,result,count)=>{
				let json={}
				if(err){
					json.success=false
					json.message=err
				}else{
					json.success=true
					json.message='操作成功'
					json.count=count
					json.id=rows.id.value
				}
				res.json(json)
			})
		}else{
			rows.delete_flag={value:0,type:'bool'}
			mssql.insert('dating_mate_standard',rows,(err,result,count,newid)=>{
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
	

})

router.get('/like',(req,res,next)=>{
	let memberNo=req.cookies['union_user']
	let query=req.query
	
	if(!memberNo){
		res.json({success:false,message:'登录已过期'})
		return
	}
	if(!query.id)
	{
		res.json({success:false,message:'请传递用户ID'})
		return
	}
	let mid=query.id

	dating_total(mid,memberNo)

	let rowsKey={
		id:'id',
		member_cardno:'',
		mind_member_cardno:'',
		mind_type:'num',
		mind_degree:'num',
		send_msg:'bool',
		delete_flag:'num',
		'send_time':'date'
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
		}

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

function dating_total(mid,cardno,callback){
	//day_of_birth,job,house_nature,annual_income,housing
	let strSql=`
		select top 1 * from dating_member_info where id='${mid}';
		select top 1 age_range,JOB,income_range,house_nature,housing from dating_mate_standard where member_cardno=${cardno};
	`
	mssql.exec(strSql,(err,result,count)=>{
		console.log(result)
	})

}

module.exports=router