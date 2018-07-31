var vapp=new Vue({
	el:'#banner',
	data:{
		is_alert:false,
		data:[],
		update_obj:{
			url:'',
			title:'',
			link_url:'',
			id:0,
			sort:0
		},
		isconfirm:false,
		confirmTxt:'',
		confirmFlag:'delete',
		deleteObj:null,
		target_files:null,
	},
	methods:{
		delete_user: function (obj) {
            this.confirmTxt = '确定要删除吗?';
            this.isconfirm = true;
            this.confirmFlag = 'delete'
            this.deleteObj = obj;
        },
        delete_now:function(obj){
        	
        },
		get_banner:function(){
			var scope=this;
			axios.get('/admin_api/banner_list').then(function(res){
				if(res.data.success){
					scope.data=res.data.data;
				}
			})
		},
		upload_choose:function(t){
			var scope=this;
			var target=t.target;
			this.target_files=t.target.files;
			var fr=new FileReader();
			fr.onload = function (e) {
                scope.update_obj.url = e.currentTarget.result;
            }
			fr.readAsDataURL(target.files[0]);
		},
		submit_banner:function(){
			var scope=this;
			if(!this.update_obj.sort){
				this.update_obj.sort=this.data.length+1;
			}
			axios.post('/admin_api/banner_insert_or_update',scope.update_obj).then(function(res){
				if(res.data.success){
					_alert('保存成功');
					scope.is_alert=false;
					scope.get_banner();
				}else{
					_alert('保存失败');
				}
			})
		},
		ready_delete:function(obj){
			this.delete_user(obj);
		},
		ready_edit:function(obj){
			this.update_obj={
				id:obj.id,
				url:obj.url,
				link_url:obj.link_url,
				sort:obj.sort
			}
			this.is_alert=true;
		},
		submit_banner_upload:function(){
			var scope=this;
			var form=new FormData();
			if(this.target_files){
				for(var i=0;i<this.target_files.length;i++){
					form.append('files'+i,this.target_files[i]);
				}
				axios.post('/api/upload',form).then(function(res){
					if(res.data.success){
						_alert('上传成功');
						scope.update_obj.url=res.data.url;
						scope.submit_banner();
					}else{
						_alert('上传失败');
					}
				})
			}else if(this.update_obj.url){
				scope.submit_banner();
			}else{
				_alert('请先上传图片');
			}

		// 	upload.onclick=()=>{
		// 	var form=new FormData()
		// 	for(var i=0;i<files.files.length;i++){
		// 		form.append('files'+i,files.files[i]);
		// 	}
		// 	var xhr=new XMLHttpRequest();
		// 	xhr.open('POST','http://127.0.0.1:2333/api/upload',true);
		// 	xhr.send(form);
		// 	xhr.onreadystatechange=function(){
		// 		console.log(xhr.responeText);
		// 	}
		// }
		}

	},
	mounted:function(){
		this.get_banner()
	},

})