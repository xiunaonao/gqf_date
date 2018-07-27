var vapp=new Vue({
	el:'#notice',
	data:{
		users:[],
		form:{
			title:'',
			msg:'',
			ids:'0',
			url:''
		},
		size:20,
		page:1,
    	user_type: 2,
		isshow:false,
		isall:true,
		cool:false,
		ky:''
	},
	methods:{
		show_user:function(show){
			var scope=this;
			if(this.isshow && !show){
				this.isshow=false;
				return;
			}
			this.isshow=true;
			this.get_user();
		},
		get_user:function(){
			var scope=this;
			axios.get('/admin_api/user_list?ky='+scope.ky+'&size='+scope.size+'&page='+scope.page+(scope.user_type!=2?('&user_type='+scope.user_type):'')).then(function(res){
				setTimeout(function(){
					scope.cool=false
				},1500)
				for(var i=0;i<res.data.data.length;i++){
					res.data.data[i].ischoose=scope.isall;
					scope.users.push(res.data.data[i]);
				}
			})
		},
		choose_all:function(){
			this.isall=!this.isall
			for(var i=0;i<this.users.length;i++){
				this.users[i].ischoose=this.isall;
			}
		},
		scroll_move:function(name,event){
			var t=event.target;
			if(t.scrollHeight<=(t.scrollTop+t.clientHeight+10)){
				if(!this.cool){
					this.page++;
					this.cool=true;
					this.get_user();
				}
			}
		},
		send_notice:function(){
			var scope=this;
			if(this.isall && !this.ky){
				this.form.ids='0';
			}else{
				this.form.ids='';

				for(var i=0;i<this.users.length;i++){
					if(this.users[i].ischoose){
						if(this.form.ids!='')
							this.form.ids+=',';
						this.form.ids+=this.users[i].id;
					}
				}
			}
			axios.post('/admin_api/wechat_send',scope.form).then(function(res){
				if(res.data.success){
					_alert('微信推送已经发送');
				}else{
					_alert(res.data.msg)
				}
			})
		}
	},
	mounted:function(){

	}
})