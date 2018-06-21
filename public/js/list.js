$(function(){
	var like_flag = false;
	
	$(".like_icon").click(function(){
		like_flag = $(this).attr("data-like");
		if(like_flag=="true"){
			$(this).attr("src","/img/unlike.png");
			$(this).attr("data-like","false");
		}else{
			$(this).attr("src","/img/like.png");
			$(this).attr("data-like","true");
		}
	});
})