//dbpool.js는 models 밑 혹은 common 밑에 들어가도 된다.
var mysql = require('mysql');
var dbPoolConfig = require('../config/localdb');
var dbPoolConfig_gameView = require('../config/aws_rds');
var logger = require('./logger');

var dbPool = mysql.createPool(dbPoolConfig); // 5개 짜리 풀(디비 공유)이 만들어짐
var dbPool_gameView = mysql.createPool(dbPoolConfig_gameView);
module.exports.dbPool = dbPool;//풀 노출
module.exports.dbPool_gameView = dbPool_gameView;//풀 노출


dbPool_gameView.on('release', function (conn) {
   logger.log('debug', 'connection#' + conn.threadId + 'is released!');
   logger.log('debug', 'pool_all' + dbPool._allConnections.length);
   logger.log('debug', 'pool_all' + dbPool._acquiringConnections.length);
   logger.log('debug', 'pool_all' + dbPool._freeConnections.length);

});