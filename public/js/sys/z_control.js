function Z_Control(dom,type,value,vdom) {
    var obj = {
        type: type,
        id: '',
        value:value,
        dom: dom,
        vdom: vdom ? vdom:dom,
        initDate: function () {
            var scope = this;
            if (!this.value) {
                this.date = new Date();
                this.value = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate());
            } else {
                this.date = new Date(this.value);
            }
            var html = '<div id="zdate_' + this.id + '" style="transform:translateY(-100%);transition:transform 0.5s;position:fixed;background:rgba(0,0,0,0.7);width:100%;height:100%;top:0;left:0;z-index:9999;font-size:16px;">';
            html += '<div style="position:absolute;width:280px;height:auto;background:#FFF;border-radius:5px;z-index:9999;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);">';
            html += '<h5 style="width:100%;height:50px;line-height:50px;font-size:16px;text-align:center;border-bottom:1px solid #E3566F;font-weight:100;color:#E3566F;" id="zdate_value_' + this.id + '"><a style="float:left;margin-left:10px;" id="zdate_cancel_' + this.id + '">取消</a><label>' + this.value + '</label><a  style="float:right;margin-right:10px;" id="zdate_confirm_' + this.id +'">确定</a></h5>';
            html += '<div style="text-align:center;position:relative;">';
            html += '<ul style="float:left;width:100px;height:200px;list-style:none;margin:10px;overflow: auto;" id="zdate_year_'+this.id+'">';

            for (var i = 1900; i < (this.date.getFullYear() + 10); i++) {
                
                html += '<li style="height:30px;line-height:30px;'+(i==1900?'padding-top:90px;':'')+(i==(this.date.getFullYear()+9)?'padding-bottom:90px':'')+'">' + i + '</li>';
            }
            html += '</ul>';

            html += '<ul style="float:left;width:50px;height:200px;list-style:none;overflow:auto;margin: 10px;;" id="zdate_month_' + this.id + '">';

            for (var i = 1; i < 13; i++) {
                html += '<li style="height:30px;line-height:30px;' + (i == 1 ? 'padding-top:90px;' : '') + (i == 12? 'padding-bottom:90px' : '')+'">' + i + '</li>';
            }
            html += '</ul>';

            var days = 30;
            if (this.date.getMonth() == 11) {
                days = 31;
            } else {
                days = new Date(new Date(this.date.getFullYear + '-' + (this.date.getMonth() + 2) + '-' + 1) - 1).getDate();
            }

            html += '<ul style="float:left;width:50px;height:200px;list-style:none;overflow:auto;margin: 10px;;" id="zdate_day_' + this.id + '">';
            for (var i = 1; i < days + 1; i++) {
                html += '<li style="height:30px;line-height:30px;' + (i == 1 ? 'padding-top:90px;' : '') + (i == (days) ? 'padding-bottom:90px' : '') + '">' + i + '</li>';
            }
            html += '</ul>';

            html += '<i style="border-top:#E3566F solid 2px;border-bottom:#E3566F solid 2px;position:absolute;height:30px;width:100px;left:10px;top:100px;"></i>';
            html += '<i style="border-top:#E3566F solid 2px;border-bottom:#E3566F solid 2px;position:absolute;height:30px;width:50px;left:130px;top:100px;" ></i>'
            html += '<i style= "border-top:#E3566F solid 2px;border-bottom:#E3566F solid 2px;position:absolute;height:30px;width:50px;left:200px;top:100px;" ></i > ';
            html += '</div></div></div>';

            var z_dom = document.createElement('div');
            z_dom.id = 'dom_id';
            z_dom.innerHTML = html;
            document.querySelector('body').appendChild(z_dom);

            var yeardom = document.querySelector('#zdate_year_' + this.id)
            var monthdom = document.querySelector('#zdate_month_' + this.id)
            var daydom = document.querySelector('#zdate_day_' + this.id)
            var valdom = document.querySelector('#zdate_value_' + this.id+' label');

            document.querySelector(scope.dom).ontouchstart = function () {
                yeardom.scrollTop = (scope.date.getFullYear() - 1900) * 30;
                monthdom.scrollTop = (scope.date.getMonth()) * 30;
                daydom.scrollTop = (scope.date.getDate() - 1) * 30;
                document.querySelector('#zdate_' + scope.id).style.transform = 'translateY(0%)';
            }

            document.querySelector('#zdate_cancel_' + this.id).onclick = function () {
                document.querySelector('#zdate_' + scope.id).style.transform = 'translateY(-100%)';
            }

            document.querySelector('#zdate_confirm_' + this.id).onclick = function () {
                document.querySelector('#zdate_' + scope.id).style.transform = 'translateY(-100%)';
                scope.value = valdom.innerHTML;
                scope.date = new Date(scope.value);
                document.querySelector(scope.vdom).value = scope.value;
            }

            document.body.ontouchend = function () {
                setTimeout(function () {
                    yeardom.scrollTo = yeardom.scrollTop;
                    monthdom.scrollTo = monthdom.scrollTop;
                    daydom.scrollTo = daydom.scrollTop;

                    var y = Math.round(yeardom.scrollTop / 30);
                    var m = Math.round(monthdom.scrollTop / 30);
                    var d = Math.round(daydom.scrollTop / 30);
                    var y2 = yeardom.scrollTop - y * 30;
                    var m2 = monthdom.scrollTop - m * 30;
                    var d2 = daydom.scrollTop - d * 30;
                    yeardom.scrollTop = y * 30;

                    monthdom.scrollTop = m * 30;
                    daydom.scrollTop = d * 30;
                    var year = yeardom.scrollTop / 30 + 1900;
                    var month = monthdom.scrollTop / 30 + 1;
                    var day = daydom.scrollTop / 30 + 1;
                    valdom.innerHTML = year + '-' + ((month < 10) ? ('0' + month) : month) + '-' + ((day < 10) ? ('0' + day) : day);
                }, 300);

                //var index = 0;
                //var interval = setInterval(function () {
                //    index++;

                //    yeardom.scrollTop -= y2 / 10;
                //    monthdom.scrollTop -= m2 / 10;
                //    daydom.scrollTop -= d2 / 10;

                //    if (index == 10) {
                //        yeardom.scrollTop =y * 30;
                //        monthdom.scrollTop = m * 30;
                //        daydom.scrollTop = d * 30;
                //        var year = yeardom.scrollTop / 30 + 1900;
                //        var month = monthdom.scrollTop / 30 + 1;
                //        var day = daydom.scrollTop / 30 + 1;
                //        valdom.innerHTML = year + '-' + ((month < 10) ? ('0' + month) : month) + '-' + ((day<10)?('0'+day):day);
                //        clearInterval(interval)
                //    }
                //}, 50)
                    
            }

            document.querySelector('#zdate_year_' + this.id).onscroll = function () {

            }

            document.querySelector('#zdate_month_' + this.id).onscroll = function () {

            }

            document.querySelector('#zdate_day_' + this.id).onscroll = function () {

            }
        },
        initDateTime: function () {

        },
        init: function () {
            this.id = new Date() - 0;
            if (this.type == 'date') {
                this.initDate();
            }
        }
    }

    obj.init();

    return obj;
}