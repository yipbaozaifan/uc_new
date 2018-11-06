const fs = require('fs');
const path = require("path");
const Mock = require('mockjs'); // 引入mock模块 通过mock模拟数据

const readJSONData = (uri, name) => {
    const filePromise = new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, `${uri}${name}`), 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(Mock.mock(JSON.parse(data)));
            }
        });
    });
    return filePromise;
}

module.exports = {
    readJSONData: readJSONData,
};

