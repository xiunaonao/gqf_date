var express = require('express');
var router = express.Router();
var fs=require('fs');
var request=require('request')

var multer=require("multer")
var sms_cool={}
//var upload=multer({ dest: 'uploads_temp/' })

var storage = multer.diskStorage({
     //设置上传后文件路径，uploads文件夹会自动创建。
        destination: function (req, file, cb) {
            //cb(null, './uploads_temp')
           	cb(null,'../gqf_date/public/temp')
       }, 
     //给上传文件重命名，获取添加后缀名
      filename: function (req, file, cb) {

          var fileFormat = (file.originalname).split(".");
          cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
      }
 });  
     //添加配置文件到muler对象。
     var upload = multer({
          storage: storage
    });


router.post('/upload',upload.any(),(req,res,next)=>{
	if(req.files.length<=0){
		res.json({success:0,msg:'未上传任何文件'})
		return
	}
	//let json={text:'',err:''}
	let imgs=[]
	let index=0
	let json={}
	let readImg=(item,i)=>{
		console.log(item.path);
		if(item){
			imgs.push(item.path.replace(/\\/g,'/').replace('../gqf_date/public',''))
		}
		if(index==req.files.length-1){
			
			if(imgs.length==0){
				json.success=0
				json.msg='上传失败'
			}else{
				json.success=1
				if(imgs.length==req.files.length){
					json.msg="上传成功"
				}else{
					json.msg="上传图片成功"+imgs.length+"个,失败"+(req.files.length-imgs.length)+""
					json.totalNum=req.files.length
					json.successNum=imgs.length
				}
				json.url=imgs.join(',')
				json.imgs=imgs
			}
			res.json(json)
		}else{
			index++
			readImg(req.files[index],index)
		}
	}

	readImg(req.files[0],0)
})

router.post('/sms_post',(req,res,next)=>{
	if(!req.body.mobile){
		res.json({success:0,msg:'请输入手机号码'})
		return;
	}
	if(sms_cool[req.body.mobile] && (new Date())-sms_cool[req.body.mobile]<30000){
		res.json({success:0,msg:'短信验证码已发送，30秒后可重新发送'})
		return;
	}
	sms_cool[req.body.mobile]=(new Date()-0);

	let url=`http://100596.un.123zou.com/api/SmsApi/send_sms?mobile=${req.body.mobile}&sms_type=2`

	request(url,(err,resp,body)=>{
		//{"success":1,"data":null,"total":0,"msg":"发送成功","err_msg":null,"code":0}
		console.log(typeof body)
		if(typeof body=='string')
			body=JSON.parse(body)
		res.json(body)
	})
})

router.post('/sms_valid',(req,res,next)=>{
	if(!req.body.mobile){
		res.json({success:0,msg:'请输入手机号码'})
		return;
	}
	if(!req.body.code){
		res.json({success:0,msg:'请输入验证码'})
		return;
	}

	let url=`http://100596.un.123zou.com/api/SmsApi/Verify?mobile=${req.body.mobile}&sms_type=2&sms=${req.body.code}`

	request(url,(err,resp,body)=>{
		//{"success":1,"data":null,"total":0,"msg":"发送成功","err_msg":null,"code":0}
		console.log(typeof body)
		if(typeof body=='string')
			body=JSON.parse(body)
		res.json(body)
	})
})

router.post('/upload_no',upload.any(),(req,res,next)=>{
	console.log(req.files)
	if(req.files.length<=0){
		res.json({success:0,msg:'未上传任何文件'})
		return
	}
	let imgs=[]
	let index=0
	let json={text:'',err:''};
	let readImg=(item,i)=>{
		let filename='/public/temp/'+(new Date().getTime()+parseInt(1000000+Math.random()*1000000))+index+item.originalname.substring(item.originalname.lastIndexOf('.'))
		//console.log(i+":"+filename)
		json.text+=(i+":"+filename)
		fs.readFile(item.path,(err,data)=>{
			fs.writeFile('.'+filename,data,(err)=>{
				json.err+=err
				console.log(err)
				if(!err)
					imgs.push(filename.replace('gqf_date\\public\\',''))
				console.log('------------')
				console.log(imgs)
				if(index==req.files.length-1){
					
					if(imgs.length==0){
						json.success=0
						json.msg='上传失败'
					}else{
						json.success=1
						if(imgs.length==req.files.length){
							json.msg="上传成功"
						}else{
							json.msg="上传图片成功"+imgs.length+"个,失败"+(req.files.length-imgs.length)+""
							json.totalNum=req.files.length
							json.successNum=imgs.length
						}
						json.url=imgs.join(',')
						json.imgs=imgs
					}
					res.json(json)
				}else{
					index++
					readImg(req.files[index],index)
				}
			})
		})
	}
	readImg(req.files[0],0)
})


module.exports=router