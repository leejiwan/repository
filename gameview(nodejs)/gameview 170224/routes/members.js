var express = require('express');
var router = express.Router();
var isSecure = require('../common/security').isSecure;
var isLoggedIn = require('../common/security').isLoggedIn;
var Member = require('../models/member');
var multer = require('multer');
var multerS3 = require('multer-s3');
var AWS = require('aws-sdk');
var s3Config = require('../config/aws_s3');
var S3 = new AWS.S3({ //S3 Client 객체 생성. S3 = 서버, nodeApp : Client
    region: 'ap-northeast-2',
    accessKeyId: s3Config.accessKeyId,
    secretAccessKey: s3Config.secretAccessKey
});
var path = require('path');
var util = require('util');
var upload = multer({dest: path.join(__dirname, '../uploads/images/members/')});
var logger = require('../common/logger');
var async = require('async');

var upload = multer({
    storage: multerS3({
        s3: S3,
        bucket: 'leejiwan',
        acl :'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, {
                ACL :'public-read',
                fieldName: file.fieldname
            }); // s3 에서 metadata 확인하기
        },
        key: function (req, file, cb) {
            cb(null, 'members/' + Date.now().toString())
        }
        // key: function (req, file, cb) { //bucket 내 photos folder 안에 저장하고 싶은 경우
        //   cb(null, 'photos/' + Date.now().toString())
        // }


    })
});
// mount point: /members
// CRUD + L



router.post('/', isSecure, upload.array('photos', 1), function (req, res, next) {
    var username = req.body.email;
    var nickname = req.body.nickname;
    var password = req.body.password;
    var exp = req.body.exp;
    var type = req.body.type;
    var gender = req.body.gender;
    var age = req.body.age;
    var photos = req.files;

    if(!username || !password) {
        var err = new Error('이메일과 패스워드를 입력하세요')
        next(err);
    }

    Member.create({
        username: username,
        nickname: nickname,
        password: password,
        exp: exp,
        type: type,
        gender: gender,
        age: age,
        photos: photos
    }, function (err, member) {
        if (err)
            return next(err);

        if(!password) {
            var err = new Error('패스워드 입력하세요')
            err.status = '404'
            next(err)
        }

        res.json({
            result: {
                message: '가입된 정보는 다음과 같습니다.',
                data: {
                   member
                    // id: member.id,
                    // email: member.username,
                    // nickname: member.nickname,
                    // type: member.type,
                    // exp: member.exp,
                    // gender: member.gender,
                    // age: member.age,
                    // photos: member.photos
                }
            }
        });
    });
});






router.get('/:mid', isSecure, function (req, res, next) {
    var id = req.params.mid;
    Member.findMember(id, function (err, member) {
        if (err)
            return next(err);
        if (!member) {
            err = new Error('Not Found');
            err.status = 404;
            return next(err);
        }
        res.json({
            result: {
                message: '회원 정보는 다음과 같습니다.',
                data: {
                    id: member.id,
                    email: member.username,
                    nickname: member.nickname,

                }
            }
        });
    });
});



router.put('/:mid', isSecure, isLoggedIn, upload.array('photos'), function (req, res, next) {
    // 2 updatemember를 호출할 때 전달할 매개변수 선언한다.
    var id = parseInt(req.params.mid);
    var username = req.body.username;
    var name = req.body.name;
    var password = req.body.password;
    var photos = req.files;

    // 동적 라우팅 파라미터의 id와 세션의 id를 비교
    if (id === req.user.id) {
        // 3 매개변수의 값들로 객체를 구성해 updateMember를 호출할 때 전달한다.
        Member.updateMember({
            id: id,
            username: username,
            name: name,
            password: password,
            photos: photos
        }, function (err, user) {
            // 4 에러가 발생할 경우 next 콜백에 err객체를 전달한다.
            if (err)
                return next(err);
            // 5 member 객체가 존재하지 않을 경우 not found 에러를 처리한다.
            if (!user) {
                err = new Error('Not Found');
                err.status = 404;
                return next(err);
            }
            var Objects =[];
            async.each(user.beforePaths, function (beforePath, nextItemCallback) {
                Objects.push({Key : beforePath.key});
            }, function (err) {
                if (err){
                    err = new Error('err occured before Path');
                    return next(err);
                }
            });


            var params = {
                Bucket: 'leejiwan', /* required */
                Delete: { /* required */
                    Objects: Objects,
                    Quiet: true || false
                },

            };

            S3.deleteObjects(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log(data);
                // 6 에러가 발생하지 않는 경우 정상적으로 수정이 완료되었음을 알려준다.
                res.json({
                    result: {
                        message: '정보 수정에 성공 했습니다',
                        user
                    }
                })
            });



        });
    }
    else {
        var err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    }


});
router.delete('/:mid', isSecure, isLoggedIn, function (req, res, next) {
    // 1. 클라이언트로부터 전달된 매개변수의 값들을 획득한다.
    var id = req.params.mid;

    // 2. Member 모델 객체의 삭제 함수 quitMember()를 호출하며 1.에서 획득한 id를 전달한다.
    Member.quitMember(id, function (err, keyValue, memFlag, picFlag) {
      //  console.log(JSON.stringify(keyValue) + "aefafafaffffaefaefafa");

        var message;
        // 3. 삭제 함수 quitMember()에서 에러가 있을 경우,
        if (err)
            return next(err);


        var params = {
            Bucket: 'leejiwan', /* required */
            Delete: { /* required */
                Objects: keyValue,
                Quiet: true || false
            }

        };

        S3.deleteObjects(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);

            if (memFlag || picFlag) {
                message = '회원정보가 삭제되었습니다. 회원번호:' + id;


                res.json({
                    result: {
                        message: message
                    }
                });
            }


        });


        // 4. 삭제가 정상적으로 이루어졌을 경우와 삭제된 것이 없을 경우에 대한 응답을 처리한다.

    });
});

// router.get('/', isSecure, function (req, res, next) {
//
//     var page = parseInt(req.query.page);
//     var rows = parseInt(req.query.rows);
//
//     //  2. 1.에서 받아온 매개변수를 목록을 조회할 함수에게 넘겨준다. (고은)
//     Member.listMember(page, rows, function (err, members) {
//         // 3. 함수의 결과 처리 (1) 에러 처리 (초롬이)
//         if (err)
//             return next(err);
//         // 4. 함수의 결과 처리 (2) 결과가 없는 경우 -> NOT FOUND (초롬이)
//         if (members.length === 0) {
//             err = new Error('Not Found');
//             err.status = 404;
//             return next(err);
//         } else {
//             // 5. 함수의 결과 처리 (3) 결과가 있는 경우 -> 배열 이용 (혜민)
//             res.json({
//                 result: {
//                     message: '회원 정보 목록을 조회하였습니다.',
//                     data: {
//                         members: members
//                     }
//                 }
//             });
//         }
//     });
// });

// router.get('/:mid/photos/:filename', isSecure, function (req, res, next) {
//     var mid = req.params.mid;
//     var filename = req.params.filename;
//
//     var options = {
//         root: path.join(__dirname, '../uploads/images/members/'),
//         headers: {
//             'content-type': 'image/jpg'
//         }
//     };
//     res.sendFile(filename, options, function (err) {
//         if (err)
//             next(err);
//     });
// });

// router.put('/:mid', isSecure, isLoggedIn, upload.single('photo'), function(req, res, next) {
//   //  1. 클라이언트로부터 전달된 매개변수의 값들을 획득한다.
//   var id = req.params.mid;
//   var username = req.body.username;
//   var name = req.body.name;
//   var password = req.body.password;
//
//   var filepath;
//   var filename;
//   var fileurl;
//   var mimetype;
//
//   if (req.file) {
//     filepath = req.file.path;
//     filename = req.file.filename;
//     fileurl = 'https://localhost/images/members/' + filename;
//     mimetype = req.file.mimetype;
//   }
//
//   //  2. 획득한 매개변수의 값을 이용해 객체를 구성한다.
//   var member = {
//     id: id,
//     username: username,
//     name: name,
//     password: password,
//     path: filepath,
//     url: fileurl,
//     mimetype: mimetype
//   };
//
//   // 3. Member 모델 객체의 변경 함수 updateMember()를 호출하며 2.에서 생성한 객체를 전달한다.
//   Member.updateMember(member, function(err, result) {
//     var message = '';
//     // 4. 변경 함수 updateMember()에서 에러가 있을 경우,
//     if (err)
//       return next(err);
//     // 5. 변경이 정상적으로 이루어졌을 경우와 변경된 것이 없을 경우에 대한 응답을 처리한다.
//     if (result === 1) {
//       message = '회원정보가 변경되었습니다.'
//     } else {
//       message = '변경된 회원정보가 없습니다.'
//     }
//     res.json({
//       result: {
//         message: message
//       }
//     });
//   });
// });
// 1 업데이트할 사진을 매개변수에 전달한다.
module.exports = router;