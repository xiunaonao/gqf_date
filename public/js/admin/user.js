var vapp=new Vue({
	el:'#user_detail',
	data:{
		news:[],
		standardInfo:[],
		income:['','5万以下','5~8万','8~10万','10~15万','15~20万','20~50万','50万以上'],
		memberId:id,
		mInfo:{
			education:""
		}
	},
	methods:{
		getMemberInfo:function(){
			var scope=this;
			document.body.scrollTop=0;
			var getUrl = "/dating_api/detail?id="+this.memberId;
			axios.get(getUrl).then(function(data){
				var dat = data.data;
				if(typeof dat=="string"){
					dat = JSON.parse(data.data);
				}
				scope.news = dat.data;
				scope.getEdu();
			});
		},
		getStandard:function(){
			var scope=this;
			var getUrl = "/dating_api/standard_detail";
			axios.get(getUrl).then(function(data){
				var dat = data.data;
				if(typeof dat=="string"){
					dat = JSON.parse(data.data);
				}
				scope.standardInfo = dat.data;
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
		examine:function(obj,status){
			axios.post('/admin_api/examine_user',{status:status,id:obj.id}).then(function(res){
				if(res.data.success){
					_alert('操作成功');
					obj.review_status=status;
				}else{
					_alert(res.data.msg);
				}
			})
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
	},
	mounted:function(){
		this.getMemberInfo();
		this.getStandard();
	}
})