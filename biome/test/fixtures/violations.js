// Intentional violations of the base configuration. DO NOT FIX.
// Used by test/smoke.test.mjs to prove enabled rules actually fire.

var config = {
    debug: true,
};

const timeout = 5000;

function log(message) {
    console.log(message);
}

function noop() {}

let value = timeout;
{
    let value = 0;
    log(value);
}

log(config.debug == 1 ? 'yes' : config.debug ? 'maybe' : 'no');

if (timeout == 5000) {
    alert('got it');
}

const parsed = parseInt('7');

const masked = timeout | 0;

['a'].forEach((entry) => log(entry));

function legacy() {
    return arguments.length;
}

for (const key in config) {
    log(key);
}

const template = '${notARealReference}';

function evaluateExpression() {
    return eval('2 + 2');
}

const handler = function () {};

handler();
noop();
legacy();
log(parsed);
log(masked);
log(template);
log(evaluateExpression());
log(config);

export default config;
