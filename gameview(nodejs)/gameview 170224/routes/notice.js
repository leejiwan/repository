var express = require('express');
var router = express.Router();
var isSecure = require('../common/security').isSecure;
var isLoggedIn = require('../common/security').isLoggedIn;
var Notice = require('../models/notice');
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



router.get('/', isSecure, function (req, res, next) {


    Notice.findNotice(function (err, notice) {
        if (err)
            return next(err);

        if (!notice) {
            err = new Error('Not Found error!!');
            err.status = 404;
            return next(err);
        }
        res.json({
            result: {
                message: '공지사항은 다음과 같습니다.',
                data: {
                    notice

                }
            }
        });
    });
});

module.exports = router;