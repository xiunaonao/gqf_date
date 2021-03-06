var routes=[
	{
		url:'home/{v}',
		dom:'home',
		script:'home.js'
	},
	{
		url:'detail/{id}',
		dom:'detail',
		script:'detail.js'
	},
	{
		url:'editor',
		dom:'editor',
		script:'editor.js'
	},
	{
		url:'list/{page}',
		dom:'list',
		script:'list.js'
	},
	{
		url:'filter',
		dom:'filter',
		script:'filter.js'
	},
	{
		url:'register',
		dom:'register',
		script:'register.js'
	},
	{
		url:'system',
		dom:'system',
		script:'system.js'
	},
	{
		url:'talk',
		dom:'talk',
		script:'talk.js'
	},
	{
		url:'readme',
		dom:'readme',
		script:'readme.js'
	},
	{
		url:'pop',
		dom:'pop',
		script:'pop.js'
	},
	{
		url:'history',
		dom:'history',
		script:'history.js'
	}
	
]

window.linkTo=function(url){
	var hash=location.hash;
	console.log(hash);
	for(var i=0;i<routes.length;i++){
		getData(routes[i]);
	}


	function getData(obj){
		var param=obj.url.toLowerCase().split('/');
		var hashs=hash.toLowerCase().split('/');
		if('#'+param[0]==hashs[0]){
			var paramObj={};
			for(var i=0;i<param.length;i++){
				if(i==0)
					continue;
				paramObj[param[i].replace('{','').replace('}','')]=hashs.length>(i)?hashs[i]:'';
			}
			window._param=(paramObj);



			var xhr= new XMLHttpRequest();
			xhr.open('GET',obj.dom+'.html',true);
			xhr.send(null);
			xhr.onreadystatechange=function(){

				if (xhr.readyState==4)
				{// 4 = "loaded"
				  if (xhr.status==200)
				    {// 200 = OK
				    	//console.log(xhr.responseText);
				    	//main.write(xhr.responseText);
				    	//var section=document.createElement('section');
				    	//section.innerHTML=xhr.responseText;
				    	main.innerHTML=(xhr.responseText);
				    	if(obj.extra){
				    		for(var i=0;i<obj.extra.length;i++){
				    			var script2=document.createElement('script');
				    			script2.src='/js/'+obj.extra[i]+'';
				    			main.appendChild(script2);
				    		}
				    	}
				    	var script=document.createElement('script')
				    	script.src='/js/'+obj.script+'?v='+window.ver;
				    	main.appendChild(script);
				    	document.body.scrollTop=0;
				    	//main.appendChild(section);
				    }
				}


			}
		}
	}
}


window.addEventListener("popstate",function(e){
	window.linkTo();
});