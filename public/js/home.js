function testAuth(){
	axios.get('/dating_api/new_user').then(function(res){
		if(res.data.success){
			location.href='#register';
		}else{
			location.href='#list';
		}
	})
}