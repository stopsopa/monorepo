

const fs        = require('fs');

const path      = require('path');

const yaml      = require('js-yaml');

const log = console.log;

function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
}

// await wait(1000);

if ( typeof process.argv[2] !== 'string' ) {

    process.stdout.write(`
Specify config file.yml like
    
    node ${__filename} config.yml

`);

    process.exit(1);
}

const file = path.resolve(process.argv[2]);

if ( ! fs.existsSync(file) ) {

    process.stdout.write(`
    Config file '${file}' doesn't exist.

`);

    process.exit(1);
}

try {
    fs.accessSync(file, fs.constants.R_OK);
}
catch (e) {

    process.stdout.write(`
    Config file '${file}' is not readable.

`);

    process.exit(1);
}

let cfg;

try {

    cfg = yaml.safeLoad(fs.readFileSync(file, 'utf8'));

} catch (e) {

    process.stdout.write(`
    Config file '${file}' yaml parse error: 
    
${String(e)}    

`);

    process.exit(1);
}

if ( ! isObject(cfg) ) {

    throw new Error(`cfg is not an object`);
}

if ( ! isObject(cfg.preventmergeto_local) ) {

    throw new Error(`cfg.preventmergeto_local is not an object`);
}

if (typeof process.argv[3] === 'undefined') {

    throw new Error(`branch arg (second cli argument) is not specified`);
}

const to = process.argv[3];

if ( ! to.trim()) {

    throw new Error(`branch arg (second cli argument) process.argv[3] is an empty string`);
}

if (typeof process.argv[4] === 'undefined') {

    throw new Error(`target branch arg (third cli argument) is not specified`);
}

const source = process.argv[4];

if ( ! source.trim()) {

    throw new Error(`target branch arg (third cli argument) process.argv[4] is an empty string`);
}

if ( ! cfg.preventmergeto_local[to] ) {

    process.stdout.write(`not listed... allow`);

    process.exit(0);
}

if ( ! Array.isArray(cfg.preventmergeto_local[to]) ) {

    throw new Error(`cfg.preventmergeto_local.${to} is not array`);
}

const blocked = cfg.preventmergeto_local[to].includes(source);

process.stdout.write('preventmergeto_local ');

process.stdout.write(blocked ? 'deny' : 'allow');

process.exit(blocked ? 1 : 0);



