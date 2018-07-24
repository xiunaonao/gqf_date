var vapp=new Vue({
	el:'#system',
	data:{

	},
	methods:{
		admin_login:function(){
			var scope=this;
			axios.post('/admin_api/admin_login').then(function(res){
				if(res.data.success){
					sessionStorage.admin=JSON.stringify(res.data.data);
					location.href="/admin/";
				}else{
					_alert(res.data.msg);
				}
			})
		},
		volunteer_register:function(){
			var scope=this;
			axios.post('/admin_api/volunteer_register').then(function(res){
				_alert(res.data.msg);
				
			})
		}
	},
	mounted:function(){

	}
})