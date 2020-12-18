var mysql = require('mysql');
var async = require('async');
var dbPool = require('../common/dbpool').dbPool;
var dbPool_gameView = require('../common/dbpool').dbPool_gameView;
var aes_key = require('../config/key').aes_key;
var fs = require('fs');
var async = require('async');
var logger = require('../common/logger');


function createPreviews(previews, callback) {
    var sql_insert_previews = 'insert into previews(rid, content) ' +
        'values(?, ?)';

    var sql_select_previews = 'select rid, pid, content ' +
        'from previews ' +
        'where pid = ?';


    dbPool_gameView.getConnection(function (err, conn) {
        if (err)
            return callback(err);

        function insertReviews(nextTaskCallback) {
            conn.query(sql_insert_previews, [previews.rid, previews.content], function (err, result) {
                if (err)
                    return nextTaskCallback(err);
                var pid = result.insertId;
                nextTaskCallback(null, pid);

            });
        }

        function selectReviews(pid, nextTaskCallback) {
            conn.query(sql_select_previews, [pid], function (err, rows, fields) {
                if (err)
                    return nextTaskCallback(err);
                var previews = {};
                previews.rid = rows[0].rid;
                previews.pid = rows[0].pid;
                previews.content = rows[0].content;
                nextTaskCallback(null, previews);
            });
        }


        conn.beginTransaction(function (err) {
            if (err) {
                conn.release();
                return callback(err);
            }

            async.waterfall([insertReviews, selectReviews], function (err, previews) {
                if (err) {
                    conn.rollback(function () {
                        conn.release();
                        callback(err);
                    });
                } else {
                    conn.commit(function (err) {
                        if (err) {
                            conn.rollback(function () {
                                conn.release();
                                callback(err);
                            });
                        }
                        conn.release();
                        callback(null, previews);

                    });
                }
            });
        });
    });
} //ok

function listPreviews(rid, pagenum, rowsnum, callback) {
    var sql_selectPage = ' select r.rid, p.pid, p.content ' +
    '                      from reviews r join previews p on(r.rid = p.rid)' +
    '                      where p.rid =? ' +
    '                      limit ?, ? ';
    var rowcnt = rowsnum;
    var offset = (pagenum - 1) * rowcnt;
    dbPool_gameView.getConnection(function (err, conn) {
        if (err)
            return callback(err);

        conn.query(sql_selectPage, [rid, offset, rowcnt], function (err, rows, fields) {
            conn.release();
            if (err)
                return callback(err);
            if (rows.length) {

                callback(null, rows);
            }
            else {
                err = new Error('not found');
                err.status = 404;
                callback(err);
            }
        });

    });
} //ok

function updatePreviews(previews, callback) {

    var sql_select_previews = 'select rid, pid,' +
        '       content ' +
        '       from previews ' +
        '       where pid = ? ';


    var sql_update_previews = 'update previews set' +
        '                     content = ? ' +
        '                     where pid = ? ';



    dbPool_gameView.getConnection(function (err, conn) {

        if (err)
            return callback(err);

        function selectPreviewsForUpdate(nextTaskCallback) {

            conn.query(sql_select_previews, [previews.pid], function (err, rows, fields) {
                if (err)
                    return nextTaskCallback(err);



                if (rows.length !== 1) {
                    err = new Error('댓글이 없습니다');
                    err.status = 404;
                    return nextTaskCallback(err);
                } else {
                    if (!previews.content) {
                        previews.content = rows[0].content;
                    }
                    nextTaskCallback(null, previews);
                }

            })

        }
        function updatePreviewsForUpdate(previews, nextTaskCallback) {


            conn.query(sql_update_previews, [previews.content, previews.pid],

                function (err) {
                    if (err)
                        return nextTaskCallback(err);

                    nextTaskCallback(null, previews);
                });


        }



        conn.beginTransaction(function (err) {
            if (err) {
                conn.release();
                return callback(err);
            }

            async.waterfall([selectPreviewsForUpdate, updatePreviewsForUpdate], function (err, previews) {

                if (err) {

                    conn.rollback(function () {
                        conn.release();
                        callback(err);
                    });
                } else {
                    conn.commit(function (err) {
                        if (err) {
                            conn.rollback(function () {
                                conn.release();
                                callback(err);
                            })
                        } else {
                            conn.release();
                            callback(null, previews);
                        }
                    });
                }
            });
        });
    });
} //ok

function quitPreviews(pid, callback) {


    var delete_sql_previews = 'delete from previews ' +
        'where pid = ?';

    dbPool_gameView.getConnection(function (err, conn) {
        if (err)
            callback(err);

            conn.query(delete_sql_previews, [pid], function (err, result) {
                conn.release();
                if (err)
                    callback(err);


                if (result.affectedRows === 1) {
                    callback(null, result);
                } else {
                    callback(null, null)
                }
            });

    });


}//ok


module.exports.createPreviews = createPreviews;
module.exports.listPreviews = listPreviews;
module.exports.updatePreviews = updatePreviews;
module.exports.quitPreviews = quitPreviews;