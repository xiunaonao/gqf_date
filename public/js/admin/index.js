var vapp=new Vue({
	el:'#index',
	data:{
		data:[],
		size:1000,
		page:1,
		keyword:'',
        user_type: undefined,
        isconfirm: false,
        confirmTxt: '',
        confirmFlag: '',
        deleteObj: {},
        cool:false,
        scroll:0
	},
	methods:{
		get_user:function(){
			var scope=this;
			axios.get('/admin_api/user_list?ky='+scope.keyword+'&size='+scope.size+'&page='+scope.page+(scope.user_type!=2?('&user_type='+scope.user_type):'')).then(function(res){
				setTimeout(function(){
					scope.cool=false
				},1500)
				if(scope.page==1){
					scope.data=[];
				}
				for(var i=0;i<res.data.data.length;i++){
					scope.data.push(res.data.data[i]);
				}
			})
		},
		lock_info:function(obj){
			var scope=this;
			var txt='公开操作中';
			if(obj.is_open){
				txt='保密操作中';
			}
			_alert(txt,null,-1);
			var postUrl='/dating_api/open_or_lock';
			axios.post(postUrl,{is_open:(!obj.is_open)?1:-1,id:obj.id}).then(function(res){
				if(res.data.success){
					_alert('操作成功');
					obj.is_open=!obj.is_open
				}else{
					_alert('操作失败');
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
        delete_user: function (obj) {
            this.confirmTxt = '确定要删除用户' + obj.member_name + '吗?';
            this.isconfirm = true;
            this.confirmFlag = 'delete'
            this.deleteObj = obj;
        },
        delete_now: function () {
            var scope = this;
            this.isconfirm = false;
            axios.post('/admin_api/delete_user', { id: scope.deleteObj.id }).then(function (res) {
                if (res.data.success) {
                    _alert('删除成功')
                    for (var i = 0; i < scope.data.length; i++) {
                        if (scope.data[i].id == scope.deleteObj.id) {
                            scope.data.splice(i, 1);
                            this.deleteObj = {};
                            break;
                        }
                    }
                }
                _alert(res.data.msg);
            })
        },
        scroll_move:function(name,event){
        	var scope=this;
			var t=event.target;
			if(t.scrollHeight<=(t.scrollTop+t.clientHeight+100)){

				if(!scope.cool){
					scope.page++;
					scope.cool=true;
					this.get_user();
				}
			}
		}
	},
	mounted:function(){
		var scope=this;
		if(user_type!=undefined){
			this.user_type=user_type;
		}
		this.get_user();

		document.onscroll=function(){
			scope.scroll_move('',{target:document.body})
		}
	}
})