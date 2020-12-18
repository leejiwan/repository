var express = require('express');
var router = express.Router();
var isSecure = require('../common/security').isSecure;
var isLoggedIn = require('../common/security').isLoggedIn;
var Reviews = require('../models/review');
var Previews = require('../models/preview');
var Star = require('../models/like');
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
            cb(null, 'reviews/' + Date.now().toString())
        }
        // key: function (req, file, cb) { //bucket 내 photos folder 안에 저장하고 싶은 경우
        //   cb(null, 'photos/' + Date.now().toString())
        // }


    })
});

router.get('/:rid', isSecure, function (req, res, next) { // 리뷰 조회
    var rid = req.params.rid;

    Reviews.findReviews(rid, function (err, reviews) {
        if (err)
            return next(err);

        // if (!reviews) {
        //     err = new Error('리뷰가 없습니다');
        //     err.status = 404;
        //     return next(err);
        // }
        res.json({
            result: {
                message: '리뷰는 다음과 같습니다.',
                data: {

                        reviews: reviews
                }
            }
        });
    });
});// 리뷰조회

router.post('/', isSecure, upload.array('photos', 5), function (req, res, next) {
    var reviewname = req.body.name;
    var gid = req.body.gid;
    var content = req.body.content;
    var star = req.body.star;
    var photos = req.files;

   if(!reviewname || !content || !photos) {
       var err = new Error('리뷰명, 내용, 사진을 입력하세요');
       return next(err);
   }
   if(star > 5) {
       var err = new Error('게임 평점을 5까지 입력하세요');
       return next(err);
   }

    Reviews.createReviews({
        reviewname: reviewname,
        content: content,
        gid: gid,
        star: star,
        photos: photos

    }, function (err, reviews) {

         if (err) {
             err = new Error('리뷰 등록에 실패 했습니다');
             return next(err);
         }

        res.json({
            result: {
                message: '리뷰 등록에 성공 했습니다.',
                data: {
                    review_id: reviews.rid,
                    game_id: reviews.gid,
                    game_star: reviews.star,
                    review_name: reviews.reviewname,
                    content: reviews.content,
                    review_image: reviews.photos
                }
            }
        });
    });
});

router.put('/:rid', isSecure, upload.array('photos'), function (req, res, next) {
    // 2 updateReviews를 호출할 때 전달할 매개변수 선언한다.
    var rid = req.params.rid;
    var gid = req.body.gid;
    var reviewname = req.body.name;
    var content = req.body.content;
    var photos = req.files;




        // 3 매개변수의 값들로 객체를 구성해 updateMember를 호출할 때 전달한다.
        Reviews.updateReviews({
            rid: rid,
            gid: gid,
            reviewname: reviewname,
            content: content,
            photos: photos
        }, function (err, reviews) {
            // 4 에러가 발생할 경우 next 콜백에 err객체를 전달한다.
            if (err)
                return next(err);
            // 5 reviews 객체가 존재하지 않을 경우 not found 에러를 처리한다.
            if (!reviews) {
                err = new Error('존재 하지 않는 리뷰 입니다');
                err.status = 404;
                return next(err);
            }
            var Objects =[];
            async.each(reviews.beforePaths, function (beforePath, nextItemCallback) {
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
                        message: '리뷰 수정에 성공 했습니다',
                        gid: gid,
                        review_name: reviewname,
                        content: content,
                    }
                })
            });

        });
});

router.delete('/:rid', isSecure, function (req, res, next) {
    // 1. 클라이언트로부터 전달된 매개변수의 값들을 획득한다.
    var id = req.params.rid;

    // 2. Member 모델 객체의 삭제 함수 quitMember()를 호출하며 1.에서 획득한 id를 전달한다.
    Reviews.quitReviews(id, function (err, keyValue, memFlag, picFlag) {


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
                message = id + ' 번 리뷰가 삭제되었습니다. ' ;


                res.json({
                    result: {
                        message: message
                    }
                });
            }


        });

    });
});


router.get('/', isSecure, function (req, res, next) {

    var page = parseInt(req.query.page);
    var rows = parseInt(req.query.rows);


    Reviews.listReviews(page, rows, function (err, reviews) {

        if (err)
            return next(err);

        if(reviews === null) {
            err = new Error('리뷰가 없습니다');
            err.status = 404;
            return next(err);
        }

        if (reviews.length === 0) {
            err = new Error('Not Found');
            err.status = 404;
            return next(err);

        } else {
            res.json({
                result: {
                    message: '리뷰 목록을 조회하였습니다.',
                    data: {
                        reviews: reviews
                    }
                }
            });
        }
    });
}); //리뷰 리스트


/////////////////////////////댓글///////////////////////////////


router.get('/:rid/previews', isSecure, function (req, res, next) {
    var rid = req.params.rid
    var page = parseInt(req.query.page);
    var rows = parseInt(req.query.rows);


    Previews.listPreviews(rid, page, rows, function (err, previews) {

        if (err)
            return next(err);

        if (previews.length === 0) {
            err = new Error('Not Found');
            err.status = 404;
            return next(err);
        } else {
            res.json({
                result: {
                    message: '댓글 목록을 조회하였습니다.',
                    data: {
                        previews
                    }
                }
            });
        }
    });
}); // 댓글 리스트

router.post('/:rid/previews', isSecure, function (req, res, next) {
    var rid = req.params.rid
    var content = req.body.content;

    if(!content) {
        var err = new Error('댓글 내용을 입력 하세요');
        return next(err);
    }

    Previews.createPreviews({
        rid: rid,
        content: content

    }, function (err, previews) {


        if (err) {
            err = Error('댓글 등록에 실패 했습니다');
            return next(err);
        }

        res.json({
            result: {
                message: '댓글 등록에 성공 했습니다.',
                data: {
                    reviews_num: previews.rid,
                    previews_num : previews.pid,
                    content: previews.content
                }
            }
        });
    });
});

router.put('/previews/:pid', function (req, res, next) {


    var pid = req.params.pid;
    var content = req.body.content;



    // 3 매개변수의 값들로 객체를 구성해 updateMember를 호출할 때 전달한다.
    Previews.updatePreviews({
        pid: pid,
        content: content
    }, function (err, previews) {
        // 4 에러가 발생할 경우 next 콜백에 err객체를 전달한다.
        if (err)
            return next(err);
        // 5 reviews 객체가 존재하지 않을 경우 not found 에러를 처리한다.
        if (!previews) {
            err = new Error('존재 하지 않는 댓글 입니다');
            err.status = 404;
            return next(err);
        }

            res.json({
                result: {
                    message: '댓글 수정에 성공 했습니다',
                    preivew_pum: pid,
                    content: content
                }
            })
        });

    });

router.delete('/previews/:pid', isSecure, function (req, res, next) {
    // 1. 클라이언트로부터 전달된 매개변수의 값들을 획득한다.
    var pid = req.params.pid;

    // 2. Member 모델 객체의 삭제 함수 quitMember()를 호출하며 1.에서 획득한 id를 전달한다.
    Previews.quitPreviews(pid, function (err, result) {



        // 3. 삭제 함수 quitMember()에서 에러가 있을 경우,
        if (err)
            return next(err);


        res.json({
            result: {
                message: '댓글 삭제에 성공 했습니다'
            }
        });


    });
})



//////////////////////////////////////리뷰 입력 할 때 게임 별점 주기////////////////

router.put('/:rid/like', function (req, res, next) {


    var rid = req.params.rid;
    var like = req.body.like;


    // 3 매개변수의 값들로 객체를 구성해 updateMember를 호출할 때 전달한다.
    Star.updateStar({
        rid: rid,
        like: like
    }, function (err, like) {
        // 4 에러가 발생할 경우 next 콜백에 err객체를 전달한다.
        if (err)
            return next(err);
        // 5 reviews 객체가 존재하지 않을 경우 not found 에러를 처리한다.
        // if (!game) {
        //     err = new Error('존재 하지 않는 댓글 입니다');
        //     err.status = 404;
        //     return next(err);
        // }

        res.json({
            result: {
                message: '별점 주기에 성공 했습니다'
            }
        })
    });

});


module.exports = router;