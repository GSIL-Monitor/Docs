'use strict';

const path = require('path');
const fs = require('fs-extra');
const execa = require('execa');
const Promise = require('bluebird');

Promise.promisifyAll(fs);

console.log('shrinkwraping...');

// 删除 from, resolved 字段
function pruneFields(json) {
    const fields = ['from', 'resolved'];

    Object.keys(json).forEach((key) => {
        const val = json[key];

        if (typeof val === 'object') {
            return pruneFields(val);
        }

        if (fields.indexOf(key) > -1 && typeof val === 'string') {
            delete json[key];
        }
    });

    return json;
}

const shrinkJsonPath = path.join(__dirname, '../npm-shrinkwrap.json');

execa('npm', ['shrinkwrap', '--dev'])
    .then((ret) => {
        console.log(ret.stdout);

        return fs.readJsonAsync(shrinkJsonPath).then((json) => {
            const data = pruneFields(json);
            return fs.writeJsonAsync(shrinkJsonPath, data);
        });
    })
    .then(Promise.coroutine(function*() {
        console.log('pruned npm-shrinkwrap.json');

        // 提交 git
        yield execa.shell('git add -A .');
        yield execa.shell('git diff --quiet --exit-code --cached').catch(() => {
            return execa.shell('git commit -a -m "chore(shrinkwrap): update npm-shrinkwrap.json"');
        }).then((ret) => {
            console.log(ret.stdout);
        });
    }))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
