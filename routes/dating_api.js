var express = require('express');
var router = express.Router();
let mssql=require('../server/mssql')
let ws=require('../server/wechat')

router.get('/list',(req,res,next)=>{
	let openid=req.cookies['union_oid']
	// if(!openid){
	// 	res.json({success:false,msg:'登录已过期'})
	// 	return
	// }
    let query = req.query
    if(!query_valid(req.query)){
    	res.json({success:false,msg:'参数含有敏感字符'})
    	return
    }
    let isagain = false;
    if (query.isagain) {
        isagain = true;
    }
	let where={
		size:query.size?parseInt(query.size):20,
		page:query.page?parseInt(query.page):1,
		order:query.order?query.order.split(' ')[0]:'id',
		order_type:(query.order && query.order.split(' ').length>1)?query.order.split(' ')[1]:'desc',
		//order:query.order?query.order:'id desc',
		openid:openid,
		filter:''
	}
	where.filter+=` and review_status=1 `
	where.filter+=` and is_open=1 `
	where.filter+=` and day_of_birth>'1900-01-01' `
	//where.filter+=` and openid <> '${openid}' `

	if(query.age && query.age.indexOf('-')>-1){
		let minage=parseInt(query.age.split('-')[0])
		let maxage=parseInt(query.age.split('-')[1])
		let nowYear=(new Date()).getFullYear()

		where.filter+=` and day_of_birth<=''${nowYear-minage}-${new Date().getMonth()+1}-${new Date().getDate()}''`
		where.filter+=` and day_of_birth>=''${nowYear-maxage}-${new Date().getMonth()+1}-${new Date().getDate()}''`
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

	if(query.sex && query.sex!='性别' && query.sex!='不限'){
		where.filter+=` and sex=${query.sex}`;
	}

	if(query.job && query.job!='职业' && query.job!='不限'){
		if(query.job!='其他')
			where.filter+=` and job='${query.job}'`;
		else{
			where.filter+=`and job not in ('公务员','教师','医护人员','军人/警察','律师','企业高管','企业职工') `
		}
	}	

	if(query.annual_income && query.annual_income.indexOf('-')>-1){
		let min_income=parseInt(query.annual_income.split('-')[0])
		let max_income=parseInt(query.annual_income.split('-')[1])

		where.filter+=` and annual_income>=${min_income}`
		where.filter+=` and annual_income<=${max_income}`
	}

	if(query.housing){
		let str="";
		where.filter+=` and housing=${(query.housing=="不限"?"''''":"''"+query.housing+"''")}`
	}

	if(query.car_buying){
		where.filter+=` and car_buying=${(query.car_buying=='不限'?"''''":"''"+query.car_buying+"''")}`
	}

	if(query.keyword){
		where.filter+=` and member_name like '%${query.keyword}%' `
	}
	//mssql.query_dating('',where,(err,result,count)=>{})
	//return;

	if(query.order){
	}

	mssql.query('dating_member_info',where,(err,result,count)=>{
		//mssql.exec(`select top 1 age_range,job,income_range,house_nature,housing from dating_mate_standard where openid='${openid}'`,(err,result2,count2)=>{

			// for(var i=0;i<result.length;i++){
			// 	if(result2){
			// 		let v=dating_total_only(result2[0],result[i])
			// 		result[i].matching=v;
			// 	}else{
			// 		result[i].matching=0
			// 	}
			// }

			
			//console.log(result)
			let json={}
			if(err){
				json.success=false
				json.msg=err
			}else{
				json.success=true
				json.msg='查询成功'

				let safe_result=[]
				for(var i=0;i<result.length;i++){
					safe_result.push({
						day_of_birth:result[i].day_of_birth,
						id:result[i].id,
						member_name:result[i].member_name,
						is_like:result[i].is_like,
						head_img:result[i].head_img,
						mind_count:result[i].mind_count,
						height:result[i].height,
						weright:result[i].weight,
						job:result[i].job

					})
				}
				json.data=safe_result
				//console.log(count)
				json.count=count
				json.page=where.page
				json.size=where.size
			}
			res.json(json)

		//})
    },'',`is_like=(select count(id) from dating_mind_member d where openid='${openid}' and mind_openid=m_table.openid)`);
})

router.get('/new_user',(req,res,next)=>{
	let body=req.body
	let openid=req.cookies['union_oid']
	mssql.querySingle('dating_member_info',`openid='${openid}'`,(err,result,count)=>{
		console.log(result);
		if(result.length>0 && !result[0].member_name){
			ws.get_user(openid,(obj)=>{
				let rows={
					member_name:{value:obj.nickname,type:''},
					sex:{value:(obj.sex=='男' || obj.sex==1)?1:2,type:'num'},
					headimgurl:{value:obj.headimgurl,type:''}
				}
				mssql.update('dating_member_info',rows,`id='${result[0].id}'`,(err,result,count)=>{
					res.json({success:false,msg:'已注册的用户'})
				})
			})

		}else if(count<=0){
			res.json({success:true,msg:'新用户注册'});
		}else{
			res.json({success:false,msg:'已注册的用户'})
		}
	})
})

router.get('/message_list',(req,res,next)=>{
	//router.querySingle('dating_messages',`review_status=1`,(err,result,count))
	mssql.exec(`select a.reply,a.message,b.member_name,b.head_img,a.created_time from dating_messages a,dating_member_info b where a.openid=b.openid and a.review_status=1`,(err,result,count)=>{
		if(err){
			res.json({success:false,msg:'网络错误'})
		}else{
			res.json({success:false,msg:'',data:result})
		}
	})
})
router.post('/insert_or_update_message',(req,res,next)=>{
	let openid=req.cookies['union_oid']
	
	if(!openid){
		res.json({success:false,msg:'登录已过期'})
		return
	}
	
	mssql.querySingle('dating_member_info',` openid='${openid}'`,(err,result,count)=>{
		if(result.length<=0){
			res.json({success:false,msg:'不存在的用户'})
			return
		}
		let now=new Date()
		mssql.insert('dating_messages',{
			message:{
				value:req.body.message,
				type:''
			},
			openid:{
				value:openid,
				type:''
			},
			review_status:{
				value:0,
				type:''
			},
			created_time:{
				value:now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds(),
				type:''
			}
		},(err2,result2,count2)=>{
			if(err2){
				res.json({success:false,msg:err2})
				return
			}
			if(count2>0){
				res.json({success:true,msg:'您的留言已提交'})
			}
		})
	})
})

router.post('/get_now_user',(req,res,next)=>{
	let openid=req.cookies['union_oid']
	ws.get_user(openid,(obj)=>{
		/*{"subscribe":1,"openid":"om-NlwIIEXNK_ghTdb_-U-lNhz8g",
		"nickname":"ᕕ(ᐛ)ᕗ变身!","sex":1,"language":"zh_CN","city":"杭州","province":"浙江","country":"中国","headimgurl":"http://thirdwx.qlogo.cn/mmopen/MibjTic8EM07dfwrRpOyic5Picz7tPibQoAZvZIdKpllBWGffGfHJ0I71JYFO2IEFyxfN1g8VogOiaAV6icnqKbqGlglXeRmNwx0avy/132","subscribe_time":1530155820,"remark":"","groupid":0,"tagid_list":[],"subscribe_scene":"ADD_SCENE_QR_CODE","qr_scene":0,"qr_scene_str":"1004276"}*/
		
		let  info={
			nickname:obj.nickname,
			sex:obj.sex,
			headimgurl:obj.headimgurl
			//"nickname":"ᕕ(ᐛ)ᕗ变身!",
			//"sex":1,
			//"headimgurl":"http://thirdwx.qlogo.cn/mmopen/MibjTic8EM07dfwrRpOyic5Picz7tPibQoAZvZIdKpllBWGffGfHJ0I71JYFO2IEFyxfN1g8VogOiaAV6icnqKbqGlglXeRmNwx0avy/132",
		}
		res.json({success:true,info:info})
	})
})

router.post('/register',(req,res,next)=>{
	let body=req.body;
	let openid=req.cookies['union_oid']
	let rowsKey=
		{
			//id:'id',
			member_cardno:'num',
			card_number:'',
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
			create_time:'date',
			unit_property:'num',
			income_type:'num',
			industry:'',
			review_status:'num'
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
	mssql.exist('dating_member_info',` openid='`+rows.openid.value+`'`,(err,result,count)=>{
		if(count>0){
			res.json({success:false,msg:'请不要重复注册'});
		}else{
			rows.delete_flag={value:0,type:'bool'}
			mssql.insert('dating_member_info',rows,(err,result,count)=>{
				let json={}
				if(err){
					json.success=false
					json.msg=err
				}else{
					let rowsKey={
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
					rows.delete_flag={value:0,type:'bool'}
					rows.openid.value=openid
					mssql.insert('dating_mate_standard',rows,(err,result,count)=>{
							// let json={}
							// if(err){
							// 	json.success=false
							// 	json.msg=err
							// }else{
							// 	json.success=true
							// 	json.msg='操作成功'
							// 	json.count=count
							// 	json.id=newid
							// }
							// res.json(json)
						
						json.success=true
						json.msg='操作成功'
						json.count=count
					})
				}
				res.json(json)
			})
		}
	});

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
			//id:'id',
			member_cardno:'num',
			card_number:'',
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
			create_time:'date',
			unit_property:'num',
			income_type:'num',
			industry:'',
        	marriage_status:'num'
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
	rows.review_status={value:0,type:'num'}
	mssql.exist('dating_member_info',` openid='`+rows.openid.value+`'`,(err,result,count)=>{
	
		rows.is_open={value:rows.is_open!=0?1:0,type:'num'}
		if(count>0){
			mssql.update('dating_member_info',rows,`id='${result[0].id}'`,(err,result,count)=>{
				let json={}
				if(err){
					json.success=false
					json.msg=err
				}else{
					json.success=true
					json.msg='操作成功'
					json.count=count
					//json.id=rows.id.value
				}
				res.json(json)
			})
		}else{
			rows.delete_flag={value:0,type:'bool'}
			mssql.insert('dating_member_info',rows,(err,result,count)=>{
				let json={}
				if(err){
					json.success=false
					json.msg=err
				}else{
					json.success=true
					json.msg='操作成功'
					json.count=count
					//json.id=newid
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
		res.json({success:false,msg:'用户信息不正确'})
		return
	}

	let where=` openid='${openid}'`
	mssql.delete('dating_member_info',where,(err,result,count)=>{
		if(err){
			json.success=false
			json.msg=err
		}else{
			json.success=true
			json.msg='操作成功'
			json.count=count
		}
		res.json(json)
	})
})


router.get('/detail',(req,res,next)=>{
	let query=req.query
	let where=''
	let openid=req.cookies['union_oid']
	let isyour=false
	if(!query.id)
	{
		if(!openid){
			res.json({success:false,msg:'登录已过期'})
			return
		}
		where=` openid='${openid}'`
		isyour=true
	}else{
		where=` id='${query.id}'`
	}
	mssql.querySingle('dating_member_info',where,(err,result,count)=>{
		let json={}
		if(err){
			json.success=false
			json.msg=err
		}else{
			json.success=true
			json.msg='操作成功'
			if(result.length==0)
				json.data=null
			else{

				let admin_oid=req.cookies['admin_oid']

				mssql.exist('dating_managers',`usertype=1 and review_status=1 and  openid='${admin_oid}'`,(err2,result2,count2)=>{
					if(count2<=0){
						delete result[0].member_cardno
						delete result[0].mobile
						delete result[0].openid
					}else{
						
					}
					json.data=result[0]
					json.data.isyour=isyour
					res.json(json)
				})

				




			}

		}
		
	})
})

router.post('/open_or_lock',(req,res,next)=>{
	let body=req.body
	let openid=req.cookies['union_oid']
	let admin_openid=req.cookies['admin_oid']
	console.log(body)
	var where='';
	if(admin_openid && body.id){
		where+=`id='${body.id}'`
	}else if(!openid){
		res.json({success:false,msg:'登录已过期'})
		return
	}else{
		where+=`openid='${openid}'`;
	}
	mssql.update('dating_member_info',{is_open:{type:'num',value:body.is_open}},where,(err,result,count)=>{
		if(count>0){
			res.json({success:true,msg:'操作成功'})
		}else{
			res.json({success:false,msg:'操作失败'})
		}
	})
})

router.get('/standard_detail',(req,res,next)=>{
	let openid=req.cookies['union_oid']

	// if(req.query.sys==123){
	// 	memberNo='66E094A0-75D8-11E8-80D2-1B66FA338D2C'
	// }

	if(!openid)
	{
		res.json({success:false,msg:'登录已过期'})
		return
	}
	let where=` openid='${openid}'`		
	mssql.querySingle('dating_mate_standard',where,(err,result,count)=>{
		let json={}
		if(err){
			json.success=false
			json.msg=err
		}else{
			json.success=true
			json.msg='操作成功'
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
	let openid=req.cookies['union_oid']

	let rowsKey={
		//id:'id',
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
	rows.member_cardno={value:0,type:'num'}
	rows.openid={value:openid,type:''}
	//console.log(rows)
	mssql.exist('dating_mate_standard',` openid='${openid}'`,(err,result,count)=>{
		if(count>0){
			//rows.id={value:result[0].id}
			mssql.update('dating_mate_standard',rows,`id='${result[0].id}'`,(err,result,count)=>{
				let json={}
				if(err){
					json.success=false
					json.msg=err
				}else{
					json.success=true
					json.msg='操作成功'
					json.count=count
					//json.id=rows.id.value
				}
				res.json(json)
			})
		}else{
			rows.delete_flag={value:0,type:'bool'}
			mssql.insert('dating_mate_standard',rows,(err,result,count)=>{
				let json={}
				if(err){
					json.success=false
					json.msg=err
				}else{
					json.success=true
					json.msg='操作成功'
					json.count=count
					//json.id=newid
				}
				res.json(json)
			})
		}

	})
	

})

router.get('/like',(req,res,next)=>{
	let openid=req.cookies['union_oid']
	let query=req.query
	let like=1
	if(req.query.is_like!=undefined){
		like=req.query.is_like
	}
	if(!openid){
		res.json({success:false,msg:'登录已过期'})
		return
	}
	if(!query.id)
	{
		res.json({success:false,msg:'请传递用户ID'})
		return
	}
	let mid=query.id

	dating_total(mid,openid,(err,mind_openid,val,allnum)=>{
		if(err){
			res.json({success:false,msg:err})
			return;
		}
		if(openid == mind_openid){
			res.json({success:false,msg:'不可以中意自己哦'});
			return;
		}

		//if(like==1 && allnum>=2){
		//	res.json({success:false,msg:'最多可中意十个用户'})
		//	return
		//}

		let now=new Date()
		let dateStr=now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds()
	


		let rows={
			openid:{
				type:'',
				value:openid
			},
			member_cardno:{
				type:'num',
				value:0
			},
			mind_openid:{
				type:'',
				value:mind_openid
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
		//console.log(mind_openid)
		if(like==1){
			rows.delete_flag={value:0,type:'bool'}



			mssql.insert('dating_mind_member',rows,(err,result,count,newid)=>{
				let json={}
				if(err){
					json.success=false
					json.msg=err
				}else{
					mssql.exec(`update dating_member_info set mind_count=mind_count+1 where openid='${mind_openid}'`,(err,result,count)=>{})


					mssql.exec(`select id from dating_send_notices where openid='${openid}' and target_openid='${mind_openid}'`,(err,reuslt,count)=>{
						if(count<=0){
							mssql.insert('dating_send_notices',{
								openid:{value:openid,type:''},
								target_openid:{value:mind_openid,type:''},
								title:{value:'关注消息'},
								content:{value:'有人在工青妇平台默默默默关注了你'},
								url:{value:'http://100579.un.123zou.com/Platform/Link?key=go.dating'},
								send_status:{value:1,type:'num'},
								created_time:{value:now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds(),type:'date'}
							},(err,result,count)=>{})

							 ws.post_one({
		                         "msg": "有人在工青妇平台上默默关注了你",
		                         "openid": mind_openid,
		                         "url":"http://100579.un.123zou.com/Platform/Link?key=go.dating"
							 })
						}else{
							console.log('已发送过该通知')
						}
					})



					json.success=true
					json.msg='操作成功'
					json.count=count
					json.id=newid
				}
				//mssql.update('dating_member_info',{min{name:''}})
				res.json(json)
			})
		}else{
			let where=` openid='${openid}' and mind_openid='${mind_openid}'`		
			mssql.remove('dating_mind_member',where,(err,result,count)=>{
				let json={}
				if(err){
					json.success=false
					json.msg=err
				}else{
					mssql.exec(`update dating_member_info set mind_count=mind_count-1 where openid='${mind_openid}'`,(err,result,count)=>{})
					json.success=true
					json.msg='操作成功'
					json.count=count
				}
				res.json(json)
			})



		}
	})
})


router.get("/execl",(req,res,next)=>{
	if(req.query.code=="cxxq123"){
		let crow="*,housing1=a.housing,car_buying1=a.car_buying,housing2=b.housing,car_buying2=b.car_buying "
		if(req.query.row){
			crow=req.query.row
		}else{

		}
		
		let nodeExcel = require('excel-export');
		var conf = {};
		mssql.exec('select '+crow+' from dating_member_info a left join dating_mate_standard b on a.openid=b.openid ',(err,result,count)=>{
			//console.log(result)
			conf.cols=[]
			conf.rows=new Array()
			let first=true

			let edu=["其他","小学","初中","高中","中专","大学专科","大学本科","研究生"]

			result.forEach((k,i)=>{
				let rows=new Array()

				Object.keys(result[0]).forEach((k2,i2)=>{
					if(first){
						console.log(k2)
						conf.cols.push({
							caption: k2,
							type: 'string',
							width:10
						})
						//console.log(k2)
					}
					let type= typeof k[k2]
					if(!k[k2]){
						k[k2]=''
					}
					if(type=="boolean")
						k[k2]=k[k2]?'是':'否'
					if(type=="object"){
						k[k2]=k[k2].getFullYear()+'-'+(k[k2].getMonth()+1)+'-'+k[k2].getDate()
					}
					if(k2=='education'){
						k[k2]=edu[k[k2]]
					}else if(k2=="sex"){
						k[k2]=k[k2]==1?"男":"女"
					}
					else if(type=="number"){
						k[k2]+=""
					}
					rows.push(k[k2])
					
				})
				first=false
				conf.rows.push(rows)

			})

			let execls=nodeExcel.execute(conf)
			//console.log(conf);
			res.setHeader('Content-Type', 'application/vnd.openxmlformats');
	        res.setHeader("Content-Disposition", "attachment; filename=" + "dating_total.xlsx");
	        res.end(execls, 'binary');
		})



	}
})

function dating_total(mid,openid,callback){
	//day_of_birth,job,house_nature,annual_income,housing
	let strSql=`
		select top 1 * from dating_member_info where id=${mid};
		--select top 1 age_range,job,income_range,house_nature,housing from dating_mate_standard where openid='${openid}';
		select likenum=count(id) from dating_mind_member WHERE openid='${openid}' and mind_type=2 and delete_flag=0;
	`
	mssql.exec(strSql,(err,result,count)=>{
		let v=0
		// if(result[0].day_of_birth || result[1].age_range){
		// 	let dayStr=result[0].day_of_birth
		// 	let age=parseInt(new Date()-dayStr)/(365*24*3600*1000)
		// 	let min_age=result[1].age_range.split('-')[0]
 		// 	let max_age=result[1].age_range.split('-')[1]

		// 	if(age>=parseInt(min_age) && age<=parseInt(max_age)){
		// 		v+=20
		// 	}
		// }
		// if(result[0].job==result[1].job){
		// 	v+=20
		// }		

		// // if(result[0].annual_income || result[1].income_range){
		// // 	let income=parseFloat(result[0].annual_income)
		// // 	let min_income=result[1].income_range.split('-')[0]
		// // 	let max_income=result[1].income_range.split('-')[1]
		// // 	if(income>=parseFloat(min_income) && income<=parseFloat(max_income)){
		// // 		v+=20
		// // 	}
		// // }
		// if(result[0].house_nature==result[1].house_nature){
		// 	v+=20
		// }	

		// if(result[0].housing==result[1].housing){
		// 	v+=20
		// }	
		console.log(result[0])
		callback(err,result[0].openid,v,result[1].likenum)
	})

}

function dating_total_only(your,his){

	if(!your || !his)
		return 0
	
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

	v+=20;
	// let income=parseFloat(his.annual_income)
	// let min_income=your.income_range.split('-')[0]
	// let max_income=your.income_range.split('-')[1]
	// if(income>=parseFloat(min_income) && income<=parseFloat(max_income)){
	// 	v+=20
	// }

	if(his.house_nature==your.house_nature){
		v+=20
	}	

	if(his.housing==your.housing){
		v+=20
	}	
	return v
}


function dating_match(openid,sex){

}

function query_valid(obj){
	let list=Object.keys(obj)
	if(!list || list.length==0){
		return true
	}

	for(let i=0;i<list.length;i++){
		let str=obj[list[i]];
		console.log(str)
		if(str.indexOf('--')>-1 || str.indexOf(`'`)>-1){
			return false
		}
	}
	return true
}

module.exports=router