const path = require("path");
const better_sqlite3 = require('better-sqlite3')(path.join(__dirname, "./data/data.sqlite3"));
const config = require("../config/config.js");
const { query } = require("express");

const connect = () =>{
}

const sqliteExecute = {
    get: async (query, params) => {
        const row = await better_sqlite3.prepare(query).get(params);
        if(!row){
            return {
                results: [],
            }
        }
        if(!Array.isArray(row)){
            let rowArray = [];
            rowArray.push(row);
            return {
                results: rowArray,
            }
        }
        return {
            results: row,
        }
    },
    run: async (query, params) => {
        const row = await better_sqlite3.prepare(query).run(params);
        return row;
    },
    all: async (query) =>{
        const rows = await better_sqlite3.prepare(query).all();
        return {
            results: rows,
        }
    },
}


exports.connect = connect;
exports.sqliteExecute = sqliteExecute;