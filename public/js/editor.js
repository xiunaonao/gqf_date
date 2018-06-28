
	
	

/** 
* 从 file 域获取 本地图片 url 
*/ 
function getFileUrl(obj) { 
  var url; 
  url = window.URL.createObjectURL(obj.files.item(0)); 
  return url; 
}


var vapp = new Vue({
  el: '.editor_main',
  // 定义数据
  data:{
    imgNum:1,    //上传的照片数量，可根据实际情况自定义  
    imgUrl:[],
    chooseImg:'',
    flagNum:0 ,
    posting:false,
  },//定义事件
  methods:{
    //根据点击上传按钮触发input
    change_input:function(){
      var inputArr=$('#addTextForm input');
      var add_inputId='';     //需要被触发的input

      for(var i=0;i<inputArr.length;i++){
          // 根据input的value值判断是否已经选择文件
        if(!inputArr[i].value){          //如果没有选择,获得这个input的ID      
           add_inputId=inputArr[i].id;
           break;
        }
      }

      if(add_inputId){                   //如果需要被触发的input ID存在,将对应的input触发
       
        return  $("#"+add_inputId).click();
      }else{
        $(".alert_msg p").html("最多选择"+this.imgNum+"张图片");
        $(".alert_msg").show();
        setTimeout('$(".alert_msg").hide()', 2000);
      }
    },
    //当input选择了图片的时候触发,将获得的src赋值到相对应的img
    setImg:function(e){
      var target=e.target;
//    $('#img_'+target.id).attr('src',getFileUrl(e.srcElement));
	$(".e_img_inner").css("background-image","url("+getFileUrl(e.srcElement)+")");
      this.flagNum++;
      console.log("flagNum++:"+this.flagNum);
      if(this.flagNum<5){
        $('.e_img').find("#e_center").hide();
      }
    },
    //点击图片删除该图片并清除相对的input
    deleteImg:function(e){
//    var target=e.target;
//    var inputID='';       //需要清除value的input
//    if(target.nodeName=='IMG'){
//      target.src='';
//      inputID=target.id.replace('img_','');    //获得需要清除value的input
        $('#addTextForm input').val("");
        this.flagNum--;
        console.log("flagNum--:"+this.flagNum);
//    }
      $(".e_img_inner").css("background-image","url(http://127.0.0.1:2333/)");
    },
    sentStandard:function(sData){
    	$.ajax({
			url:"/dating_api/insert_or_update_standard",
			type:"post",
			dataTyoe: "json",
			data: sData,
			async: false,
			success:function(data){
				if(data.success){
					$(".alert_qr").show();
				}else{
					$(".alert_msg p").html(data.message+"<br/>网络错误。");
	                $(".alert_msg").show();
	                setTimeout('$(".alert_msg").hide()', 2000);
	                return;
				}
			}
		});
    },
    textSubmit:function(isSubmit){
    	if(this.posting){
      		return;
      	}
      	this.posting=true;
      	if(isSubmit){
	    	$(".alert_msg p").html("正在提交！");
		    $(".alert_msg").show();
		}

   		var scope=this;
   		var member_name = $("#member_name").val();
		var sex = $("#member_gender").attr("data-val");
		var day_of_birth = $("#member_birth").val();
		var card_number = $("#member_card").val();
		var domicile = $("#member_address").val();
		var work_unit = $("#member_company").val();
		var job = $("#member_woke").val();
		var education = $("#member_education").attr("data-val");
		var annual_income = $("#member_income").val();
		var college = $("#member_school").val();
		var health = $("#member_health").val();
		var height = $("#member_height").val();
		var weight = $("#member_weight").val();
		var nation = $("#member_nation").val();
		var housing = $("#member_house").html()!='请选择'?$("#member_house").html():'';
		var car_buying = $("#member_car").html()!='请选择'?$("#member_house").html():'';
		var hobby = $("#member_hobby").val();
		var special = $("#member_specialty").val();
		var mobile = $("#member_tel").val();

		var head_img = this.chooseImg;
			
		var postData = {member_name: member_name, sex: sex, day_of_birth: day_of_birth, card_number: card_number, domicile: domicile, work_unit: work_unit, job: job, education: education, annual_income: annual_income, college: college, health: health, height: height, weight: weight, nation: nation, housing: housing, car_buying: car_buying, hobby: hobby, special: special, mobile: mobile, head_img: head_img}
		
		var age01 = $("#filter_age01").val();
		var age02 = $("#filter_age02").val();
		var age_range = age01+"-"+age02;
		var height01 = $("#filter_height01").val();
		var height02 = $("#filter_height02").val();
		var height_range = height01+"-"+height02;
		var weight01 = $("#filter_weight01").val();
		var weight02 = $("#filter_weight02").val();
		var weight_range = weight01+"-"+weight02;
		var job = $("#filter_job").val();
		var income01 = $("#filter_income01").val();
		var income02 = $("#filter_income02").val();
		var income_range = income01+"-"+income02;
		var housing = $("#filter_house").html();
		var car_buying = $("#filter_car").html();
		var house_nature = $("#filter_address").html();
		
		var sentData = {age_range: age_range, height_range: height_range, weight_range: weight_range, job: job, income_range: income_range, housing: housing, car_buying: car_buying, house_nature: house_nature};
		
		console.log(postData);
          		
		$.ajax({
			url: "/dating_api/insert_or_update",
			type: "post",
			dataType: "json",
			data: postData,
			async: false,
			success:function(data){
				if(data.success){
					$(".alert_msg").hide();

					setTimeout(function(){
						clearTimeout(scope.submitLoading);
						scope.posting=false;
						scope.sentStandard(sentData);
					},500)
				}else{

					$(".alert_msg p").html(data.message);
	                $(".alert_msg").show();
	                setTimeout('$(".alert_msg").hide()', 2000);
	                return;
				}
			}
		});
  },
      allSubmit:function(){
      	var scope=this;
      	$(".alert_msg p").html("正在提交！");
	    $(".alert_msg").show();
	    this.submitLoading=setTimeout(function(){
	    	if(this.posting){
	    		this.posting=false;
	    		$(".alert_msg p").html('网络异常，请重试');
                $(".alert_msg").show();
                setTimeout('$(".alert_msg").hide()', 2000);
                return;
	    	}
	    },30000)
      	var scope=this;
        var uploadSrc = $('#addTextForm input').val();
        // srcArr = this.imgUrl.split(",");
        console.log("uploadSrc:"+uploadSrc);
		
/*
 lrz(this.files[0], {
            width: 300 //设置压缩参数
        }).then(function (rst) {
*/
		if(uploadSrc==""){
			scope.textSubmit();
		}else{


			lrz(addTextForm.querySelector('input').files[0], {
            width: 300 //设置压缩参数
	        }).then(function (rst) {
	            /* 处理成功后执行 */
	            rst.formData.append('base64img', rst.base64); // 添加额外参数
	            $.ajax({
	                url: "/api/upload",
	                type: "POST",
	                data: rst.formData,
	                processData: false,
	                contentType: false,
	                success: function (data) {
	                    //$("<img />").attr("src", data).appendTo("body");
	                    scope.chooseImg = data.url;
	                    if(data.success==1){
		                	scope.textSubmit(true);
		                  
		                  this.flagNum = 0;
		                  return;
		
		               }else{
		                  $(".alert_msg p").html(data.msg);
		                  $(".alert_msg").show();
		                  setTimeout('$(".alert_msg").hide()', 2000);
		                  return;
		               }
	                }
	            });
	        }).catch(function (err) {
	            /* 处理失败后执行 */
	        }).always(function () {
	            /* 必然执行 */
	        })
			
// 	        $("#addTextForm").ajaxSubmit({
// 	           url: "/api/upload",      
// 	           type: "post",
// 	           data: {
// 	                    'total_price':this.price,
// 	                    'descript':this.descript,
// 	                },
// 	           success:  function(data){
// 	           		console.log(this.price)
// 		           	scope.chooseImg = data.url;
// 			       	//console.log("this.imgUrl:"+this.imgUrl);
// //			       	var srcArr = this.imgUrl;
// 	                if(data.success==1){
// 	                	scope.textSubmit();
	                  
// 	                  this.flagNum = 0;
// 	                  return;
	
// 	               }else{
// 	                  $(".alert_msg p").html(data.msg);
// 	                  $(".alert_msg").show();
// 	                  setTimeout('$(".alert_msg").hide()', 2000);
// 	                  return;
// 	               }
// 	            }
// 	        });
		}


        
      }
   },
   
  //页面加载后执行
  mounted:function(){
    for(var i=0;i<this.imgNum;i++){
     //生成input框，默认为1
    var my_input = $('<input type="file" name="image" />');   //创建一个input
    my_input.attr('id',i);                           //为创建的input添加id
    $('#addTextForm').append(my_input);                     //将生成的input追加到指定的form
    //new Z_Control('#member_birth','date','','#member_birth');
    //生成img，默认为1
//  var my_img = $('<div id="uploadImg"><img src=""></div>');
//  my_img.find("img").attr('id', 'img_'+i);  
//  $('.e_img_inner').append(my_img); 
	
    }
  },
}) 


jQuery(function(){
	
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
		$(this).parent().parent().find(".select_text").html(pText);
		$(this).parent().parent().find(".select_text").attr("data-val",pVal);
	});
	
//	$("body").on("click",".head_img",function(){
//		$(this).hide();
//	});
	
	$("img").click(function(){
		event.stopPropagation();  
        event.preventDefault();
        console.log("yes");
	});
	
	
	function getBirth(birthday){
	    var sArr = birthday.split("T"); 
	    return sArr[0];
	}
	
	function getRange(range){
		var rArr = range.split("-");
		return rArr;
	}
	
	$.ajax({
		url:"/dating_api/detail",
		type:"get",
		success:function(data){
			if(data.data!=null){
				if(data.success){
					if(data.data.head_img){
						$("#e_center").hide();
//						$(".head_img").attr("src",data.data.head_img);
//						$(".head_img").show();
						$(".e_img_inner").css("background-image","url("+data.data.head_img+")");
						vapp.chooseImg=data.data.head_img
					}else{
						$(".head_img").hide();
					}
					$("#member_name").val(data.data.member_name);
					if(data.data.sex == 1){
						$("#member_gender").html("男");
						$("#member_gender").attr("data-val",1);
					}else if(data.data.sex == 2){
						$("#member_gender").html("女");
						$("#member_gender").attr("data-val",2);
					}
					$("#member_birth").val(getBirth(data.data.day_of_birth));
					$("#member_card").val(data.data.card_number);
					$("#member_address").val(data.data.domicile);
					$("#member_company").val(data.data.work_unit);
					$("#member_woke").val(data.data.job);
					if(data.data.education == 0){
						$("#member_education").html("其他");
						$("#member_education").attr("data-val",0);
					}else if(data.data.education == 1){
						$("#member_education").html("小学");
						$("#member_education").attr("data-val",1);
					}else if(data.data.education == 2){
						$("#member_education").html("初中");
						$("#member_education").attr("data-val",2);
					}else if(data.data.education == 3){
						$("#member_education").html("高中");
						$("#member_education").attr("data-val",3);
					}else if(data.data.education == 4){
						$("#member_education").html("中专");
						$("#member_education").attr("data-val",4);
					}else if(data.data.education == 5){
						$("#member_education").html("大学专科");
						$("#member_education").attr("data-val",5);
					}else if(data.data.education == 6){
						$("#member_education").html("大学本科");
						$("#member_education").attr("data-val",6);
					}else if(data.data.education == 7){
						$("#member_education").html("研究生");
						$("#member_education").attr("data-val",7);
					}
					$("#member_income").val(data.data.annual_income);
					$("#member_school").val(data.data.college);
					$("#member_health").val(data.data.health);
					$("#member_height").val(data.data.height);
					$("#member_weight").val(data.data.weight);
					$("#member_nation").val(data.data.nation);
					$("#member_house").html(data.data.housing);
					$("#member_car").html(data.data.car_buying);
					$("#member_hobby").val(data.data.hobby);
					$("#member_specialty").val(data.data.special);
					$("#member_tel").val(data.data.mobile);
					
				}else{
					$(".alert_msg p").html(data.message);
	                $(".alert_msg").show();
	                setTimeout('$(".alert_msg").hide()', 2000);
	                return;
				}
				
			}
		}
	});
	
	$.ajax({
		url:"/dating_api/standard_detail",
		type:"get",
		success:function(data){
			if(data.data!=null){
				if(data.success){
					var ageArr = getRange(data.data.age_range);
					$("#filter_age01").val(ageArr[0]);
					$("#filter_age02").val(ageArr[1]);
					console.log("ageArr[0]:"+ageArr[0]);
					var heightArr = getRange(data.data.height_range);
					$("#filter_height01").val(heightArr[0]);
					$("#filter_height02").val(heightArr[1]);
					var weightArr = getRange(data.data.weight_range);
					$("#filter_weight01").val(weightArr[0]);
					$("#filter_weight02").val(weightArr[1]);
					$("#filter_job").val(data.data.job);
					var incomeArr = getRange(data.data.income_range);
					$("#filter_income01").val(incomeArr[0]);
					$("#filter_income02").val(incomeArr[1]);
					$("#filter_house").html(data.data.housing);
					$("#filter_car").html(data.data.car_buying);
					$("#filter_address").html(data.data.house_nature);
				}else{
					$(".alert_msg p").html(data.message);
	                $(".alert_msg").show();
	                setTimeout('$(".alert_msg").hide()', 2000);
	                return;
				}
				
			}
		}
	});
	
//	function sentStandard(sData){
//		
//	}
//	
//	
//	$(".submit_btn").click(function(){
//
//	});
	
	
	
})