let Connection= require('tedious').Connection
let Request = require('tedious').Request
let connectionCfg = {
    server: '192.168.5.173',  
    userName: 'hm',
    password: '208hongmai',
	options: { database: 'HmUnionBusiness' }  
}

let sqlServer={
	connect:(callback)=>{
		let conn=new Connection(connectionCfg)
		conn.on('connect', (err)=>{
			if(err){
				console.log('连接失败')
				console.log(err)
				return
			}else
		 		callback(conn)
		})
	},
	exec:(sqlStr,callback)=>{
		sqlServer.connect((conn)=>{
			console.log('连接数据库成功，开始查询sql语句:'+sqlStr)
			let _rowCount=0
			let request = new Request(sqlStr,(err, rowCount)=>{
		      if (err) {
		        console.error(err)
		        callback(err,[]) //创建 request 实例失败
		      }else{
		      	console.log(rowCount)
		      	_rowCount=rowCount
		      }
		    })
		    var _result = [];  
		    request.on('row', (columns,idx)=>{
		    	//console.log(columns)
				var obj = {}  
				columns.forEach((column)=>{
					if(column.value !== null){
						var key = column.metadata.colName
						var val = column.value
						obj[key] = val
					}
				});
		    	_result.push(obj)
		    })

		    request.on('requestCompleted',()=>{
		    	callback(null,_result,_rowCount)
		    })
		    conn.execSql(request)
		})
	},
	query:(table,where,callback)=>{

		if(!where.size)
			where.size=20
		if(!where.page)
			where.page=1
		if(!where.filter)
			where.filter=''
		if(!where.order)
			where.order='id'
		if(!where.orderType)
			where.orderType='desc'
		where.orderType2=where.orderType=='desc'?'asc':'desc'
		if(where.filter)
			where.filter=' where '+where.filter

		let strSql=''

		// let topSql=`select top ${where.size*(where.page-1)} ${where.order} from ${table} ${where.filter}  order by ${where.order} ${where.orderType} `
		// strSql=`
		// 	select top ${where.size} * from ${table} where ${where.order}${where.orderType=='aes'?'>=':'<=1'}(select max(${where.order}) from (${topSql}) t)
		// 	 order by ${where.order} ${where.orderType}
		// `

		strSql=`
			select * from ${table} where id in
			(
				select top ${where.size} _ID from (select top ${where.size*where.page} ${where.order},_ID=id from ${table} ${where.filter} order by ${where.order} ${where.orderType}) w 
				order by ${where.order} ${where.orderType2}
			) 
			order by ${where.order} ${where.orderType}
		`

		console.log(strSql)
		sqlServer.exec(strSql,(err,result,count)=>{
			callback(err,result,count)
		})
	},
	update:()=>{

	}
}

sqlServer.query('Test',{},(err,r,c)=>{
	console.log(r)
})

module.exports=sqlServer