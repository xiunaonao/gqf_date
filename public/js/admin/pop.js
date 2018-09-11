var vapp=new Vue({
	el:'#pop',
	data:{
		data:[],
		page:1,
		size:20,
		order:'mind_count',
		order_type:'desc',
		sex:0,
		job:'',
		keyword:''
	},
	methods:{
		get_user:function(){
			var scope=this;
			var url='http://127.0.0.1:2333/dating_api/list?page='+scope.page+'&size='+scope.size+'&order='+scope.order+'%20'+scope.order_type;
			if(scope.job)
				url+='&job='+scope.job;
			if(scope.keyword)
				url+='&keyword='+scope.keyword
			axios.get(url).then(function(res){
				scope.data=res.data.data;
			})
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
			    if(birthYear<=1900){
			    	return '';
			    }

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
			    return returnAge+'岁';//返回周岁年龄  
			      
		}
	},
	mounted:function(){
		this.get_user();
	}
})