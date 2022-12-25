const port = process.env.PORT || 3000;
module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
    },
    devServer: {
        host: 'localhost',
        port: port,
        open: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html',
        })
    ],
    module: {
        rules: [
            {
                test: /\.jsx?/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            }
        ]
    }
};

/*
mode
development/production 모드를 설정할 수 있다.
entry (입력)
entry는 변환할 대상을 지정하는 것으로 시작점인 src/index.js로 설정하자
output (출력)
output은 변환된 결과물의 파일 이름을 설정해 주면 된다.
path도 설정해 줄 수 있지만 default는 dist 디렉터리이다.
*/