let request=require('request')
let appid='wxb5ed549f53f1ba99';
let secret='9e2e9837c28f3f849613c23cd1aa9a81';

let post_all=()=>{

}

let post_one=(obj)=>{
	//openid,msg,title,title2,remark,callback

	
	let json={
		"touser":obj.openid,
		"template_id":"9cWnla5OOXHC2-dHJ-xkpF5eqUedQuUQDZNzJT5xrgk",
		"url":"http://100579.un.123zou.com/member/PreImmigrate",
		"miniprogram":{
			"appid":appid,
			"pagepath":""
		},
		"data":{
			"first":{"value":obj.title?obj.title:"工青妇单身交友平台消息","color":"#173177"},
			"keyword1":{"value":obj.title2?obj.title2:"工青妇单身交友平台","color":"#173177"},
			"keyword2":{"value":obj.msg?obj.msg:"","color":"#00FF00"},
			"remark":{"value":obj.remark?obj.remark:"","color":"#173177"}
		}
	}
	get_token((data)=>{
		let token=data.access_token
		//https://api.weixin.qq.com/cgi-bin/message/template/send?access_token={0}
			request({
		        url: `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`,
		        method: "POST",
		        json: true,
		        headers: {
		            "content-type": "application/json",
		        },
		        body: json,
		    }, function(error, response, body) {
		        if (!error && response.statusCode == 200) {
		            console.log(body) // 请求成功的处理逻辑
		            if(obj.callback){
		            	obj.callback(body)
		            }
		        }
		    });
	})
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

let get_token=(callback)=>{
	request({
        url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: json,
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
	post_all,
	post_one
}