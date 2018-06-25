var express = require('express');
var router = express.Router();
let mssql=require('../server/mssql')


router.get('/list',(req,res,next)=>{
	let openid=req.cookies['union_oid']
	if(req.query.sys==123){
		openid='123'
	}
	if(!openid){
		res.json({success:false,message:'登录已过期'})
		return
	}
	let query=req.query
	let where={
		size:query.size?parseInt(query.size):20,
		page:query.page?parseInt(query.page):1,
		order_type:query.order_type?query.order_type:'desc',
		order:query.order?query.order:'create_time',
		filter:''
	}

	if(query.age && query.age.indexOf('-')>-1){
		let minage=parseInt(query.age.split('-')[0])
		let maxage=parseInt(query.age.split('-')[1])
		let nowYear=(new Date()).getFullYear()

		where.filter+=` and day_of_birth<='${nowYear-minage}-${new Date().getMonth()+1}-${new Date().getDate()}'`
		where.filter+=` and day_of_birth>='${nowYear-maxage}-${new Date().getMonth()+1}-${new Date().getDate()}'`
	}

	if(query.height && query.height.indexOf('-')>-1){
		let minheight=parseInt(query.height.split('-')[0])
		let maxheight=parseInt(query.height.split('-')[1])

		where.filter+=` and height>=${minheight}`
		where.filter+=` and height<=${maxheight}`
	}


	if(query.education){
		let education=parseInt(query.education)
		where.filter+=` and education>=${education}`
	}



	if(query.annual_income && query.annual_income.indexOf('-')>-1){
		let min_income=parseInt(query.annual_income.split('-')[0])
		let max_income=parseInt(query.annual_income.split('-')[1])

		where.filter+=` and annual_income>=${min_income}`
		where.filter+=` and annual_income<=${max_income}`
	}

	if(query.housing){
		where.filter+=` and housing=${(query.housing=="有房"?"'有房'":"'无房'")}`
	}

	if(query.car_buying){
		where.filter+=` and car_buying=${(query.car_buying=='有车'?"'有车'":"'无车'")}`
	}


	mssql.query('dating_member_info',where,(err,result,count)=>{
		mssql.exec(`select top 1 age_range,job,income_range,house_nature,housing from dating_mate_standard where openid=${openid}`,(err,result2,count2)=>{

				for(var i=0;i<result.length;i++){
					if(result2){
						let v=dating_total_only(result2[0],result[i])
						result[i].matching=v;
					}else{
						result[i].matching=0
					}
				}

			
			//console.log(result)
			let json={}
			if(err){
				json.success=false
				json.message=err
			}else{
				json.success=true
				json.message='查询成功'
				json.data=result
				//console.log(count)
				json.count=count
				json.page=where.page
				json.size=where.size
			}
			res.json(json)

		})
	},'',` is_like=(select count(mind_openid) from dating_mind_member where mind_openid=m_table.openid and openid=${openid})`)
})


router.post('/insert_or_update',(req,res,next)=>{
	let body=req.body
	//let memberNo=req.cookies['union_user']
	let openid=req.cookies['union_oid']
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
	
	//rows.member_cardno={value:memberNo,type:'num'}
	rows.openid={value:openid,type:''}
	mssql.exist('dating_member_info',' openid='+rows.openid.value,(err,result,count)=>{
	

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
	//let memberNo=req.cookies['union_user']
	let openid=req.cookies['user_oid']
	if(req.query.sys==123){
		memberNo='-1'
	}

	if(!memberNo)
	{
		res.json({success:false,message:'用户信息不正确'})
		return
	}

	let where=` openid='${openid}'`
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
	let opneid=req.cookies['union_oid']
	if(!query.id)
	{
		if(!memberNo){
			res.json({success:false,message:'登录已过期'})
			return
		}
		where=` opneid=${opneid}`		
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
	let openid=req.cookies['union_oid']

	// if(req.query.sys==123){
	// 	memberNo='66E094A0-75D8-11E8-80D2-1B66FA338D2C'
	// }

	if(!memberNo)
	{
		res.json({success:false,message:'登录已过期'})
		return
	}
	let where=` openid=${openid}`		
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
	let openid=req.cookies['union_oid']

	if(req.query.sys==123){
		memberNo='1827938056500000048'
	}

	let rowsKey={
		id:'id',
        member_cardno:'num',
        openid:'',
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
	rows.openid={value:openid,type:''}
	console.log(rows)
	mssql.exist('dating_mate_standard',` openid=${openid}`,(err,result,count)=>{

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
	let like=1
	if(req.query.is_like!=undefined){
		like=req.query.is_like
	}
	if(req.query.sys==123){
		memberNo='1827938056500000048'
	}
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

	dating_total(mid,memberNo,(err,mindMemberNo,val,allnum)=>{
		if(err){
			res.json({success:false,message:err})
			return;
		}
		if(like==1 && allnum>=2){
			res.json({success:false,message:'最多可中意两个用户'})
			return
		}

		let now=new Date()
		let dateStr=now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds()
	


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
			mind_degree:{
				type:'num',
				value:val
			},
			send_time:{
				type:'date',
				'value':dateStr
			},
			send_msg:{
				type:'bool',
				'value':0
			}

		}
		if(like==1){
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
		}else{
			let where=` member_cardno=${memberNo} and mind_member_cardno=${mindMemberNo}`		
			mssql.delete('dating_mind_member',where,(err,result,count)=>{
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



		}
	})
})

function dating_total(mid,openid,callback){
	//day_of_birth,job,house_nature,annual_income,housing
	let strSql=`
		select top 1 * from dating_member_info where id='${mid}';
		select top 1 age_range,job,income_range,house_nature,housing from dating_mate_standard where openid=${openid};
		select liknnum=count(id) from dating_mind_member WHERE openid=${openid} and mind_type=2 and delete_flag=0;
	`
	mssql.exec(strSql,(err,result,count)=>{
		let v=0

		let dayStr=result[0].day_of_birth
		let age=parseInt(new Date()-dayStr)/(365*24*3600*1000)
		let min_age=result[1].age_range.split('-')[0]
		let max_age=result[1].age_range.split('-')[1]

		if(age>=parseInt(min_age) && age<=parseInt(max_age)){
			v+=20
		}

		if(result[0].job==result[1].job){
			v+=20
		}		

		let income=parseFloat(result[0].annual_income)
		let min_income=result[1].income_range.split('-')[0]
		let max_income=result[1].income_range.split('-')[1]
		if(income>=parseFloat(min_income) && income<=parseFloat(max_income)){
			v+=20
		}

		if(result[0].house_nature==result[1].house_nature){
			v+=20
		}	

		if(result[0].housing==result[1].housing){
			v+=20
		}	


		callback(err,result[0].member_cardno,v,result[2].liknnum)
	})

}

function dating_total_only(your,his){
	console.log(his)
	let v=0

	let dayStr=his.day_of_birth
	let age=parseInt(new Date()-dayStr)/(365*24*3600*1000)
	let min_age=your.age_range.split('-')[0]
	let max_age=your.age_range.split('-')[1]

	if(age>=parseInt(min_age) && age<=parseInt(max_age)){
		v+=20
	}

	if(his.job==your.job){
		v+=20
	}		

	let income=parseFloat(his.annual_income)
	let min_income=your.income_range.split('-')[0]
	let max_income=your.income_range.split('-')[1]
	if(income>=parseFloat(min_income) && income<=parseFloat(max_income)){
		v+=20
	}

	if(his.house_nature==your.house_nature){
		v+=20
	}	

	if(his.housing==your.housing){
		v+=20
	}	
	return v
}

module.exports=router