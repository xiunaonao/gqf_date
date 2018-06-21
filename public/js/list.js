$(function(){
	var like_flag = false;
	
	$(".like_icon").click(function(){
		like_flag = $(this).attr("data-like");
		if(like_flag=="true"){
			$(this).attr("src","/img/unlike.png");
			$(this).attr("data-like","false");
			console.log("yes");
		}else{
			$(this).attr("src","/img/like.png");
			$(this).attr("data-like","true");
			console.log("no");
		}
	});
	
	$(".member_dl").click(function(){
		window.location.href = "#detail";
	})
	
})

	var vapp = new Vue({
		el:'.list_main',
		data:{
			news:[]
		},
		methods:{
			ready:function(){
				var getUrl = 'dating_api/list?page=1&size=5&order_type=asc&order=day_of_birth';
				this.$http.get(getUrl).then(function(data){
					var dat = data.data;
					if(typeof dat == 'string'){
	                    dat=JSON.parse(data.data);
	                }
					this.news = dat.data;
//					console.log(this.news.day_of_birth);
					console.log("success:"+dat.success);
					console.log("message:"+dat.message);
				});
			},
			getAge:function(birthday){         
			    var returnAge;  
			    var sArr = birthday.split("T"); 
			    var birthArr = sArr[0].split("-");
			    var birthYear = birthArr[0];  
			    var birthMonth = birthArr[1];  
			    var birthDay = birthArr[2];  
			      
			    d = new Date();  
			    var nowYear = d.getFullYear();  
			    var nowMonth = d.getMonth() + 1;  
			    var nowDay = d.getDate();  
			      
			    if(nowYear == birthYear){  
			        returnAge = 0;//同年 则为0岁  
			    }  
			    else{  
			        var ageDiff = nowYear - birthYear ; //年之差  
			        if(ageDiff > 0){  
			            if(nowMonth == birthMonth) {  
			                var dayDiff = nowDay - birthDay;//日之差  
			                if(dayDiff < 0){  
			                    returnAge = ageDiff - 1;  
			                }else{  
			                    returnAge = ageDiff ;  
			                }  
			            }else{  
			                var monthDiff = nowMonth - birthMonth;//月之差  
			                if(monthDiff < 0){  
			                    returnAge = ageDiff - 1;  
			                }else{  
			                    returnAge = ageDiff ;  
			                }  
			            }  
			        }else{  
			            returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天  
			        }  
			    }  
			    return returnAge;//返回周岁年龄  
			      
			},  
			getId:function(mId){
				window.location.href="#detail/"+mId;
			}
		}
	});
	vapp.ready();