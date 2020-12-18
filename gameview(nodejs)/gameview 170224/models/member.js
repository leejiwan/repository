var mysql = require('mysql');
var async = require('async');
var dbPool = require('../common/dbpool').dbPool;
var dbPool_gameView = require('../common/dbpool').dbPool_gameView;
var aes_key = require('../config/key').aes_key;
var fs = require('fs');
var async = require('async');
var logger = require('../common/logger');

function quitMember(id, callback) {

    var delete_sql_photos = 'delete from member_photo ' +
        'where mid = ?';

    var delete_sql_members = 'delete from members ' +
        'where id = ?';

    var sql_select_photos = 'select mid, location, bucket, keyvalue ' +
        'from member_photo ' +
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

            conn.query(sql_select_photos, [id], function (err, rows, fields) {

                async.each(rows, function (row, nextItemCallback) {
                    objects.push({Key: row.keyvalue});
                    nextItemCallback(null);

                });


                nextTaskCallback(null, objects);

            });


        }


        function deletePhotos(objects, nextTaskCallback) {

            conn.query(delete_sql_photos, [id], function (err, result) {

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

        function deleteMembers(objects, checkPicDelete, nextTaskCallback) {

            conn.query(delete_sql_members, [id], function (err, result) {

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

            async.waterfall([selectPhotosforDelete, deletePhotos, deleteMembers], function (err, objects, checkMemDelete, checkPicDelete) {
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


} //ok



function updateMember(member, callback) {

    var sql_select_members = 'select id,' +
        '       nickname, password, type, gender, exp, age' +
        '       password ' +
        'from members ' +
        'where id = ? ';

    // 변경하는 비밀번호가 없는 경우 (이중암호화 방지)
    var sql_update_members = 'update members ' +
        '    set type = ?, gender = ?, exp = ?, age = ? ' +
        'where id = ? ';

    // 변경하는 비밀번호가 있는 경우
    var sql_update_members_pw = 'update members ' +
        '    set type = ?, gender = ?, exp = ?, age = ? ' +
        '    password = sha2(?, 512) ' +
        'where id = ? ';

    var sql_select_photos = 'select mid, location, bucket, keyvalue ' +
        'from photos ' +
        'where mid = ? ';

    var sql_insert_photos = 'insert into photos (mid, location, bucket, keyvalue)  ' +
        'values (?, ?, ?, ?) ';

    var sql_delete_photos = 'delete ' +
        'from photos ' +
        'where keyvalue = ? ';


    dbPool_gameView.getConnection(function (err, conn) {

        if (err)
            return callback(err);

        function selectMemberForUpdate(nextTaskCallback) {
            var pwFlag = 0; // 비밀번호가 변경 유무를 나타내는 상태 변수(0 = 변경되었을때, 1 = 변경되지않았을때)
            conn.query(sql_select_members, [member.id], function (err, rows, fields) {
                if (err)
                    return nextTaskCallback(err);

                if (rows.length !== 1) {
                    err = new Error('Not Found');
                    err.status = 404;
                    return nextTaskCallback(err);
                } else {
                    if (!member.type)
                        member.type = rows[0].type;
                    if (!member.age)
                        member.age = rows[0].age;
                    if (!member.gender)
                        member.gender = rows[0].gender;
                    if (!member.exp)
                        member.exp = rows[0].exp;
                    if (!member.password) {
                        pwFlag = 1;
                        member.password = rows[0].password;
                    }
                    nextTaskCallback(null, pwFlag, member);
                }

            })

        }

        // TODO.5 updateMembersForUpdate 중첩함수(id에 해당하는 멤버객체 변경)를 작성한다.
        function updateMemberForUpdate(pwFlag, member, nextTaskCallback) {

            if (pwFlag === 1) { // 비밀번호가 변경되지 않았을때
                conn.query(sql_update_members, [member.type, member.gender, member.exp, member.age],
                    function (err) {
                        if (err)
                            return nextTaskCallback(err);

                        nextTaskCallback(null, member);
                    });
            } else { // 비밀번호 변경되었을때
                conn.query(sql_update_members_pw, [member.type, member.gender, member.exp, member.age, member.password],
                    function (err) {
                        if (err)
                            return nextTaskCallback(err);

                        nextTaskCallback(null, member);
                    });
            }

        }


        // TODO.6 selectPhotosForUpdate 중첩함수(id에 해당하는 사진정보를 가진 멤버객체 반환)를 작성한다.

        function selectPhotosForUpdate(member, nextTaskCallback) {

            conn.query(sql_select_photos, [member.id], function (err, rows, fields) {
                if (err)
                    return nextTaskCallback(err);

                var beforePaths = []; // 변경 전의 사진정보를 임시 저장

                if (member.photos)  {
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

            var photos = member.photos;

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

                    conn.query(sql_insert_photos, [member.id, location, bucket, keyvalue], function (err) {
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
                    member.beforePaths = beforePaths; //commit시 지울 파일의 경로를 member 객체에 등록
                    nextTaskCallback(null, member);
                })
            } else { // beforePaths가 빈 배열일 때
                nextTaskCallback(null, member);

            }
        }

        // TODO.9 transaction 을 시작한다.
        conn.beginTransaction(function (err) {
            if (err) {
                conn.release();
                return callback(err);
            }

            async.waterfall([selectMemberForUpdate, updateMemberForUpdate, selectPhotosForUpdate,
                insertPhotosForUpdate, deletePhotosForUpdate], function (err, member) {
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
                            callback(null, member);
                        }
                    });
                }
            });
        });
    });
}


//photo 와 관련된 테이블 쿼리 모두 바꾸기
function create(member, callback) { //username = email
    var sql_insert_members = 'insert into members(username, nickname, password, type, gender, exp, age) ' +
        '                     values(?, ?, sha2(?, 512), ?, ?, ?, ?) ';
    var sql_insert_photos = 'insert into member_photo(mid, location, bucket, keyvalue) ' +
        'values(?, ?, ?, ?)';
    var sql_select_members = 'select id, username, ' +
        '                     nickname, type, gender, exp, age, password ' +
        '                     from members ' +
        '                     where id = ?';
    var sql_select_photos = 'select keyvalue, location ' +
        'from member_photo ' +
        'where mid = ?';

    dbPool_gameView.getConnection(function (err, conn) {
        if (err)
            return callback(err);

        function insertMembers(nextTaskCallback) {
            conn.query(sql_insert_members, [member.username, member.nickname, member.password, member.type, member.gender, member.exp, member.age], function (err, result) {
                if (err)
                    return nextTaskCallback(err);
                var mid = result.insertId;
                var photos = member.photos;
                console.log(member.username + '1234')
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

        function selectMembers(id, nextTaskCallback) {
            conn.query(sql_select_members, [id], function (err, rows, fields) {
                if (err)
                    return nextTaskCallback(err);
                var member = {};
                member.id = rows[0].id;
                member.email = rows[0].username;
                member.nickname = rows[0].nickname;
                member.exp = rows[0].exp;
                member.gender = rows[0].gender;
                member.type = rows[0].type;
                member.age = rows[0].age;
                nextTaskCallback(null, member);
            });
        }

        function selectPhotos(member, nextTaskCallback) {
            conn.query(sql_select_photos, [member.id], function (err, rows, fields) {
                if (err)
                    return nextTaskCallback(err);

                member.photos = [];
                async.each(rows, function (row, nextItemCallback) {
                    member.photos.push({
                        location: row.location,
                        key: row.key
                    });
                    nextItemCallback(null);
                }, function (err) {
                    if (err)
                        return nextTaskCallback(err);
                    nextTaskCallback(null, member);
                });
            });
        }

        conn.beginTransaction(function (err) {
            if (err) {
                conn.release();
                return callback(err);
            }

            async.waterfall([insertMembers, insertPhotos, selectMembers, selectPhotos], function (err, member) {
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
                        callback(null, member);
                    });
                }
            });
        });
    });
} //ok


function findByUsername(username, callback) {
    var sql = 'select id, username, ' +
        '       password ' +
        'from members ' +
        'where username = ?';
    dbPool_gameView.getConnection(function (err, conn) {
        if (err)
            return callback(err);

        conn.query(sql, [username], function (err, rows, fields) {
            conn.release();
            if (err)
                return callback(err);

            if (rows.length === 1) { // username - unique column
                var user = {};
                user.id = rows[0].id;
                user.email = rows[0].username;
                user.name = rows[0].name;
                user.password = rows[0].password;
                callback(null, user);
            } else {
                callback(null, null);
            }
        });
    });
}

function verifyPassword(password, user, callback) {
    var sql = 'select password = sha2(?, 512) as col ' +
        'from members ' +
        'where username = ?';

    dbPool_gameView.getConnection(function (err, conn) {
        if (err)
            return callback(err);

        conn.query(sql, [password, user.email], function (err, rows, fields) {
            conn.release();
            if (err)
                return callback(err);
            if (rows[0].col === 1)
                callback(null, true);
            else
                callback(null, false);
        })
    });
}

function findMember(memberId, callback) {
    var sql = 'select id, username, ' +
        '       nickname, ' +
        '       password ' +
        'from members ' +
        'where id = ?';
    dbPool_gameView.getConnection(function (err, conn) {
        if (err)
            return callback(err);
        conn.query(sql, [memberId], function (err, rows, fields) {
            conn.release();
            if (err)
                return callback(err);
            if (rows.length === 1) { // id - primary key column
                var user = {};
                user.id = rows[0].id;
                user.username = rows[0].username;
                user.nickname = rows[0].nickname;
                callback(null, user);
            } else {
                callback(null, null);
            }
        });
    });
}

function findOrCreate(profile, callback) {
    var sql_select = 'select id from members where facebookid =?'; //facebook id 로 가입 여부 추출할 것
    var sql_insert = 'insert into members (facebookid, facebooktoken) values (?, ?) ' //최초 가입시 facebookid 와 token 넣기.
    var sql_update = 'update members set facebooktoken = ? where facebookid = ?'; //기존 사용자는 변경된 token 만 update.
    var sql_dml, sql_params = '';

    logger.log('debug', 'bugbugbug %s', JSON.stringify(profile));

    //i/nsert, update동시에 안됨. 그렇기 때문에 트랜젝션만들 필요없다. 대신 dbPool해서 getConnection함
    dbPool_gameView.getConnection(function (err, conn) {
        if (err)
            return callback(err);

        //profil =  {"id":"1179075452189663","displayName":"김혜원","name":{},
        conn.query(sql_select, [profile.id], function (err, rows, fields) {
            if (err) //에러가 있으면
                return callback(err);

            var member = {};
            if (rows.length === 0) { //select한 정보가 존재하지 않는다
                sql_dml = sql_insert;
                sql_params = [profile.id, profile.accessToken];
            } else {
                sql_dml = sql_update;
                sql_params = [profile.accessToken, profile.id];
                member.id = rows[0].id;
            }

            conn.query(sql_dml, sql_params, function (err, result) {
                conn.release();
                if (err)
                    return callback(err);

                if (result.facebookid)
                    member.id = result.facebookid;
                callback(null, member);
            });
        });
    });

    // callback(null, { //findOrCreate가 멤버 하나 만들어서 넘겨줬음.
    //   id: '1179075452189663' //test하기위한 장치
    // })
}


// function listMember(pagenum, rowsnum, callback) {
//     // 1. id, username, name, url, mimetype을 가져올 select 쿼리문 작성. (혜수)
//     var sql_selectPage = 'select id, ' +
//         '       username, ' +
//         '       nickname, ' +
//         '       from members ' +
//         '       limit ?, ?';
//     // 2. pagenum과 rowsnum을 이용해 limit절에 들어갈 escape place holder 생성. (선호)
//     var rowcnt = rowsnum;
//     var offset = (pagenum - 1) * rowcnt;
//     // 3. dbPool을 통해 connection을 생성. (선호)
//     dbPool_gameView.getConnection(function (err, conn) {
//         // 4. err 처리.  (선호)
//         if (err)
//             return callback(err);
//
//         // 5. connection의 query 메소드를 이용해 쿼리문, 옵션, 콜백 전달. (덕문)
//         // 6. err 처리 (덕문)
//         conn.query(sql_selectPage, [aes_key, offset, rowcnt], function (err, rows, fields) {
//             conn.release();
//             if (err)
//                 return callback(err);
//             if (rows.length) {
//                 // 8. rows를 callback에 전달. (덕문)
//                 callback(null, rows);
//             }
//             else {
//                 err = new Error('not found');
//                 err.status = 404;
//                 callback(err);
//             }
//         });
//
//     });
// }

/*function createInExgroup(member, callback) {
 var sql_insert_members = 'insert into members (username, nickname, password) ' +
 'values(?, aes_encrypt(?, unhex(sha2(?, 512))), sha2(?, 512))';

 var sql_select_members = 'select username, nickname, password ' +
 'from members where username = ? ';

 dbPool_gameView.getConnection(function (err, conn) {
 if (err)
 return callback(err);

 function insertMembers(nextTaskCallback) {
 conn.query(sql_insert_members, [member.username, member.nickname, aes_key, member.password], function (err, result) {
 if (err)
 return nextTaskCallback(err);
 nextTaskCallback(null, member);
 });
 }

 function selectMembers(member, nextTaskCallback) {
 conn.query(sql_select_members, [member.username], function (err, result) {
 if (err)
 return nextTaskCallback(err);

 var newUser = {};
 newUser.password = result[0].password;
 newUser.username = result[0].username;
 newUser.id = result[0].id;
 newUser.nickname = result[0].nickname;
 nextTaskCallback(null, member);
 });
 }


 conn.beginTransaction(function (err) {
 if (err) {
 conn.release();
 return callback(err);
 }

 async.waterfall([insertMembers, selectMembers], function (err, member) {
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
 callback(null, member);
 });
 }
 });
 });
 });

 }
 */

// function updateMember(member, callback) {
//   // 1: 멤버를 변경하기 위한 쿼리를 작성한다.
//   var sql_select = 'select id, username, ' +
//                    '       cast(aes_decrypt(name, unhex(sha2(?, 512))) as char(40)) as name, ' +
//                    '       password,' +
//                    '       path, url, mimetype ' +
//                    'from members ' +
//                    'where id = ?';
//
//   var sql_update = 'update members ' +
//                    'set username = ?, ' +
//                    '    name = aes_encrypt(?, unhex(sha2(?, 512))), ' +
//                    '    password = sha2(?, 512), ' +
//                    '    path = ?, ' +
//                    '    url = ?,' +
//                    '    mimetype = ? ' +
//                    'where id = ?';
//
//   var beforePath;
//
//   // 2: connection 을 dbPool로부터 획득한다.
//   dbPool.getConnection(function (err, conn) {
//     // 3: connection 을 얻지 못했을 경우 에러처리한다.
//     if (err)
//       return callback(err);
//
//     conn.query(sql_select, [aes_key, member.id], function(err, rows, fields) {
//       if (err) {
//         conn.release();
//         return callback(err);
//       }
//
//       if (rows.length !== 1) {
//         conn.release();
//         err = new Error('Not Found');
//         err.status = 404;
//         callback(err);
//       } else {
//         beforePath = rows[0].path;
//
//         if (!member.username)
//           member.username = rows[0].username;
//         if (!member.name)
//           member.name = rows[0].name;
//         if (!member.password)
//           member.password = rows[0].password;
//         if (!member.path)
//           member.path = rows[0].path;
//         if (!member.url)
//           member.url = rows[0].url;
//         if (!member.mimetype)
//           member.mimetype = rows[0].mimetype;
//
//         var values = [member.username, member.name, aes_key, member.password,
//           member.path, member.url, member.mimetype, member.id];
//         // 4: connection 을 이용해서 쿼리함수 호출한다. 인자로 sql, escape place holder, callback 함수 전달
//         conn.query(sql_update, values, function(err, result) {
//           // 5: 콜백함수 내에서 connection release 해준다.
//           conn.release();
//           // 6: 에러 발생 시, 콜백에 err 전달.
//           if(err)
//             return callback(err);
//
//           // 7: 매개변수로 전달된 result의 changedRows 값 1일 때, 0일 때 나눠서 처리
//           if (result.changedRows === 1) {
//             // 8: changedRows 값 1일 때, callback 에 인자로 null 과 1 전달
//             // 변경 이전의 파일 지우기
//             if (beforePath !== member.path) {
//               fs.unlink(beforePath, function() {
//                 callback(null, 1);
//               });
//             } else {
//               callback(null, 1);
//             }
//           } else {
//             //  9: changedRows 값 0일 때, callback 에 인자로 null 과 0 전달
//             callback(null, 0);
//           }
//         });
//       }
//     });
//   });
// }
module.exports.findMember = findMember;
module.exports.findByUsername = findByUsername;
module.exports.verifyPassword = verifyPassword;
module.exports.create = create;
module.exports.updateMember = updateMember;
module.exports.quitMember = quitMember;
//module.exports.listMember = listMember;
module.exports.findOrCreate = findOrCreate;
