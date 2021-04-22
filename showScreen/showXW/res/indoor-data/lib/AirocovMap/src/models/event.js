/**
 * 全局自定义事件管理
 * @type {{on, emit, off}}
 */
let cache = {};

const event = {
    on(key, fn) {
        if (!cache[key]) {
            cache[key] = [];
        }
        cache[key].push(fn);

    },
    emit(...args) {
        var key = Array.prototype.shift.call(args),
            fns = cache[key];
        if (!fns || fns.length === 0) {
            return false;
        }
        for (var i = 0, fn; fn = fns[i++];) {
            fn.apply(this, args);
        }
    },
    off(key, fn) {
        var fns = cache[key];
        if (!fns) {
            return false;
        }
        if (!fn) {
            fns && (fns.length == 0);
        } else {
            for (var l = fns.length - 1; l >= 0; l--) {
                var _fn = fns[l];
                if (_fn === fn) {
                    fns.splice(l, 1);
                }
            }
        }
    },
    clear(){
        cache = {};
    }

};


// export default event;
module.exports = event;