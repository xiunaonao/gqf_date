var _ZLOADING=function(_obj){
    if(!_obj){
        _obj={
            dom:'_ZCAV'
        }
    }
    var obj= {
        dom:_obj.dom?_obj.dom:'_ZCAV',
        index:0,
        spr:[],
        cav:null,
        c:null,
        isRun:false,
        frames:0,
        mid:{
            x:187.5,
            y:400
        },
        init:function(){
            this.cav=document.createElement('canvas');
            this.cav.setAttribute('id',this.dom);
            this.cav.width=375;
            this.cav.height=800;
            this.cav.setAttribute('style','display:block;width:100%;position:fixed;z-index:999;background:rgba(255,255,255,1);top:50%;left:50%;-webkit-transform:translate(-50%,-50%);-webkit-transition:opacity 1s;');
            document.querySelector('body').appendChild(this.cav);
            this.c=this.cav.getContext('2d');
            this.isRun=true;
            this.unionLoad();
            requestAnimationFrame(this.draw.bind(this));
        },
        remove:function(){
            var scope=this;
            this.cav.style.opacity=0;
            setTimeout(function(){
                scope.cav.remove();
            },1000);
            
        },
        unionLoad:function(){
            var scope=this;
            this.spr.push({
                type:4,
                x:this.mid.x,
                y:this.mid.y,
                r:40,
                r2:35,
                sa:1,
                ea:1,
                bcolor:'#FF0000',
                lcolor:'#FF0000',
                timeIndex:0,
                timeAll:0,
                event:function(){

                    if(this.timeIndex<50){
                        this.ea+=0.02;
                    //}else if(this.timeIndex<100){

                    }else if(this.timeIndex<100){
                        this.sa+=0.02;
                        if(this.sa>this.ea)
                            this.sa=this.ea;
                    }else if(this.timeIndex==100){
                        this.sa=1;
                        this.ea=1;
                    }else{
                        // this.sa=1;
                        // this.ea=1;
                        this.timeIndex=0;
                    }
                }

                

            })
            this.spr.push({
                type:4,
                x:this.mid.x,
                y:this.mid.y,
                r:40,
                r2:35,
                sa:2,
                ea:2,
                bcolor:'#FF0000',
                lcolor:'#FF0000',
                timeIndex:0,
                timeAll:0,
                event:function(){

                    if(this.timeIndex<50){
                        this.ea+=0.02;
                    //}else if(this.timeIndex<100){

                    }else if(this.timeIndex<100){
                        this.sa+=0.02;
                        if(this.sa>this.ea)
                            this.sa=this.ea;
                    }else if(this.timeIndex==100){
                        this.sa=2;
                        this.ea=2;
                    }else{
                        // this.sa=1;
                        // this.ea=1;
                        this.timeIndex=0;
                    }
                }

                

            })

            this.spr.push({
                type:3,
                x:this.mid.x,
                y:this.mid.y,
                w:80,
                h:10,
                bcolor:'#FFF',
                lcolor:'#FFF',
                timeIndex:0,
                thisAll:0
            })

            this.spr.push({
                type:4,
                x:this.mid.x,
                y:this.mid.y,
                r:20,
                r2:15,
                sa:1,
                ea:1,
                bcolor:'#FF0000',
                lcolor:'#FF0000',
                timeIndex:0,
                timeAll:0,
                event:function(){

                    if(this.timeIndex<51){
                        this.ea+=0.04;
                    //}else if(this.timeIndex<100){

                    }else if(this.timeIndex<100){
                        this.sa+=0.04;
                        if(this.sa>this.ea)
                            this.sa=this.ea;
                    }else if(this.timeIndex==100){
                        this.sa=4;
                        this.ea=4;
                    }else{
                        // this.sa=1;
                        // this.ea=1;
                        this.timeIndex=0;
                    }
                }
            });

            this.spr.push({
                type:3,
                x:this.mid.x,
                y:this.mid.y,
                w:5,
                h:75,
                bcolor:'#FF0000',
                lcolor:'#FF0000',
                timeIndex:0,
                thisAll:0,
                event:function(){
                    // if(this.timeIndex<50){
                    //     //this.w+=0.1;
                    // }else if(this.timeIndex<100){
                    //     //this.w-=0.1;
                    // //}else if(this.timeIndex<150){
                        
                    // }else if(this.timeIndex==100){
                    //     //this.w=0;
                    // }else{
                    //     //this.timeIndex=0;
                    // }
                }
            });

            this.spr.push({
                type:2,
                x:this.mid.x,
                y:this.mid.y+65,
                size:15,
                lcolor:'rgb(255,255,255)',
                align:'center',
                text:'信息加载中',
                timeIndex:0,
                timeAll:0,
                event:function(){
                    if(this.timeIndex<50){
                        var c=255-this.timeIndex*2;
                        this.lcolor='rgb('+c+','+c+','+c+')';
                    }else if(this.timeIndex==50){
                        this.lcolor='rgb(155,155,155)';
                    }else if(this.timeIndex<100){
                        var c=this.timeIndex*2-45;
                        this.lcolor='rgb('+c+','+c+','+c+')';
                    }else if(this.timeIndex==100){
                        this.lcolor='rgb(255,255,255)';
                    }else{
                        this.timeIndex=0;
                    }
                }
            })
        },
        drawSpr:function(spr){
            //1:img,2:txt,3:rect,4:arc
            switch(spr.type){
                case 2:
                this.text(spr);
                    break;
                case 3:
                    this.rect(spr);
                    return;
                case 4:
                    this.arc(spr);
                    break;

            }
        },
        text:function(spr){
            this.c.font=spr.size+'px Arial';
            this.c.textAlign='center';
            if(spr.align)
                this.c.textAlign=spr.align;
            this.c.fillStyle=spr.lcolor;
            this.c.fillText(spr.text,spr.x,spr.y);
        },
        arc:function(spr){
            this.c.strokeStyle=spr.lcolor;
            this.c.fillStyle=spr.bcolor;
            if(spr.ea==spr.sa)
                return;
            this.c.arc(spr.x,spr.y,spr.r,spr.sa*Math.PI,spr.ea*Math.PI);
            this.c.arc(spr.x,spr.y,spr.r2,spr.ea*Math.PI,spr.sa*Math.PI,-1);
            this.c.arc(spr.x,spr.y,spr.r,spr.sa*Math.PI,spr.sa*Math.PI);
            this.c.stroke();
            this.c.fill();
            
        },
        rect:function(spr){
            this.c.strokeStyle=spr.lcolor;
            this.c.fillStyle=spr.bcolor;
            if(spr.w<=0 || spr.h<=0)
                return;
            this.c.strokeRect(spr.x-spr.w/2,spr.y-spr.h/2,spr.w,spr.h);
            if(spr.bcolor){
                this.c.fillRect(spr.x-spr.w/2,spr.y-spr.h/2,spr.w,spr.h);
            }
        },
        event:function(){
            /**/
        },
        draw:function(timespan){
            this.frames++;
            //console.log(this);
            if(this.frames%2==0)
                this.c.clearRect(0,0,1000,1000);
            for(var i=0;i<this.spr.length;i++){
                if(this.frames%2==0){
                    this.c.save();
                    this.c.beginPath();
                    this.drawSpr(this.spr[i]);
                    this.c.restore();
                }
                if(!this.spr[i].timeIndex)
                    this.spr[i].timeIndex=0;
                if(!this.spr[i].timeAll)
                    this.spr[i].timeAll=0;
                this.spr[i].timeIndex++;
                this.spr[i].timeAll++;
                if(this.spr[i].event)
                    this.spr[i].event();
            }
            if(this.isRun)
                //return;
                requestAnimationFrame(this.draw.bind(this));
        }
    }




    return obj;
}

window.z=new _ZLOADING();

if(location.href.indexOf('loading')>-1){
    window.z=new _ZLOADING();
}