var vapp=new Vue({
	el:'#message',
	data:{
		data:[]
	},
	methods:{
		lock_info:function(obj,v){
			var scope=this;
			var txt='公开操作中';
			if(obj.is_open){
				txt='保密操作中';
			}
			_alert(txt,null,-1);
			var postUrl='/admin_api/message_check';
			axios.post(postUrl,{status:v,id:obj.id}).then(function(res){
				if(res.data.success){
					_alert('操作成功');
					obj.review_status=v
				}else{
					_alert('操作失败');
				}
			})
		},
		message_list:function(){
			var scope=this;
			axios.get('/admin_api/message_list').then(function(res){
				scope.data=res.data.data;
			})
		}
	},
	mounted:function(){
		this.message_list();
	}
})