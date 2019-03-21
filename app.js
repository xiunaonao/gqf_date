var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dating_apiRouter=require('./routes/dating_api')
var apiRouter=require('./routes/api')
var adminRouter=require('./routes/admin')
var adminapiRouter=require('./routes/admin_api')
var gameRouter=require('./routes/game')
var ver=require('./package.json').version
console.log('project version:'+ver)

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
	//console.log(req.url.indexOf('union_valid'))
	if(req.url.indexOf('/dq_')>-1){
		res.locals._v=ver
		next()
		return
	}

	if(req.url.indexOf('/nmd_wsm')>-1){
		let tel_times=new Date(new Date().setDate(new Date().getDate()+30))
		res.cookie('new_oid','',{expires:tel_times,httpOnly:true})
		res.cookie('union_oid','om-NlwIIEXNK_ghTdb_-U-lNhz8g',{expires:tel_times,httpOnly:true})
	}

	if(req.url.indexOf('union_valid')==-1 && req.url.indexOf('api')==-1){
		let openid=req.cookies['union_oid']
		let newid=req.cookies['new_oid']
		if(!openid || (!req.query.code && openid && !newid)){
			if(req.query.code){
				let code=req.query.code
				let wechat_web=require('./server/wechat_token')
				wechat_web.get_web_token(code,(body)=>{
					let tel_times=new Date(new Date().setDate(new Date().getDate()+30))
					res.cookie('union_oid',body.openid,{expires:tel_times,httpOnly:true})
					res.cookie('new_oid','1',{expires:tel_times,httpOnly:true})
					res.redirect('https://xq.123zou.com/#home')
				})
				return
			}else{
				let url=encodeURIComponent('http://xq.123zou.com').toLocaleLowerCase()
				let appid='wx7bc344f62f4fdaa3'
				res.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${url}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`)
				return
			}
			// if(req.url.indexOf('openid')>-1){
			// 	openid=req.query.openid
			// 	res.redirect(302,'http://xq.123zou.com/union_valid?openid='+openid)
			// 	return
			// }else{
		 //  		res.redirect(302,'https://100579.un.123zou.com/Platform/Link?key=go.dating')
		 //  		return
		 //  	}
		}else if(!newid){
			console.log("老用户记录修改中")
			let code=req.query.code
			let wechat_web=require('./server/wechat_token')
			wechat_web.get_web_token(code,(body)=>{
				let mssql=require('./server/mssql')
				let rows={}
				rows['openid']={value:body.openid,type:''}
				//res.json({mssql:mssql.update})
				mssql.update('dating_member_info',rows,` openid='${openid}'`,(err,result,count)=>{
					//res.json({old:openid,new:body.openid,result:result})
					if(!err){
						mssql.update('dating_member_info',rows,` openid='${openid}'`,()=>{})

						let tel_times=new Date(new Date().setDate(new Date().getDate()+30))
						res.cookie('union_oid',body.openid,{expires:tel_times,httpOnly:true})
						res.cookie('new_oid','1',{expires:tel_times,httpOnly:true})
						res.redirect('https://xq.123zou.com/#home')
						return
					}else{
						//res.json(err);
					}
				})
				
			})
			return
		}
	  }
	res.locals._v=ver
	next()
})


app.use(express.static(path.join(__dirname, 'views/html')))
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/dating_api', dating_apiRouter)
app.use('/api',apiRouter)
app.use('/admin',adminRouter)
app.use('/admin_api',adminapiRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
