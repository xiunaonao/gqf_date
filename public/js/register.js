var vapp=new Vue({
	el:'#register',
	data:{
		data:{
			card_number:'',
			mobile:'',
			member_name:'',
			sex:1,
			day_of_birth:''
		},
		code:'',
		code_cool:0,
	},
	methods:{
		reg:function(){
			var scope=this;

			var valid_idcard=Z_VALID().idcard(scope.data.card_number);
			
			if(!valid_idcard.success){
				$(".alert_msg p").html('身份证格式不正确');
			    $(".alert_msg").show();
			    setTimeout('$(".alert_msg").hide()', 2000);
				return;
			}else{
				scope.data.sex=valid_idcard.info.sex=='男'?1:2;
				scope.data.day_of_birth=valid_idcard.info.year+'-'+valid_idcard.info.month+'-'+valid_idcard.info.day;
			}
			

	    	axios.post('/api/sms_valid',{mobile:scope.data.mobile,code:scope.code}).then(function(res){
	    		var data=res.data;
	    		if(data.success){
					axios.post('/dating_api/register',scope.data).then(function(res){
						if(res.data.success){
							$(".alert_msg p").html(res.data.msg);
						    $(".alert_msg").show();
						    setTimeout('$(".alert_msg").hide()', 2000);
						}else{
							$(".alert_msg p").html(res.data.msg);
						    $(".alert_msg").show();
						    setTimeout('$(".alert_msg").hide();location.href="#list"', 2000);
						}
					})
	    		}else{
	    			$(".alert_msg p").html(res.data.msg);
				    $(".alert_msg").show();
				    setTimeout('$(".alert_msg").hide()', 2000);
	    		}
	    	})


		},
		get_whchat:function(){
			axios.post('/dating_api/get_now_user').then(function(res){

			})
		},
		postCode:function(){
	    	var scope=this;
	    	if(!scope.data.mobile){
	    		$(".alert_msg p").html("请先输入手机号码");
			    $(".alert_msg").show();
			    setTimeout('$(".alert_msg").hide()', 2000);
	    		return;
	    	}
	    	if(this.code_cool!=0){
	    		return;
	    	}

	    	this.code_cool=30;


	    	var code_cool_interval=setInterval(function(){
	    		if(scope.code_cool>0)
	    			scope.code_cool--;
	    		else
	    			clearInterval(code_cool_interval);
	    	},1000);

	    	axios.post('/api/sms_post',{mobile:scope.data.mobile}).then(function(res){
	    		var data=res.data;
	    		if(data.success){
	    			$(".alert_msg p").html("验证码已发送");
				    $(".alert_msg").show();
				    setTimeout('$(".alert_msg").hide()', 2000);
	    		}else{
	    			$(".alert_msg p").html(res.data.msg);
				    $(".alert_msg").show();
				    setTimeout('$(".alert_msg").hide()', 2000);
	    		}
	    	})

	    },
	},
	mounted:function(){

	}
})