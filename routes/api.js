var express = require('express');
var router = express.Router();
var fs=require('fs');

var multer=require("multer")
//var upload=multer({ dest: 'uploads_temp/' })

var storage = multer.diskStorage({
     //设置上传后文件路径，uploads文件夹会自动创建。
        destination: function (req, file, cb) {
            cb(null, './uploads_temp')
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
					imgs.push(filename.replace('/public',''))
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