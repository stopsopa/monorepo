

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
    
${e + ''}    

`);

    process.exit(1);
}

if ( ! isObject(cfg) ) {

    throw new Error(`cfg is not an object`);
}

if ( ! isObject(cfg.pushallow) && ! isObject(cfg.pushblock) ) {

    throw new Error(`cfg.pushallow nor cfg.pushblock is not an object`);
}

if (typeof process.argv[3] === 'undefined') {

    throw new Error(`branch arg (second cli argument) is not specified`);
}

const from = process.argv[3];

if ( ! from.trim()) {

    throw new Error(`branch arg (second cli argument) process.argv[3] is an empty string`);
}

if (typeof process.argv[4] === 'undefined') {

    throw new Error(`target branch arg (third cli argument) is not specified`);
}

const remote = process.argv[4];

// console.log(JSON.stringify({
//     from,
//     remote,
//     cfg,
//     // 'cfg.pushallow[]': cfg.pushallow[from],
//     // 'cfg.pushblock[]': cfg.pushblock[from],
//     '!!cfg.pushallow': !!cfg.pushallow,
//     // 'Array.isArray(cfg.pushallow[from])': Array.isArray(cfg.pushallow[from]),
//     '!!cfg.pushblock': !!cfg.pushblock,
//     // 'Array.isArray(cfg.pushblock[from])': Array.isArray(cfg.pushblock[from]),
//
// }, null, 4))

if ( ! remote.trim()) {

    throw new Error(`target branch arg (third cli argument) process.argv[4] is an empty string`);
}

console.log('')
console.log('')

if ( cfg.pushallow && Array.isArray(cfg.pushallow[from]) ) {

    console.log('pushallow: [' + cfg.pushallow[from].join(',') + ']')

    const blocked = cfg.pushallow[from].includes(remote) ? false : true;

    process.stdout.write(blocked ? 'pushallow deny' : 'pushallow allow');

    process.exit(blocked ? 1 : 0);
}

if ( cfg.pushblock && Array.isArray(cfg.pushblock[from]) ) {

    console.log('pushblock: [' + cfg.pushblock[from].join(',') + ']')

    const blocked = cfg.pushblock[from].includes(remote) ? true : false;

    process.stdout.write(blocked ? 'pushblock deny' : 'pushblock allow');

    process.exit(blocked ? 1 : 0);
}

process.stdout.write('final allow');

process.exit(0);



