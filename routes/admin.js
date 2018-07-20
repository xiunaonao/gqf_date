var express = require('express');
let http=require('http');
var router = express.Router();
var ver=require('../package.json').version


router.get('/',(req,res,next)=>{
	res.render('admin_index',{})
})

router.get('/notice',(req,res,next)=>{
	res.render('admin_notice',{})
})

router.get('/volunteer',(req,res,next)=>{
	res.render('admin_volunteer',{})
})

router.get('/banner',(req,res,next)=>{
	res.render('admin_banner',{})
})

router.get('/pair',(req,res,next)=>{
	res.render('admin_pair',{})
})
module.exports = router;
