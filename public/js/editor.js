
//window._OCC1=['100,销售','200,客户服务','300,计算机/互联网','400,通信/电子','500,生产/制造','600,物流/仓储','700,商贸/采购','800,人事/行政','900,高级管理','1000,广告/市场','1100,传媒/艺术','1200,生物/制药','1300,医疗/护理','1400,金融/银行/保险','1500,建筑/房地产','1600,咨询/顾问','1700,法律','1800,财会/审计','1900,教育/科研','2000,服务业','2100,交通运输','2200,政府机构','2300,军人/警察','2400,农林牧渔','2500,自由职业','2600,在校学生','2700,待业','2800,其他行业'];
//window._OCC2=['101,销售总监','102,销售经理','103,销售主管','104,销售专员','105,渠道/分销管理','106,渠道/分销专员','107,经销商','108,客户经理','109,客户代表','110,其他','201,客服经理','202,客服主管','203,客服专员','204,客服协调','205,客服技术支持','206,其他','301,IT技术总监','302,IT技术经理','303,IT工程师','304,系统管理员','305,测试专员','306,运营管理','307,网页设计','308,网站编辑','309,网站产品经理','310,其他','401,通信技术','402,电子技术','403,其他','501,工厂经理','502,工程师','503,项目主管','504,营运经理','505,营运主管','506,车间主任','507,物料管理','508,生产领班','509,操作工人','510,安全管理','511,其他','601,物流经理','602,物流主管','603,物流专员','604,仓库经理','605,仓库管理员','606,货运代理','607,集装箱业务','608,海关事物管理','609,报单员','610,快递员','611,其他','701,商务经理','702,商务专员','703,采购经理','704,采购专员','705,外贸经理','706,外贸专员','707,业务跟单','708,报关员','709,其他','801,人事总监','802,人事经理','803,人事主管','804,人事专员','805,招聘经理','806,招聘专员','807,培训经理','808,培训专员','809,秘书','810,文员','811,后勤','812,其他','901,总经理','902,副总经理','903,合伙人','904,总监','905,经理','906,总裁助理','907,其他','1001,广告客户经理','1002,广告客户专员','1003,广告设计经理','1004,广告设计专员','1005,广告策划','1006,市场营销经理','1007,市场营销专员','1008,市场策划','1009,市场调研与分析','1010,市场拓展','1011,公关经理','1012,公关专员','1013,媒介经理','1014,媒介专员','1015,品牌经理','1016,品牌专员','1017,其他','1101,主编','1102,编辑','1103,作家','1104,撰稿人','1105,文案策划','1106,出版发行','1107,导演','1108,记者','1109,主持人','1110,演员','1111,模特','1112,经纪人','1113,摄影师','1114,影视后期制作','1115,设计师','1116,画家','1117,音乐家','1118,舞蹈','1119,其他','1201,生物工程','1202,药品生产','1203,临床研究','1204,医疗器械','1205,医药代表','1206,化工工程师','1207,其他','1301,医疗管理','1302,医生','1303,心理医生','1304,药剂师','1305,护士','1306,兽医','1307,其他','1401,投资','1402,保险','1403,金融','1404,银行','1405,证券','1406,其他','1501,建筑师','1502,工程师','1503,规划师','1504,景观设计','1505,房地产策划','1506,房地产交易','1507,物业管理','1508,其他','1601,专业顾问','1602,咨询经理','1603,咨询师','1604,培训师','1605,其他','1701,律师','1702,律师助理','1703,法务经理','1704,法务专员','1705,知识产权专员','1706,其他','1801,财务总监','1802,财务经理','1803,财务主管','1804,会计','1805,注册会计师','1806,审计师','1807,税务经理','1808,税务专员','1809,成本经理','1810,其他','1901,教授','1902,讲师/助教','1903,中学教师','1904,小学教师','1905,幼师','1906,教务管理人员','1907,职业技术教师','1908,培训师','1909,科研管理人员','1910,科研人员','1911,其他','2001,餐饮管理','2002,厨师','2003,餐厅服务员','2004,酒店管理','2005,大堂经理','2006,酒店服务员','2007,导游','2008,美容师','2009,健身教练','2010,商场经理','2011,零售店店长','2012,店员','2013,保安经理','2014,保安人员','2015,家政服务','2016,其他','2101,飞行员','2102,空乘人员','2103,地勤人员','2104,列车司机','2105,乘务员','2106,船长','2107,船员','2108,司机','2109,其他','2201,公务员','2202,其他'];

	

/** 
* 从 file 域获取 本地图片 url 
*/ 
function getFileUrl(obj) { 
  var url; 
  url = window.URL.createObjectURL(obj.files.item(0)); 
  return url; 
}


var vapp = new Vue({
  el: '#editor',
  // 定义数据
  data:{
    imgNum:1,    //上传的照片数量，可根据实际情况自定义  
    imgUrl:[],
    //job:{0:{value:'请选择',category:{'0':'请选择'}}},
    industry:['请选择','党政机关','事业单位','国有企业','非公企业','自由职业者','军人/公检法','其他'],
    industryc:'请选择',
    industryelse:'',
    job:['请选择','公务员','教师','医护人员','军人/警察','律师','企业高管','企业职工','其他'],
    jobc:'请选择',
    jobc2:'',
    jobelse:'',
    companyCategory:['请选择','政府机关','事业单位','外资企业','合资企业','国营企业','私营企业','自由公司','其他'],
    income:['请选择','5万以下','5~8万','8~10万','10~15万','15~20万','20~50万','50万以上'],
    marry_status:['请选择','未婚','离异无子','丧偶无子','离异有子','丧偶有子'],
    marry_status_c:'请选择',
    companyCategoryIndex:0,
    incomeIndex:0,
    jobIndex:0,
    code:'',
    code_cool:0,
    jobIndex2:0,
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
    postCode:function(){
    	var scope=this;
    	if(!member_tel.value){
    		$(".alert_msg p").html("请先输入手机号码");
		    $(".alert_msg").show();
		    setTimeout('$(".alert_msg").hide()', 2000);
    		return;
    	}
    	if(this.code_cool!=0){
    		return;
    	}

    	this.code_cool=30;


    	var code_cool_interval=setInterval(function(){
    		if(scope.code_cool>0)
    			scope.code_cool--;
    		else
    			clearInterval(code_cool_interval);
    	},1000);

    	axios.post('/api/sms_post',{mobile:member_tel.value}).then(function(res){
    		var data=res.data;
    		if(data.success){
    			$(".alert_msg p").html("验证码已发送");
			    $(".alert_msg").show();
			    setTimeout('$(".alert_msg").hide()', 2000);
    		}else{
    			$(".alert_msg p").html(data.msg);
			    $(".alert_msg").show();
			    setTimeout('$(".alert_msg").hide()', 2000);
    		}
    	})

    },
    mul_check:function(obj){
    	if(this.jobc2.indexOf(','+obj)!=-1){
    		this.jobc2=this.jobc2.replace(','+obj,'');
    	}else{
    		this.jobc2+=','+obj;
    	}
    	console.log(obj)
    },
    vaildCode:function(isSubmit){
    	var scope=this;
    	axios.post('/api/sms_valid',{mobile:member_tel.value,code:scope.code}).then(function(res){
    		var data=res.data;
    		if(data.success){
    			scope.textSubmit(isSubmit);
    		}else{
    			$(".alert_msg p").html(data.msg);
			    $(".alert_msg").show();
			    setTimeout('$(".alert_msg").hide()', 2000);
    		}
    	})
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

      	var valid_idcard=Z_VALID().idcard($("#member_card").val());
      	console.log(valid_idcard)
      	if(!valid_idcard.success){
	    	$(".alert_msg p").html("身份证格式不正确");
		    $(".alert_msg").show();
		    setTimeout('$(".alert_msg").hide()', 2000);
      		this.posting=false;
      		return;
      	}

      	if(!$("#member_name").val()){
	    	$(".alert_msg p").html("请输入姓名");
		    $(".alert_msg").show();
		    setTimeout('$(".alert_msg").hide()', 2000);
      		this.posting=false;
      		return;
      	}

      	if(!$("#member_tel").val()){
	    	$(".alert_msg p").html("请输入手机号码");
		    $(".alert_msg").show();
		    setTimeout('$(".alert_msg").hide()', 2000);
      		this.posting=false;
      		return;
      	}

      // 	if( this.industryc=='请选择' || (this.industryc=='其他' && this.industryelse=='')){
	    	// $(".alert_msg p").html("请选择职业");
		    // $(".alert_msg").show();
		    // setTimeout('$(".alert_msg").hide()', 2000);
      // 		this.posting=false;
      // 		return;
      // 	}

      	if(!$("#member_job2").text() || $("#member_job2").text()=='请选择' || (this.jobc=='其他' && this.jobelse=='')){
	    	$(".alert_msg p").html("请选择职业");
		    $(".alert_msg").show();
		    setTimeout('$(".alert_msg").hide()', 2000);
      		this.posting=false;
      		return;
      	}

      	if(isSubmit){
	    	$(".alert_msg p").html("正在提交！");
		    $(".alert_msg").show();
		}

   		var scope=this;
   		var member_name = $("#member_name").val();
		//var sex = $("#member_gender").attr("data-val");
		//var day_of_birth = $("#member_birth").val();
		var sex=(valid_idcard.info.sex=='男'?'1':'');
		sex+=(valid_idcard.info.sex=='女'?'2':'');
		console.log(valid_idcard);
		var day_of_birth=valid_idcard.info.year+'-'+valid_idcard.info.month+'-'+valid_idcard.info.day;
		var card_number = $("#member_card").val();
		var domicile = $("#member_address").val();
		var work_unit = $("#member_company").val();
		var job = $("#member_job2").text();
		if(job=='其他'){
			job=this.jobelse;
		}
		var education = $("#member_education").attr("data-val");
		//var annual_income = $("#member_income").val();
		var income_type = vapp.incomeIndex;
		var unit_property = vapp.companyCategoryIndex;
		var industry=$('#member_job').text();
		// if(industry=='其他'){
		// 	industry=this.industryelse;
		// }
		var college = $("#member_school").val();
		var health = $("#member_health").val();
		var height = $("#member_height").val();
		var weight = $("#member_weight").val();
		var nation = $("#member_nation").val();
		var housing = $("#member_house").html()!='请选择'?$("#member_house").html():'';
		var car_buying = $("#member_car").html()!='请选择'?$("#member_car").html():'';
		var hobby = $("#member_hobby").val();
		var special = $("#member_specialty").val();
		var mobile = $("#member_tel").val();

		var head_img = this.chooseImg;
			
		var postData = {member_name: member_name, sex: sex, day_of_birth: day_of_birth, card_number: card_number, domicile: domicile, work_unit: work_unit, job: job, education: education, college: college, health: health, height: height, weight: weight, nation: nation, housing: housing, car_buying: car_buying, hobby: hobby, special: special, mobile: mobile, head_img: head_img
			,income_type:income_type,unit_property:unit_property,industry:industry
		}
		
		var age01 = $("#filter_age01").val();
		var age02 = $("#filter_age02").val();
		var age_range = age01+"-"+age02;
		var height01 = $("#filter_height01").val();
		var height02 = $("#filter_height02").val();
		var height_range = height01+"-"+height02;
		var weight01 = $("#filter_weight01").val();
		var weight02 = $("#filter_weight02").val();
		var weight_range = weight01+"-"+weight02;
		//var job = $("#filter_job").val();
		var job=((this.jobc2=='不限' || this.jobc2=='请选择')?'':this.jobc2);
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
			//scope.textSubmit();
			scope.vaildCode();
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
	                    	scope.vaildCode(true);
		                	//scope.textSubmit(true);
		                  
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
  	var job_ind=0;
  	// for(var i=0;i<window._OCC1.length;i++){
  	// 	var key=window._OCC1[i];
  	// 	Vue.set(this.job,key.split(',')[0],{value:key.split(',')[1]});
  	// 	var ind=parseInt(key.split(',')[0]);
  	// 	var jobList={};

  	// 	for(var j=job_ind;j<window._OCC2.length;j++){
  	// 		var key2=window._OCC2[j];
  	// 		var ind2=parseInt(key2.split(',')[0]);
  	// 		if(ind2>ind && ind2-ind<100){
  	// 			jobList[key2.split(',')[0]]=key2.split(',')[1];

  	// 			//Vue.set(this.job[key],)
  	// 		}else{
  	// 			job_ind=j;
  	// 			Vue.set(this.job[ind],'category',jobList);
  	// 			break;
  	// 		}

  	// 	}
  	// }
  	

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
	$('body').on('click',".info_top",function(){
		console.log(select_flag)
		if(!select_flag){
			$(this).parent().find(".select_div").show("solw");
			select_flag = true;
		}else{
			$(this).parent().find(".select_div").hide("solw");
			select_flag = false;
		}
	});


	
	$("body").on('click','.select_div p',function(){
		console.log($(this).parent().attr('mul_check'))
		if($(this).parent().attr('mul_check')){
			return;
		}
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
                    $("#member_height").val(data.data.height == 0 ? "" : data.data.height);
                    $("#member_weight").val(data.data.weight == 0 ? "" : data.data.weight);
					$("#member_nation").val(data.data.nation);
					$("#member_house").html(data.data.housing);
					$("#member_car").html(data.data.car_buying);
					$("#member_hobby").val(data.data.hobby);
					$("#member_specialty").val(data.data.special);
					$("#member_tel").val(data.data.mobile);
					
					vapp.incomeIndex=data.data.income_type;
					vapp.companyCategoryIndex=data.data.unit_property;
					vapp.jobc=data.data.job;
					if(vapp.job.indexOf(vapp.jobc)<=-1){
						vapp.jobelse=vapp.jobc;
						vapp.jobc='其他'
					}
					vapp.industryc=data.data.industry;
					// if(vapp.industry.indexOf(vapp.industryc)<=-1){
					// 	vapp.industryelse=vapp.industryc;
					// 	vapp.industryc='其他'
					// }


					// for(var i=0;i<Object.keys(vapp.job).length;i++){
					// 	var key=Object.keys(vapp.job)[i];
					// 	if(vapp.job[key].value==data.data.industry){
					// 		vapp.jobIndex=key;
					// 		for(var j=0;j<Object.keys(vapp.job[key].category).length;j++){
					// 			key2=Object.keys(vapp.job[key].category)[j];
					// 			if(vapp.job[key].category[key2]==data.data.job){
					// 				vapp.jobIndex2=key2;
					// 				break;
					// 			}
					// 		}
					// 		break;
					// 	}
					// }

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
					//$("#filter_job").val(data.data.job);
					var incomeArr = getRange(data.data.income_range);
					$("#filter_income01").val(incomeArr[0]);
					$("#filter_income02").val(incomeArr[1]);
					$("#filter_house").html(data.data.housing);
					$("#filter_car").html(data.data.car_buying);
					$("#filter_address").html(data.data.house_nature);
					vapp.jobc2=data.data.job;
					for(var i=0;i<document.querySelectorAll('.mul_job p').length;i++){
						var dom=document.querySelectorAll('.mul_job p')[i];
						if(vapp.jobc2.indexOf(','+dom.innerText)>-1)
							dom.querySelector('.checkbox').checked=true
					}
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