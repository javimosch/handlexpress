var watch = require('watch');
var gwatch = require('gulp-watch');
var readDirFiles = require('read-dir-files');
var fs = require('fs');
var mkdirp = require('mkdirp');
var Handlebars = require('handlebars');

module.exports = {
    watch: watchHelper,
    normalizeFilesTreePreservePath: normalizeFilesTreePreservePath,
    getPaths: getPaths,
    normalizeFilesTree: normalizeFilesTree,
    filesIncludeOnly: filesIncludeOnly,
    cbHell: cbHell,
    copyFilesFromTo: copyFilesFromTo
}

function copyFilesFromTo(FROM_PATH, DEST, opt) {
    var hasErrors = false;
    var rta = new Promise((resolve, error) => {
        opt = opt || {
            formatContentHandler: undefined,
            formatPathHandler: undefined
        }
        var files = normalizeFilesTreePreservePath(readDirFiles.readSync(FROM_PATH));
        //console.log('debug-files-to-copy',Object.keys(files));
        var folders = getPaths(files);
        folders = folders.map(v => DEST + '/' + v);
        //console.log('debug-folders-to-create',folders);
        var _wait = cbHell(folders.length, function() {
            var path, rawContent, compiledContent;
            Object.keys(files).forEach(k => {
                path = k;
                rawContent = files[k];
                if (opt.formatPathHandler) {
                    path = opt.formatPathHandler(path);
                }

                if (opt.formatContentHandler) {
                    try {
                        compiledContent = opt.formatContentHandler(rawContent, path);
                    } catch (e) {
                        console.log('debug-compilation-has-errors',e);
                        hasErrors = true;
                    }
                } else {
                    compiledContent = rawContent;
                }

                fs.writeFileSync(DEST + '/' + path, compiledContent);
                console.log('Generating file ' + DEST + '/' + path);
            });
            resolve({
                ok:!hasErrors
            });
        });
        mkdirp(DEST, () => {
            folders.forEach(folderPath => {
                console.log('Generating folder ', folderPath);
                mkdirp(folderPath, _wait.add);
            });
            if (folders.length == 0) _wait.call();
        });
    });
    return rta;
}

//waits to success N basic async operations to procced.
function cbHell(quantity, cb) {
    //if(quantity==0) cb();
    return {
        call: () => cb(),
        add: () => {
            quantity--;
            if (quantity === 0) cb();
        }
    }
}

function filesIncludeOnly(filesObj, exts) {
    var rta = {},
        v, split;
    Object.keys(filesObj).forEach(k => {
        v = filesObj[k];
        split = k.split('.');
        if (split.length == 1) return;
        if (split.some(ext => ext == split[split.length - 1])) {
            rta[k] = v;
        }
    });
    return rta;
}

function normalizeFilesTree(files, rta) {
    rta = rta || {};
    var v, keys = Object.keys(files);
    keys.forEach(k => {
        v = files[k];
        if (v instanceof Buffer) {
            rta[k] = v.toString();
        } else {
            rta = normalizeFilesTree(v, rta);
        }
    });
    return rta;
}

function getPaths(obj) {
    var rta = [],
        index;
    Object.keys(obj).forEach(n => { //ex: n = aboutus/index.aboutus.html | RTA = aboutus/
        index = n.lastIndexOf('/');
        if (index === -1) return;
        rta.push(n.substring(0, index));
    });
    return rta;
}

function normalizeFilesTreePreservePath(files, rta, path) {
    //console.log('normalizeFilesTreePreservePath',path);
    rta = rta || {};
    var v, keys = Object.keys(files);
    keys.forEach(k => {
        v = files[k];
        if (v instanceof Buffer) {
            rta[(path || '') + k] = v.toString();
        } else {
            rta = normalizeFilesTreePreservePath(v, rta, (path || '') + k + '/');
        }
    });
    return rta;
}


function watchHelper(PATH, CB) {
    if(typeof PATH !== 'string'){
        return gwatch(PATH,CB);
    }
    watch.watchTree(PATH, function(f, curr, prev) {
        var k = f;
        if (typeof f == "object" && prev === null && curr === null) {
            CB();
        } else if (prev === null) { // f is a new file
            CB();
        } else if (curr.nlink === 0) { // f was removed
            CB();
        } else { // f was changed
            CB();
            //console.log('changed', k);
        }
    });
}
