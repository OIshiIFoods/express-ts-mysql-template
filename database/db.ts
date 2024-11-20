const mysql = require('mysql')

// 创建mysql连接池
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: ''
});

/** 数据库查询函数 */
const dbQuery = async (sql, params) => {
    return await new Promise((resolve, reject) => {
        // 获取数据库连接 
        pool.getConnection((err, connection) => {
            // 获取连接时报错
            if (err) {
                reject(err)
            }
            // 执行查询语句
            connection.query(sql, params, (err, results) => {
                // 关闭连接
                connection.release();
                // 查询时报错
                if (err) {
                    reject(err)
                }
                resolve(results)
            });
        });
    })
}

export default dbQuery
