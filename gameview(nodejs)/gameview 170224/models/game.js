var mysql = require('mysql');
var async = require('async');
var dbPool = require('../common/dbpool').dbPool;
var dbPool_gameView = require('../common/dbpool').dbPool_gameView;
var aes_key = require('../config/key').aes_key;
var fs = require('fs');
var async = require('async');
var logger = require('../common/logger');

// function findGame(gid, callback) {
//     var sql = 'select gid, category, gname, icon, company, star, ' +
//         '                  down_count, payment, free ' +
//         '                  from game ' +
//         '                  where gid = ?' ;
//
//     var game = {};
//
//     dbPool_gameView.getConnection(function (err, conn) {
//         if (err)
//             return callback(err);
//         conn.query(sql, [gid], function (err, rows, fields) {
//             conn.release();
//             if (err)
//                 return callback(err);
//
//
//                 game.gid = rows[0].gid;
//                 game.category = rows[0].category;
//                 game.gname = rows[0].gname;
//                 game.icon = rows[0].icon;
//                 game.company = rows[0].company;
//                 game.star = rows[0].star;
//                 game.down_count = rows[0].down_count;
//                 game.payment = rows[0].payment;
//                 game.free = rows[0].free;
//
//
//
//
//             callback(null, game);
//
//
//         });
//     });
// }



function listGame(cid, pagenum, rowsnum, callback) {
    var sql_selectPage = 'select ' +
        '                 gname, ' +
        '                 icon, ' +
        '                 company ' +
        'from game ' +
        'where category = ?' +
        'limit ?, ?';
    var rowcnt = rowsnum;
    var offset = (pagenum - 1) * rowcnt;
    dbPool_gameView.getConnection(function (err, conn) {
        if (err)
            return callback(err);

        conn.query(sql_selectPage, [cid, offset, rowcnt], function (err, rows, fields) {
            conn.release();
            if (err)
                return callback(err);
            if (rows.length) {
                // 8. rows를 callback에 전달. (덕문)
                callback(null, rows);
            }
            else {
                err = new Error('not found');
                err.status = 404;
                callback(err);
            }
        });

    });
}



//module.exports.findGame = findGame;

module.exports.listGame = listGame;
