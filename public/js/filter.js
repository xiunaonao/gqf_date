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
//		console.log("pVal:"+pVal+"--pText:"+pText);
		$(this).parent().hide("solw");
		select_flag = false;
		$(this).parent().parent().find(".select_text").attr("data-val",pVal);
		$(this).parent().parent().find(".select_text").html(pText);
	});
	
	
	$("body").on("click",".filter_ok",function(){
		var age = $("#f_age").attr("data-val");
		var height = $("#f_height").attr("data-val");
		var education = $("#f_education").attr("data-val");
		var annual_income = $("#f_income").attr("data-val");
		var housing = $("#f_house").html();
		var car_buying = $("#f_car").attr("data-val");
		
		var listPost = {age: age, height: height, education: education, annual_income: annual_income, housing: housing, car_buying: car_buying};
		
		listPost = JSON.stringify(listPost);
		sessionStorage.setItem("listPost",listPost);
		console.log('- - -')
		window.location.href = "#list";
	});
})