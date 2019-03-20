let request=require('request')
// let appid='wxb5ed549f53f1ba99';
// let secret='9e2e9837c28f3f849613c23cd1aa9a81';
const secret='8260a54e8dec7e4d740770bc69fe4bb9'
const appid='wx7bc344f62f4fdaa3'

let post_more=(obj)=>{
	console.log(obj)
	let index=0
	let openid_list=obj.openid_list
	let token=''
	let func=(token)=>{
		post_one({
			openid:openid_list[index],
			title:obj.title,
			url:obj.url,
			msg:obj.msg,
			callback:(body,token)=>{
				index++
				//console.log('可用的token:'+token)
				if(index<openid_list.length)
					func(token)
			}
		},token)
		
	}
	func()
}

let post_one=(obj,token)=>{
	//openid,msg,title,title2,remark,callback
	//console.log('即将发送通知');
	
	let json={
		"touser":obj.openid,
		"template_id":"9cWnla5OOXHC2-dHJ-xkpF5eqUedQuUQDZNzJT5xrgk",
        "url":obj.url,
		"miniprogram":{
			"appid":"",
			"pagepath":""
		},
		"data":{
			"first":{"value":obj.title?obj.title:"","color":"#173177"},
			"keyword1":{"value":obj.title2?obj.title2:"长兴工青妇","color":"#173177"},
			"keyword2":{"value":obj.msg?obj.msg:"","color":"#FF82AB"},
			"remark":{"value":obj.remark?obj.remark:"","color":"#173177"}
		}
	}
	get_token((data)=>{
		let token=data.access_token
		console.log(json)
		//https://api.weixin.qq.com/cgi-bin/message/template/send?access_token={0}
		request({
	        url: `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`,
	        method: "POST",
	        json: true,
	        headers: {
	            "content-type": "application/json",
	        },
	        body: json,
	    }, (error, response, body)=> {
	        if (!error && response.statusCode == 200) {
	            console.log(body) // 请求成功的处理逻辑
	            if(obj.callback){
	            	obj.callback(body,token)
	            }
	        }
	    })
	},token)
	// request({
 //        url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`,
 //        method: "POST",
 //        json: true,
 //        headers: {
 //            "content-type": "application/json",
 //        },
 //        body: json,
 //    }, function(error, response, body) {
 //        if (!error && response.statusCode == 200) {
 //            console.log(body) // 请求成功的处理逻辑
 //            if(obj.callback){
 //            	obj.callback(body)
 //            }
 //        }
 //    });

}

let get_user=(openid,callback)=>{
	//https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN
	get_token((data)=>{
		let token=data.access_token
		request({
	        url: `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${token}&openid=${openid}&lang=zh_CN`,
	        method: "POST",
	        json: true,
	        headers: {
	            "content-type": "application/json",
	        },
	        body: {},
	    }, (error, response, body)=> {
	        if (!error && response.statusCode == 200) {
	            console.log(body) // 请求成功的处理逻辑
	            if(callback){
	            	callback(body,token)
	            }
	        }
	    })
	})
	
}


let get_token=(callback,token)=>{
	if(token){
		if(callback){
			console.log('略过验证')
        	callback({access_token:token})
        }
		return;
	}
	request({
        url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: {},
	    }, function(error, response, body) {
	        if (!error && response.statusCode == 200) {
	            console.log(body) // 请求成功的处理逻辑
	            if(callback){
	            	callback(body)
	            }
	        }
	    });
}

module.exports={
	post_more,
	post_one,
	get_user
}