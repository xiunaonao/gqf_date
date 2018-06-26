jQuery(function(){
	var like_flag = 0;
	
	$("body").on('click','.like_icon',function(){
		like_flag = $(this).attr("data-like");
		if(like_flag==1){
			$(this).attr("src","/img/unlike.png");
			$(this).attr("data-like",0);
//			console.log("yes");
		}else{
			$(this).attr("src","/img/like.png");
			$(this).attr("data-like",1);
//			console.log("no");
		}
	});
	
})

	var vapp = new Vue({
		el:'.list_main',
		data:{
			news:[],
			like_flag:false,
			pageCool:true,
			pageIndex:1,
			listParam:{}
		},
		methods:{
			init:function(){
				var scope=this;

				document.body.onscroll=function(){
					var top=document.body.scrollTop;
					var mheight=document.body.scrollHeight;
					var cheight=document.body.clientHeight;
					if(top+cheight>=mheight-10){
						console.log('翻页')
						scope.getMoreData()
					}
				}


				var listPost = sessionStorage.getItem("listPost");
				console.log("listPost:"+listPost);
				if(listPost==null){
					var getUrl = 'dating_api/list?page=1&size=20&order_type=asc';
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
				}else{
					var listArr = JSON.parse(sessionStorage.listPost);
					console.log(listArr.age);
					var getUrl = 'dating_api/list?page=1&size=20&order_type=asc&order=day_of_birth&age='+listArr.age+'&height='+listArr.height+'&education='+listArr.education+'&annual_income='+listArr.annual_income+'&housing='+listArr.housing+'&car_buying='+listArr.car_buying;
					this.$http.get(getUrl).then(function(data){
						var dat = data.data;
						if(typeof dat == 'string'){
		                    dat=JSON.parse(data.data);
		                }
						//this.news = dat.data;
						for(var i=0;i<dat.data.length;i++){
							this.news.push(dat.data[i])
						}
	//					console.log(this.news.day_of_birth);
						console.log("success:"+dat.success);
						console.log("message:"+dat.message);
						//sessionStorage.setItem("listPost","");
						this.listParam=listArr
						delete sessionStorage.listPost
					});
				}
			},
			getMoreData:function(){
				var scope=this
				if(!this.pageCool){
					return;
				}
				this.pageCool=false;
				setTimeout(function(){
					scope.pageCool=true

				},3000)
				this.pageIndex++;
				var listArr=this.listParam
				var getUrl = 'dating_api/list?page='+this.pageIndex+'&size=20&order_type=asc';
				if(listArr.age){
				 getUrl+='&age='+listArr.age;
				}
				if(listArr.height){
				 getUrl+='&height='+listArr.height;
				}
				if(listArr.education){
				 getUrl+='&education='+listArr.education;
				}
				if(listArr.annual_income){
				 getUrl+='&annual_income='+listArr.annual_income;
				}
				if(listArr.housing){
				 getUrl+='&housing='+listArr.housing;
				}
				if(listArr.car_buying){
				 getUrl+='&car_buying='+listArr.car_buying;
				}
				this.$http.get(getUrl).then(function(data){
					var dat = data.data;
					if(typeof dat == 'string'){
	                    dat=JSON.parse(data.data);
	                }
					this.news = dat.data;
//					console.log(this.news.day_of_birth);
					console.log("success:"+dat.success);
					console.log("message:"+dat.message);
					//sessionStorage.setItem("listPost","");
					delete sessionStorage.listPost
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
			},
			getLike:function(res){
				if(res){
					$(this).attr("src","/img/like.png");
				}else{
					$(this).attr("src","/img/unlike.png");
				}
			},
			sentLike:function(mId,isLike){
				if(isLike){
					isLike = 0;
				}else{
					isLike = 1;
				}
				console.log("mId:"+mId+"--isLike:"+isLike);
				var sentUrl = '/dating_api/like?id='+mId+'&is_like='+isLike;
				this.$http.get(sentUrl).then(function(data){
					var dat = data.data;
					console.log("success:"+dat.success);
					console.log("message:"+dat.message);
				});
			}
		}
	});
	vapp.init();
	
