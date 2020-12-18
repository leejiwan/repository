var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; //require 결과는 객체
var FacebookStrategy = require('passport-facebook').Strategy;
var Member = require('../models/member'); //models 폴더는 db와 연동할 때, 테이블과 매핑할 파일 위치
var facebookConfig = require('../config/facebook');
var logger = require('../common/logger');
var FacebookTokenStrategy = require('passport-facebook-token');
//안주면 이미 해놓은 wb용 token 으로 하면됨
var facebookConfig = require('../config/facebook'); //facebookappid , appsecretkey token 안드로이드 개발자에게 요구.
var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var sesConfig = require('../config/aws_ses');
var generatorPassword = require('password-generator');


//정책 설정 passport 프레임워크에 Localstrategy 장착
passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'},
    function (username, password, done) { //new LocalStrategy의 두번째 인자는 콜백함수 (username과 password가 맞는지 확인)
        Member.findByUsername(username, function (err, user) { //여기로 전송받았던 username이 전달됨
            if (err) {
                return done(err); //에러
            }
            if (!user) {
                return done(null, false);//에러는 아니지만 user가 없다
            }
            Member.verifyPassword(password, user, function (err, result) {
                if (err) {
                    return done(err);
                }
                if (!result) {
                    return done(null, false); //인증실패
                }
                delete user.password; //암호화된 패스워드이긴 하지만 메모리 상에 올라가있기 때문에 삭제
                done(null, user); //result 결과가 true이면 세션테이블에 user를 넘겨줌
            })
        });
    }));


//facebook-passport
router.get('/facebook', passport.authenticate('facebook', {scope: ['email']}));
router.get('/facebook/callback', passport.authenticate('facebook'), function (req, res, next) {
    res.send({message: 'facebook callback'});
});

// passport strategy 등록 함수
passport.use(new FacebookStrategy({
    clientID: facebookConfig.appId, //ID 대문자로 쓰긴함.
    clientSecret: facebookConfig.appSecretCode,
    callbackURL: 'https://localhost/auth/facebook/callback' //web browser 일 때만 필요함. client 가 android app 일 때는 필요없다. 지울예정 !! 그렇지만 access_token 만 받아오면됨.!!!!!!!!!!!!!!
}, function (accessToken, refreshToken, profile, done) {
    logger.log('debug', 'facebook token: %s(length: %d)', accessToken, accessToken.length);
    //profile 객체 넘기지 않고 {facebookId : profile.id) parameter object 보내쓰는게 낫다. 순서 기억안해도 됨.
    //유사어 : dto data transfer object
    profile.accessToken = accessToken;
    Member.findOrCreate(profile, function (err, member) { //profile 의 여러 정보 꺼내서 db insert task
        if (err) {
            err = new Error('findOrCreate 실행 중 err 발생');
            done(err);
        } else {
            done(null, member);
            res.send('member의 facebookid 가 정상적으로 등록되었습니다' + member.facebookid);
        }
    });
}))


//객체 저장(id만 세션테이블에 저장) -> serialize는 user안에 들어있는 id를 꺼내다가 세션테이블에 id 저장
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

//객체 복원 -> 유저가 필요할 경우 세션에서 id 꺼내 db에서 복원
passport.deserializeUser(function (id, done) {  //function의 id는 세션id
    Member.findMember(id, function (err, user) {
        if (err) {
            return done(err)
        }
        done(null, user);
    });
});

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user) { // 첫번째 인자로 strategy 명, 두번째로 콜백 전달
        if (err) {
            return next(err);
        }
        if (!user) { //user는 false나 user객체를 담고있고 username이 없을 경우 또는 패스워드가 틀리면 401로 처리
            return res.status(401).send({
                message: 'Login failed!!!'
            });
        }
        req.login(user, function (err) { //passport와 연동되면 express가 req에 login function추가
            if (err) {                    //login함수 호출하면 user가 생긴다. (user객체(db에서 데이터를 셀렉해서 가져온))
                return next(err);           //passport는 미리 인증에 성공이 됬으면 인증성공한 유저의 정보를 메모리 상에 가지고 있는다.
            }                             //req와 연결해주는 것은 req.login
            next();                       //로그인이 성공했다는 것은 request객체에 유저정보가 존재한다는 것
        });
    })(req, res, next);
}, function (req, res, next) {
    var user = {};
    user.email = req.user.email;
    user.password = req.user.password;
    res.send({
        message: 'local login',
        user: user
    });
});

router.post('/local/initpass', function (req, res, next) {
    var id = req.body.mid;
    //TODO 1 : id 에 해당하는 email 조회
    //dbpool getconnection?
    Member.findMember(id, function (err, member) {
        if (err)
            return next(err);

        //TODO 2 : 임시 비밀 번호를 생성하고, id를 이용해서 password 변경한다.
        var tempPass = generatorPassword(6, false);
        member.password = tempPass;
        Member.updateMember(member, function (err, result) {
            if (err)
                return next(err);
            //TODO 3 : 2의 콜백에서 임시비밀번호를 기록한 메일을 전송합니다.
            var transporter = nodemailer.createTransport(sesTransport(({
                "accessKeyId": sesConfig.accessKeyId,
                "secretAccessKey": sesConfig.secretAccessKey,
                "region": sesConfig.region
            })));
            var data = {
                "from": "egg01031215205@gmail.com",
                "to": ["skdidimdol3@gmail.com"],
                "subject": "임시비밀번호발행",
                "text": "임시번호는 " + tempPass + '입니다'
            }
            transporter.sendMail(data, function(err, info){
                if(err) {
                    next(err);
                }
                res.json(info);
            });
        });
    });
})

/*
 authenticate함수의 첫번째 인자로는 strategy 네임, 두번째 인자로는 callback 함수를 전달 (local-strategy가 수행이 됬을 때)
 authenticate함수가 호출이 되면 클로저를 반환하고 그 클로저는 미들웨어
 그래서 그 다음 구조가 req,res,next를 받을 수 있는 구조
 autheticate가 실행되고 그 다음 next가 실행됨 (next 작업이 일어났다는 것은 로그인이 되었다는 것을 의미함
 next가 되지 않았다면
 local strategy에서 user가 넘어오면)
 전체적인 구조는 2개의 미들웨어로 되어있음
 첫번째 미들웨어는 passport.authenticate함수를 커스터마이징
 두번째 미들웨어는 통과한 결과를 가지고 json 응답 처리

 authenticate함수는
 인증받은 user객체 or err, false를 반환
 */

// request객체에 있는 user정보를 참고해서 세션테이블에 해당 user정보를 없애는 것이 logout
router.get('/logout', function (req, res, next) {
    req.logout();
    res.send({message: 'local logout'});
});


module.exports = router; //라우터도 미들웨어이다.