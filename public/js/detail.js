

	var vapp = new Vue({
		el:".detail_main",
		data:{
			news:[],
			standardInfo:[],
			memberId:_param.id,
			mInfo:{
				education:""
			}
		},
		methods:{
			getMemberInfo:function(){
				document.body.scrollTop=0;
				var getUrl = "dating_api/detail?id="+this.memberId;
				this.$http.get(getUrl).then(function(data){
					var dat = data.data;
					if(typeof dat=="string"){
						dat = JSON.parse(data.data);
					}
					this.news = dat.data;
					this.getEdu();
				});
			},
			getStandard:function(){
				var getUrl = "/dating_api/standard_detail";
				this.$http.get(getUrl).then(function(data){
					var dat = data.data;
					if(typeof dat=="string"){
						dat = JSON.parse(data.data);
					}
					this.standardInfo = dat.data;
				});
			},
			getAge:function(birthday){         
			    var returnAge;  
			    if(!birthday)
			    	return "未知";
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
			getBirth:function(birthday){
				if(!birthday)
					return '未知';
			    var sArr = birthday.split("T"); 
			    var birthArr = sArr[0].split("-");
			    var birthYear = birthArr[0];  
			    var birthMonth = birthArr[1];  
			    var birthDay = birthArr[2];
			    var retBirthday = birthYear+"."+birthMonth+"."+birthDay;
			    return retBirthday;
			},
			getEdu:function(){
				var eduNum = this.news.education;
				if(eduNum == 0){
					this.mInfo.education = "其他";
				}else if(eduNum == 1){
					this.mInfo.education = "小学";
				}else if(eduNum == 2){
					this.mInfo.education = "初中";
				}else if(eduNum == 3){
					this.mInfo.education = "高中";
				}else if(eduNum == 4){
					this.mInfo.education = "中专";
				}else if(eduNum == 5){
					this.mInfo.education = "大学专科";
				}else if(eduNum == 6){
					this.mInfo.education = "大学本科";
				}else if(eduNum == 7){
					this.mInfo.education = "研究生";
				}
			}
			
		}
	});
	vapp.getMemberInfo();
//	vapp.getStandard();

jQuery(function(){
	
	$("body").ready(function(){ 
		var like_flag = false;
	　　
		if(like_flag){
			$(".like_btn").show();
			$(".unlike_btn").hide();
		}else{
			$(".like_btn").hide();
			$(".unlike_btn").show();
		}
	}); 
	
	$(".unlike_btn").click(function(){
		$(this).hide();
		$(".like_btn").show();
	});
	$(".like_btn").click(function(){
		$(this).hide();
		$(".unlike_btn").show();
	})
})