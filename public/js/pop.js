var vapp=new Vue({
	el:'#pop',
	data:{
		boy:[],
		girl:[]
	},
	methods:{
		get_pop:function(){
			var scope=this;
			var url='/admin_api/get_pop_list'
			axios.post(url).then(function(res){
				scope.data=res.data.data;

				for(var i=0;i<scope.data.length;i++){
					var dat=scope.data[i];
					if(dat.sex==1){
						scope.boy.push(dat);
					}else{
						scope.girl.push(dat);
					}
				}
			})
		},
		goto:function(obj){
			window.location.href='#detail/'+obj.user_id
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
		this.get_pop();
	}
})