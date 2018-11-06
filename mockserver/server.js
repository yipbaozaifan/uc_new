/*为app添加中间件处理跨域请求*/
const express = require('express');
const route = require('./router/router.js');

const app = express();
const port = 3000;
app.use(route);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.listen(port, function(){
	console.log('listening on port %d ', port);
});