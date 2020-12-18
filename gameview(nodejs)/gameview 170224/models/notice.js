var mysql = require('mysql');
var async = require('async');
var dbPool = require('../common/dbpool').dbPool;
var dbPool_gameView = require('../common/dbpool').dbPool_gameView;
var aes_key = require('../config/key').aes_key;
var fs = require('fs');
var async = require('async');
var logger = require('../common/logger');


function findNotice(callback) {
    var sql = 'select name, content ' +
              'from notice ';
    var notice = {};
    var array = [];

    dbPool_gameView.getConnection(function (err, conn) {
        if (err)
            return callback(err);
        conn.query(sql, [], function (err, rows, fields) {
            conn.release();
            if (err)
                return callback(err);

            for(var i =0; i< rows.length; i++) {
                notice.name = rows[i].name;
                notice.content = rows[i].content;
                array.push(notice)
            }


                callback(null, notice);
        });
    });
}


module.exports.findNotice = findNotice;