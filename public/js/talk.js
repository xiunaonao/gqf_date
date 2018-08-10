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
			axios.post('/dating_api/insert_or_update_message',{message:''})
		}
	},
	mounted:function(){
		this.get_message();
	}
})