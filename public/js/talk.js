var vapp=new Vue({
	el:'#talk',
	data:{
		data:[],
		message:''
	},
	methods:{
		get_message:function(){
			var scope=this;
			axios.get('/dating_api/message_list').then(function(res){
				scope.data=res.data.data;
			})
		},
		add_message:function(){
			var scope=this;
			if(!this.message){
				_alert('请输入内容')
				return;
			}
			axios.post('/dating_api/insert_or_update_message',{message:scope.message}).then(function(res){
				if(res.data.success){
					_alert('留言已发布，待管理员审核')
				}else{
					_alert('发布失败')
				}
			})
		}
	},
	mounted:function(){
		this.get_message();
	}
})