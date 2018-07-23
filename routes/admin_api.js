var express = require('express');
var router = express.Router();
let mssql=require('../server/mssql')


router.post('/admin_login',(req,res,next)=>{
	let openid=req.cookies['union_oid']
	mssql.querySingle('dating_managers',`openid='${openid}' and review_status==1`,(err,result,count)=>{
		let json={data:null}
		console.log(count)
		if(err){
			json.success=false
			json.msg=err
			res.json(json)
			return
		}
		if(result.length<=0){
			res.json({
				success:false,
				msg:'您不是管理员，无法登录',
				data:null
			})
		}else{
			var times=new Date(new Date().setDate(new Date().getDate()+7))

			//res.cookie('union_user',req.query.membercardno,{expires:times,httpOnly:true})
			res.cookie('admin_oid',result[0].openid,{expires:times,httpOnly:true})
			res.json({
				success:true,
				msg:'',
				data:result[0]
			})
		}
	})
})

router.post('/volunteer_register',(req,res,next)=>{
	let openid=req.cookies['union_oid']
	mssql.querySingle('dating_managers',`openid='openid'`,(err,result,count)=>{
		if(count>0){
			if(result[0].review_status==0){
				res.json({success:false,msg:'您的信息正在审核，请耐心等待'})
			}else{
				res.json(success:false,msg:'您已经是申请成功，请点击登录')
			}
			//res.json({success:false,msg})

		}else{
			mssql.querySingle('dating_member_info',`openid='openid'`,(err,result2,count)=>{
				let body=result2[0]
				let rowsKey={
			        name:'',
			        openid:'',
			        head_img:'',
			        user_type:'num',
			        work_unity:'',
			        mobile:'',
			        review_status:''
				}
				let rows={}
				for(let i=0;i<Object.keys(rowsKey).length;i++){
					let key=Object.keys(rowsKey)[i]
					rows[key]={}
					rows[key].value=body[key]
					rows[key].type=rowsKey[key]
				}
				rows[name]=body.member_name
				rows[review_status]=0

				mssql.insert('dating_managers',rows,(err,result,count)=>{
					if(count>0){

					}else{
						res.json({success:false,msg:'网络错误，申请失败，请重试'})
					}
					res.json({success:true,msg:'已发起申请，等待管理员审核'})
				})
				
			})
		}
	})
	// mssql.querySingle('dating_managers',`openid='${openid}'`,(err,result,count)=>{
	// 	console.log(result)
	// })
})

router.get('/admin_list',(req,res,next)=>{
	//table,where,callback,orderName,elseStr
	let openid=req.cookies['admin_oid']
	let query=req.query
	let where={
		size:query.size?parseInt(query.size):20,
		page:query.page?parseInt(query.page):1,
		order_type:query.order_type?query.order_type:'desc',
		order:query.order?query.order:'create_time',
		filter:(query.user_type!=undefined?(` and review_status=${query.user_type}`):'')
	}

	mssql.query('dating_managers',where,(err,result,count)=>{
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
})



router.get('/user_list',(req,res,next)=>{
	//table,where,callback,orderName,elseStr
	let openid=req.cookies['admin_oid']
	let query=req.query
	let where={
		size:query.size?parseInt(query.size):20,
		page:query.page?parseInt(query.page):1,
		order_type:query.order_type?query.order_type:'desc',
		order:query.order?query.order:'create_time',
		filter:(query.user_type!=undefined?(` and review_status=${query.user_type}`):'')
	}

	mssql.query('dating_member_info',where,(err,result,count)=>{
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
})

router.get('/multi_like_list',(req,res,next)=>{
	let openid=req.cookies['admin_oid']
	let query=req.query
	mssql.exec(`
			SELECT h1=c.height,h2=d.height,w1=c.weight,w2=d.weight,tel1=c.mobile,tel2=d.mobile,name1=c.member_name,name2=d.member_name,id1=c.card_number,id2=d.card_number,img1=c.head_img,img2=d.head_img ,a.openid,a.mind_openid FROM dating_member_info c,dating_member_info d, dating_mind_member a,dating_mind_member b where a.mind_openid=d.openid and a.openid=c.openid and  a.mind_openid = b.openid and b.mind_openid = a.openid
		`,(err,result,count)=>{
			let arr=[]
			let kv={}
			for(let i=0;i<result.length;i++){
				if(kv[result[i].openid]==result[i].mind_openid){
					continue
				}else{
					arr.push(result[i])
					kv[result[i].mind_openid]=result[i].openid
				}
			}
			//console.log(kv)
			res.json({success:true,data:arr,msg:'获取成功'})
		})
})

router.get('/examine_admin',(req,res,next)=>{
	let openid=req.cookies['admin_oid']
	if(openid=='')
	{
		res.json({success:false,msg:'登录已失效'})
		return;
	}
	let id=req.body.id;
	mssql.update('dating_managers',{review_status:{type:'num',value:1}},`id='id'`,(err,result,count)=>{
		let json={}
		if(count>0){
			json.success=true
			json.msg='操作成功'
		}else{
			json.success=false
			json.msg='操作失败'
		}
	})
})

router.get('/examine_user',(req,res,next)=>{
	let openid=req.cookies['admin_oid']
	if(openid=='')
	{
		res.json({success:false,msg:'登录已失效'})
		return;
	}
	let id=req.body.id;
	mssql.update('dating_member_info',{review_status:{type:'num',value:1}},`id='id'`,(err,result,count)=>{
		let json={}
		if(count>0){
			json.success=true
			json.msg='操作成功'
		}else{
			json.success=false
			json.msg='操作失败'
		}
	})
})

module.exports=router