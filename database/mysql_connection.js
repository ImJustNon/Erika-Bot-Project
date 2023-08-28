const mysql = require("mysql2/promise");
const config = require("../config/config.js");

const pool = mysql.createPool(config.database.mysql());

const connect = () =>{
    pool.getConnection().then(connection => {
        console.log("[Database] MySQL: Connected");
        connection.release();
    }).catch(err => {
        console.error("[Database] MySQL: Connection error", err);
    });
}


const executeQuery = async (query, params) => {
    let connection;

    try {
        connection = await pool.getConnection();

        const [rows, fields] = await connection.execute(query, params);
        return {
            error: null,
            results: rows, 
            fields: fields,
        }
    } catch (err) {
        return {
            error: err,
            results: [],
            fields: [],
        }
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

exports.pool = pool;
exports.connect = connect;
exports.executeQuery = executeQuery;