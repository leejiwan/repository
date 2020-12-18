var express = require('express');
var router = express.Router();
var isSecure = require('../common/security').isSecure;
var isLoggedIn = require('../common/security').isLoggedIn;
var Game = require('../models/game');
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
            cb(null, 'game/' + Date.now().toString())
        }
        // key: function (req, file, cb) { //bucket 내 photos folder 안에 저장하고 싶은 경우
        //   cb(null, 'photos/' + Date.now().toString())
        // }


    })
});

// router.get('/:gid', isSecure, function (req, res, next) { // 게임 조회
//     var gid = req.params.gid;
//
//     Game.findGame(gid, function (err, game) {
//         if (err)
//             return next(err);
//
//         if (!game) {
//             err = new Error('게임 조회에 실패 했습니다');
//             err.status = 404;
//             return next(err);
//         }
//
//
//         res.json({
//             result: {
//                 message: '게임 정보는 다음과 같습니다.',
//                 data: {
//                     game
//                 }
//             }
//         });
//     });
// });



router.get('/category/:cid', isSecure, function (req, res, next) {
    var cid = req.params.cid
    var page = parseInt(req.query.page);
    var rows = parseInt(req.query.rows);



    Game.listGame(cid, page, rows, function (err, game) {

        if (err)
            return next(err);

        if(cid = 1)
            var category = '스포츠';
        if(cid = 2)
            var category = '어드벤쳐';
        if(cid = 3)
            var category = '카드';
        if(cid = 4)
            var category = '시뮬';
        if(cid = 5)
            var category = '전략';
        if(cid = 6)
            var category = '아케이드';
        if(cid = 7)
            var category = '퍼즐';
        if(cid = 8)
            var category = '롤플레잉';
        if(cid = 9)
            var category = '음악';
        if(cid = 10)
            var category = '보드';

        if (game.length === 0) {
            err = new Error('게임이 존재 하지 않습니다');
            err.status = 404;
            return next(err);
        } else {

            res.json({
                result: {
                    message: '게임 정보 목록을 조회하였습니다.',
                    data: {
                        category: category,
                        game
                    }
                }
            });
        }
    });
});

module.exports = router;

