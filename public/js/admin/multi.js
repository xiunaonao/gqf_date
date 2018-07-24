var vapp=new Vue({
	el:'#pair',
	data:{
		data:[],
		type:0,
	},
	methods:{
		get_multi:function(){
			var scope=this;
			axios.get('/admin_api//multi_like_list').then(function(res){
				scope.data=res.data.data;
			})
		},
		getAge:function(id){         
			var birthday=id.substring(6,10)+'-'+id.substring(10,12)+'-'+id.substring(12,14)
			console.log(birthday);
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
		      
		}
	},
	mounted:function(){
		this.get_multi();
	}
})