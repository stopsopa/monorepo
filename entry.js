
const fs = require('fs');

const path = require('path');

const React = require('react');

const isObject = require('nlab/isObject');

const isArray = require('nlab/isArray');

const {Component} = React;

const {render, Color, Box} = require('ink');

const log = require('inspc');

const { wait } = require('nlab/delay');

const yaml = require('js-yaml');

const readline = require('readline');

const validator = require('@stopsopa/validator');

const template = require('lodash/template');

const {
    Required,
    Optional,
    Collection,
    All,
    Blank,
    Callback,
    Choice,
    Count,
    Email,
    IsFalse,
    IsNull,
    IsTrue,
    Length,
    NotBlank,
    NotNull,
    Regex,
    Type,
} = validator;


const tmp = (function () {

    function up(s) {
        return s.replace(/\$/g, '<[]>');
    }

    function down(s) {
        return s.replace(/<\[\]>/g, '$');
    }

    return function (tmpfile, params) {

        let tmp;
        try {

            tmp = path.resolve(__dirname, tmpfile);

            if ( ! fs.existsSync(tmp)) {

                throw `file '${tmp}' doesn't exist`;
            }

            try {

                fs.accessSync(tmp, fs.constants.R_OK);
            }
            catch (e) {

                throw `file '${tmp}' is not readdable`;
            }

            tmp = fs.readFileSync(tmp).toString();

            tmp = up(tmp);

            const t = template(tmp, { 'variable': 'data' });

            if (params) {

                return down(t(params));
            }

            return params => down(t(params));
        }
        catch (e) {

            log.dump({
                error: 'lodash template',
                e,
                tmp,
            }, 5)
        }
    };
})();

const maintmp = tmp('templates/template.sh');

// Array [
//     <0> [String]: >node< len: 19
//     <1> [String]: >/Users/sd/Workspace/projects/z_roderic_new/roderic-project/.git/merge.js< len: 72
//       removed:  <2> [String]: >merge-with-diff | merge-no-diff< len: ???
//     <2> [String]: >config.yml< len: 10
//     <3> [String]: >test.sh< len: 7
// ]
// log.dump(process.argv);

// if ( typeof process.argv[2] !== 'string' ) {
//
//     process.stdout.write(`
//     target directory not specified in script arguemnts
//
//     run:
//         node merge.js merge-with-diff|merge-no-diff config.yml test.sh
//
// `);
//
//     process.exit(1);
// }
//
// if ( ! /^(merge-with-diff|merge-no-diff)$/.test(process.argv[2]) ) {
//
//     process.stdout.write(`
//     first argument should be >merge-with-diff< or >merge-no-diff<
//     it is now "${process.argv[2]}"
//
//     run:
//         node merge.js merge-with-diff|merge-no-diff config.yml test.sh
//
// `);
//
//     process.exit(1);
// }

// const mode = process.argv[2];

if ( typeof process.argv[3] !== 'string' ) {

    process.stdout.write(`
    target directory not specified in script arguemnts
    
    run: 
        node merge.js config.yml test.sh

`);

    process.exit(1);
}

const target = path.resolve(__dirname, process.argv[3]);

const dirname = path.dirname(target);

try {

    fs.accessSync(dirname, fs.constants.W_OK);
}
catch (e) {

    process.stdout.write(`
    Target directory '${dirname}' is not writable.

`);

    process.exit(1);
}

if (fs.existsSync(target)) {

    try {
        fs.accessSync(target, fs.constants.W_OK);
    }
    catch (e) {

        process.stdout.write(`
    Target file '${target}' is not writable.

`);

        process.exit(1);
    }
}

let getConfig = async function () {

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

    // await wait(1000);

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

    function level(cc) {

        const ll = {};

        let c;

        for (let i = 0, lll = cc.length ; i < lll ; i += 1 ) {

            c = cc[i];

            const l = {
                type: new Required(new Choice(['merge', 'pullpush', 'template'])),
                default: new Choice(['on', 'off']),
            };

            if (c) {

                if (c.type === 'merge' || c.type === 'pullpush') {

                    l.remotebranch = new Required([
                        new Type('str'),
                        new NotBlank(),
                    ]);
                    l.localbranch = new Required([
                        new Type('str'),
                        new NotBlank(),
                    ]);
                }

                if (c.type === 'template') {
    // type: template
    // message: Release to heroku
    // template: master
    // default: on

                    l.message = new Required([
                        new Type('str'),
                        new NotBlank(),
                    ]);
                    l.template = new Callback(
                        (value, context, p, extra) =>
                            new Promise((resolve, reject) => {
                                setTimeout(() => {

                                    if ( typeof value !== 'string' ) {

                                        context
                                            .buildViolation(`Parameter 'template' is not a string`)
                                            .atPath(p)
                                            .setCode("CALLBACK_1")
                                            .setInvalidValue(value)
                                            .addViolation()
                                        ;

                                        return reject('not string');
                                    }

                                    if ( ! value ) {

                                        context
                                            .buildViolation(`Parameter 'template' an empty string`)
                                            .atPath(p)
                                            .setCode("CALLBACK_2")
                                            .setInvalidValue(value)
                                            .addViolation()
                                        ;

                                        return reject('empty string');
                                    }

                                    const file = path.resolve(__dirname, value);

                                    if ( ! fs.existsSync(file) ) {

                                        context
                                            .buildViolation(`File specified in 'template' parameter doesn't exist, file: {{ file }}, value: '{{ value }}'`)
                                            .atPath(p)
                                            .setParameter('{{ file }}', file)
                                            .setParameter('{{ value }}', value)
                                            .setCode("CALLBACK_3")
                                            .setInvalidValue(value)
                                            .addViolation()
                                        ;

                                        return reject(`file doesn't exist`);
                                    }

                                    try {

                                        fs.accessSync(file, fs.constants.R_OK);
                                    }
                                    catch (e) {

                                        context
                                            .buildViolation(`File specified in 'template' parameter is not readable, file: {{ file }}'`)
                                            .atPath(p)
                                            .setParameter('{{ file }}', file)
                                            .setCode("CALLBACK_4")
                                            .setInvalidValue(value)
                                            .addViolation()
                                        ;

                                        return reject(`file is not readable`);
                                    }

                                    resolve('resolve Callback_template');

                                }, 50)
                            })
                    );

                }

                if (c.type === 'merge') {
    // type: merge
    // remotebranch: master
    // to: master
    // default: on

                }

                if (c.type === 'pullpush') {

    // type: pullpush
    // remotebranch: master
    // remote: origin
    // to: master
    // default: on

                    l.remote = new Required([
                        new Type('str'),
                        new NotBlank(),
                    ]);

                }

                if (c.merge) {

                    l.merge = level(c.merge);
                }
            }

            ll[i] = new Collection({
                fields: l,
                allowExtraFields: true,
            });
        }

        return new Collection({
            fields: ll,
            allowExtraFields: true,
        });
    }

    const errors = await validator(cfg, new Collection({
        fields: {
            merge: level(cfg.merge),
        },
        allowExtraFields: true,
    }));

    if ( errors.count() ) {

        process.stdout.write(`
    Config file '${file}' validation error: 
    
${JSON.stringify(errors.getTree(), null, 4)}    

`);

        process.exit(1);
    }

    return cfg;
};

let result,
    unmount = () => {
        log('Race condition error');
    }
;

const cc = {
    on: '◉',
    off: '◯',
    c: '❯',
    nodiff: '✘',
}

class Counter extends Component {
    constructor(...args) {
        super(...args);

        this.state = {
            list: this.props.list,
            c: 0,
        };
    }

    line = (l, key) => {

        const {
            c,
        } = this.state;

        const spaces = '  '.repeat(l.l);

        let cont;
        switch (l.type) {
            case `template`:
                cont = (<>  <Color green>{l.message}</Color></>);
                break;
            case `merge`:
                cont = (<><Color red>{l.nodiff ? cc.nodiff : ' '}</Color> <Color green>merge</Color>: local:<Color yellow>{l.localbranch}</Color> {`<`}-- local:<Color magenta>{l.remotebranch}</Color></>);
                break;
            case `pullpush`:
                cont = (<>  <Color green>pullpush</Color>: local:<Color yellow>{l.localbranch}</Color> {`<`}-{`>`} <Color cyan>{l.remote}</Color>:<Color magenta>{l.remotebranch}</Color></>);
                break;
        }

        // pullpush
        return (
            <Box key={key}>
                <Color green>{spaces}{(c === key) ? cc.c : ' '} {cc[l.default]}</Color> {cont}
            </Box>
        )
    }

    render() {

        const {
            list,
            c,
        } = this.state;

        return (
            <>
                {list.map((l, i) => this.line(l, i))}
                <Box>{` `}</Box>
                <Box><Color yellow>  Ctr+c or Escape                        exit</Color></Box>
                <Box><Color yellow>  [← off] [→ on] ↑ ↓ [space - toggle]    control, change options</Color></Box>
                <Box><Color yellow>  [- off all] [= on all]                 </Color></Box>
                <Box><Color yellow>  home, end                              jump to star/end of the list</Color></Box>
                <Box><Color yellow>  x                                      toggle merging with no changes. red 'x' means merge will be performed to bring no changes</Color></Box>
                <Box><Color yellow>  Enter                                  just generate bash script</Color></Box>
                <Box><Color yellow>  e                                      generate and EXECUTE</Color></Box>
            </>
        );
    }
    componentDidMount() {

        const l = this.state.list.length - 1;

        readline.emitKeypressEvents(process.stdin);

        process.stdin.setRawMode(true);

        process.stdin.on('keypress', (str, key) => {

            const {
                c,
                list,
            } = this.state;

            // log.dump(key);
            // Object {
            //     <sequence> [String]: >< len: 1
            //     <name> [String]: >c< len: 1
            //     <ctrl> [Boolean]: >true<
            //     <meta> [Boolean]: >false<
            //     <shift> [Boolean]: >false<
            // }

            if ( (key.ctrl && key.name === 'c') || key.name === 'escape' ) {

                process.exit(1);
            }

            if (key.name === 'e') {

                result = this.state;

                result.execute = true;

                unmount();

                return process.stdin.pause();
            }

            if (key.name === 'return') {

                result = this.state;

                unmount();

                return process.stdin.pause();
            }

            if (key.name === 'up') {

                return this.setState({
                    c: ( (c - 1) < 0) ? 0 : c - 1,
                });
            }

            if (key.name === 'down') {

                return this.setState({
                    c: ( (c + 1) > l) ? l : c + 1,
                });
            }

            if (key.name === 'home') {

                return this.setState({
                    c: 0,
                });
            }

            if (key.name === 'end') {

                return this.setState({
                    c: l,
                });
            }

            if (key.name === 'right' || key.name === 'left') {

                return this.setState({
                    list: list.map((l, i) => {
                        if (i === c) {

                            l.default = (key.name == 'right') ? 'on' : 'off';
                        }
                        return l;
                    }),
                });
            }

            if (key.sequence === '=' || key.sequence === '-') {

                return this.setState({
                    list: list.map((l, i) => {
                        l.default = (key.sequence === '=') ? 'on' : 'off';
                        return l;
                    }),
                });
            }

            if (key.name === 'x') {

                return this.setState({
                    list: list.map((l, i) => {
                        if (i === c) {

                            l.nodiff = !l.nodiff;
                        }
                        return l;
                    }),
                });
            }

            // 'space' and any other keys
            return this.setState({
                list: list.map((l, i) => {
                    if (i === c) {

                        l.default = (l.default === 'on') ? 'off' : 'on';
                    }
                    return l;
                }),
            });
        });
    }
}


const prepare = (function () {

    function level(source, target, ll = 0) {

        for (let i = 0, l = source.length ; i < l ; i += 1 ) {

            const {merge, ...rest} = source[i];

            rest.l = ll;

            rest.nodiff = false;

            target.push(rest);

            if (Array.isArray(merge)) {

                level(merge, target, ll + 1);
            }
        }
    }

    return function (cfg) {

        const list = [];

        level(cfg.merge, list);

        return list;
    };
}());

(async function () {

    const cfg = await getConfig();

    const list = prepare(cfg);

    const r = render(<Counter list={list} />);

    unmount = r.unmount;

    const {
        waitUntilExit,
    } = r;

    await waitUntilExit();

    const filtered = result.list.filter(l => l.default === 'on');

    if (filtered.length === 0) {

        process.stdout.write(`
Nothing selected...
`);

        process.exit(1);
    }

    const raw = maintmp({
        list: filtered.map(l => {

            if (l.type === 'template') {

                l.template = tmp(l.template, l);
            }

            return l;
        }),
        // mode,
    });

    fs.writeFileSync(target, raw);

    if (result.execute) {

        process.stdout.write(`
    Executing '${target}' ...
    
`);

        process.exit(10);
    }
    else {

        process.stdout.write(`
    File '${target}' generated...
    
    To run execute: 
    
        /bin/bash ${process.argv[3]}
    
`);

    }
}());


