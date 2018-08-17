var vapp=new Vue({
	el:'#message',
	data:{
		data:[],
		reply_id:0,
		reply_txt:'',
		reply_add:{

		}
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
		},
		delete_info:function(obj){
			if(!confirm('确定要删除这条留言吗?'))
				return;
			var scope=this;
			axios.post('/admin_api/message_delete',{id:obj.id}).then(function(res){
				if(res.data.success){
					//obj.is_del=true;
					Vue.set(obj,'is_del',true)
					_alert('操作成功');
				}else{
					_alert('操作失败');
				}
			})
		},
		reply_info:function(obj){
			this.reply_id=obj.id;
			this.reply_txt=(this.reply_add[obj.id]?this.reply_add[obj.id]:obj.reply);
		},
		reply_now:function(){
			var scope=this;
			axios.post('/admin_api/message_reply',{id:scope.reply_id,reply:scope.reply_txt}).then(function(res){
				if(res.data.success){
					//obj.is_del=true;
					scope.reply_add[scope.reply_id]=scope.reply_txt
					scope.reply_id=0
					scope.reply_txt=''
					_alert('回复成功');
				}else{
					_alert('操作失败');
				}
			})
		}
	},
	mounted:function(){
		this.message_list();
	}
})