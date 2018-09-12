var vapp=new Vue({
	el:'#pop',
	data:{
		data:[],
		user_list:[],
		is_over:true,
		add_sort:-1,
		sex_c:1,
		boy:[],
		girl:[],
		page:1,
		size:20,
		order:'mind_count',
		order_type:'desc',
		sex:1,
		job:'',
		job_list:['公务员','教师','医护人员','军人/警察','律师','企业高管','企业职工','其他'],
		keyword:''
	},
	methods:{
		get_user:function(is_new){
			if(is_new){
				this.page=1
				this.user_list=[]
				this.is_over=false
			}
			var scope=this;
			var url='/dating_api/list?page='+scope.page+'&size='+scope.size+'&order='+scope.order+'%20'+scope.order_type;
			if(scope.job)
				url+='&job='+scope.job;
			if(scope.keyword)
				url+='&keyword='+scope.keyword
			url+='&sex='+this.sex;
			axios.get(url).then(function(res){
				if(res.data.data.length==0)
					scope.is_over=true;
				for(var i=0;i<res.data.data.length;i++){
					scope.user_list.push(res.data.data[i])
				}

			})
		},
		get_pop:function(){
			var scope=this;
			var url='/admin_api/get_pop_list'
			axios.post(url).then(function(res){
				scope.data=res.data.data;

				for(var i=0;i<scope.data.length;i++){
					var dat=scope.data[i];
					if(dat.sex==1){
						if(scope.boy.length==dat.sort){
							scope.boy.push(dat);
						}else if(scope.boy.length<dat.sort){
							for(var j=scope.boy.length;j<dat.sort;j++){
								scope.boy.push(null);
							}
							scope.boy.push(dat);
						}
					}else{
						if(scope.girl.length==dat.sort){
							scope.girl.push(dat);
						}else if(scope.girl.length<dat.sort){
							for(var j=scope.girl.length;j<dat.sort;j++){
								scope.girl.push(null);
							}
							scope.girl.push(dat);
						}
					}
				}
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
			      
		},
		add_pop:function(sort,sex){
			this.add_sort=sort;
			this.sex=sex;
			this.is_over=false;
			this.get_user();
		},
		insert_pop:function(obj){
			var scope=this;
			var data={
				sort:scope.add_sort,
				sex:scope.sex,
				user_id:obj.id
			}
			console.log(data)
			axios.post('/admin_api/pop_update_or_insert',data).then(function(res){
				if(res.data.success){
					_alert('添加成功');
					setTimeout(function(){
						window.location.reload();
					},1500)
					// if(scope.sex==1){
					// 	scope.boy[scope.add_sort]=obj;
					// }else{
					// 	scope.girl[scope.add_sort]=obj
					// }
					//scope.add_sort=-1;
				}
			})
		},
		delete_pop:function(obj,index){
			var scope=this;
			var sex=scope.sex_c;
			console.log(index);
			axios.post('/admin_api/pop_delete',{id:obj.id}).then(function(res){
				if(res.data.success){
					if(sex==1){
						Vue.set(scope.boy,index,null)
					}else{
						Vue.set(scope.girl,index,null)
					}
				}
			})
		}
	},
	mounted:function(){
		this.get_pop();
	}
})