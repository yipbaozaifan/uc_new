// 配置前端路由
const config = require('../utils/config'); 
const express = require('express');
const router = express.Router();
const utils = require('../utils/utils');

for (let i = 0; i < config.apis.length; i++) {
    router.use(config.apis[i].url, (req, res) => {
        utils.readJSONData('../mock/', `${config.apis[i].name}.json`).then((data) => {
            res.json(data);
        }, (err) => {
            console.log(err);
        });
    });
}

module.exports = router;

