module.exports = {
    plugins: {
        'autoprefixer': {
            browsers: ['Android >= 4.0', 'iOS >= 7'],
            overrideBrowserslist: [
                "Android 4.1",
                "iOS 7.1",
                "Chrome > 31",
                "ff > 31",
                "ie >= 8"
                //'last 10 versions', // 所有主流浏览器最近10版本用
            ],
            grid: true
        },
        'postcss-pxtorem': {
            rootValue: 37.5, //vant-UI的官方根字体大小是37.5
            propList: ['*']
        }
    }
}