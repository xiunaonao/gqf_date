$(function(){
	var select_flag = false;
	$(".info_top").click(function(){
		if(!select_flag){
			$(this).parent().find(".select_div").show("solw");
			select_flag = true;
		}else{
			$(this).parent().find(".select_div").hide("solw");
			select_flag = false;
		}
	});
	
	$(".select_div p").click(function(){
		var pVal = $(this).attr("value");
		var pText = $(this).text();
		console.log("pVal:"+pVal+"--pText:"+pText);
		$(this).parent().hide("solw");
		$(this).parent().parent().find(".select_text").html(pText);
	});
})