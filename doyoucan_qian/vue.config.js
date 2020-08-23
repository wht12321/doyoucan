module.exports = {
    devServer: {
        // 设置代理
        proxy: {
            "/api": {
                target: "http://www.doyoucan.com:3000", // 访问数据的计算机域名
                // target: "http://127.0.0.1:3000", // 访问数据的计算机域名
                ws: true, // 是否启用websockets
                changOrigin: true, //开启代理
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
};