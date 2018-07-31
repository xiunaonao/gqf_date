var express = require('express');
var router = express.Router();
let mssql=require('../server/mssql')
let ws=require('../server/wechat')


router.post('/admin_login',(req,res,next)=>{
	let openid=req.cookies['union_oid']
	mssql.querySingle('dating_managers',`openid='${openid}' and review_status=1`,(err,result,count)=>{
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
				msg:'您不是管理员或者未审核完成，无法登录',
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

router.post('/admin_update',(req,res,next)=>{
	let openid=req.cookies['union_oid']
	let id=req.body.id
	if(!id){
		res.json({success:false,msg:'请选择用户'})
		return;
	}

	mssql.update('dating_managers',{usertype:{type:'num',value:1}},`id=${id} and (select count(id) from dating_managers where usertype=1 and review_status=1 and  openid='${openid}')>0`,(err,result,count)=>{
			let json={}
			if(count>0){
				json.success=true
				json.msg='操作成功'
			}else{
				json.success=false
				json.msg='操作失败'
			}
			res.json(json)
		})

})

router.post('/volunteer_register',(req,res,next)=>{
	let openid=req.cookies['union_oid']
	mssql.querySingle('dating_managers',`openid='${openid}'`,(err,result,count)=>{
		if(count>0){
			if(result[0].review_status==0){
				res.json({success:false,msg:'您的信息正在审核，请耐心等待'})
			}else{
				res.json({success:false,msg:'您已经申请成功过，请直接登录'})
			}
			//res.json({success:false,msg})

		}else{
			mssql.querySingle('dating_member_info',`openid='${openid}'`,(err,result2,count)=>{
				let body=result2[0]
				if(!body){
					res.json({success:false,msg:'无效的用户'})
					return;
				}
				console.log(result2)
				let rowsKey={
			        name:'',
			        openid:'',
			        head_img:'',
			        usertype:'num',
			        work_unit:'',
			        mobile:'',
			        review_status:''
				}
				let rows={}
				for(let i=0;i<Object.keys(rowsKey).length;i++){
					let key=Object.keys(rowsKey)[i]
					rows[key]={}
					rows[key].value=body[key]
					if(rows[key].value==undefined){
						rows[key].value=''
					}
					rows[key].type=rowsKey[key]
				}
				rows.name.value=body.member_name
				rows.review_status.value=0
				rows.usertype.value=2
				mssql.insert('dating_managers',rows,(err,result,count)=>{
					if(count>0){
						res.json({success:true,msg:'已发起申请，等待管理员审核'})
					}else{
						res.json({success:false,msg:'网络错误，申请失败，请重试'})
					}
					
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
		//filter:(query.user_type!=undefined?(` and usertype=${query.user_type}`):'')+(query.review_status!=undefined?(` and review_status=${query.user_type}`):'')
		filter:`` 
	}
	if(query.usertype!=-2){
		where.filter+=` and usertype=${query.usertype}`
	}
	if(query.status!=2){
		where.filter+=` and review_status=${query.status} `
	}
	mssql.exec(`select * from dating_managers where (select count(id) from dating_managers where usertype=1 and review_status=1 and  openid='${openid}')>0 `+where.filter,(err,result,count)=>{
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

    if(req.query.ky){
    	if(isNaN(req.query.ky)){
    		where.filter+=` and (member_name like '%${req.query.ky}%')`
    	}else{
    		where.filter+=` and (id=${req.query.ky})`
    	}
    	//where.filter+=` and (id in ${ky} or ) `
    }
    where.filter += ' ';
    console.log('查询条件:'+where.filter)
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

router.post('/examine_admin',(req,res,next)=>{
	let openid=req.cookies['admin_oid']
	if(openid=='')
	{
		res.json({success:false,msg:'登录已失效'})
		return;
	}

	mssql.exist('dating_managers',`usertype=1 and review_status=1 and  openid='${openid}'`,(err2,result2,count2)=>{
		if(count2<=0){
			res.json({success:false,msg:'权限不足'});
			reutrn;
		}
		req.body.status=(req.body.status?1:-1)
		let id=req.body.id;
		mssql.update('dating_managers',{review_status:{type:'num',value:req.body.status}},`id=${id}`,(err,result,count)=>{
			let json={}
			if(count>0){
				json.success=true
				json.msg='操作成功'
			}else{
				json.success=false
				json.msg='操作失败'
			}
			res.json(json)
		})
	})


})


router.post('/delete_user', (req, res, next) => {
    let openid = req.cookies['admin_oid']
    if (openid == '') {
        res.json({ success: false, msg: '登录已失效' })
        return;
    }
    req.body.status = (req.body.status ? 1 : -1)
    let id = req.body.id;
    mssql.remove('dating_member_info', `id=${id}`, (err, result, count) => {
        let json = {}
        if (count > 0) {
            json.success = true
            json.msg = '操作成功'
        } else {
            json.success = false
            json.msg = '操作失败'
        }
        res.json(json)
    })
})



router.post('/examine_user',(req,res,next)=>{
	let openid=req.cookies['admin_oid']
	if(openid=='')
	{
		res.json({success:false,msg:'登录已失效'})
		return;
	}
	req.body.status=(req.body.status?1:-1)
	let id=req.body.id;
	mssql.update('dating_member_info',{review_status:{type:'num',value:req.body.status}},`id=${id}`,(err,result,count)=>{
		let json={}
		if(count>0){
			json.success=true
			json.msg='操作成功'
		}else{
			json.success=false
			json.msg='操作失败'
		}
		res.json(json)
	})
})

router.post('/wechat_send',(req,res,next)=>{
	let openid=req.cookies['admin_oid']
	if(openid=='')
	{
		res.json({success:false,msg:'登录已失效'})
		return;
	}
	let ids=req.body.ids
	let title=req.body.title
	let msg=req.body.msg
	let url=req.body.url
	mssql.exist('dating_managers',`usertype=1 and review_status=1 and  openid='${openid}'`,(err2,result2,count2)=>{
		if(count2<=0){
			res.json({success:false,msg:'权限不足'})
			reutrn
		}
		let sql=`select openid from dating_member_info where id in (${ids})`
		if(ids==0)
			sql=`select openid from dating_member_info`
		mssql.exec(sql,(err,result,count)=>{
			if(count<=0){
				res.json({success:false,msg:'没有选择有效的会员'})
			}else{
				let openid_list=[]
				for(let i=0;i<result.length;i++){
					openid_list.push(result[i].openid)
				}
				ws.post_more({
					title:title,
					msg:msg,
					url:url,
					openid_list:openid_list
				})
				res.json({success:true,msg:'微信通知发送已经开始处理'})
			}
		})

	})
})

router.get('/banner_list',(req,res,next)=>{
	mssql.exec('select * from dating_banners order by sort asc',(err,result,count)=>{
		if(err){
			res.json({success:false,msg:err})
			return
		}
		let json={
			success:true,
			data:result,
			msg:'操作成功'
		}
		res.json(json)
	})
})

router.post('/banner_delete',(req,res,next)=>{
	let openid=req.cookies['admin_oid']
	if(openid=='')
	{
		res.json({success:false,msg:'登录已失效'})
		return;
	}
	let id=req.body.id
	mssql.exist('dating_managers',`usertype=1 and review_status=1 and  openid='${openid}'`,(err2,result2,count2)=>{
		if(count2<=0){
			res.json({success:false,msg:'权限不足'})
			reutrn
		}
		mssql.remove(`dating_banners`,`id=${id}`,(req,res,next)=>{
			
		})
	})
})

router.post('/banner_insert_or_update',(req,res,next)=>{
	let openid=req.cookies['admin_oid']
	if(openid=='')
	{
		res.json({success:false,msg:'登录已失效'})
		return;
	}
	let id=req.body.id
	let name=req.body.name
	let title=req.body.title
	let url=req.body.url
	let link_url=req.body.link_url
	let sort=req.body.sort
	mssql.exist('dating_managers',`usertype=1 and review_status=1 and  openid='${openid}'`,(err2,result2,count2)=>{
		if(count2<=0){
			res.json({success:false,msg:'权限不足'})
			reutrn
		}

		let rows={
			name:{
				type:'',
				value:name
			},
			title:{
				type:'',
				value:title
			},
			url:{
				type:'',
				value:url
			},
			link_url:{
				type:'',
				value:link_url
			},
			sort:{
				type:'num',
				value:sort
			}
		}
		if(!id){
			let now=new Date()
			rows['created_time']={
				type:'date',
				value:now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds()
			}

			mssql.insert(`dating_banners`,rows,(err,result,count)=>{
				let json={}
				if(err){
					json.success=false
					json.message=err
				}else{
					json.success=true
					json.message='操作成功'
					json.count=count
					//json.id=rows.id.value
				}
				res.json(json)
			})

		}else{
			mssql.update(`dating_banners`,rows,`id=${id}`,(err,result,count)=>{
				let json={}
				if(err){
					json.success=false
					json.message=err
				}else{
					json.success=true
					json.message='操作成功'
					json.count=count
					//json.id=rows.id.value
				}
				res.json(json)
			})
		}

		// let sql=`select openid from dating_member_info where id in (${ids})`
		// if(ids==0)
		// 	sql=`select openid from dating_member_info`
		// mssql.exec(sql,(err,result,count)=>{
		// 	if(count<=0){
		// 		res.json({success:false,msg:'没有选择有效的会员'})
		// 	}else{
		// 		let openid_list=[]
		// 		for(let i=0;i<result.length;i++){
		// 			openid_list.push(result[i].openid)
		// 		}
		// 		ws.post_more({
		// 			title:title,
		// 			msg:msg,
		// 			url:url,
		// 			openid_list:openid_list
		// 		})
		// 		res.json({success:true,msg:'微信通知发送已经开始处理'})
		// 	}
		// })

	})
})

module.exports=router