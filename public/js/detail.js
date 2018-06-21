$(function(){
	var like_flag = false;
	
	if(like_flag){
		$(".like_btn").show();
		$(".unlike_btn").hide();
	}else{
		$(".like_btn").hide();
		$(".unlike_btn").show();
	}
	$(".unlike_btn").click(function(){
		$(this).hide();
		$(".like_btn").show();
	});
	$(".like_btn").click(function(){
		$(this).hide();
		$(".unlike_btn").show();
	})
})