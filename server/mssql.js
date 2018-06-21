let Connection= require('tedious').Connection
let Request = require('tedious').Request
let node_uuid=require('node-uuid')
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
	query:(table,where,callback,orderName)=>{

		if(!where.size)
			where.size=20
		if(!where.page)
			where.page=1
		if(!where.filter)
			where.filter=''
		if(!where.order){
			if(!orderName)
				where.order='create_time'
			else
				where.order=orderName
		}
		if(!where.order_type)
			where.order_type='desc'
		where.order_type2=where.order_type=='desc'?'asc':'desc'
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
				select top ${where.size} _ID from (select top ${where.size*where.page} ${where.order},_ID=id from ${table} ${where.filter} order by ${where.order} ${where.order_type}) w 
				order by ${where.order} ${where.order_type2}
			) 
			order by ${where.order} ${where.order_type}

			
		`
		strNumber=`select count=count(id) from ${table} ${where.filter}`
		sqlServer.exec(strSql,(err,result,count)=>{
			sqlServer.exec(strNumber,(err,result2)=>{
				callback(err,result,result2[0].count)
			})
		})
	},
	update:(table,rows,where,callback)=>{

	},
	insert:(table,rows,callback)=>{

		function valid_null(key){
			if(!rows[key].value){
				if(!rows[key].type)
					rows[key].value=""
				if(rows[key].type=='num')
					rows[key].value=0
				if(rows[key].type=='date')
					rows[key].value="1970-01-01"
				if(rows[key].type=='id')
					rows[key].value="'"+node_uuid.v1()+"'"
				if(rows[key].type=='bool')
					rows[key].value=0
			}
			if(!rows[key].type || rows[key].type=='date')
				rows[key].value="'"+rows[key].value+"'"
			return rows[key].value
		}
		let rowkey=Object.keys(rows)
		let colName=rowkey.join(',')
		let rowValue=''
		for(let i=0;i<rowkey.length;i++){
			if(i!=0)
				rowValue+=","
			rowValue+=valid_null(rowkey[i])
		}

		strSql=`
			INSERT INTO ${table}(${rowkey}) VALUES
     		(
     			${rowValue}
     		)
		`
		sqlServer.exec(strSql,(err,result,count)=>{
			callback(err,result,count)
		})
	},
	delete:(table,where,callback)=>{

	}
}

// sqlServer.query('Test',{},(err,r,c)=>{
// 	console.log(r)
// })

module.exports=sqlServer