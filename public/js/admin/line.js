var vapp=new Vue({
	el:'#app',
	data:{
		sex_c:1,
		job1:'请选择',
		job2:'请选择',
		job:['请选择','公务员','教师','医护人员','军人/警察','律师','企业高管','企业职工','其他'],
		data:[]
	},
	methods:{
		get_users:function(){
			var scope=this;
			var str='?sex='+this.sex_c;
			if(this.job1!='请选择')
				str+='&job='+this.job1;
			if(this.job2!='请选择')
				str+='&job2='+this.job2;
			_alert('正在处理数据中，请稍等...',null,-1);
			axios.get('/admin_api/user_line'+str).then(function(res){
				_alert('处理完成',null,200)
				scope.data=res.data.data;
			})
		},
		jump:function(url){
			location.href=url

		}
	},
	mounted:function(){

	}
})