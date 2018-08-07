jQuery(function(){
	var like_flag = 0;
	
// 	$("body").on('click','.like_icon',function(){
// 		like_flag = $(this).attr("data-like");
// 		if(like_flag==1){
// 			$(this).attr("src","/img/unlike.png");
// 			$(this).attr("data-like",0);
// //			console.log("yes");
// 		}else{
// 			$(this).attr("src","/img/like.png");
// 			$(this).attr("data-like",1);
// //			console.log("no");
// 		}
// 	});
	
})

	var vapp = new Vue({
		el:'#list_app',
		data:{
			news:[],
			like_flag:false,
			pageCool:true,
			pageIndex:1,
			yourid:'',
			head_img:'/img/noheadimg.png',
			banner_index:0,
			banner:[
				// {link_url:'',url:'/img/通栏.jpg',title:'姻为有你，缘聚长兴'},
				 {link_url:'',url:'/img/banner_dz.jpg',title:'标心配对成功可尽早参加线下活动'}
			],
			orderArr:[
				{name:'id',value:'desc'},
				{name:'mind_count',value:'desc'},
				{name:'day_of_birth',value:'desc'}
            ],
            job:['公务员','教师','医护人员','军人/警察','律师','企业高管','企业职工','其他'],
            orderNow: 0,
            where:{
            	sex:"性别",
            	job:"职业"
            },
			listParam:{},
			no_more:false,
		},
		methods:{
			init:function(){
				var scope=this;
				this.getMemberInfo();
				this.get_banner();
				document.body.onscroll=function(){
					var top=document.body.scrollTop;
					var mheight=document.body.scrollHeight;
					var cheight=document.body.clientHeight;
					if(top+cheight>=mheight-40){
						console.log('翻页')
						scope.getMoreData()
					}
				}

				setInterval(function(){
					if(scope.banner_index<scope.banner.length-1)
						scope.banner_index++;
					else
						scope.banner_index=0;
				},4000)

				var listPost = sessionStorage.getItem("listPost");
				console.log("listPost:"+listPost);
				if(listPost==null){
                    var orderStr = ""
                    for (var i = 0; i < scope.orderArr.length; i++) {
                        if (i == scope.orderNow)
                            orderStr = scope.orderArr[scope.orderNow].name + ' ' + scope.orderArr[scope.orderNow].value
                        else
                            scope.orderArr[i].value = 'asc';
                    }
					var getUrl = 'dating_api/list?page=1&size=20&order='+orderStr;
					this.$http.get(getUrl).then(function(data){
						var dat = data.data;
						if(typeof dat == 'string'){
		                    dat=JSON.parse(data.data);
		                }
		                if(dat.data.length<=0){
		                	scope.no_more=true;
		                }else{
		                	scope.no_more=false;
		                }
						this.news = dat.data;
						console.log("success:"+dat.success);
						console.log("message:"+dat.message);
					});
				}else{
					var listArr = JSON.parse(sessionStorage.listPost);
					console.log(listArr.age);
					//var orderStr=scope.orderArr[0].name+' '+scope.orderArr[0].value+',';
					//orderStr+=scope.orderArr[1].name+' '+scope.orderArr[1].value+',';
					//orderStr+=scope.orderArr[2].name+' '+scope.orderArr[2].value+'';
                    var orderStr = ""
                    for (var i = 0; i < scope.orderArr.length; i++) {
                        if (i == scope.orderNow)
                            orderStr = scope.orderArr[scope.orderNow].name + ' ' + scope.orderArr[scope.orderNow].value
                        else
                            scope.orderArr[i].value = 'asc';
                    }
					var getUrl = 'dating_api/list?page=1&size=20order='+orderStr+'&age='+listArr.age+'&height='+listArr.height+'&education='+listArr.education+'&annual_income='+listArr.annual_income+'&housing='+listArr.housing+'&car_buying='+listArr.car_buying;
					this.$http.get(getUrl).then(function(data){
						var dat = data.data;
						if(typeof dat == 'string'){
		                    dat=JSON.parse(data.data);
		                }
		                if(dat.data.length<=0){
		                	scope.no_more=true;
		                }else{
		                	scope.no_more=false;
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
			getMemberInfo:function(){
				var scope=this;
				$.ajax({
					url:"/dating_api/detail",
					type:"get",
					success:function(data){
						if(data.success){
							console.log(data.data.head_img)
							if(data.data.head_img){
								scope.head_img=data.data.head_img;
								scope.yourid=data.data.id;
							}
						}
					}
				});
			},
			get_banner:function(){
				return;
				var scope=this;
				axios.get('/admin_api/banner_list').then(function(res){
				if(res.data.success){
					scope.banner=res.data.data;
				}
			})
			},
			getFirstData:function(){
				this.pageIndex=0;
				this.news=[]
				var scope=this
				if(!this.pageCool){
					return;
				}
				this.pageIndex++;
				var listArr=this.listParam
					//var orderStr=scope.orderArr[0].name+' '+scope.orderArr[0].value+',';
					//orderStr+=scope.orderArr[1].name+' '+scope.orderArr[1].value+',';
     //           orderStr += scope.orderArr[2].name + ' ' + scope.orderArr[2].value + '';
                var orderStr = ""
                for (var i = 0; i < scope.orderArr.length; i++) {
                    if (i == scope.orderNow)
                        orderStr = scope.orderArr[scope.orderNow].name + ' ' + scope.orderArr[scope.orderNow].value
                    else
                        scope.orderArr[i].value = 'asc';
                }
				var getUrl = 'dating_api/list?page='+this.pageIndex+'&size=20&order='+orderStr;
				if(this.where.sex!="不限" && this.where.sex!="性别"){
					getUrl+='&sex='+(this.where.sex=="男"?1:2)
				}else{

				}
				if(this.where.job!="不限" && this.where.job!="职业"){
					getUrl+='&job='+(this.where.job);
				}
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
	                if(dat.data.length<=0){
		                	scope.no_more=true;
		                }else{
		                	scope.no_more=false;
		                }
					for(var i=0;i<dat.data.length;i++){
						if(dat.count<=(dat.size*(dat.page-1)+i)){
							break;
						}
						this.news.push(dat.data[i])
					}
					delete sessionStorage.listPost
				});
			},
            getMoreData: function (isagain){
				var scope=this
				if(!this.pageCool){
					return;
				}
				this.pageCool=false;
				setTimeout(function(){
					scope.pageCool=true

				},3000)
                this.pageIndex++;

                var listArr = this.listParam
                var orderStr = ""
                for (var i = 0; i < scope.orderArr.length; i++) {
                    if (i == scope.orderNow)
                        orderStr = scope.orderArr[scope.orderNow].name + ' ' + scope.orderArr[scope.orderNow].value
                    else
                        scope.orderArr[i].value = 'asc';
                }
					//var orderStr=scope.orderArr[0].name+' '+scope.orderArr[0].value+',';
					//orderStr+=scope.orderArr[1].name+' '+scope.orderArr[1].value+',';
					//orderStr+=scope.orderArr[2].name+' '+scope.orderArr[2].value+'';
				var getUrl = 'dating_api/list?page='+this.pageIndex+'&size=20&order='+orderStr;
				console.log(this.where.sex!="性别")
				if(this.where.sex!="不限" && this.where.sex!="性别"){
					getUrl+='&sex='+(this.where.sex=="男"?1:2)
				}
				if(this.where.job!="不限" && this.where.job!="职业"){
					getUrl+='&job='+(this.where.job);
				}
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
                if (isagain) {
                    getUrl += '&isagain=true';
                }
				this.$http.get(getUrl).then(function(data){
					var dat = data.data;
					if(typeof dat == 'string'){
	                    dat=JSON.parse(data.data);
	                }
	                if(dat.data.length<=0){
		                	scope.no_more=true;
		                }else{
		                	scope.no_more=false;
		                }
					for(var i=0;i<dat.data.length;i++){
						// if(dat.count<=(dat.size*(dat.page-1)+i)){
						// 	break;
						// }
						this.news.push(dat.data[i])
					}
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
			sentLike:function(obj,isLike){
				if(isLike){
					isLike = 0;
				}else{
					isLike = 1;
				}
				var mId=obj.id;
				var sentUrl = '/dating_api/like?id='+mId+'&is_like='+isLike;
				this.$http.get(sentUrl).then(function(data){
					var dat = data.data;
					if(typeof dat=='string')
						dat=JSON.parse(dat)
					if(dat.success){
						obj.is_like=isLike;
						if(isLike){
							obj.mind_count++;
						}else{
							obj.mind_count--;
						}
						console.log(obj.is_like)
					}else{
						$(".alert_msg p").html(dat.message);
				        $(".alert_msg").show();
				        setTimeout('$(".alert_msg").hide()', 2000);
					}
				});
			}
		}
	});
	vapp.init();
	
