 // var dbPoolConfig_gameView = {
 //     port: process.env.gameView_PORT,
 //     host: process.env.gameView_HOST,
 //     user: process.env.gameView_USER,
 //     password: process.env.gameView_PASSWORD,
 //     database : process.env.gameView_NAME,
 //     connectionLimit: process.env.gameView_CONNECTION_LIMIT,
 //     debug: process.env.gameView_DEBUG
 // };

var dbPoolConfig_gameView = {
     port: '3306',
     host: 'boombuy.clxzveedeth5.ap-northeast-2.rds.amazonaws.com',
     user: 'boombuy',
     password: 'zxasqw12',
     database : 'mysite',
     connectionLimit: '5',
     debug: 'true'
 }


module.exports = dbPoolConfig_gameView;