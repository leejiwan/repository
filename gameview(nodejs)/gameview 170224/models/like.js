var mysql = require('mysql');
var async = require('async');
var dbPool = require('../common/dbpool').dbPool;
var dbPool_gameView = require('../common/dbpool').dbPool_gameView;
var aes_key = require('../config/key').aes_key;
var fs = require('fs');
var async = require('async');
var logger = require('../common/logger');


function updateStar(reviews, callback) {

    var sql_select_reviews = 'select rid, like_num, reviewname ' +
        '       from reviews ' +
        '       where rid = ? ';


    var sql_update_reviews = 'update reviews ' +
        '                     set like_num = ? ' +
        '                     where rid = ? ';

    var temp;

    dbPool_gameView.getConnection(function (err, conn) {

        if (err)
            return callback(err);

        function selectStar(nextTaskCallback) {
            conn.query(sql_select_reviews, [reviews.rid], function (err, rows, fields) {

                if (err)
                    return nextTaskCallback(err);

                if (rows.length !== 1) {
                    err = new Error('리뷰가 없습니다');
                    err.status = 404;
                    return nextTaskCallback(err);
                } else {


                    if(reviews.like) {
                        temp = rows[0].like_num + 1;

                    }
                    if (!reviews.like) {
                        reviews.like = rows[0].like_num;
                    }

                    nextTaskCallback(null, reviews, temp);
                }

            })

        }


        function updateStar(reviews, temp, nextTaskCallback) {

            conn.query(sql_update_reviews, [temp, reviews.rid],

                function (err) {
                    if (err)
                        return nextTaskCallback(err);

                    nextTaskCallback(null, reviews);
                });

        }


            async.waterfall([selectStar, updateStar], function (err, reviews) {

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
                            callback(null, reviews);
                        }
                    });
                }
            });
        });
}


module.exports.updateStar = updateStar;