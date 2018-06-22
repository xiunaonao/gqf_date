var express = require('express');
var router = express.Router();
var fs=require('fs');

var multer=require("multer")
var upload=multer({ dest: 'uploads_temp/' })

router.post('/upload',upload.any(),(req,res,next)=>{
	console.log(req.files)
	if(req.files.length<=0){
		res.json({success:0,msg:'未上传任何文件'})
		return
	}
	let imgs=[]
	let index=0
	let readImg=(item,i)=>{
		let filename='/public/temp/'+(new Date().getTime()+parseInt(1000000+Math.random()*1000000))+index+item.originalname.substring(item.originalname.lastIndexOf('.'))
		console.log(i+":"+filename)
		fs.readFile(item.path,(err,data)=>{
			fs.writeFile('.'+filename,data,(err)=>{
				console.log(err)
				if(!err)
					imgs.push(filename.replace('/public',''))
				console.log('------------')
				console.log(imgs)
				if(index==req.files.length-1){
					let json={};
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