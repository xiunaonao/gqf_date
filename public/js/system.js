var vapp=new Vue({
	el:'#system',
	data:{

	},
	methods:{
		admin_login:function(){
			var scope=this;
			axios.post('/admin_api/admin_login').then(function(res){
				if(res.data.success){
					sessionStorage.admin=res.data.data;
					location.href="/admin/";
				}else{

				}
			})
		},
		volunteer_register:function(){
			var scope=this;
			axios.post('/admin_api/volunteer_register')
		}
	},
	mounted:function(){

	}
})