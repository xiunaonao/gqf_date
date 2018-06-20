var Z_VALID=function(_obj){
	var obj={
		id_city:{
			11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",
			31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",
			43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",
			61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "
		},
  
		idcard:function(code){
			var tip="";
			var pass=true;
			var idInfo={};
			//if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
                //tip = "身份证号格式错误";
                //pass = false;
            if(!code){
                tip="身份证位数不正确";
                pass=false;
            }
            if(!this.id_city[code[0]+""+code[1]]){
            	tip="区域信息错误";
            	pass=false;
            }else{
            	idInfo.sf=this.id_city[code[0]+""+code[1]];

            	if(code.length == 18){
                    code = code.split('');
                    //∑(ai×Wi)(mod 11)
                    //加权因子
                    var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                    //校验位
                    var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                    var sum = 0;
                    var ai = 0;
                    var wi = 0;
                    for (var i = 0; i < 17; i++)
                    {
                        ai = code[i];
                        wi = factor[i];
                        sum += ai * wi;
                    }
                    var last = parity[sum % 11];
                    if(parity[sum % 11] != code[17]){
                        tip = "校验位错误";
                        pass =false;
                    }else{
                    	var code=code.join('');
                    	idInfo.year=code.substring(6,10);
                    	idInfo.month=code.substring(10,12);
                    	idInfo.day=code.substring(12,14);
                    	idInfo.sex=(parseInt(code.substring[16])%2==0)?'女':'男'
                    }
                }

            }

            return {
            	success:pass,
            	msg:tip,
            	info:idInfo
            }

		}
	}


	return obj;
}