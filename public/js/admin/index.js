var vapp=new Vue({
	el:'#index',
	data:{
		data:[],
		size:1000,
		page:1,
        user_type: undefined,
        isconfirm: false,
        confirmTxt: '',
        confirmFlag: '',
        deleteObj: {}
	},
	methods:{
		get_user:function(){
			var scope=this;
			axios.get('/admin_api/user_list?size='+scope.size+'&page='+scope.page+(scope.user_type!=2?('&user_type='+scope.user_type):'')).then(function(res){
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
        }
	},
	mounted:function(){
		if(user_type!=undefined){
			this.user_type=user_type;
		}
		this.get_user();
	}
})