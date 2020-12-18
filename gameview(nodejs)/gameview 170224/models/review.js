var mysql = require('mysql');
var async = require('async');
var dbPool = require('../common/dbpool').dbPool;
var dbPool_gameView = require('../common/dbpool').dbPool_gameView;
var aes_key = require('../config/key').aes_key;
var fs = require('fs');
var async = require('async');
var logger = require('../common/logger');




function findReviews(rid, callback) {
    var sql = ' select r.rid, star, reviewname, content, location, gname, icon' +
    '           from reviews r join reviews_photo p on(r.rid = p.mid) ' +
    '           join game g on(r.gid = g.gid) ' +
    '           where rid = ? ' ;
    var reviews = {};


    dbPool_gameView.getConnection(function (err, conn) {
        if (err)
            return callback(err);
        conn.query(sql, [rid], function (err, rows, fields) {
            conn.release();
            if (err)
                return callback(err);

                    if(rows.length === 0) {
                        err = new Error('리뷰가 없습니다')
                        err.status = 404
                        callback(err);

                    }

                    if(rows.length === 1) {
                        reviews.rid = rows[0].rid;
                        reviews.gname = rows[0].gname;
                        reviews.icon = rows[0].icon;
                        reviews.game_star = rows[0].star;
                        reviews.reviewname = rows[0].reviewname;
                        reviews.content = rows[0].content;
                        reviews.image = rows[0].location;
                        callback(null, reviews);

                    }

                   if(rows.length === 2) {
                       reviews.rid = rows[0].rid;
                       reviews.gname = rows[0].gname;
                       reviews.icon = rows[0].icon;
                       reviews.game_star = rows[0].star;
                       reviews.reviewname = rows[0].reviewname;
                       reviews.content = rows[0].content;
                       reviews.image = rows[0].location;
                       reviews.image2 = rows[1].location;
                       callback(null, reviews);
                   }

                   if(rows.length === 3) {
                       reviews.rid = rows[0].rid;
                       reviews.gname = rows[0].gname;
                       reviews.icon = rows[0].icon;
                       reviews.game_star = rows[0].star;
                       reviews.reviewname = rows[0].reviewname;
                       reviews.content = rows[0].content;
                       reviews.image = rows[0].location;
                       reviews.image2 = rows[1].location;
                       reviews.image3 = rows[2].location;
                       callback(null, reviews);
                   }

                  if(rows.length === 4) {
                    reviews.rid = rows[0].rid;
                    reviews.gname = rows[0].gname;
                    reviews.icon = rows[0].icon;
                    reviews.game_star = rows[0].star;
                    reviews.reviewname = rows[0].reviewname;
                    reviews.content = rows[0].content;
                    reviews.image = rows[0].location;
                    reviews.image2 = rows[1].location;
                    reviews.image3 = rows[2].location;
                    reviews.image4 = rows[3].location;
                    callback(null, reviews);
                   }

                  if(rows.length === 5) {
                        reviews.rid = rows[0].rid;
                        reviews.gname = rows[0].gname;
                        reviews.icon = rows[0].icon;
                        reviews.game_star = rows[0].star;
                        reviews.reviewname = rows[0].reviewname;
                        reviews.content = rows[0].content;
                        reviews.icon = rows[0].icon;
                        reviews.image = rows[0].location;
                        reviews.image2 = rows[1].location;
                        reviews.image3 = rows[2].location;
                        reviews.image4 = rows[3].location;
                        reviews.image4 = rows[4].location;
                callback(null, reviews);
            }

                   else callback(null, null);
        });
    });
} //ok

function createReviews(reviews, callback) {
    var sql_insert_reviews = 'insert into reviews(gid, reviewname, content, star) ' +
        'values(?, ?, ?, ?)';

    var sql_insert_photos = 'insert into reviews_photo(mid, location, bucket, keyvalue) ' +
        'values(?, ?, ?, ?)';
    var sql_select_reviews = 'select rid, gid, reviewname, ' +
        '       content, star ' +
        'from reviews ' +
        'where rid = ?';
    var sql_select_photos = 'select keyvalue, location ' +
        'from reviews_photo ' +
        'where mid = ?';


    var temp;


    dbPool_gameView.getConnection(function (err, conn) {
        if (err)
            return callback(err);

        function insertReviews(nextTaskCallback) {
            conn.query(sql_insert_reviews, [reviews.gid, reviews.reviewname, reviews.content, reviews.star], function (err, result) {
                if (err)
                    return nextTaskCallback(err);
                var mid = result.insertId;
                var photos = reviews.photos;
                nextTaskCallback(null, mid, photos);

            });
        }


        function insertPhotos(mid, photos, nextTaskCallback) {
            if (photos) {
                async.each(photos, function (photo, nextItemCallback) {
                    var location = photo.location.toString();
                    var bucket = photo.bucket.toString();
                    var keyvalue = photo.key.toString();
                    conn.query(sql_insert_photos, [mid, location, bucket, keyvalue], function (err) {
                        if (err)
                            return nextItemCallback(err);
                        nextItemCallback(null);
                    });
                }, function (err) {
                    if (err)
                        return nextTaskCallback(err);
                    nextTaskCallback(null, mid);
                });
            } else {
                nextTaskCallback(null, mid);
            }
        }

        function selectReviews(rid, nextTaskCallback) {
            conn.query(sql_select_reviews, [rid], function (err, rows, fields) {
                if (err)
                    return nextTaskCallback(err);



                var reviews = {};
                reviews.rid = rows[0].rid;
                reviews.gid = rows[0].gid;
                reviews.star = rows[0].star;
                reviews.reviewname= rows[0].reviewname;
                reviews.content = rows[0].content;
                nextTaskCallback(null, reviews);
            });
        }

        function selectPhotos(reviews, nextTaskCallback) {

            conn.query(sql_select_photos, [reviews.rid], function (err, rows, fields) {
                if (err)
                    return nextTaskCallback(err);

                reviews.photos = [];
                async.each(rows, function (row, nextItemCallback) {
                    reviews.photos.push({
                        location: row.location,
                        key: row.key
                    });
                    nextItemCallback(null);
                }, function (err) {
                    if (err)
                        return nextTaskCallback(err);
                    nextTaskCallback(null, reviews);

                });
            });
        }

        conn.beginTransaction(function (err) {
            if (err) {
                conn.release();
                return callback(err);
            }

            async.waterfall([insertReviews, insertPhotos, selectReviews, selectPhotos], function (err, reviews) {
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
                        callback(null, reviews);

                    });
                }
            });
        });
    });
} //ok

function quitReviews(rid, callback) {

    var delete_sql_photos = 'delete from reviews_photo ' +
        'where mid = ?';

    var delete_sql_reviews = 'delete from reviews ' +
        'where rid = ?';
    // var delete_sql_previews = 'delete from previews ' +
    //     'where rid = ?';

    var sql_select_photos = 'select mid, location, bucket, keyvalue ' +
        'from reviews_photo ' +
        'where mid = ? ';

    var objects = [];
    var checkPicDelete;
    var checkMemDelete;
    dbPool_gameView.getConnection(function (err, conn) {
        if (err)
            callback(err);


        function selectPhotosforDelete(nextTaskCallback) {

            if (err)
                nextTaskCallback(err);


            conn.query(sql_select_photos, [rid], function (err, rows, fields) {

                async.each(rows, function (row, nextItemCallback) {
                    objects.push({Key: row.keyvalue});
                    nextItemCallback(null);

                });

                nextTaskCallback(null, objects);

            });


        }


        function deletePhotos(objects, nextTaskCallback) {

            conn.query(delete_sql_photos, [rid], function (err, result) {

                if (err)
                    nextTaskCallback(err);

                if (result.affectedRows === 1) {
                    checkPicDelete = 1;
                    nextTaskCallback(null, objects, checkPicDelete);
                } else {
                    checkPicDelete = 0;
                    nextTaskCallback(null, objects, checkPicDelete);
                }
            });

        }

        // function deletePreviews(objects, checkPicDelete, nextTaskCallback) {
        //
        //     conn.query(delete_sql_previews, [rid], function (err, result) {
        //
        //         if (err)
        //             nextTaskCallback(err);
        //
        //
        //         if (result.affectedRows === 1) {
        //
        //             nextTaskCallback(null, objects, checkMemDelete, checkPicDelete);
        //         } else {
        //
        //             nextTaskCallback(null, objects, checkMemDelete, checkPicDelete);
        //         }
        //     });

        function deleteReviews(objects, checkPicDelete, nextTaskCallback) {

            conn.query(delete_sql_reviews, [rid], function (err, result) {

                if (err)
                    nextTaskCallback(err);


                if (result.affectedRows === 1) {
                    checkMemDelete = 1;
                    nextTaskCallback(null, objects, checkMemDelete, checkPicDelete);
                } else {
                    checkMemDelete = 0;
                    nextTaskCallback(null, objects, checkMemDelete, checkPicDelete);
                }
            });

        }





        conn.beginTransaction(function (err) {
            if (err) {
                conn.release();
                return callback(err);
            }

            async.waterfall([selectPhotosforDelete, deletePhotos, deleteReviews], function (err, objects, checkMemDelete, checkPicDelete) {
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
                        callback(null, objects, checkMemDelete, checkPicDelete);
                    });
                }
            });
        });


    });


}//ok

function updateReviews(reviews, callback) {
    // TODO.1 쿼리 변수를 선언한다.
    var sql_select_reviews = 'select rid,' +
        '       gid, ' +
        '       reviewname, ' +
        '       content ' +
        '       from reviews ' +
        '       where rid = ? ';


    var sql_update_reviews = 'update reviews ' +
        '                     set gid = ?, ' +
        '                     reviewname = ?, ' +
        '                     content = ? ' +
        '                     where rid = ? ';

    var sql_select_photos = 'select mid, location, bucket, keyvalue ' +
        'from reviews_photo ' +
        'where mid = ? ';

    var sql_insert_photos = 'insert into reviews_photo (mid, location, bucket, keyvalue)  ' +
        'values (?, ?, ?, ?) ';

    var sql_delete_photos = 'delete ' +
        'from reviews_photo ' +
        'where keyvalue = ? ';

    // TODO.2 dbPool에서 connection

    dbPool_gameView.getConnection(function (err, conn) {
        // TODO.3 err가 발생할 경우 콜백함수에 err객체를 전달
        if (err)
            return callback(err);
        // TODO.4 selectMembersForUpdate 중첩함수(id에 해당하는 멤버객체 반환)를 작성한다.
        function selectReviewsForUpdate(nextTaskCallback) {
            var pwFlag = 0; // 비밀번호가 변경 유무를 나타내는 상태 변수(0 = 변경되었을때, 1 = 변경되지않았을때)
            conn.query(sql_select_reviews, [reviews.rid], function (err, rows, fields) {
                if (err)
                    return nextTaskCallback(err);

                if (rows.length !== 1) {
                    err = new Error('리뷰가 없습니다');
                    err.status = 404;
                    return nextTaskCallback(err);
                } else {
                    if (!reviews.gid)
                        reviews.gid = rows[0].gid;
                    if (!reviews.reviewname)
                        reviews.reviewname = rows[0].reviewname;
                    if (!reviews.content) {
                        reviews.content = rows[0].content;
                    }
                    nextTaskCallback(null, reviews);
                }

            })

        }

        // TODO.5 updateMembersForUpdate 중첩함수(id에 해당하는 멤버객체 변경)를 작성한다.
        function updateReviewsForUpdate(reviews, nextTaskCallback) {


                conn.query(sql_update_reviews, [reviews.gid, reviews.reviewname, reviews.content, reviews.rid],

                    function (err) {
                        if (err)
                            return nextTaskCallback(err);

                        nextTaskCallback(null, reviews);
                    });


        }


        // TODO.6 selectPhotosForUpdate 중첩함수(id에 해당하는 사진정보를 가진 멤버객체 반환)를 작성한다.

        function selectPhotosForUpdate(reviews, nextTaskCallback) {

            conn.query(sql_select_photos, [reviews.rid], function (err, rows, fields) {
                if (err)
                    return nextTaskCallback(err);

                var beforePaths = []; // 변경 전의 사진정보를 임시 저장

                if (reviews.photos)  {
                    async.each(rows, function (row, nextItemCallback) {
                        beforePaths.push({
                            location: row.location,
                            bucket: row.bucket,
                            key: row.keyvalue  //key 로 받아야 할 듯 !!
                        });
                        nextItemCallback(null);
                    }, function (err) {
                        if (err)
                            return nextTaskCallback(err);
                        nextTaskCallback(null, beforePaths);
                    });
                } else {
                    nextTaskCallback(null, beforePaths);
                }
            });
        }

        // TODO.7 insertPhotosForUpdate 중첩함수(id에 해당하는 사진정보를 추가)를 작성한다.

        function insertPhotosForUpdate(beforePaths, nextTaskCallback) {

            var photos = reviews.photos;

            if (photos) { // 복수의 사진 파일이 업로드 되었을 경우

                var bucket;
                var location;
                var keyvalue;

                async.each(photos, function (photo, nextItemCallback) {

                    if (photo) {
                        bucket = photo.bucket;
                        location = photo.location;
                        keyvalue = photo.key;
                    }

                    conn.query(sql_insert_photos, [reviews.rid, location, bucket, keyvalue], function (err) {
                        if (err)
                            return nextItemCallback(err);
                        nextItemCallback(null);
                    });
                }, function (err) {
                    if (err)
                        return nextTaskCallback(err);
                    nextTaskCallback(null, beforePaths);
                });
            } else {
                nextTaskCallback(null, beforePaths);
            }
        }

        // TODO.8 deletePhotosForUpdate 중첩함수(id에 해당하는 사진정보 및 beforePaths에 해당하는 사진파일을 삭제)를 작성한다.
        function deletePhotosForUpdate(beforePaths, nextTaskCallback) {

            if (beforePaths) { // beforePaths가 파일의 경로를 가지고 있을 때
                async.each(beforePaths, function (beforePath, nextItemCallback) {
                    var beforePhotoKeyValue = beforePath.key;
                    conn.query(sql_delete_photos, [beforePhotoKeyValue], function (err) {
                        if (err)
                            return nextItemCallback(err);
                        nextItemCallback(null);
                    });
                }, function (err) {
                    if (err)
                        return nextTaskCallback(err);
                    reviews.beforePaths = beforePaths; //commit시 지울 파일의 경로를 member 객체에 등록
                    nextTaskCallback(null, reviews);
                })
            } else { // beforePaths가 빈 배열일 때
                nextTaskCallback(null, reviews);

            }
        }

        // TODO.9 transaction 을 시작한다.
        conn.beginTransaction(function (err) {
            if (err) {
                conn.release();
                return callback(err);
            }

            async.waterfall([selectReviewsForUpdate, updateReviewsForUpdate, selectPhotosForUpdate,
                insertPhotosForUpdate, deletePhotosForUpdate], function (err, reviews) {
                // TODO.10 async.waterfall의 task로 중첩함수들을 전달한다.
                if (err) {
                    // TODO.11 에러가 발생할 경우 rollback을, 정상적으로 처리될 경우 commit을 수행한다.(connection객체를 반환할것!!!)
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
    });
} //ok


function listReviews(pagenum, rowsnum, callback) {
    var sql_selectPage = 'select r.rid, reviewname, location ' +
    '                     from reviews r join reviews_photo p on(r.rid = p.mid) ' +
    '                     where rid ' +
    '                     group by rid ' +
    '                     limit ?,? ';
    var rowcnt = rowsnum;
    var offset = (pagenum - 1) * rowcnt;
    var reviews = {};

    dbPool_gameView.getConnection(function (err, conn) {
        if (err)
            return callback(err);

        conn.query(sql_selectPage, [offset, rowcnt], function (err, rows, fields) {
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
}



module.exports.findReviews = findReviews;
module.exports.createReviews = createReviews;
module.exports.updateReviews = updateReviews;
module.exports.quitReviews = quitReviews;
module.exports.listReviews = listReviews;