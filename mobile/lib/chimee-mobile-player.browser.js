
/** ChimeeMobilePlayer
 * chimee-mobile-player v0.0.2
 * (c) 2017 yandeqiang
 * Released under MIT
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ChimeeMobilePlayer = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

var _toObject = function (it) {
  return Object(_defined(it));
};

var hasOwnProperty = {}.hasOwnProperty;
var _has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var SHARED = '__core-js_shared__';
var store = _global[SHARED] || (_global[SHARED] = {});
var _shared = function (key) {
  return store[key] || (store[key] = {});
};

var id = 0;
var px = Math.random();
var _uid = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var shared = _shared('keys');

var _sharedKey = function (key) {
  return shared[key] || (shared[key] = _uid(key));
};

var IE_PROTO = _sharedKey('IE_PROTO');
var ObjectProto = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function (O) {
  O = _toObject(O);
  if (_has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

var _core = createCommonjsModule(function (module) {
var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

var _core_1 = _core.version;

var _aFunction = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

var _ctx = function (fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var _isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function (it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document$1 = _global.document;
// typeof document.createElement is 'object' in old IE
var is = _isObject(document$1) && _isObject(document$1.createElement);
var _domCreate = function (it) {
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
});

var _toPrimitive = function (it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if (_ie8DomDefine) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide = _descriptors ? function (object, key, value) {
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? _ctx(out, _global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) _hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
var _export = $export;

var _objectSap = function (KEY, exec) {
  var fn = (_core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  _export(_export.S + _export.F * _fails(function () { fn(1); }), 'Object', exp);
};

_objectSap('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return _objectGpo(_toObject(it));
  };
});

var getPrototypeOf$1 = _core.Object.getPrototypeOf;

var getPrototypeOf = createCommonjsModule(function (module) {
module.exports = { "default": getPrototypeOf$1, __esModule: true };
});

var _Object$getPrototypeOf = unwrapExports(getPrototypeOf);

var classCallCheck = createCommonjsModule(function (module, exports) {
exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
});

var _classCallCheck = unwrapExports(classCallCheck);

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
var _toInteger = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

var _stringAt = function (TO_STRING) {
  return function (that, pos) {
    var s = String(_defined(that));
    var i = _toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

var _library = true;

var _redefine = _hide;

var _iterators = {};

var toString = {}.toString;

var _cof = function (it) {
  return toString.call(it).slice(8, -1);
};

var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

var _toIobject = function (it) {
  return _iobject(_defined(it));
};

var min = Math.min;
var _toLength = function (it) {
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;
var _toAbsoluteIndex = function (index, length) {
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

var _arrayIncludes = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject($this);
    var length = _toLength(O.length);
    var index = _toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO$2 = _sharedKey('IE_PROTO');

var _objectKeysInternal = function (object, names) {
  var O = _toIobject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO$2) _has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (_has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

var _objectKeys = Object.keys || function keys(O) {
  return _objectKeysInternal(O, _enumBugKeys);
};

var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  _anObject(O);
  var keys = _objectKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
  return O;
};

var document$2 = _global.document;
var _html = document$2 && document$2.documentElement;

var IE_PROTO$1 = _sharedKey('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE$1 = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate('iframe');
  var i = _enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  _html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
  return createDict();
};

var _objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE$1] = _anObject(O);
    result = new Empty();
    Empty[PROTOTYPE$1] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = createDict();
  return Properties === undefined ? result : _objectDps(result, Properties);
};

var _wks = createCommonjsModule(function (module) {
var store = _shared('wks');

var Symbol = _global.Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
};

$exports.store = store;
});

var def = _objectDp.f;

var TAG = _wks('toStringTag');

var _setToStringTag = function (it, tag, stat) {
  if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide(IteratorPrototype, _wks('iterator'), function () { return this; });

var _iterCreate = function (Constructor, NAME, next) {
  Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
  _setToStringTag(Constructor, NAME + ' Iterator');
};

var ITERATOR = _wks('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  _iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = _objectGpo($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      _setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!_library && !_has(IteratorPrototype, ITERATOR)) _hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    _hide(proto, ITERATOR, $default);
  }
  // Plug for library
  _iterators[NAME] = $default;
  _iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) _redefine(proto, key, methods[key]);
    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

var $at = _stringAt(true);

// 21.1.3.27 String.prototype[@@iterator]()
_iterDefine(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

var _iterStep = function (done, value) {
  return { value: value, done: !!done };
};

var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
  this._t = _toIobject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return _iterStep(1);
  }
  if (kind == 'keys') return _iterStep(0, index);
  if (kind == 'values') return _iterStep(0, O[index]);
  return _iterStep(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
_iterators.Arguments = _iterators.Array;

var TO_STRING_TAG = _wks('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = _global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
  _iterators[NAME] = _iterators.Array;
}

var f$1 = _wks;

var _wksExt = {
	f: f$1
};

var iterator$2 = _wksExt.f('iterator');

var iterator = createCommonjsModule(function (module) {
module.exports = { "default": iterator$2, __esModule: true };
});

unwrapExports(iterator);

var _meta = createCommonjsModule(function (module) {
var META = _uid('meta');


var setDesc = _objectDp.f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !_fails(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!_isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!_has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!_has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};
});

var _meta_1 = _meta.KEY;
var _meta_2 = _meta.NEED;
var _meta_3 = _meta.fastKey;
var _meta_4 = _meta.getWeak;
var _meta_5 = _meta.onFreeze;

var defineProperty = _objectDp.f;
var _wksDefine = function (name) {
  var $Symbol = _core.Symbol || (_core.Symbol = _library ? {} : _global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: _wksExt.f(name) });
};

var f$2 = Object.getOwnPropertySymbols;

var _objectGops = {
	f: f$2
};

var f$3 = {}.propertyIsEnumerable;

var _objectPie = {
	f: f$3
};

var _enumKeys = function (it) {
  var result = _objectKeys(it);
  var getSymbols = _objectGops.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = _objectPie.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

var _isArray = Array.isArray || function isArray(arg) {
  return _cof(arg) == 'Array';
};

var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

var f$5 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return _objectKeysInternal(O, hiddenKeys);
};

var _objectGopn = {
	f: f$5
};

var gOPN$1 = _objectGopn.f;
var toString$1 = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN$1(it);
  } catch (e) {
    return windowNames.slice();
  }
};

var f$4 = function getOwnPropertyNames(it) {
  return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN$1(_toIobject(it));
};

var _objectGopnExt = {
	f: f$4
};

var gOPD$1 = Object.getOwnPropertyDescriptor;

var f$6 = _descriptors ? gOPD$1 : function getOwnPropertyDescriptor(O, P) {
  O = _toIobject(O);
  P = _toPrimitive(P, true);
  if (_ie8DomDefine) try {
    return gOPD$1(O, P);
  } catch (e) { /* empty */ }
  if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
};

var _objectGopd = {
	f: f$6
};

var META = _meta.KEY;


















var gOPD = _objectGopd.f;
var dP$1 = _objectDp.f;
var gOPN = _objectGopnExt.f;
var $Symbol = _global.Symbol;
var $JSON = _global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE$2 = 'prototype';
var HIDDEN = _wks('_hidden');
var TO_PRIMITIVE = _wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = _shared('symbol-registry');
var AllSymbols = _shared('symbols');
var OPSymbols = _shared('op-symbols');
var ObjectProto$1 = Object[PROTOTYPE$2];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = _global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = _descriptors && _fails(function () {
  return _objectCreate(dP$1({}, 'a', {
    get: function () { return dP$1(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto$1, key);
  if (protoDesc) delete ObjectProto$1[key];
  dP$1(it, key, D);
  if (protoDesc && it !== ObjectProto$1) dP$1(ObjectProto$1, key, protoDesc);
} : dP$1;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto$1) $defineProperty(OPSymbols, key, D);
  _anObject(it);
  key = _toPrimitive(key, true);
  _anObject(D);
  if (_has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!_has(it, HIDDEN)) dP$1(it, HIDDEN, _propertyDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (_has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _objectCreate(D, { enumerable: _propertyDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP$1(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  _anObject(it);
  var keys = _enumKeys(P = _toIobject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = _toPrimitive(key, true));
  if (this === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return false;
  return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = _toIobject(it);
  key = _toPrimitive(key, true);
  if (it === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(_toIobject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto$1;
  var names = gOPN(IS_OP ? OPSymbols : _toIobject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto$1, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto$1) $set.call(OPSymbols, value);
      if (_has(this, HIDDEN) && _has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, _propertyDesc(1, value));
    };
    if (_descriptors && setter) setSymbolDesc(ObjectProto$1, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  _redefine($Symbol[PROTOTYPE$2], 'toString', function toString() {
    return this._k;
  });

  _objectGopd.f = $getOwnPropertyDescriptor;
  _objectDp.f = $defineProperty;
  _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
  _objectPie.f = $propertyIsEnumerable;
  _objectGops.f = $getOwnPropertySymbols;

  if (_descriptors && !_library) {
    _redefine(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  _wksExt.f = function (name) {
    return wrap(_wks(name));
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)_wks(es6Symbols[j++]);

for (var wellKnownSymbols = _objectKeys(_wks.store), k = 0; wellKnownSymbols.length > k;) _wksDefine(wellKnownSymbols[k++]);

_export(_export.S + _export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return _has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

_export(_export.S + _export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && _export(_export.S + _export.F * (!USE_NATIVE || _fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    replacer = args[1];
    if (typeof replacer == 'function') $replacer = replacer;
    if ($replacer || !_isArray(replacer)) replacer = function (key, value) {
      if ($replacer) value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
_setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
_setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
_setToStringTag(_global.JSON, 'JSON', true);

_wksDefine('asyncIterator');

_wksDefine('observable');

var symbol$2 = _core.Symbol;

var symbol = createCommonjsModule(function (module) {
module.exports = { "default": symbol$2, __esModule: true };
});

unwrapExports(symbol);

var _typeof_1 = createCommonjsModule(function (module, exports) {
exports.__esModule = true;



var _iterator2 = _interopRequireDefault(iterator);



var _symbol2 = _interopRequireDefault(symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
});

var _typeof = unwrapExports(_typeof_1);

var possibleConstructorReturn = createCommonjsModule(function (module, exports) {
exports.__esModule = true;



var _typeof3 = _interopRequireDefault(_typeof_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};
});

var _possibleConstructorReturn = unwrapExports(possibleConstructorReturn);

var check = function (O, proto) {
  _anObject(O);
  if (!_isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
var _setProto = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

_export(_export.S, 'Object', { setPrototypeOf: _setProto.set });

var setPrototypeOf$2 = _core.Object.setPrototypeOf;

var setPrototypeOf = createCommonjsModule(function (module) {
module.exports = { "default": setPrototypeOf$2, __esModule: true };
});

unwrapExports(setPrototypeOf);

_export(_export.S, 'Object', { create: _objectCreate });

var $Object = _core.Object;
var create$2 = function create(P, D) {
  return $Object.create(P, D);
};

var create$1 = createCommonjsModule(function (module) {
module.exports = { "default": create$2, __esModule: true };
});

var _Object$create = unwrapExports(create$1);

var inherits = createCommonjsModule(function (module, exports) {
exports.__esModule = true;



var _setPrototypeOf2 = _interopRequireDefault(setPrototypeOf);



var _create2 = _interopRequireDefault(create$1);



var _typeof3 = _interopRequireDefault(_typeof_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};
});

var _inherits = unwrapExports(inherits);

_export(_export.S + _export.F * !_descriptors, 'Object', { defineProperty: _objectDp.f });

var $Object$1 = _core.Object;
var defineProperty$2 = function defineProperty(it, key, desc) {
  return $Object$1.defineProperty(it, key, desc);
};

var defineProperty$1 = createCommonjsModule(function (module) {
module.exports = { "default": defineProperty$2, __esModule: true };
});

var _Object$defineProperty = unwrapExports(defineProperty$1);

var $getOwnPropertyDescriptor$1 = _objectGopd.f;

_objectSap('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor$1(_toIobject(it), key);
  };
});

var $Object$2 = _core.Object;
var getOwnPropertyDescriptor$1 = function getOwnPropertyDescriptor(it, key) {
  return $Object$2.getOwnPropertyDescriptor(it, key);
};

var getOwnPropertyDescriptor = createCommonjsModule(function (module) {
module.exports = { "default": getOwnPropertyDescriptor$1, __esModule: true };
});

var _Object$getOwnPropertyDescriptor = unwrapExports(getOwnPropertyDescriptor);

var createClass = createCommonjsModule(function (module, exports) {
exports.__esModule = true;



var _defineProperty2 = _interopRequireDefault(defineProperty$1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
});

var _createClass = unwrapExports(createClass);

var get = createCommonjsModule(function (module, exports) {
exports.__esModule = true;



var _getPrototypeOf2 = _interopRequireDefault(getPrototypeOf);



var _getOwnPropertyDescriptor2 = _interopRequireDefault(getOwnPropertyDescriptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);

  if (desc === undefined) {
    var parent = (0, _getPrototypeOf2.default)(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};
});

var _get = unwrapExports(get);

var TAG$1 = _wks('toStringTag');
// ES3 wrong here
var ARG = _cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

var _classof = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
    // builtinTag case
    : ARG ? _cof(O)
    // ES3 arguments fallback
    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

var ITERATOR$1 = _wks('iterator');

var core_isIterable = _core.isIterable = function (it) {
  var O = Object(it);
  return O[ITERATOR$1] !== undefined
    || '@@iterator' in O
    // eslint-disable-next-line no-prototype-builtins
    || _iterators.hasOwnProperty(_classof(O));
};

var isIterable$2 = core_isIterable;

var isIterable = createCommonjsModule(function (module) {
module.exports = { "default": isIterable$2, __esModule: true };
});

unwrapExports(isIterable);

var ITERATOR$2 = _wks('iterator');

var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$2]
    || it['@@iterator']
    || _iterators[_classof(it)];
};

var core_getIterator = _core.getIterator = function (it) {
  var iterFn = core_getIteratorMethod(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return _anObject(iterFn.call(it));
};

var getIterator$2 = core_getIterator;

var getIterator = createCommonjsModule(function (module) {
module.exports = { "default": getIterator$2, __esModule: true };
});

unwrapExports(getIterator);

var slicedToArray = createCommonjsModule(function (module, exports) {
exports.__esModule = true;



var _isIterable3 = _interopRequireDefault(isIterable);



var _getIterator3 = _interopRequireDefault(getIterator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();
});

var _slicedToArray = unwrapExports(slicedToArray);

var isEnum$1 = _objectPie.f;
var _objectToArray = function (isEntries) {
  return function (it) {
    var O = _toIobject(it);
    var keys = _objectKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum$1.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

var $entries = _objectToArray(true);

_export(_export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});

var entries$1 = _core.Object.entries;

var entries = createCommonjsModule(function (module) {
module.exports = { "default": entries$1, __esModule: true };
});

var _Object$entries = unwrapExports(entries);

var _iterCall = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) _anObject(ret.call(iterator));
    throw e;
  }
};

var ITERATOR$3 = _wks('iterator');
var ArrayProto = Array.prototype;

var _isArrayIter = function (it) {
  return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR$3] === it);
};

var _createProperty = function (object, index, value) {
  if (index in object) _objectDp.f(object, index, _propertyDesc(0, value));
  else object[index] = value;
};

var ITERATOR$4 = _wks('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR$4]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  
} catch (e) { /* empty */ }

var _iterDetect = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR$4]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR$4] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

_export(_export.S + _export.F * !_iterDetect(function (iter) {  }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = _toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = core_getIteratorMethod(O);
    var length, result, step, iterator;
    if (mapping) mapfn = _ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && _isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        _createProperty(result, index, mapping ? _iterCall(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = _toLength(O.length);
      for (result = new C(length); length > index; index++) {
        _createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

var from$1 = _core.Array.from;

var from = createCommonjsModule(function (module) {
module.exports = { "default": from$1, __esModule: true };
});

var _Array$from = unwrapExports(from);

var toConsumableArray = createCommonjsModule(function (module, exports) {
exports.__esModule = true;



var _from2 = _interopRequireDefault(from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};
});

var _toConsumableArray = unwrapExports(toConsumableArray);

var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
var _objectAssign = !$assign || _fails(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = _toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = _objectGops.f;
  var isEnum = _objectPie.f;
  while (aLen > index) {
    var S = _iobject(arguments[index++]);
    var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

_export(_export.S + _export.F, 'Object', { assign: _objectAssign });

var assign$1 = _core.Object.assign;

var assign = createCommonjsModule(function (module) {
module.exports = { "default": assign$1, __esModule: true };
});

var _Object$assign = unwrapExports(assign);

var _anInstance = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

var _forOf = createCommonjsModule(function (module) {
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : core_getIteratorMethod(iterable);
  var f = _ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (_isArrayIter(iterFn)) for (length = _toLength(iterable.length); length > index; index++) {
    result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = _iterCall(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;
});

var SPECIES = _wks('species');
var _speciesConstructor = function (O, D) {
  var C = _anObject(O).constructor;
  var S;
  return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
};

// fast apply, http://jsperf.lnkit.com/fast-apply/5
var _invoke = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

var process$1 = _global.process;
var setTask = _global.setImmediate;
var clearTask = _global.clearImmediate;
var MessageChannel = _global.MessageChannel;
var Dispatch = _global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer;
var channel;
var port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      _invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (_cof(process$1) == 'process') {
    defer = function (id) {
      process$1.nextTick(_ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(_ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = _ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts) {
    defer = function (id) {
      _global.postMessage(id + '', '*');
    };
    _global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in _domCreate('script')) {
    defer = function (id) {
      _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function () {
        _html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(_ctx(run, id, 1), 0);
    };
  }
}
var _task = {
  set: setTask,
  clear: clearTask
};

var macrotask = _task.set;
var Observer = _global.MutationObserver || _global.WebKitMutationObserver;
var process$2 = _global.process;
var Promise = _global.Promise;
var isNode$1 = _cof(process$2) == 'process';

var _microtask = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode$1 && (parent = process$2.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode$1) {
    notify = function () {
      process$2.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if (Observer) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(_global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = _aFunction(resolve);
  this.reject = _aFunction(reject);
}

var f$7 = function (C) {
  return new PromiseCapability(C);
};

var _newPromiseCapability = {
	f: f$7
};

var _perform = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

var _promiseResolve = function (C, x) {
  _anObject(C);
  if (_isObject(x) && x.constructor === C) return x;
  var promiseCapability = _newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

var _redefineAll = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else _hide(target, key, src[key]);
  } return target;
};

var SPECIES$1 = _wks('species');

var _setSpecies = function (KEY) {
  var C = typeof _core[KEY] == 'function' ? _core[KEY] : _global[KEY];
  if (_descriptors && C && !C[SPECIES$1]) _objectDp.f(C, SPECIES$1, {
    configurable: true,
    get: function () { return this; }
  });
};

var task = _task.set;
var microtask = _microtask();



var PROMISE = 'Promise';
var TypeError$1 = _global.TypeError;
var process = _global.process;
var $Promise = _global[PROMISE];
var isNode = _classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal;
var newGenericPromiseCapability;
var OwnPromiseCapability;
var Wrapper;
var newPromiseCapability = newGenericPromiseCapability = _newPromiseCapability.f;

var USE_NATIVE$1 = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[_wks('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError$1('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(_global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = _perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = _global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = _global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  if (promise._h == 1) return false;
  var chain = promise._a || promise._c;
  var i = 0;
  var reaction;
  while (chain.length > i) {
    reaction = chain[i++];
    if (reaction.fail || !isUnhandled(reaction.promise)) return false;
  } return true;
};
var onHandleUnhandled = function (promise) {
  task.call(_global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = _global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE$1) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    _anInstance(this, $Promise, PROMISE, '_h');
    _aFunction(executor);
    Internal.call(this);
    try {
      executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = _redefineAll($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(_speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = _ctx($resolve, promise, 1);
    this.reject = _ctx($reject, promise, 1);
  };
  _newPromiseCapability.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE$1, { Promise: $Promise });
_setToStringTag($Promise, PROMISE);
_setSpecies(PROMISE);
Wrapper = _core[PROMISE];

// statics
_export(_export.S + _export.F * !USE_NATIVE$1, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
_export(_export.S + _export.F * (_library || !USE_NATIVE$1), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return _promiseResolve(_library && this === Wrapper ? $Promise : this, x);
  }
});
_export(_export.S + _export.F * !(USE_NATIVE$1 && _iterDetect(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = _perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      _forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = _perform(function () {
      _forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

_export(_export.P + _export.R, 'Promise', { 'finally': function (onFinally) {
  var C = _speciesConstructor(this, _core.Promise || _global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return _promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return _promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });

_export(_export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = _newPromiseCapability.f(this);
  var result = _perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });

var promise$1 = _core.Promise;

var promise = createCommonjsModule(function (module) {
module.exports = { "default": promise$1, __esModule: true };
});

var _Promise = unwrapExports(promise);

_objectSap('keys', function () {
  return function keys(it) {
    return _objectKeys(_toObject(it));
  };
});

var keys$1 = _core.Object.keys;

var keys = createCommonjsModule(function (module) {
module.exports = { "default": keys$1, __esModule: true };
});

var _Object$keys = unwrapExports(keys);

var floor$1 = Math.floor;
var _isInteger = function isInteger(it) {
  return !_isObject(it) && isFinite(it) && floor$1(it) === it;
};

_export(_export.S, 'Number', { isInteger: _isInteger });

var isInteger$2 = _core.Number.isInteger;

var isInteger$1 = createCommonjsModule(function (module) {
module.exports = { "default": isInteger$2, __esModule: true };
});

var _Number$isInteger = unwrapExports(isInteger$1);

var _stringWs = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

var space = '[' + _stringWs + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = _fails(function () {
    return !!_stringWs[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : _stringWs[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  _export(_export.P + _export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(_defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

var _stringTrim = exporter;

var $parseFloat = _global.parseFloat;
var $trim = _stringTrim.trim;

var _parseFloat$3 = 1 / $parseFloat(_stringWs + '-0') !== -Infinity ? function parseFloat(str) {
  var string = $trim(String(str), 3);
  var result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;

_export(_export.S + _export.F * (Number.parseFloat != _parseFloat$3), 'Number', { parseFloat: _parseFloat$3 });

var _parseFloat$1 = parseFloat;

var _parseFloat = createCommonjsModule(function (module) {
module.exports = { "default": _parseFloat$1, __esModule: true };
});

var _Number$parseFloat = unwrapExports(_parseFloat);

/**
 * toxic-predicate-functions v0.1.5
 * (c) 2017 toxic-johann
 * Released under MIT
 */

function defined$1(obj) {
  return typeof obj !== 'undefined';
}
/**
 * is void element or not ? Means it will return true when val is undefined or null
 */
function isVoid(obj) {
  return obj === undefined || obj === null;
}
/**
 * to check whether a variable is array
 */
function isArray$1(arr) {
  return Array.isArray(arr);
}

/**
 * is it a function or not
 */
function isFunction(obj) {
  return typeof obj === 'function';
}

/**
 * is it an object or not
 */
function isObject$1(obj) {
  // incase of arrow function and array
  return Object(obj) === obj && String(obj) === '[object Object]' && !isFunction(obj) && !isArray$1(obj);
}
/**
 * to tell you if it's a real number
 */
function isNumber(obj) {
  return typeof obj === 'number';
}
/**
 * to tell you if the val can be transfer into number
 */
function isNumeric(obj) {
  return !isArray$1(obj) && obj - _Number$parseFloat(obj) + 1 >= 0;
}
/**
 * is it an interget or not
 */
function isInteger(num) {
  return _Number$isInteger(num);
}

/**
 * return true when the value is "", {}, [], 0, null, undefined, false.
 */
function isEmpty(obj) {
  if (isArray$1(obj)) {
    return obj.length === 0;
  } else if (isObject$1(obj)) {
    return _Object$keys(obj).length === 0;
  } else {
    return !obj;
  }
}
/**
 * is it an event or not
 */
function isEvent(obj) {
  return obj instanceof Event || (obj && obj.originalEvent) instanceof Event;
}
/**
 * is it a blob
 */
function isString(str) {
  return typeof str === 'string' || str instanceof String;
}
/**
 * is Boolean or not
 */
function isBoolean(bool) {
  return typeof bool === 'boolean';
}
/**
 * is a promise or not
 */
function isPromise(obj) {
  return !!obj && ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}
/**
 * is Primitive type or not, whick means it will return true when data is number/string/boolean/undefined/null
 */
function isPrimitive(val) {
  return isVoid(val) || isBoolean(val) || isString(val) || isNumber(val);
}
/**
 * is it an url, but this test require the url to have an protocol
 */
function isNode$2(obj) {
  return !!((typeof Node === 'undefined' ? 'undefined' : _typeof(Node)) === 'object' ? obj instanceof Node : obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && typeof obj.nodeType === 'number' && typeof obj.nodeName === 'string');
}
/**
 * to test if a HTML element
 */
function isElement(obj) {
  return !!((typeof HTMLElement === 'undefined' ? 'undefined' : _typeof(HTMLElement)) === 'object' ? obj instanceof HTMLElement : obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === 'string');
}
/**
 * check if node A is node B's parent or not
 */
function isPosterityNode(parent, child) {
  if (!isNode$2(parent) || !isNode$2(child)) {
    return false;
  }
  while (child.parentNode) {
    child = child.parentNode;
    if (child === parent) {
      return true;
    }
  }
  return false;
}
/**
 * check if the string is an HTMLString
 */
function isHTMLString(str) {
  return (/<[^>]+?>/.test(str)
  );
}
/**
 * check if is an error
 */
function isError(val) {
  return val instanceof Error;
}
/**
 * check if is an RegExp
 */

/**
 * chimee-helper-log v0.1.2
 * (c) 2017 toxic-johann
 * Released under MIT
 */

function formatter(tag, msg) {
  if (!isString(tag)) throw new TypeError('Log\'s method only acccept string as argument, but not ' + tag + ' in ' + (typeof tag === 'undefined' ? 'undefined' : _typeof(tag)));
  if (!isString(msg)) return '[' + Log.GLOBAL_TAG + '] > ' + tag;
  tag = Log.FORCE_GLOBAL_TAG ? Log.GLOBAL_TAG : tag || Log.GLOBAL_TAG;
  return '[' + tag + '] > ' + msg;
}
/**
 * Log Object
 */

var Log = function () {
  function Log() {
    _classCallCheck(this, Log);
  }

  _createClass(Log, null, [{
    key: 'error',

    /**
     * equal to console.error, output `[${tag}] > {$msg}`
     * @param {string} tag optional, the header of log 
     * @param {string} msg the message
     */

    /**
     * @member {boolean}
     */

    /**
     * @member {boolean}
     */

    /**
     * @member {boolean}
     */
    value: function error(tag, msg) {
      if (!Log.ENABLE_ERROR) {
        return;
      }

      (console.error || console.warn || console.log)(formatter(tag, msg));
    }
    /**
     * equal to console.info, output `[${tag}] > {$msg}`
     * @param {string} tag optional, the header of log 
     * @param {string} msg the message
     */

    /**
     * @member {boolean}
     */

    /**
     * @member {boolean}
     */

    /**
     * @member {boolean}
     */

    /**
     * @member {string}
     */

  }, {
    key: 'info',
    value: function info(tag, msg) {
      if (!Log.ENABLE_INFO) {
        return;
      }
      (console.info || console.log)(formatter(tag, msg));
    }
    /**
     * equal to console.warn, output `[${tag}] > {$msg}`
     * @param {string} tag optional, the header of log 
     * @param {string} msg the message
     */

  }, {
    key: 'warn',
    value: function warn(tag, msg) {
      if (!Log.ENABLE_WARN) {
        return;
      }
      (console.warn || console.log)(formatter(tag, msg));
    }
    /**
     * equal to console.debug, output `[${tag}] > {$msg}`
     * @param {string} tag optional, the header of log 
     * @param {string} msg the message
     */

  }, {
    key: 'debug',
    value: function debug(tag, msg) {
      if (!Log.ENABLE_DEBUG) {
        return;
      }
      (console.debug || console.log)(formatter(tag, msg));
    }
    /**
     * equal to console.verbose, output `[${tag}] > {$msg}`
     * @param {string} tag optional, the header of log 
     * @param {string} msg the message
     */

  }, {
    key: 'verbose',
    value: function verbose(tag, msg) {
      if (!Log.ENABLE_VERBOSE) {
        return;
      }
      console.log(formatter(tag, msg));
    }
  }]);

  return Log;
}();

Log.GLOBAL_TAG = 'chimee';
Log.FORCE_GLOBAL_TAG = false;
Log.ENABLE_ERROR = true;
Log.ENABLE_INFO = true;
Log.ENABLE_WARN = true;
Log.ENABLE_DEBUG = true;
Log.ENABLE_VERBOSE = true;

var uaParser = createCommonjsModule(function (module, exports) {
/**
 * UAParser.js v0.7.17
 * Lightweight JavaScript-based User-Agent string parser
 * https://github.com/faisalman/ua-parser-js
 *
 * Copyright ?? 2012-2016 Faisal Salman <fyzlman@gmail.com>
 * Dual licensed under GPLv2 & MIT
 */

(function (window, undefined) {

    var LIBVERSION  = '0.7.17',
        EMPTY       = '',
        UNKNOWN     = '?',
        FUNC_TYPE   = 'function',
        UNDEF_TYPE  = 'undefined',
        OBJ_TYPE    = 'object',
        STR_TYPE    = 'string',
        MAJOR       = 'major', // deprecated
        MODEL       = 'model',
        NAME        = 'name',
        TYPE        = 'type',
        VENDOR      = 'vendor',
        VERSION     = 'version',
        ARCHITECTURE= 'architecture',
        CONSOLE     = 'console',
        MOBILE      = 'mobile',
        TABLET      = 'tablet',
        SMARTTV     = 'smarttv',
        WEARABLE    = 'wearable',
        EMBEDDED    = 'embedded';


    ///////////
    // Helper
    //////////


    var util = {
        extend : function (regexes, extensions) {
            var margedRegexes = {};
            for (var i in regexes) {
                if (extensions[i] && extensions[i].length % 2 === 0) {
                    margedRegexes[i] = extensions[i].concat(regexes[i]);
                } else {
                    margedRegexes[i] = regexes[i];
                }
            }
            return margedRegexes;
        },
        has : function (str1, str2) {
          if (typeof str1 === "string") {
            return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
          } else {
            return false;
          }
        },
        lowerize : function (str) {
            return str.toLowerCase();
        },
        major : function (version) {
            return typeof(version) === STR_TYPE ? version.replace(/[^\d\.]/g,'').split(".")[0] : undefined;
        },
        trim : function (str) {
          return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        }
    };


    ///////////////
    // Map helper
    //////////////


    var mapper = {

        rgx : function (ua, arrays) {

            //var result = {},
            var i = 0, j, k, p, q, matches, match;//, args = arguments;

            /*// construct object barebones
            for (p = 0; p < args[1].length; p++) {
                q = args[1][p];
                result[typeof q === OBJ_TYPE ? q[0] : q] = undefined;
            }*/

            // loop through all regexes maps
            while (i < arrays.length && !matches) {

                var regex = arrays[i],       // even sequence (0,2,4,..)
                    props = arrays[i + 1];   // odd sequence (1,3,5,..)
                j = k = 0;

                // try matching uastring with regexes
                while (j < regex.length && !matches) {

                    matches = regex[j++].exec(ua);

                    if (!!matches) {
                        for (p = 0; p < props.length; p++) {
                            match = matches[++k];
                            q = props[p];
                            // check if given property is actually array
                            if (typeof q === OBJ_TYPE && q.length > 0) {
                                if (q.length == 2) {
                                    if (typeof q[1] == FUNC_TYPE) {
                                        // assign modified match
                                        this[q[0]] = q[1].call(this, match);
                                    } else {
                                        // assign given value, ignore regex match
                                        this[q[0]] = q[1];
                                    }
                                } else if (q.length == 3) {
                                    // check whether function or regex
                                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                                        // call function (usually string mapper)
                                        this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                                    } else {
                                        // sanitize match using given regex
                                        this[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                                    }
                                } else if (q.length == 4) {
                                        this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                                }
                            } else {
                                this[q] = match ? match : undefined;
                            }
                        }
                    }
                }
                i += 2;
            }
            // console.log(this);
            //return this;
        },

        str : function (str, map) {

            for (var i in map) {
                // check if array
                if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                    for (var j = 0; j < map[i].length; j++) {
                        if (util.has(map[i][j], str)) {
                            return (i === UNKNOWN) ? undefined : i;
                        }
                    }
                } else if (util.has(map[i], str)) {
                    return (i === UNKNOWN) ? undefined : i;
                }
            }
            return str;
        }
    };


    ///////////////
    // String map
    //////////////


    var maps = {

        browser : {
            oldsafari : {
                version : {
                    '1.0'   : '/8',
                    '1.2'   : '/1',
                    '1.3'   : '/3',
                    '2.0'   : '/412',
                    '2.0.2' : '/416',
                    '2.0.3' : '/417',
                    '2.0.4' : '/419',
                    '?'     : '/'
                }
            }
        },

        device : {
            amazon : {
                model : {
                    'Fire Phone' : ['SD', 'KF']
                }
            },
            sprint : {
                model : {
                    'Evo Shift 4G' : '7373KT'
                },
                vendor : {
                    'HTC'       : 'APA',
                    'Sprint'    : 'Sprint'
                }
            }
        },

        os : {
            windows : {
                version : {
                    'ME'        : '4.90',
                    'NT 3.11'   : 'NT3.51',
                    'NT 4.0'    : 'NT4.0',
                    '2000'      : 'NT 5.0',
                    'XP'        : ['NT 5.1', 'NT 5.2'],
                    'Vista'     : 'NT 6.0',
                    '7'         : 'NT 6.1',
                    '8'         : 'NT 6.2',
                    '8.1'       : 'NT 6.3',
                    '10'        : ['NT 6.4', 'NT 10.0'],
                    'RT'        : 'ARM'
                }
            }
        }
    };


    //////////////
    // Regex map
    /////////////


    var regexes = {

        browser : [[

            // Presto based
            /(opera\smini)\/([\w\.-]+)/i,                                       // Opera Mini
            /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,                      // Opera Mobi/Tablet
            /(opera).+version\/([\w\.]+)/i,                                     // Opera > 9.80
            /(opera)[\/\s]+([\w\.]+)/i                                          // Opera < 9.80
            ], [NAME, VERSION], [

            /(opios)[\/\s]+([\w\.]+)/i                                          // Opera mini on iphone >= 8.0
            ], [[NAME, 'Opera Mini'], VERSION], [

            /\s(opr)\/([\w\.]+)/i                                               // Opera Webkit
            ], [[NAME, 'Opera'], VERSION], [

            // Mixed
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i,
                                                                                // Lunascape/Maxthon/Netfront/Jasmine/Blazer

            // Trident based
            /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,
                                                                                // Avant/IEMobile/SlimBrowser/Baidu
            /(?:ms|\()(ie)\s([\w\.]+)/i,                                        // Internet Explorer

            // Webkit/KHTML based
            /(rekonq)\/([\w\.]+)*/i,                                            // Rekonq
            /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser)\/([\w\.-]+)/i
                                                                                // Chromium/Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser
            ], [NAME, VERSION], [

            /(trident).+rv[:\s]([\w\.]+).+like\sgecko/i                         // IE11
            ], [[NAME, 'IE'], VERSION], [

            /(edge)\/((\d+)?[\w\.]+)/i                                          // Microsoft Edge
            ], [NAME, VERSION], [

            /(yabrowser)\/([\w\.]+)/i                                           // Yandex
            ], [[NAME, 'Yandex'], VERSION], [

            /(puffin)\/([\w\.]+)/i                                              // Puffin
            ], [[NAME, 'Puffin'], VERSION], [

            /((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i
                                                                                // UCBrowser
            ], [[NAME, 'UCBrowser'], VERSION], [

            /(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
            ], [[NAME, /_/g, ' '], VERSION], [

            /(micromessenger)\/([\w\.]+)/i                                      // WeChat
            ], [[NAME, 'WeChat'], VERSION], [

            /(QQ)\/([\d\.]+)/i                                                  // QQ, aka ShouQ
            ], [NAME, VERSION], [

            /m?(qqbrowser)[\/\s]?([\w\.]+)/i                                    // QQBrowser
            ], [NAME, VERSION], [

            /xiaomi\/miuibrowser\/([\w\.]+)/i                                   // MIUI Browser
            ], [VERSION, [NAME, 'MIUI Browser']], [

            /;fbav\/([\w\.]+);/i                                                // Facebook App for iOS & Android
            ], [VERSION, [NAME, 'Facebook']], [

            /headlesschrome(?:\/([\w\.]+)|\s)/i                                 // Chrome Headless
            ], [VERSION, [NAME, 'Chrome Headless']], [

            /\swv\).+(chrome)\/([\w\.]+)/i                                      // Chrome WebView
            ], [[NAME, /(.+)/, '$1 WebView'], VERSION], [

            /((?:oculus|samsung)browser)\/([\w\.]+)/i
            ], [[NAME, /(.+(?:g|us))(.+)/, '$1 $2'], VERSION], [                // Oculus / Samsung Browser

            /android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i        // Android Browser
            ], [VERSION, [NAME, 'Android Browser']], [

            /(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i
                                                                                // Chrome/OmniWeb/Arora/Tizen/Nokia
            ], [NAME, VERSION], [

            /(dolfin)\/([\w\.]+)/i                                              // Dolphin
            ], [[NAME, 'Dolphin'], VERSION], [

            /((?:android.+)crmo|crios)\/([\w\.]+)/i                             // Chrome for Android/iOS
            ], [[NAME, 'Chrome'], VERSION], [

            /(coast)\/([\w\.]+)/i                                               // Opera Coast
            ], [[NAME, 'Opera Coast'], VERSION], [

            /fxios\/([\w\.-]+)/i                                                // Firefox for iOS
            ], [VERSION, [NAME, 'Firefox']], [

            /version\/([\w\.]+).+?mobile\/\w+\s(safari)/i                       // Mobile Safari
            ], [VERSION, [NAME, 'Mobile Safari']], [

            /version\/([\w\.]+).+?(mobile\s?safari|safari)/i                    // Safari & Safari Mobile
            ], [VERSION, NAME], [

            /webkit.+?(gsa)\/([\w\.]+).+?(mobile\s?safari|safari)(\/[\w\.]+)/i  // Google Search Appliance on iOS
            ], [[NAME, 'GSA'], VERSION], [

            /webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i                     // Safari < 3.0
            ], [NAME, [VERSION, mapper.str, maps.browser.oldsafari.version]], [

            /(konqueror)\/([\w\.]+)/i,                                          // Konqueror
            /(webkit|khtml)\/([\w\.]+)/i
            ], [NAME, VERSION], [

            // Gecko based
            /(navigator|netscape)\/([\w\.-]+)/i                                 // Netscape
            ], [[NAME, 'Netscape'], VERSION], [
            /(swiftfox)/i,                                                      // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
                                                                                // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
            /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i,
                                                                                // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,                          // Mozilla

            // Other
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
                                                                                // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir
            /(links)\s\(([\w\.]+)/i,                                            // Links
            /(gobrowser)\/?([\w\.]+)*/i,                                        // GoBrowser
            /(ice\s?browser)\/v?([\w\._]+)/i,                                   // ICE Browser
            /(mosaic)[\/\s]([\w\.]+)/i                                          // Mosaic
            ], [NAME, VERSION]

            /* /////////////////////
            // Media players BEGIN
            ////////////////////////

            , [

            /(apple(?:coremedia|))\/((\d+)[\w\._]+)/i,                          // Generic Apple CoreMedia
            /(coremedia) v((\d+)[\w\._]+)/i
            ], [NAME, VERSION], [

            /(aqualung|lyssna|bsplayer)\/((\d+)?[\w\.-]+)/i                     // Aqualung/Lyssna/BSPlayer
            ], [NAME, VERSION], [

            /(ares|ossproxy)\s((\d+)[\w\.-]+)/i                                 // Ares/OSSProxy
            ], [NAME, VERSION], [

            /(audacious|audimusicstream|amarok|bass|core|dalvik|gnomemplayer|music on console|nsplayer|psp-internetradioplayer|videos)\/((\d+)[\w\.-]+)/i,
                                                                                // Audacious/AudiMusicStream/Amarok/BASS/OpenCORE/Dalvik/GnomeMplayer/MoC
                                                                                // NSPlayer/PSP-InternetRadioPlayer/Videos
            /(clementine|music player daemon)\s((\d+)[\w\.-]+)/i,               // Clementine/MPD
            /(lg player|nexplayer)\s((\d+)[\d\.]+)/i,
            /player\/(nexplayer|lg player)\s((\d+)[\w\.-]+)/i                   // NexPlayer/LG Player
            ], [NAME, VERSION], [
            /(nexplayer)\s((\d+)[\w\.-]+)/i                                     // Nexplayer
            ], [NAME, VERSION], [

            /(flrp)\/((\d+)[\w\.-]+)/i                                          // Flip Player
            ], [[NAME, 'Flip Player'], VERSION], [

            /(fstream|nativehost|queryseekspider|ia-archiver|facebookexternalhit)/i
                                                                                // FStream/NativeHost/QuerySeekSpider/IA Archiver/facebookexternalhit
            ], [NAME], [

            /(gstreamer) souphttpsrc (?:\([^\)]+\)){0,1} libsoup\/((\d+)[\w\.-]+)/i
                                                                                // Gstreamer
            ], [NAME, VERSION], [

            /(htc streaming player)\s[\w_]+\s\/\s((\d+)[\d\.]+)/i,              // HTC Streaming Player
            /(java|python-urllib|python-requests|wget|libcurl)\/((\d+)[\w\.-_]+)/i,
                                                                                // Java/urllib/requests/wget/cURL
            /(lavf)((\d+)[\d\.]+)/i                                             // Lavf (FFMPEG)
            ], [NAME, VERSION], [

            /(htc_one_s)\/((\d+)[\d\.]+)/i                                      // HTC One S
            ], [[NAME, /_/g, ' '], VERSION], [

            /(mplayer)(?:\s|\/)(?:(?:sherpya-){0,1}svn)(?:-|\s)(r\d+(?:-\d+[\w\.-]+){0,1})/i
                                                                                // MPlayer SVN
            ], [NAME, VERSION], [

            /(mplayer)(?:\s|\/|[unkow-]+)((\d+)[\w\.-]+)/i                      // MPlayer
            ], [NAME, VERSION], [

            /(mplayer)/i,                                                       // MPlayer (no other info)
            /(yourmuze)/i,                                                      // YourMuze
            /(media player classic|nero showtime)/i                             // Media Player Classic/Nero ShowTime
            ], [NAME], [

            /(nero (?:home|scout))\/((\d+)[\w\.-]+)/i                           // Nero Home/Nero Scout
            ], [NAME, VERSION], [

            /(nokia\d+)\/((\d+)[\w\.-]+)/i                                      // Nokia
            ], [NAME, VERSION], [

            /\s(songbird)\/((\d+)[\w\.-]+)/i                                    // Songbird/Philips-Songbird
            ], [NAME, VERSION], [

            /(winamp)3 version ((\d+)[\w\.-]+)/i,                               // Winamp
            /(winamp)\s((\d+)[\w\.-]+)/i,
            /(winamp)mpeg\/((\d+)[\w\.-]+)/i
            ], [NAME, VERSION], [

            /(ocms-bot|tapinradio|tunein radio|unknown|winamp|inlight radio)/i  // OCMS-bot/tap in radio/tunein/unknown/winamp (no other info)
                                                                                // inlight radio
            ], [NAME], [

            /(quicktime|rma|radioapp|radioclientapplication|soundtap|totem|stagefright|streamium)\/((\d+)[\w\.-]+)/i
                                                                                // QuickTime/RealMedia/RadioApp/RadioClientApplication/
                                                                                // SoundTap/Totem/Stagefright/Streamium
            ], [NAME, VERSION], [

            /(smp)((\d+)[\d\.]+)/i                                              // SMP
            ], [NAME, VERSION], [

            /(vlc) media player - version ((\d+)[\w\.]+)/i,                     // VLC Videolan
            /(vlc)\/((\d+)[\w\.-]+)/i,
            /(xbmc|gvfs|xine|xmms|irapp)\/((\d+)[\w\.-]+)/i,                    // XBMC/gvfs/Xine/XMMS/irapp
            /(foobar2000)\/((\d+)[\d\.]+)/i,                                    // Foobar2000
            /(itunes)\/((\d+)[\d\.]+)/i                                         // iTunes
            ], [NAME, VERSION], [

            /(wmplayer)\/((\d+)[\w\.-]+)/i,                                     // Windows Media Player
            /(windows-media-player)\/((\d+)[\w\.-]+)/i
            ], [[NAME, /-/g, ' '], VERSION], [

            /windows\/((\d+)[\w\.-]+) upnp\/[\d\.]+ dlnadoc\/[\d\.]+ (home media server)/i
                                                                                // Windows Media Server
            ], [VERSION, [NAME, 'Windows']], [

            /(com\.riseupradioalarm)\/((\d+)[\d\.]*)/i                          // RiseUP Radio Alarm
            ], [NAME, VERSION], [

            /(rad.io)\s((\d+)[\d\.]+)/i,                                        // Rad.io
            /(radio.(?:de|at|fr))\s((\d+)[\d\.]+)/i
            ], [[NAME, 'rad.io'], VERSION]

            //////////////////////
            // Media players END
            ////////////////////*/

        ],

        cpu : [[

            /(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i                     // AMD64
            ], [[ARCHITECTURE, 'amd64']], [

            /(ia32(?=;))/i                                                      // IA32 (quicktime)
            ], [[ARCHITECTURE, util.lowerize]], [

            /((?:i[346]|x)86)[;\)]/i                                            // IA32
            ], [[ARCHITECTURE, 'ia32']], [

            // PocketPC mistakenly identified as PowerPC
            /windows\s(ce|mobile);\sppc;/i
            ], [[ARCHITECTURE, 'arm']], [

            /((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i                           // PowerPC
            ], [[ARCHITECTURE, /ower/, '', util.lowerize]], [

            /(sun4\w)[;\)]/i                                                    // SPARC
            ], [[ARCHITECTURE, 'sparc']], [

            /((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i
                                                                                // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
            ], [[ARCHITECTURE, util.lowerize]]
        ],

        device : [[

            /\((ipad|playbook);[\w\s\);-]+(rim|apple)/i                         // iPad/PlayBook
            ], [MODEL, VENDOR, [TYPE, TABLET]], [

            /applecoremedia\/[\w\.]+ \((ipad)/                                  // iPad
            ], [MODEL, [VENDOR, 'Apple'], [TYPE, TABLET]], [

            /(apple\s{0,1}tv)/i                                                 // Apple TV
            ], [[MODEL, 'Apple TV'], [VENDOR, 'Apple']], [

            /(archos)\s(gamepad2?)/i,                                           // Archos
            /(hp).+(touchpad)/i,                                                // HP TouchPad
            /(hp).+(tablet)/i,                                                  // HP Tablet
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /\s(nook)[\w\s]+build\/(\w+)/i,                                     // Nook
            /(dell)\s(strea[kpr\s\d]*[\dko])/i                                  // Dell Streak
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i                               // Kindle Fire HD
            ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [
            /(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i                  // Fire Phone
            ], [[MODEL, mapper.str, maps.device.amazon.model], [VENDOR, 'Amazon'], [TYPE, MOBILE]], [

            /\((ip[honed|\s\w*]+);.+(apple)/i                                   // iPod/iPhone
            ], [MODEL, VENDOR, [TYPE, MOBILE]], [
            /\((ip[honed|\s\w*]+);/i                                            // iPod/iPhone
            ], [MODEL, [VENDOR, 'Apple'], [TYPE, MOBILE]], [

            /(blackberry)[\s-]?(\w+)/i,                                         // BlackBerry
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i,
                                                                                // BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
            /(hp)\s([\w\s]+\w)/i,                                               // HP iPAQ
            /(asus)-?(\w+)/i                                                    // Asus
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /\(bb10;\s(\w+)/i                                                   // BlackBerry 10
            ], [MODEL, [VENDOR, 'BlackBerry'], [TYPE, MOBILE]], [
                                                                                // Asus Tablets
            /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone)/i
            ], [MODEL, [VENDOR, 'Asus'], [TYPE, TABLET]], [

            /(sony)\s(tablet\s[ps])\sbuild\//i,                                  // Sony
            /(sony)?(?:sgp.+)\sbuild\//i
            ], [[VENDOR, 'Sony'], [MODEL, 'Xperia Tablet'], [TYPE, TABLET]], [
            /android.+\s([c-g]\d{4}|so[-l]\w+)\sbuild\//i
            ], [MODEL, [VENDOR, 'Sony'], [TYPE, MOBILE]], [

            /\s(ouya)\s/i,                                                      // Ouya
            /(nintendo)\s([wids3u]+)/i                                          // Nintendo
            ], [VENDOR, MODEL, [TYPE, CONSOLE]], [

            /android.+;\s(shield)\sbuild/i                                      // Nvidia
            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [

            /(playstation\s[34portablevi]+)/i                                   // Playstation
            ], [MODEL, [VENDOR, 'Sony'], [TYPE, CONSOLE]], [

            /(sprint\s(\w+))/i                                                  // Sprint Phones
            ], [[VENDOR, mapper.str, maps.device.sprint.vendor], [MODEL, mapper.str, maps.device.sprint.model], [TYPE, MOBILE]], [

            /(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i                         // Lenovo tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i,                               // HTC
            /(zte)-(\w+)*/i,                                                    // ZTE
            /(alcatel|geeksphone|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i
                                                                                // Alcatel/GeeksPhone/Lenovo/Nexian/Panasonic/Sony
            ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [

            /(nexus\s9)/i                                                       // HTC Nexus 9
            ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [

            /d\/huawei([\w\s-]+)[;\)]/i,
            /(nexus\s6p)/i                                                      // Huawei
            ], [MODEL, [VENDOR, 'Huawei'], [TYPE, MOBILE]], [

            /(microsoft);\s(lumia[\s\w]+)/i                                     // Microsoft Lumia
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /[\s\(;](xbox(?:\sone)?)[\s\);]/i                                   // Microsoft Xbox
            ], [MODEL, [VENDOR, 'Microsoft'], [TYPE, CONSOLE]], [
            /(kin\.[onetw]{3})/i                                                // Microsoft Kin
            ], [[MODEL, /\./g, ' '], [VENDOR, 'Microsoft'], [TYPE, MOBILE]], [

                                                                                // Motorola
            /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i,
            /mot[\s-]?(\w+)*/i,
            /(XT\d{3,4}) build\//i,
            /(nexus\s6)/i
            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, MOBILE]], [
            /android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i
            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, TABLET]], [

            /hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i            // HbbTV devices
            ], [[VENDOR, util.trim], [MODEL, util.trim], [TYPE, SMARTTV]], [

            /hbbtv.+maple;(\d+)/i
            ], [[MODEL, /^/, 'SmartTV'], [VENDOR, 'Samsung'], [TYPE, SMARTTV]], [

            /\(dtv[\);].+(aquos)/i                                              // Sharp
            ], [MODEL, [VENDOR, 'Sharp'], [TYPE, SMARTTV]], [

            /android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,
            /((SM-T\w+))/i
            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, TABLET]], [                  // Samsung
            /smart-tv.+(samsung)/i
            ], [VENDOR, [TYPE, SMARTTV], MODEL], [
            /((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,
            /(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i,
            /sec-((sgh\w+))/i
            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, MOBILE]], [

            /sie-(\w+)*/i                                                       // Siemens
            ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [

            /(maemo|nokia).*(n900|lumia\s\d+)/i,                                // Nokia
            /(nokia)[\s_-]?([\w-]+)*/i
            ], [[VENDOR, 'Nokia'], MODEL, [TYPE, MOBILE]], [

            /android\s3\.[\s\w;-]{10}(a\d{3})/i                                 // Acer
            ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

            /android.+([vl]k\-?\d{3})\s+build/i                                 // LG Tablet
            ], [MODEL, [VENDOR, 'LG'], [TYPE, TABLET]], [
            /android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i                     // LG Tablet
            ], [[VENDOR, 'LG'], MODEL, [TYPE, TABLET]], [
            /(lg) netcast\.tv/i                                                 // LG SmartTV
            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
            /(nexus\s[45])/i,                                                   // LG
            /lg[e;\s\/-]+(\w+)*/i,
            /android.+lg(\-?[\d\w]+)\s+build/i
            ], [MODEL, [VENDOR, 'LG'], [TYPE, MOBILE]], [

            /android.+(ideatab[a-z0-9\-\s]+)/i                                  // Lenovo
            ], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [

            /linux;.+((jolla));/i                                               // Jolla
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /((pebble))app\/[\d\.]+\s/i                                         // Pebble
            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [

            /android.+;\s(oppo)\s?([\w\s]+)\sbuild/i                            // OPPO
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /crkey/i                                                            // Google Chromecast
            ], [[MODEL, 'Chromecast'], [VENDOR, 'Google']], [

            /android.+;\s(glass)\s\d/i                                          // Google Glass
            ], [MODEL, [VENDOR, 'Google'], [TYPE, WEARABLE]], [

            /android.+;\s(pixel c)\s/i                                          // Google Pixel C
            ], [MODEL, [VENDOR, 'Google'], [TYPE, TABLET]], [

            /android.+;\s(pixel xl|pixel)\s/i                                   // Google Pixel
            ], [MODEL, [VENDOR, 'Google'], [TYPE, MOBILE]], [

            /android.+(\w+)\s+build\/hm\1/i,                                    // Xiaomi Hongmi 'numeric' models
            /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,               // Xiaomi Hongmi
            /android.+(mi[\s\-_]*(?:one|one[\s_]plus|note lte)?[\s_]*(?:\d\w)?)\s+build/i,    // Xiaomi Mi
            /android.+(redmi[\s\-_]*(?:note)?(?:[\s_]*[\w\s]+)?)\s+build/i      // Redmi Phones
            ], [[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, MOBILE]], [
            /android.+(mi[\s\-_]*(?:pad)?(?:[\s_]*[\w\s]+)?)\s+build/i          // Mi Pad tablets
            ],[[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, TABLET]], [
            /android.+;\s(m[1-5]\snote)\sbuild/i                                // Meizu Tablet
            ], [MODEL, [VENDOR, 'Meizu'], [TYPE, TABLET]], [

            /android.+a000(1)\s+build/i                                         // OnePlus
            ], [MODEL, [VENDOR, 'OnePlus'], [TYPE, MOBILE]], [

            /android.+[;\/]\s*(RCT[\d\w]+)\s+build/i                            // RCA Tablets
            ], [MODEL, [VENDOR, 'RCA'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Venue[\d\s]*)\s+build/i                          // Dell Venue Tablets
            ], [MODEL, [VENDOR, 'Dell'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i                         // Verizon Tablet
            ], [MODEL, [VENDOR, 'Verizon'], [TYPE, TABLET]], [

            /android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i     // Barnes & Noble Tablet
            ], [[VENDOR, 'Barnes & Noble'], MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i                           // Barnes & Noble Tablet
            ], [MODEL, [VENDOR, 'NuVision'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(zte)?.+(k\d{2})\s+build/i                        // ZTE K Series Tablet
            ], [[VENDOR, 'ZTE'], MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*(gen\d{3})\s+build.*49h/i                         // Swiss GEN Mobile
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, MOBILE]], [

            /android.+[;\/]\s*(zur\d{3})\s+build/i                              // Swiss ZUR Tablet
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, TABLET]], [

            /android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i                         // Zeki Tablets
            ], [MODEL, [VENDOR, 'Zeki'], [TYPE, TABLET]], [

            /(android).+[;\/]\s+([YR]\d{2}x?.*)\s+build/i,
            /android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(.+)\s+build/i          // Dragon Touch Tablet
            ], [[VENDOR, 'Dragon Touch'], MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*(NS-?.+)\s+build/i                                // Insignia Tablets
            ], [MODEL, [VENDOR, 'Insignia'], [TYPE, TABLET]], [

            /android.+[;\/]\s*((NX|Next)-?.+)\s+build/i                         // NextBook Tablets
            ], [MODEL, [VENDOR, 'NextBook'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Xtreme\_?)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i
            ], [[VENDOR, 'Voice'], MODEL, [TYPE, MOBILE]], [                    // Voice Xtreme Phones

            /android.+[;\/]\s*(LVTEL\-?)?(V1[12])\s+build/i                     // LvTel Phones
            ], [[VENDOR, 'LvTel'], MODEL, [TYPE, MOBILE]], [

            /android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i          // Envizen Tablets
            ], [MODEL, [VENDOR, 'Envizen'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(.*\b)\s+build/i             // Le Pan Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i                         // MachSpeed Tablets
            ], [MODEL, [VENDOR, 'MachSpeed'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i                // Trinity Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*TU_(1491)\s+build/i                               // Rotor Tablets
            ], [MODEL, [VENDOR, 'Rotor'], [TYPE, TABLET]], [

            /android.+(KS(.+))\s+build/i                                        // Amazon Kindle Tablets
            ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [

            /android.+(Gigaset)[\s\-]+(Q.+)\s+build/i                           // Gigaset Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /\s(tablet|tab)[;\/]/i,                                             // Unidentifiable Tablet
            /\s(mobile)(?:[;\/]|\ssafari)/i                                     // Unidentifiable Mobile
            ], [[TYPE, util.lowerize], VENDOR, MODEL], [

            /(android.+)[;\/].+build/i                                          // Generic Android Device
            ], [MODEL, [VENDOR, 'Generic']]


        /*//////////////////////////
            // TODO: move to string map
            ////////////////////////////

            /(C6603)/i                                                          // Sony Xperia Z C6603
            ], [[MODEL, 'Xperia Z C6603'], [VENDOR, 'Sony'], [TYPE, MOBILE]], [
            /(C6903)/i                                                          // Sony Xperia Z 1
            ], [[MODEL, 'Xperia Z 1'], [VENDOR, 'Sony'], [TYPE, MOBILE]], [

            /(SM-G900[F|H])/i                                                   // Samsung Galaxy S5
            ], [[MODEL, 'Galaxy S5'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G7102)/i                                                       // Samsung Galaxy Grand 2
            ], [[MODEL, 'Galaxy Grand 2'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G530H)/i                                                       // Samsung Galaxy Grand Prime
            ], [[MODEL, 'Galaxy Grand Prime'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G313HZ)/i                                                      // Samsung Galaxy V
            ], [[MODEL, 'Galaxy V'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-T805)/i                                                        // Samsung Galaxy Tab S 10.5
            ], [[MODEL, 'Galaxy Tab S 10.5'], [VENDOR, 'Samsung'], [TYPE, TABLET]], [
            /(SM-G800F)/i                                                       // Samsung Galaxy S5 Mini
            ], [[MODEL, 'Galaxy S5 Mini'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-T311)/i                                                        // Samsung Galaxy Tab 3 8.0
            ], [[MODEL, 'Galaxy Tab 3 8.0'], [VENDOR, 'Samsung'], [TYPE, TABLET]], [

            /(T3C)/i                                                            // Advan Vandroid T3C
            ], [MODEL, [VENDOR, 'Advan'], [TYPE, TABLET]], [
            /(ADVAN T1J\+)/i                                                    // Advan Vandroid T1J+
            ], [[MODEL, 'Vandroid T1J+'], [VENDOR, 'Advan'], [TYPE, TABLET]], [
            /(ADVAN S4A)/i                                                      // Advan Vandroid S4A
            ], [[MODEL, 'Vandroid S4A'], [VENDOR, 'Advan'], [TYPE, MOBILE]], [

            /(V972M)/i                                                          // ZTE V972M
            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, MOBILE]], [

            /(i-mobile)\s(IQ\s[\d\.]+)/i                                        // i-mobile IQ
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /(IQ6.3)/i                                                          // i-mobile IQ IQ 6.3
            ], [[MODEL, 'IQ 6.3'], [VENDOR, 'i-mobile'], [TYPE, MOBILE]], [
            /(i-mobile)\s(i-style\s[\d\.]+)/i                                   // i-mobile i-STYLE
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /(i-STYLE2.1)/i                                                     // i-mobile i-STYLE 2.1
            ], [[MODEL, 'i-STYLE 2.1'], [VENDOR, 'i-mobile'], [TYPE, MOBILE]], [

            /(mobiistar touch LAI 512)/i                                        // mobiistar touch LAI 512
            ], [[MODEL, 'Touch LAI 512'], [VENDOR, 'mobiistar'], [TYPE, MOBILE]], [

            /////////////
            // END TODO
            ///////////*/

        ],

        engine : [[

            /windows.+\sedge\/([\w\.]+)/i                                       // EdgeHTML
            ], [VERSION, [NAME, 'EdgeHTML']], [

            /(presto)\/([\w\.]+)/i,                                             // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i,     // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m
            /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,                          // KHTML/Tasman/Links
            /(icab)[\/\s]([23]\.[\d\.]+)/i                                      // iCab
            ], [NAME, VERSION], [

            /rv\:([\w\.]+).*(gecko)/i                                           // Gecko
            ], [VERSION, NAME]
        ],

        os : [[

            // Windows based
            /microsoft\s(windows)\s(vista|xp)/i                                 // Windows (iTunes)
            ], [NAME, VERSION], [
            /(windows)\snt\s6\.2;\s(arm)/i,                                     // Windows RT
            /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s]+\w)*/i,                  // Windows Phone
            /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i
            ], [NAME, [VERSION, mapper.str, maps.os.windows.version]], [
            /(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i
            ], [[NAME, 'Windows'], [VERSION, mapper.str, maps.os.windows.version]], [

            // Mobile/Embedded OS
            /\((bb)(10);/i                                                      // BlackBerry 10
            ], [[NAME, 'BlackBerry'], VERSION], [
            /(blackberry)\w*\/?([\w\.]+)*/i,                                    // Blackberry
            /(tizen)[\/\s]([\w\.]+)/i,                                          // Tizen
            /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i,
                                                                                // Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki
            /linux;.+(sailfish);/i                                              // Sailfish OS
            ], [NAME, VERSION], [
            /(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i                 // Symbian
            ], [[NAME, 'Symbian'], VERSION], [
            /\((series40);/i                                                    // Series 40
            ], [NAME], [
            /mozilla.+\(mobile;.+gecko.+firefox/i                               // Firefox OS
            ], [[NAME, 'Firefox OS'], VERSION], [

            // Console
            /(nintendo|playstation)\s([wids34portablevu]+)/i,                   // Nintendo/Playstation

            // GNU/Linux based
            /(mint)[\/\s\(]?(\w+)*/i,                                           // Mint
            /(mageia|vectorlinux)[;\s]/i,                                       // Mageia/VectorLinux
            /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]+)*/i,
                                                                                // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
                                                                                // Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
            /(hurd|linux)\s?([\w\.]+)*/i,                                       // Hurd/Linux
            /(gnu)\s?([\w\.]+)*/i                                               // GNU
            ], [NAME, VERSION], [

            /(cros)\s[\w]+\s([\w\.]+\w)/i                                       // Chromium OS
            ], [[NAME, 'Chromium OS'], VERSION],[

            // Solaris
            /(sunos)\s?([\w\.]+\d)*/i                                           // Solaris
            ], [[NAME, 'Solaris'], VERSION], [

            // BSD based
            /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i                   // FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
            ], [NAME, VERSION],[

            /(haiku)\s(\w+)/i                                                  // Haiku
            ], [NAME, VERSION],[

            /cfnetwork\/.+darwin/i,
            /ip[honead]+(?:.*os\s([\w]+)\slike\smac|;\sopera)/i                 // iOS
            ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [

            /(mac\sos\sx)\s?([\w\s\.]+\w)*/i,
            /(macintosh|mac(?=_powerpc)\s)/i                                    // Mac OS
            ], [[NAME, 'Mac OS'], [VERSION, /_/g, '.']], [

            // Other
            /((?:open)?solaris)[\/\s-]?([\w\.]+)*/i,                            // Solaris
            /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i,                               // AIX
            /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,
                                                                                // Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS
            /(unix)\s?([\w\.]+)*/i                                              // UNIX
            ], [NAME, VERSION]
        ]
    };


    /////////////////
    // Constructor
    ////////////////
    /*
    var Browser = function (name, version) {
        this[NAME] = name;
        this[VERSION] = version;
    };
    var CPU = function (arch) {
        this[ARCHITECTURE] = arch;
    };
    var Device = function (vendor, model, type) {
        this[VENDOR] = vendor;
        this[MODEL] = model;
        this[TYPE] = type;
    };
    var Engine = Browser;
    var OS = Browser;
    */
    var UAParser = function (uastring, extensions) {

        if (typeof uastring === 'object') {
            extensions = uastring;
            uastring = undefined;
        }

        if (!(this instanceof UAParser)) {
            return new UAParser(uastring, extensions).getResult();
        }

        var ua = uastring || ((window && window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : EMPTY);
        var rgxmap = extensions ? util.extend(regexes, extensions) : regexes;
        //var browser = new Browser();
        //var cpu = new CPU();
        //var device = new Device();
        //var engine = new Engine();
        //var os = new OS();

        this.getBrowser = function () {
            var browser = { name: undefined, version: undefined };
            mapper.rgx.call(browser, ua, rgxmap.browser);
            browser.major = util.major(browser.version); // deprecated
            return browser;
        };
        this.getCPU = function () {
            var cpu = { architecture: undefined };
            mapper.rgx.call(cpu, ua, rgxmap.cpu);
            return cpu;
        };
        this.getDevice = function () {
            var device = { vendor: undefined, model: undefined, type: undefined };
            mapper.rgx.call(device, ua, rgxmap.device);
            return device;
        };
        this.getEngine = function () {
            var engine = { name: undefined, version: undefined };
            mapper.rgx.call(engine, ua, rgxmap.engine);
            return engine;
        };
        this.getOS = function () {
            var os = { name: undefined, version: undefined };
            mapper.rgx.call(os, ua, rgxmap.os);
            return os;
        };
        this.getResult = function () {
            return {
                ua      : this.getUA(),
                browser : this.getBrowser(),
                engine  : this.getEngine(),
                os      : this.getOS(),
                device  : this.getDevice(),
                cpu     : this.getCPU()
            };
        };
        this.getUA = function () {
            return ua;
        };
        this.setUA = function (uastring) {
            ua = uastring;
            //browser = new Browser();
            //cpu = new CPU();
            //device = new Device();
            //engine = new Engine();
            //os = new OS();
            return this;
        };
        return this;
    };

    UAParser.VERSION = LIBVERSION;
    UAParser.BROWSER = {
        NAME    : NAME,
        MAJOR   : MAJOR, // deprecated
        VERSION : VERSION
    };
    UAParser.CPU = {
        ARCHITECTURE : ARCHITECTURE
    };
    UAParser.DEVICE = {
        MODEL   : MODEL,
        VENDOR  : VENDOR,
        TYPE    : TYPE,
        CONSOLE : CONSOLE,
        MOBILE  : MOBILE,
        SMARTTV : SMARTTV,
        TABLET  : TABLET,
        WEARABLE: WEARABLE,
        EMBEDDED: EMBEDDED
    };
    UAParser.ENGINE = {
        NAME    : NAME,
        VERSION : VERSION
    };
    UAParser.OS = {
        NAME    : NAME,
        VERSION : VERSION
    };
    //UAParser.Utils = util;

    ///////////
    // Export
    //////////


    // check js environment
    if ('object' !== UNDEF_TYPE) {
        // nodejs env
        if ('object' !== UNDEF_TYPE && module.exports) {
            exports = module.exports = UAParser;
        }
        // TODO: test!!!!!!!!
        /*
        if (require && require.main === module && process) {
            // cli
            var jsonize = function (arr) {
                var res = [];
                for (var i in arr) {
                    res.push(new UAParser(arr[i]).getResult());
                }
                process.stdout.write(JSON.stringify(res, null, 2) + '\n');
            };
            if (process.stdin.isTTY) {
                // via args
                jsonize(process.argv.slice(2));
            } else {
                // via pipe
                var str = '';
                process.stdin.on('readable', function() {
                    var read = process.stdin.read();
                    if (read !== null) {
                        str += read;
                    }
                });
                process.stdin.on('end', function () {
                    jsonize(str.replace(/\n$/, '').split('\n'));
                });
            }
        }
        */
        exports.UAParser = UAParser;
    } else {
        // requirejs env (optional)
        if (typeof(undefined) === FUNC_TYPE && undefined.amd) {
            undefined(function () {
                return UAParser;
            });
        } else if (window) {
            // browser env
            window.UAParser = UAParser;
        }
    }

    // jQuery/Zepto specific (optional)
    // Note:
    //   In AMD env the global scope should be kept clean, but jQuery is an exception.
    //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
    //   and we should catch that.
    var $ = window && (window.jQuery || window.Zepto);
    if (typeof $ !== UNDEF_TYPE) {
        var parser = new UAParser();
        $.ua = parser.getResult();
        $.ua.get = function () {
            return parser.getUA();
        };
        $.ua.set = function (uastring) {
            parser.setUA(uastring);
            var result = parser.getResult();
            for (var prop in result) {
                $.ua[prop] = result[prop];
            }
        };
    }

})(typeof window === 'object' ? window : commonjsGlobal);
});

var uaParser_1 = uaParser.UAParser;

/**
 * toxic-utils v0.1.6
 * (c) 2017 toxic-johann
 * Released under MIT
 */

function genTraversalHandler(fn) {
  function recursiveFn(source, target, key) {
    if (isArray$1(source) || isObject$1(source)) {
      target = isPrimitive(target) ? isObject$1(source) ? {} : [] : target;
      for (var _key in source) {
        // $FlowFixMe: support computed key here
        target[_key] = recursiveFn(source[_key], target[_key], _key);
      }
      return target;
    }
    return fn(source, target, key);
  }
  return recursiveFn;
}
var _deepAssign = genTraversalHandler(function (val) {
  return val;
});
/**
 * deeply clone an object
 * @param  {Array|Object} source if you pass in other type, it will throw an error
 * @return {clone-target}        the new Object
 */
function deepClone(source) {
  if (isPrimitive(source)) {
    throw new TypeError('deepClone only accept non primitive type');
  }
  return _deepAssign(source);
}
/**
 * merge multiple objects
 * @param  {...Object} args [description]
 * @return {merge-object}         [description]
 */
function deepAssign() {
  for (var _len = arguments.length, args = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
    args[_key2] = arguments[_key2];
  }

  if (args.length < 2) {
    throw new Error('deepAssign accept two and more argument');
  }
  for (var i = args.length - 1; i > -1; i--) {
    if (isPrimitive(args[i])) {
      throw new TypeError('deepAssign only accept non primitive type');
    }
  }
  var target = args.shift();
  args.forEach(function (source) {
    return _deepAssign(source, target);
  });
  return target;
}

/**
 * camelize any string, e.g hello world -> helloWorld
 * @param  {string} str only accept string!
 * @return {string}     camelize string
 */
function camelize(str, isBig) {
  return str.replace(/(^|[^a-zA-Z]+)([a-zA-Z])/g, function (match, spilt, initials, index) {
    return !isBig && index === 0 ? initials.toLowerCase() : initials.toUpperCase();
  });
}
/**
 * hypenate any string e.g hello world -> hello-world
 * @param  {string} str only accept string
 * @return {string}
 */
function hypenate(str) {
  return camelize(str).replace(/([A-Z])/g, function (match) {
    return '-' + match.toLowerCase();
  });
}

/**
 * bind the function with some context. we have some fallback strategy here
 * @param {function} fn the function which we need to bind the context on
 * @param {any} context the context object
 */
function bind(fn, context) {
  if (fn.bind) {
    return fn.bind(context);
  } else if (fn.apply) {
    return function __autobind__() {
      for (var _len2 = arguments.length, args = Array(_len2), _key3 = 0; _key3 < _len2; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return fn.apply(context, args);
    };
  } else {
    return function __autobind__() {
      for (var _len3 = arguments.length, args = Array(_len3), _key4 = 0; _key4 < _len3; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return fn.call.apply(fn, [context].concat(_toConsumableArray(args)));
    };
  }
}

/**
 * generate an uuid
 */
function getDeepProperty(obj, keys) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$throwError = _ref.throwError,
      throwError = _ref$throwError === undefined ? false : _ref$throwError,
      backup = _ref.backup;

  if (isString(keys)) {
    keys = keys.split('.');
  }
  if (!isArray$1(keys)) {
    throw new TypeError('keys of getDeepProperty must be string or Array<string>');
  }
  var read = [];
  var target = obj;
  for (var i = 0, len = keys.length; i < len; i++) {
    var key = keys[i];
    if (isVoid(target)) {
      if (throwError) {
        throw new Error('obj' + (read.length > 0 ? '.' + read.join('.') : ' itself') + ' is ' + target);
      } else {
        return backup;
      }
    }
    target = target[key];
    read.push(key);
  }
  return target;
}

/**
 * chimee-helper-utils v0.2.0
 * (c) 2017 toxic-johann
 * Released under MIT
 */

var inBrowser = typeof window !== 'undefined' && Object.prototype.toString.call(window) !== '[object Object]';

// **********************  ????????????  ************************
/**
 * ????????????????????????????????????
 */
function transObjectAttrIntoArray(obj) {
  var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (a, b) {
    return +a - +b;
  };

  return _Object$keys(obj).sort(fn).reduce(function (order, key) {
    return order.concat(obj[key]);
  }, []);
}
/**
 * run a queue one by one.If include function reject or return false it will stop
 * @param  {Array} queue the queue which we want to run one by one
 * @return {Promise}    tell us whether a queue run finished
 */
function runRejectableQueue(queue) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return new _Promise(function (resolve, reject) {
    var step = function step(index) {
      if (index >= queue.length) {
        resolve();
        return;
      }
      var result = isFunction(queue[index]) ? queue[index].apply(queue, _toConsumableArray(args)) : queue[index];
      if (result === false) return reject('stop');
      return _Promise.resolve(result).then(function () {
        return step(index + 1);
      }).catch(function (err) {
        return reject(err || 'stop');
      });
    };
    step(0);
  });
}
/**
 * run a queue one by one.If include function return false it will stop
 * @param  {Array} queue the queue which we want to run one by one
 * @return {boolean} tell the user if the queue run finished
 */
function runStoppableQueue(queue) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  var step = function step(index) {
    if (index >= queue.length) {
      return true;
    }
    var result = isFunction(queue[index]) ? queue[index].apply(queue, _toConsumableArray(args)) : queue[index];
    if (result === false) return false;
    return step(++index);
  };
  return step(0);
}

var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (cb) {
  return setTimeout(cb, 17);
};

// cancelAnimationFrame
var caf = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.msCancelAnimationFrame || window.oCancelAnimationFrame || function (id) {
  clearTimeout(id);
};

// ???????????????????????????9???????????? 09\009\0009...
function strRepeat(num, bit) {
  var pBit = bit;
  num = '' + (num || '');
  var numLen = num.length;
  bit = (bit || numLen) - numLen;
  var paddingStr = bit > 0 ? num.repeat ? '0'.repeat(bit) : new Array(bit + 1).join('0') : '';
  return (paddingStr + num).slice(0, pBit);
}

// video ???????????????
function formatTime(time) {
  var hh = Math.floor(time / 3600);
  time = Math.floor(time % 3600);
  var mm = strRepeat(Math.floor(time / 60), 2);
  time = Math.floor(time % 60);
  var ss = strRepeat(time, 2);
  return hh >= 1 ? hh + ':' + mm + ':' + ss : mm + ':' + ss;
}

/**
 * ?????????????????????head???style???????????????????????????
 * @param {String} cssText ????????????
 * @return {HTMLElement}
 */

/**
 * chimee-helper-events v0.1.0
 * (c) 2017 toxic-johann
 * Released under MIT
 */

var _evtListenerCache = _Object$create(null);
_evtListenerCache.count = 0;

/**
 * ????????????????????????????????????????????????????????????
 * @param  {Object}  target ?????????????????????
 * @param {String} type ????????????(?????????????????????????????????????????????????????????????????????????????????????????????)
 * @return {Array}
 */
function getEvtTypeCache(target, type) {

  var evtId = target.__evt_id;
  if (!evtId) {

    /* ??????__evt_id???????????? */
    Object.defineProperty(target, '__evt_id', {
      writable: true,
      enumerable: false,
      configurable: true
    });

    /* ?????????????????????????????? */
    evtId = target.__evt_id = ++_evtListenerCache.count;
  }

  var typeCacheKey = evtId + '_' + type;
  var evtTypeCache = _evtListenerCache[typeCacheKey];
  if (!evtTypeCache) {
    evtTypeCache = _evtListenerCache[typeCacheKey] = [];
  }

  return evtTypeCache;
}

/**
 * ????????????????????????
 * @param  {Object}  target ?????????????????????
 * @param {String} type ????????????
 * @param {Object} eventObj ???????????????????????????event??????
 * @return {undefined}
 */
function emitEventCache(target, type, eventObj) {
  var evt = _Object$create(null);
  evt.type = type;
  evt.target = target;
  if (eventObj) {
    _Object$assign(evt, isObject$1(eventObj) ? eventObj : { data: eventObj });
  }
  getEvtTypeCache(target, type).forEach(function (item) {
    (item[1] || item[0]).apply(target, [evt]);
  });
}

/**
 * ???????????????????????????
 * @param  {Object}  target ?????????????????????
 * @param {String} type ????????????
 * @param {Function} handler ????????????
 * @param {Boolean} isOnce ??????????????????
 * @param {Function} handlerWrap
 * @return {undefined}
 */
function addEventCache(target, type, handler) {
  var isOnce = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var handlerWrap = arguments[4];

  if (isFunction(isOnce) && !handlerWrap) {
    handlerWrap = isOnce;
    isOnce = undefined;
  }
  var handlers = [handler, undefined, isOnce];
  if (isOnce && !handlerWrap) {
    handlerWrap = function handlerWrap() {
      removeEventCache(target, type, handler, isOnce);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      handler.apply(target, args);
    };
  }
  if (handlerWrap) {
    handlers[1] = handlerWrap;
  }
  getEvtTypeCache(target, type).push(handlers);
}

/**
 * ??????????????????
 * @param  {Object}  target ?????????????????????
 * @param {String} type ????????????
 * @param {Function} handler ????????????
 * @return {undefined}
 */
function removeEventCache(target, type, handler) {
  var isOnce = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  var typeCache = getEvtTypeCache(target, type);

  if (handler || isOnce) {
    /* ????????? handler ????????????????????? */
    var handlerId = -1;
    var handlerWrap = void 0;
    typeCache.find(function (item, i) {
      if ((!handler || item[0] === handler) && (!isOnce || item[2])) {
        handlerId = i;
        handlerWrap = item[1];
        return true;
      }
    });
    if (handlerId !== -1) {
      typeCache.splice(handlerId, 1);
    }
    return handlerWrap;
  } else {
    /* ????????? handler ?????????type????????????????????? */
    typeCache.length = 0;
  }
}

/**
 * @class CustEvent
 * @description
 * Event ??????????????????
 * 1. ??????????????????????????????????????????eventBus??????
 * 2. ??????????????????target??????????????????????????????target?????????????????????
 * 3. ?????????target????????????????????????assign???true?????????target??????"on\once\off\emit"??????
 * @param  {Object}  target ???????????????????????????????????????event?????????
 * @param  {Boolean}  assign ?????????"on\once\off\emit"???????????????target?????????
 * @return {event}
 */
var CustEvent = function () {
  function CustEvent(target, assign$$1) {
    var _this = this;

    _classCallCheck(this, CustEvent);

    /* ??????__target???????????? */
    Object.defineProperty(this, '__target', {
      writable: true,
      enumerable: false,
      configurable: true
    });
    this.__target = this;

    if (target) {

      if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object') {
        throw new Error('CusEvent target are not object');
      }
      this.__target = target;

      /* ???target??????on\once\off\emit */
      if (assign$$1) {
        ['on', 'once', 'off', 'emit'].forEach(function (mth) {
          target[mth] = _this[mth];
        });
      }
    }
  }

  /**
   * ??????????????????
   * @param {String} type ????????????
   * @param {Function} handler ????????????
   * @param {Boolean} isOnce ??????????????????
   * @return {event}
   */


  _createClass(CustEvent, [{
    key: 'on',
    value: function on(type, handler) {
      var isOnce = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      addEventCache(this.__target, type, handler, isOnce);
      return this;
    }

    /**
     * ??????????????????,?????????????????????
     * @param {String} type ????????????
     * @param {Function} handler ????????????
     * @return {event}
     */

  }, {
    key: 'once',
    value: function once(type, handler) {
      return this.on(type, handler, true);
    }

    /**
     * ??????????????????
     * @param {String} type ????????????
     * @param {Function} handler ????????????(?????????handler?????????type???????????????????????????)
     * @param {Boolean} isOnce ??????????????????
     * @return {event}
     */

  }, {
    key: 'off',
    value: function off(type, handler) {
      var isOnce = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      removeEventCache(this.__target, type, handler, isOnce);
      return this;
    }

    /**
     * ????????????????????????
     * @param {String} type ????????????
     * @return {event}
     */

  }, {
    key: 'emit',
    value: function emit(type, data) {
      emitEventCache(this.__target, type, { data: data });
      return this;
    }
  }]);

  return CustEvent;
}();

/**
 * chimee-helper-dom v0.1.7
 * (c) 2017 huzunjie
 * Released under MIT
 */

var _evtListenerCache$1 = _Object$create(null);
_evtListenerCache$1.count = 0;

/**
 * ????????????????????????????????????????????????????????????
 * @param  {Object}  target ?????????????????????
 * @param {String} type ????????????(?????????????????????????????????????????????????????????????????????????????????????????????)
 * @return {Array}
 */
function getEvtTypeCache$1(target, type) {

  var evtId = target.__evt_id;
  if (!evtId) {

    /* ??????__evt_id???????????? */
    Object.defineProperty(target, '__evt_id', {
      writable: true,
      enumerable: false,
      configurable: true
    });

    /* ?????????????????????????????? */
    evtId = target.__evt_id = ++_evtListenerCache$1.count;
  }

  var typeCacheKey = evtId + '_' + type;
  var evtTypeCache = _evtListenerCache$1[typeCacheKey];
  if (!evtTypeCache) {
    evtTypeCache = _evtListenerCache$1[typeCacheKey] = [];
  }

  return evtTypeCache;
}

/**
 * ????????????????????????
 * @param  {Object}  target ?????????????????????
 * @param {String} type ????????????
 * @param {Object} eventObj ???????????????????????????event??????
 * @return {undefined}
 */
function emitEventCache$1(target, type, eventObj) {
  var evt = _Object$create(null);
  evt.type = type;
  evt.target = target;
  if (eventObj) {
    _Object$assign(evt, isObject$1(eventObj) ? eventObj : { data: eventObj });
  }
  getEvtTypeCache$1(target, type).forEach(function (item) {
    (item[1] || item[0]).apply(target, [evt]);
  });
}

/**
 * ???????????????????????????
 * @param  {Object}  target ?????????????????????
 * @param {String} type ????????????
 * @param {Function} handler ????????????
 * @param {Boolean} isOnce ??????????????????
 * @param {Function} handlerWrap
 * @return {undefined}
 */
function addEventCache$1(target, type, handler) {
  var isOnce = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var handlerWrap = arguments[4];

  if (isFunction(isOnce) && !handlerWrap) {
    handlerWrap = isOnce;
    isOnce = undefined;
  }
  var handlers = [handler, undefined, isOnce];
  if (isOnce && !handlerWrap) {
    handlerWrap = function handlerWrap() {
      removeEventCache$1(target, type, handler, isOnce);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      handler.apply(target, args);
    };
  }
  if (handlerWrap) {
    handlers[1] = handlerWrap;
  }
  getEvtTypeCache$1(target, type).push(handlers);
}

/**
 * ??????????????????
 * @param  {Object}  target ?????????????????????
 * @param {String} type ????????????
 * @param {Function} handler ????????????
 * @return {undefined}
 */
function removeEventCache$1(target, type, handler) {
  var isOnce = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  var typeCache = getEvtTypeCache$1(target, type);

  if (handler || isOnce) {
    /* ????????? handler ????????????????????? */
    var handlerId = -1;
    var handlerWrap = void 0;
    typeCache.find(function (item, i) {
      if ((!handler || item[0] === handler) && (!isOnce || item[2])) {
        handlerId = i;
        handlerWrap = item[1];
        return true;
      }
    });
    if (handlerId !== -1) {
      typeCache.splice(handlerId, 1);
    }
    return handlerWrap;
  } else {
    /* ????????? handler ?????????type????????????????????? */
    typeCache.length = 0;
  }
}

/**
 * @class CustEvent
 * @description
 * Event ??????????????????
 * 1. ??????????????????????????????????????????eventBus??????
 * 2. ??????????????????target??????????????????????????????target?????????????????????
 * 3. ?????????target????????????????????????assign???true?????????target??????"on\once\off\emit"??????
 * @param  {Object}  target ???????????????????????????????????????event?????????
 * @param  {Boolean}  assign ?????????"on\once\off\emit"???????????????target?????????
 * @return {event}
 */
var CustEvent$1 = function () {
  function CustEvent(target, assign$$1) {
    var _this = this;

    _classCallCheck(this, CustEvent);

    /* ??????__target???????????? */
    Object.defineProperty(this, '__target', {
      writable: true,
      enumerable: false,
      configurable: true
    });
    this.__target = this;

    if (target) {

      if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object') {
        throw new Error('CusEvent target are not object');
      }
      this.__target = target;

      /* ???target??????on\once\off\emit */
      if (assign$$1) {
        ['on', 'once', 'off', 'emit'].forEach(function (mth) {
          target[mth] = _this[mth];
        });
      }
    }
  }

  /**
   * ??????????????????
   * @param {String} type ????????????
   * @param {Function} handler ????????????
   * @param {Boolean} isOnce ??????????????????
   * @return {event}
   */


  _createClass(CustEvent, [{
    key: 'on',
    value: function on(type, handler) {
      var isOnce = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      addEventCache$1(this.__target, type, handler, isOnce);
      return this;
    }

    /**
     * ??????????????????,?????????????????????
     * @param {String} type ????????????
     * @param {Function} handler ????????????
     * @return {event}
     */

  }, {
    key: 'once',
    value: function once(type, handler) {
      return this.on(type, handler, true);
    }

    /**
     * ??????????????????
     * @param {String} type ????????????
     * @param {Function} handler ????????????(?????????handler?????????type???????????????????????????)
     * @param {Boolean} isOnce ??????????????????
     * @return {event}
     */

  }, {
    key: 'off',
    value: function off(type, handler) {
      var isOnce = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      removeEventCache$1(this.__target, type, handler, isOnce);
      return this;
    }

    /**
     * ????????????????????????
     * @param {String} type ????????????
     * @return {event}
     */

  }, {
    key: 'emit',
    value: function emit(type, data) {
      emitEventCache$1(this.__target, type, { data: data });
      return this;
    }
  }]);

  return CustEvent;
}();

/**
 * chimee-helper-utils v0.2.0
 * (c) 2017 toxic-johann
 * Released under MIT
 */

// **********************  judgement   ************************
/**
 * check if the code running in browser environment (not include worker env)
 * @returns {Boolean}
 */
var inBrowser$1 = typeof window !== 'undefined' && Object.prototype.toString.call(window) !== '[object Object]';

// **********************  ????????????  ************************
/**
 * ????????????????????????????????????
 */
function makeArray$1(obj) {
  return _Array$from(obj);
}

/**
* @module dom
* @author huzunjie
* @description ???????????????DOM????????????????????????????????????dom.$('*')??????DOM????????????jQuery?????????????????????????????????????????????????????????????????????
*/

var _divEl = document.createElement('div');
var _textAttrName = 'innerText';
'textContent' in _divEl && (_textAttrName = 'textContent');
var _arrPrototype = Array.prototype;

/**
 * ??????HTML???????????????
 * @param {HTMLElement} el ????????????
 * @param {String} attrName ??????????????????
 * @return {String}
 */
function getAttr(el, attrName) {
  return el.getAttribute(attrName);
}

/**
 * ??????HTML???????????????
 * @param {HTMLElement} el ????????????
 * @param {String} attrName ??????????????????
 * @param {String} attrVal ???????????????
 */
function setAttr(el, attrName, attrVal) {
  if (attrVal === undefined) {
    el.removeAttribute(attrName);
  } else {
    el.setAttribute(attrName, attrVal);
  }
}

/**
 * ???HTML????????????className
 * @param {HTMLElement} el ????????????
 * @param {String} cls ????????????className???????????????????????????
 */
function addClassName(el, cls) {
  if (!cls || !(cls = cls.trim())) {
    return;
  }
  var clsArr = cls.split(/\s+/);
  if (el.classList) {
    clsArr.forEach(function (c) {
      return el.classList.add(c);
    });
  } else {
    var curCls = ' ' + (el.className || '') + ' ';
    clsArr.forEach(function (c) {
      curCls.indexOf(' ' + c + ' ') === -1 && (curCls += ' ' + c);
    });
    el.className = curCls.trim();
  }
}

/**
 * ???HTML????????????className
 * @param {HTMLElement} el ????????????
 * @param {String} cls ????????????className???????????????????????????
 */
function removeClassName(el, cls) {
  if (!cls || !(cls = cls.trim())) {
    return;
  }

  var clsArr = cls.split(/\s+/);
  if (el.classList) {
    clsArr.forEach(function (c) {
      return el.classList.remove(c);
    });
  } else {
    var curCls = ' ' + el.className + ' ';
    clsArr.forEach(function (c) {
      var tar = ' ' + c + ' ';
      while (curCls.indexOf(tar) !== -1) {
        curCls = curCls.replace(tar, ' ');
      }
    });
    el.className = curCls.trim();
  }
}

/**
 * ??????HTML?????????????????????className
 * @param {HTMLElement} el ????????????
 * @param {String} className ????????????className
 * @return {Boolean}
 */
function hasClassName(el, className) {
  return new RegExp('(?:^|\\s)' + className + '(?=\\s|$)').test(el.className);
}

/**
 * addEventListener ??????????????? passive
 * @return {Boolean}
 */
var supportsPassive = false;
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function get() {
      supportsPassive = true;
    }
  });
  window.addEventListener('test', null, opts);
} catch (e) {}

/**
 * ???HTML????????????????????????
 * @param {HTMLElement} el ????????????
 * @param {String} type ????????????
 * @param {Function} handler ????????????
 * @param {Boolean} once ?????????????????????
 * @param {Boolean} capture ??????????????????????????????
 */
function removeEvent(el, type, handler) {
  var once = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var capture = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  if (capture !== undefined && !isBoolean(capture) && supportsPassive) {
    capture = { passive: true };
  }
  if (once) {
    /* ?????????????????????????????????????????? */
    var handlerWrap = removeEventCache$1(el, type + '_once', handler);
    if (handlerWrap) {
      handler = handlerWrap;
    }
  }
  el.removeEventListener(type, handler, capture);
}

/**
 * ???HTML????????????????????????
 * @param {HTMLElement} el ????????????
 * @param {String} type ????????????
 * @param {Function} handler ????????????
 * @param {Boolean} once ?????????????????????
 * @param {Boolean} capture ???????????????????????????
 */
function addEvent(el, type, handler) {
  var once = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var capture = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  if (capture !== undefined && !isBoolean(capture) && supportsPassive) {
    capture = { passive: true };
  }
  if (once) {
    var oldHandler = handler;
    handler = function () {
      return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        oldHandler.apply(this, args);
        removeEvent(el, type, handler, once, capture);
      };
    }();
    /* ??????????????????????????????????????? */
    addEventCache$1(el, type + '_once', oldHandler, handler);
  }

  el.addEventListener(type, handler, capture);
}

/**
 * ???HTML????????????????????????
 * @param {HTMLElement} el ????????????
 * @param {String} selector ?????????????????????
 * @param {String} type ????????????
 * @param {Function} handler ????????????
 * @param {Boolean} capture ???????????????????????????
 */
function addDelegate(el, selector, type, handler) {
  var capture = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  if (capture !== undefined && !isBoolean(capture) && supportsPassive) {
    capture = { passive: true };
  }
  var handlerWrap = function handlerWrap(e) {
    var targetElsArr = findParents(e.target || e.srcElement, el, true);
    var targetElArr = query(selector, el, true);
    var retEl = void 0;
    if (targetElArr.find) {
      retEl = targetElArr.find(function (seEl) {
        return targetElsArr.find(function (tgEl) {
          return seEl === tgEl;
        });
      });
    } else {
      // Fixed IE11 Array.find not defined bug
      targetElArr.forEach(function (seEl) {
        return !retEl && targetElsArr.forEach(function (tgEl) {
          if (!retEl && seEl === tgEl) {
            retEl = tgEl;
          }
        });
      });
    }
    retEl && handler.apply(retEl, arguments);
  };
  /* ??????????????????????????????????????? */
  addEventCache$1(el, type + '_delegate_' + selector, handler, handlerWrap);
  el.addEventListener(type, handlerWrap, capture);
}

/**
 * ???HTML????????????????????????
 * @param {HTMLElement} el ????????????
 * @param {String} selector ?????????????????????
 * @param {String} type ????????????
 * @param {Function} handler ????????????
 * @param {Boolean} capture ???????????????????????????
 */
function removeDelegate(el, selector, type, handler) {
  var capture = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  if (capture !== undefined && !isBoolean(capture) && supportsPassive) {
    capture = { passive: true };
  }
  /* ?????????????????????????????????????????? */
  var handlerWrap = removeEventCache$1(el, type + '_delegate_' + selector, handler);
  handlerWrap && el.removeEventListener(type, handlerWrap, capture);
}

/**
 * ??????HTML???????????????
 * @param {HTMLElement} el ????????????
 * @param {String} key ??????key
 * @return {String}
 */
function getStyle(el, key) {
  return (el.currentStyle || document.defaultView.getComputedStyle(el, null))[key] || el.style[key];
}

/**
 * ??????HTML???????????????
 * @param {HTMLElement} el ????????????
 * @param {String} key ??????key
 * @param {String} val ?????????
 */
function setStyle(el, key, val) {
  if (isObject$1(key)) {
    for (var k in key) {
      setStyle(el, k, key[k]);
    }
  } else {
    el.style[key] = val;
  }
}

/**
 * ?????????????????????????????????
 * @param {String} selector ?????????,?????? querySelectorAll
 * @param {HTMLElement} container ?????????
 * @param {Boolean} toArray ?????????????????????
 * @return {NodeList|Array}
 */
function query(selector) {
  var container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  var toArray = arguments[2];

  var retNodeList = container.querySelectorAll(selector);
  return toArray ? _Array$from(retNodeList) : retNodeList;
}

/**
 * ???DOM????????????el
 * @param {HTMLElement} el ????????????
 */
function removeEl(el) {
  el.parentNode.removeChild(el);
}

/**
 * ???????????????????????????
 * @param {HTMLElement} el ????????????
 * @param {HTMLElement} endEl ????????????????????????????????????html???
 * @param {Boolean} haveEl ??????????????????
 * @param {Boolean} haveEndEl ??????????????????????????????
 */
function findParents(el) {
  var endEl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var haveEl = arguments[2];
  var haveEndEl = arguments[3];

  var retEls = [];
  if (haveEl) {
    retEls.push(el);
  }
  while (el && el.parentNode !== endEl) {
    el = el.parentNode;
    el && retEls.push(el);
  }
  if (haveEndEl) {
    retEls.push(endEl);
  }
  return retEls;
}

/**
 * ?????????????????????????????????????????????wrap?????????
 * @param {String} selector ?????????,???????????? HTMLString||NodeList||NodeArray||HTMLElement
 * @param {HTMLElement} container ?????????
 * @return {Object}
 */
function $(selector, container) {
  return selector.constructor === NodeWrap ? selector : new NodeWrap(selector, container);
}

/**
 * @class NodeWrap
 * @description
 * NodeWrap DOM?????????????????????????????????????????????
 * new dom.NodeWrap('*') ????????? dom.$('*')
 * ???????????????DOM?????????????????????????????????????????????????????????????????????????????????????????????
 * @param {String} selector ?????????(?????? String||HTMLString||NodeList||NodeArray||HTMLElement)
 * @param {HTMLElement} container ?????????????????????document???
 */

var NodeWrap = function () {
  function NodeWrap(selector) {
    var container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

    _classCallCheck(this, NodeWrap);

    var _this = this;
    _this.selector = selector;

    /* String||NodeList||HTMLElement ???????????? */
    var elsArr = void 0;
    if (selector && selector.constructor === NodeList) {
      /* ??????????????????NodeList?????????????????? */
      elsArr = makeArray$1(selector);
    } else if (isArray$1(selector)) {
      /* ??????????????????Node???????????????????????? */
      elsArr = selector;
    } else if (isString(selector)) {
      if (selector.indexOf('<') === 0) {
        /* ??????????????????HTML??????????????????DOM?????????????????? */
        _divEl.innerHTML = selector;
        elsArr = query('*', _divEl, true);
      } else {
        /* ?????????????????????????????????????????????DOM?????????????????? */
        elsArr = query(selector, container, true);
      }
    } else {
      /* ??????????????????????????????????????? */
      elsArr = [selector];
    }
    _Object$assign(_this, elsArr);

    /* NodeWrap???????????? extends Array????????????????????????????????????????????????????????????????????? */
    _this.length = elsArr.length;
  }

  /**
   * ????????????DOM??????
   * @param {Function} fn ???????????? fn(item, i)
   * @return {Object}
   */


  _createClass(NodeWrap, [{
    key: 'each',
    value: function each() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      _arrPrototype.forEach.apply(this, args);
      return this;
    }
  }, {
    key: 'push',


    /**
     * ???????????????DOM??????
     * @param {HTMLElement} el ??????????????????
     * @return {this}
     */
    value: function push() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      _arrPrototype.push.apply(this, args);
      return this;
    }
  }, {
    key: 'splice',


    /**
     * ??????DOM???????????????????????????????????????splice
     * @param {Nubmer} start
     * @param {Nubmer} count
     * @return {NodeWrap} ??????DOM???????????????
     */
    value: function splice() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return $(_arrPrototype.splice.apply(this, args));
    }
  }, {
    key: 'find',


    /**
     * ???????????????
     * @param {String} selector ?????????
     * @return {NodeWrap} ??????DOM???????????????
     */
    value: function find(selector) {
      var childs = [];
      this.each(function (el) {
        childs = childs.concat(query(selector, el, true));
      });
      var childsWrap = $(childs);
      childsWrap.parent = this;
      childsWrap.selector = selector;
      return childsWrap;
    }

    /**
     * ???????????????
     * @param {HTMLElement} childEls ????????????HTML??????
     * @return {this}
     */

  }, {
    key: 'append',
    value: function append(childEls) {
      var childsWrap = $(childEls);
      var firstEl = this[0];
      childsWrap.each(function (newEl) {
        return firstEl.appendChild(newEl);
      });
      return this;
    }

    /**
     * ????????????????????????????????????
     * @param {HTMLElement} parentEl ?????????????????????
     * @return {this}
     */

  }, {
    key: 'appendTo',
    value: function appendTo(parentEl) {
      $(parentEl).append(this);
      return this;
    }

    /**
     * DOM??????text??????????????????
     * @param {String} val ????????????????????????????????????????????????????????????????????????????????????
     * @return {this}
     */

  }, {
    key: 'text',
    value: function text(val) {
      if (arguments.length === 0) {
        return this[0][_textAttrName];
      }
      return this.each(function (el) {
        el[_textAttrName] = val;
      });
    }

    /**
     * DOM??????HTML??????????????????
     * @param {String} html html??????????????????????????????????????????????????????????????????????????????
     * @return {this}
     */

  }, {
    key: 'html',
    value: function html(_html) {
      if (arguments.length === 0) {
        return this[0].innerHTML;
      }
      return this.each(function (el) {
        el.innerHTML = _html;
      });
    }

    /**
     * DOM????????????????????????
     * @param {String} name ????????????
     * @param {String} val ?????????????????????????????????????????????????????????????????????????????????
     * @return {this}
     */

  }, {
    key: 'attr',
    value: function attr(name, val) {
      if (arguments.length === 1) {
        return getAttr(this[0], name);
      }
      return this.each(function (el) {
        return setAttr(el, name, val);
      });
    }

    /**
     * DOM??????dataset????????????
     * @param {String} key ??????
     * @param {Any} val ??????????????????????????????????????????????????????????????????????????????
     * @return {this}
     */

  }, {
    key: 'data',
    value: function data(key, val) {
      if (arguments.length === 0) {
        return this[0].dataset || {};
      }
      if (arguments.length === 1) {
        return (this[0].dataset || {})[key];
      }
      return this.each(function (el) {
        (el.dataset || (el.dataset = {}))[key] = val;
      });
    }

    /**
     * DOM????????????????????????
     * @param {String} key ??????key
     * @param {String} val ?????????????????????????????????????????????????????????????????????????????????
     * @return {this}
     */

  }, {
    key: 'css',
    value: function css(key, val) {
      if (arguments.length === 1 && !isObject$1(key)) {
        return getStyle(this[0], key);
      }
      return this.each(function (el) {
        return setStyle(el, key, val);
      });
    }

    /**
     * ???DOM????????????className
     * @param {String} cls ????????????className
     * @return {this}
     */

  }, {
    key: 'addClass',
    value: function addClass(cls) {
      return this.each(function (el) {
        return addClassName(el, cls);
      });
    }

    /**
     * ????????????DOM?????????className
     * @param {String} cls ????????????className
     * @return {this}
     */

  }, {
    key: 'removeClass',
    value: function removeClass(cls) {
      return this.each(function (el) {
        return removeClassName(el, cls);
      });
    }

    /**
     * ????????????0???DOM?????????className
     * @param {String} cls ????????????className
     * @return {this}
     */

  }, {
    key: 'hasClass',
    value: function hasClass(cls) {
      return hasClassName(this[0], cls);
    }

    /**
     * ???DOM????????????????????????
     * @param {String} type ????????????
     * @param {Function} handler ????????????
     * @param {Boolean} once ?????????????????????
     * @param {Boolean} capture ???????????????????????????
     * @return {this}
     */

  }, {
    key: 'on',
    value: function on(type, handler) {
      var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      return this.each(function (el) {
        return addEvent(el, type, handler, once, capture);
      });
    }

    /**
     * ???DOM????????????????????????
     * @param {String} type ????????????
     * @param {Function} handler ????????????
     * @param {Boolean} once ?????????????????????
     * @param {Boolean} capture ???????????????????????????
     * @return {this}
     */

  }, {
    key: 'off',
    value: function off(type, handler) {
      var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      return this.each(function (el) {
        return removeEvent(el, type, handler, once, capture);
      });
    }

    /**
     * ???DOM????????????????????????
     * @param {String} selector ????????????????????????
     * @param {String} type ????????????
     * @param {Function} handler ????????????
     * @param {Boolean} capture ???????????????????????????
     * @return {this}
     */

  }, {
    key: 'delegate',
    value: function delegate(selector, type, handler) {
      var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      return this.each(function (el) {
        return addDelegate(el, selector, type, handler, capture);
      });
    }

    /**
     * ???DOM????????????????????????
     * @param {String} selector ????????????????????????
     * @param {String} type ????????????
     * @param {Function} handler ????????????
     * @param {Boolean} capture ???????????????????????????
     * @return {this}
     */

  }, {
    key: 'undelegate',
    value: function undelegate(selector, type, handler) {
      var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      return this.each(function (el) {
        return removeDelegate(el, selector, type, handler, capture);
      });
    }

    /**
     * ???DOM????????????
     * @return {this}
     */

  }, {
    key: 'remove',
    value: function remove() {
      return this.each(function (el) {
        return removeEl(el);
      });
    }
  }]);

  return NodeWrap;
}();

/**
 * chimee-helper v0.2.8
 * (c) 2017 toxic-johann
 * Released under MIT
 */

var defaultConfig = {
  type: 'vod',
  box: 'native',
  lockInternalProperty: false
};

/**
 * native player
 *
 * @export
 * @class Native
 */

var Native = function (_CustEvent) {
  _inherits(Native, _CustEvent);

  /**
   * Creates an instance of Native.
   * @param {any} videodom video dom
   * @param {any} config 
   * @memberof Native
   */
  function Native(videodom, config) {
    _classCallCheck(this, Native);

    var _this2 = _possibleConstructorReturn(this, (Native.__proto__ || _Object$getPrototypeOf(Native)).call(this));

    _this2.video = videodom;
    _this2.box = 'native';
    _this2.config = defaultConfig;
    deepAssign(_this2.config, config);
    _this2.bindEvents();
    return _this2;
  }

  _createClass(Native, [{
    key: 'internalPropertyHandle',
    value: function internalPropertyHandle() {
      if (!_Object$getOwnPropertyDescriptor) {
        return;
      }
      var _this = this;
      var time = _Object$getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'currentTime');

      Object.defineProperty(this.video, 'currentTime', {
        get: function get() {
          return time.get.call(_this.video);
        },
        set: function set(t) {
          if (!_this.currentTimeLock) {
            throw new Error('can not set currentTime by youself');
          } else {
            return time.set.call(_this.video, t);
          }
        }
      });
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this3 = this;

      if (this.video && this.config.lockInternalProperty) {
        this.video.addEventListener('canplay', function () {
          _this3.internalPropertyHandle();
        });
      }
    }
  }, {
    key: 'load',
    value: function load(src) {
      this.config.src = src || this.config.src;
      this.video.setAttribute('src', this.config.src);
    }
  }, {
    key: 'unload',
    value: function unload() {
      this.video.src = '';
      this.video.removeAttribute('src');
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.video) {
        this.unload();
      }
    }
  }, {
    key: 'play',
    value: function play() {
      return this.video.play();
    }
  }, {
    key: 'pause',
    value: function pause() {
      return this.video.pause();
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      this.video.src = this.config.src;
    }
  }, {
    key: 'attachMedia',
    value: function attachMedia() {}
  }, {
    key: 'seek',
    value: function seek(seconds) {
      this.currentTimeLock = true;
      this.video.currentTime = seconds;
      this.currentTimeLock = false;
    }
  }]);

  return Native;
}(CustEvent);

var defaultConfig$1 = {
  isLive: true, // vod or live
  box: 'native', // box type : native mp4 hls flv
  lockInternalProperty: false,
  reloadTime: 1500 // video can't play when this time to reload
};

var $const = {
  kernelEvent: ['mediaInfo', 'heartbeat', 'error']
};

var Kernel = function (_CustEvent) {
	_inherits(Kernel, _CustEvent);

	/**
  * kernelWrapper
  * @param {any} wrap videoElement
  * @param {any} option
  * @class kernel
  */
	function Kernel(videoElement, config) {
		_classCallCheck(this, Kernel);

		var _this = _possibleConstructorReturn(this, (Kernel.__proto__ || _Object$getPrototypeOf(Kernel)).call(this));

		_this.tag = 'kernel';
		_this.config = deepAssign({}, defaultConfig$1, config);
		_this.video = videoElement;
		_this.videokernel = _this.selectKernel();
		_this.bindEvents(_this.videokernel, _this.video);
		return _this;
	}

	/**
  * bind events
  * @memberof kernel
  */


	_createClass(Kernel, [{
		key: 'bindEvents',
		value: function bindEvents(videokernel, video) {
			var _this2 = this;

			if (!videokernel) {
				return;
			}
			$const.kernelEvent.forEach(function (item) {
				videokernel.on(item, function (msg) {
					_this2.emit(item, msg.data);
				});
			});
		}

		/**
   * select kernel
   * @memberof kernel
   */

	}, {
		key: 'selectKernel',
		value: function selectKernel() {
			var config = this.config;
			isObject$1(config.preset) || (config.preset = {});
			var box = config.box;
			var src = config.src.toLowerCase();
			// ?????? src ?????? box
			if (!box) {
				if (src.indexOf('.flv') !== -1) {
					box = 'flv';
				} else if (src.indexOf('.m3u8') !== -1) {
					box = 'hls';
				} else if (src.indexOf('.mp4') !== -1) {
					box = 'mp4';
				} else {
					// ?????? src ??????????????????????????????????????? native ?????????
					box = 'native';
				}
			}
			// ?????????????????? box???????????? box ???????????????
			// ?????? native ??? mp4 ??????????????????????????????????????????????????????
			if (box !== 'native' && box !== 'mp4' && !config.preset[box]) {
				Log.error(this.tag, 'You want to play for ' + box + ', but you have not installed the kernel.');
				return;
			}
			if (box === 'mp4') {
				if (!config.preset[box] || !config.preset[box].isSupport()) {
					Log.verbose(this.tag, 'browser is not support mp4 decode, auto switch native player');
					box = 'native';
				}
			}

			// ???????????? box
			switch (box) {
				case 'native':
					return new Native(this.video, config);
				case 'mp4':
				case 'flv':
				case 'hls':
					return new config.preset[box](this.video, config);
				default:
					Log.error(this.tag, 'not mactch any player, please check your config');
					return;
			}
		}

		/**
   * select attachMedia
   * @memberof kernel
   */

	}, {
		key: 'attachMedia',
		value: function attachMedia() {
			if (!this.videokernel) {
				return Log.error(this.tag, 'videokernel is not already, must init player');
			}

			this.videokernel.attachMedia();
		}
		/**
   * load source
   * @param {string} src 
   * @memberof kernel
   */

	}, {
		key: 'load',
		value: function load(src) {
			this.config.src = src || this.config.src;
			if (!this.videokernel || !this.config.src) {
				return Log.error(this.tag, 'videokernel is not already, must init player');
			}

			this.videokernel.load(this.config.src);
		}
		/**
   * destory kernel
   * @memberof kernel
   */

	}, {
		key: 'destroy',
		value: function destroy() {
			if (!this.videokernel) {
				return Log.error(this.tag, 'videokernel is not exit');
			}

			this.videokernel.destroy();
		}
		/**
   * to play
   * @memberof kernel
   */

	}, {
		key: 'play',
		value: function play() {
			if (!this.videokernel) {
				return Log.error(this.tag, 'videokernel is not already, must init player');
			}

			this.videokernel.play();
		}
		/**
   * pause
   * @memberof kernel
   */

	}, {
		key: 'pause',
		value: function pause() {
			if (!this.videokernel || !this.config.src) {
				return Log.error(this.tag, 'videokernel is not already, must init player');
			}
			this.videokernel.pause();
		}
		/**
   * get video currentTime
   * @memberof kernel
   */

	}, {
		key: 'seek',

		/**
   * seek to a point
   * @memberof kernel
   */
		value: function seek(seconds) {
			if (!isNumber(seconds)) {
				Log.error(this.tag, 'seek params must be a number');
				return;
			}
			if (this.videokernel) {
				return this.videokernel.seek(seconds);
			} else {
				Log.error(this.tag, 'videokernel is not already, must init player');
			}
		}
		/**
   * refresh kernel
   * @memberof kernel
   */

	}, {
		key: 'refresh',
		value: function refresh() {
			if (!this.videokernel) {
				return Log.error(this.tag, 'videokernel is not already, must init player');
			}
			this.videokernel.refresh();
		}
		/**
   * get video duration
   * @memberof kernel
   */

	}, {
		key: 'currentTime',
		get: function get() {
			if (this.videokernel) {
				return this.video.currentTime;
			}
			return 0;
		}
	}, {
		key: 'duration',
		get: function get() {
			return this.video.duration;
		}
		/**
   * get video volume
   * @memberof kernel
   */

	}, {
		key: 'volume',
		get: function get() {
			return this.video.volume;
		}
		/**
  * set video volume
  * @memberof kernel
  */
		,
		set: function set(value) {
			this.video.volume = value;
		}
		/**
   * get video muted
   * @memberof kernel
   */

	}, {
		key: 'muted',
		get: function get() {
			return this.video.muted;
		}
		/**
   * set video muted
   * @memberof kernel
   */
		,
		set: function set(muted) {
			this.video.muted = muted;
		}
		/**
  * get video buffer
  * @memberof kernel
  */

	}, {
		key: 'buffered',
		get: function get() {
			return this.video.buffered;
		}
	}]);

	return Kernel;
}(CustEvent);

var _validateCollection = function (it, TYPE) {
  if (!_isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

var dP$2 = _objectDp.f;









var fastKey = _meta.fastKey;

var SIZE = _descriptors ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

var _collectionStrong = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      _anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = _objectCreate(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
    });
    _redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = _validateCollection(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = _validateCollection(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        _validateCollection(this, NAME);
        var f = _ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(_validateCollection(this, NAME), key);
      }
    });
    if (_descriptors) dP$2(C.prototype, 'size', {
      get: function () {
        return _validateCollection(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    _iterDefine(C, NAME, function (iterated, kind) {
      this._t = _validateCollection(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return _iterStep(1);
      }
      // return step by kind
      if (kind == 'keys') return _iterStep(0, entry.k);
      if (kind == 'values') return _iterStep(0, entry.v);
      return _iterStep(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    _setSpecies(NAME);
  }
};

var SPECIES$2 = _wks('species');

var _arraySpeciesConstructor = function (original) {
  var C;
  if (_isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || _isArray(C.prototype))) C = undefined;
    if (_isObject(C)) {
      C = C[SPECIES$2];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

var _arraySpeciesCreate = function (original, length) {
  return new (_arraySpeciesConstructor(original))(length);
};

var _arrayMethods = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || _arraySpeciesCreate;
  return function ($this, callbackfn, that) {
    var O = _toObject($this);
    var self = _iobject(O);
    var f = _ctx(callbackfn, that, 3);
    var length = _toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

var dP$3 = _objectDp.f;
var each = _arrayMethods(0);


var _collection = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = _global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  if (!_descriptors || typeof C != 'function' || !(IS_WEAK || proto.forEach && !_fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    _redefineAll(C.prototype, methods);
    _meta.NEED = true;
  } else {
    C = wrapper(function (target, iterable) {
      _anInstance(target, C, NAME, '_c');
      target._c = new Base();
      if (iterable != undefined) _forOf(iterable, IS_MAP, target[ADDER], target);
    });
    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','), function (KEY) {
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if (KEY in proto && !(IS_WEAK && KEY == 'clear')) _hide(C.prototype, KEY, function (a, b) {
        _anInstance(this, C, KEY);
        if (!IS_ADDER && IS_WEAK && !_isObject(a)) return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    IS_WEAK || dP$3(C.prototype, 'size', {
      get: function () {
        return this._c.size;
      }
    });
  }

  _setToStringTag(C, NAME);

  O[NAME] = C;
  _export(_export.G + _export.W + _export.F, O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

var MAP = 'Map';

// 23.1 Map Objects
var es6_map = _collection(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = _collectionStrong.getEntry(_validateCollection(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return _collectionStrong.def(_validateCollection(this, MAP), key === 0 ? 0 : key, value);
  }
}, _collectionStrong, true);

var _arrayFromIterable = function (iter, ITERATOR) {
  var result = [];
  _forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

var _collectionToJson = function (NAME) {
  return function toJSON() {
    if (_classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return _arrayFromIterable(this);
  };
};

_export(_export.P + _export.R, 'Map', { toJSON: _collectionToJson('Map') });

var _setCollectionOf = function (COLLECTION) {
  _export(_export.S, COLLECTION, { of: function of() {
    var length = arguments.length;
    var A = Array(length);
    while (length--) A[length] = arguments[length];
    return new this(A);
  } });
};

_setCollectionOf('Map');

var _setCollectionFrom = function (COLLECTION) {
  _export(_export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
    var mapFn = arguments[1];
    var mapping, A, n, cb;
    _aFunction(this);
    mapping = mapFn !== undefined;
    if (mapping) _aFunction(mapFn);
    if (source == undefined) return new this();
    A = [];
    if (mapping) {
      n = 0;
      cb = _ctx(mapFn, arguments[2], 2);
      _forOf(source, false, function (nextItem) {
        A.push(cb(nextItem, n++));
      });
    } else {
      _forOf(source, false, A.push, A);
    }
    return new this(A);
  } });
};

_setCollectionFrom('Map');

var map$1 = _core.Map;

var map = createCommonjsModule(function (module) {
module.exports = { "default": map$1, __esModule: true };
});

var _Map = unwrapExports(map);

var Reflect = _global.Reflect;
var _ownKeys = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = _objectGopn.f(_anObject(it));
  var getSymbols = _objectGops.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};

_export(_export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = _toIobject(object);
    var getDesc = _objectGopd.f;
    var keys = _ownKeys(O);
    var result = {};
    var i = 0;
    var key, desc;
    while (keys.length > i) {
      desc = getDesc(O, key = keys[i++]);
      if (desc !== undefined) _createProperty(result, key, desc);
    }
    return result;
  }
});

var getOwnPropertyDescriptors$2 = _core.Object.getOwnPropertyDescriptors;

var getOwnPropertyDescriptors$1 = createCommonjsModule(function (module) {
module.exports = { "default": getOwnPropertyDescriptors$2, __esModule: true };
});

var _Object$getOwnPropertyDescriptors = unwrapExports(getOwnPropertyDescriptors$1);

var getOwnPropertySymbols$1 = _core.Object.getOwnPropertySymbols;

var getOwnPropertySymbols = createCommonjsModule(function (module) {
module.exports = { "default": getOwnPropertySymbols$1, __esModule: true };
});

var _Object$getOwnPropertySymbols = unwrapExports(getOwnPropertySymbols);

_objectSap('getOwnPropertyNames', function () {
  return _objectGopnExt.f;
});

var $Object$3 = _core.Object;
var getOwnPropertyNames$1 = function getOwnPropertyNames(it) {
  return $Object$3.getOwnPropertyNames(it);
};

var getOwnPropertyNames = createCommonjsModule(function (module) {
module.exports = { "default": getOwnPropertyNames$1, __esModule: true };
});

var _Object$getOwnPropertyNames = unwrapExports(getOwnPropertyNames);

var getWeak = _meta.getWeak;







var arrayFind = _arrayMethods(5);
var arrayFindIndex = _arrayMethods(6);
var id$1 = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (that) {
  return that._l || (that._l = new UncaughtFrozenStore());
};
var UncaughtFrozenStore = function () {
  this.a = [];
};
var findUncaughtFrozen = function (store, key) {
  return arrayFind(store.a, function (it) {
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function (key) {
    var index = arrayFindIndex(this.a, function (it) {
      return it[0] === key;
    });
    if (~index) this.a.splice(index, 1);
    return !!~index;
  }
};

var _collectionWeak = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      _anInstance(that, C, NAME, '_i');
      that._t = NAME;      // collection type
      that._i = id$1++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
    });
    _redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function (key) {
        if (!_isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(_validateCollection(this, NAME))['delete'](key);
        return data && _has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key) {
        if (!_isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(_validateCollection(this, NAME)).has(key);
        return data && _has(data, this._i);
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var data = getWeak(_anObject(key), true);
    if (data === true) uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};

var es6_weakMap = createCommonjsModule(function (module) {
var each = _arrayMethods(0);







var WEAK_MAP = 'WeakMap';
var getWeak = _meta.getWeak;
var isExtensible = Object.isExtensible;
var uncaughtFrozenStore = _collectionWeak.ufstore;
var tmp = {};
var InternalMap;

var wrapper = function (get) {
  return function WeakMap() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key) {
    if (_isObject(key)) {
      var data = getWeak(key);
      if (data === true) return uncaughtFrozenStore(_validateCollection(this, WEAK_MAP)).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value) {
    return _collectionWeak.def(_validateCollection(this, WEAK_MAP), key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = _collection(WEAK_MAP, wrapper, methods, _collectionWeak, true, true);

// IE11 WeakMap frozen keys fix
if (_fails(function () { return new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7; })) {
  InternalMap = _collectionWeak.getConstructor(wrapper, WEAK_MAP);
  _objectAssign(InternalMap.prototype, methods);
  _meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function (key) {
    var proto = $WeakMap.prototype;
    var method = proto[key];
    _redefine(proto, key, function (a, b) {
      // store frozen objects on internal weakmap shim
      if (_isObject(a) && !isExtensible(a)) {
        if (!this._f) this._f = new InternalMap();
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}
});

_setCollectionOf('WeakMap');

_setCollectionFrom('WeakMap');

var weakMap$1 = _core.WeakMap;

var weakMap = createCommonjsModule(function (module) {
module.exports = { "default": weakMap$1, __esModule: true };
});

var _WeakMap = unwrapExports(weakMap);

var defineProperty$5$1 = createCommonjsModule(function (module, exports) {
exports.__esModule = true;



var _defineProperty2 = _interopRequireDefault(defineProperty$1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};
});

var _defineProperty$1 = unwrapExports(defineProperty$5$1);

var meta = _meta.onFreeze;

_objectSap('preventExtensions', function ($preventExtensions) {
  return function preventExtensions(it) {
    return $preventExtensions && _isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});

var preventExtensions$2 = _core.Object.preventExtensions;

var preventExtensions$1 = createCommonjsModule(function (module) {
module.exports = { "default": preventExtensions$2, __esModule: true };
});

unwrapExports(preventExtensions$1);

/**
 * toxic-decorators v0.3.8
 * (c) 2017 toxic-johann
 * Released under GPL-3.0
 */

var getOwnPropertyDescriptor$3 = _Object$getOwnPropertyDescriptor;
// **********************  ????????????  ************************
/**
 * sort Object attributes by function
 * and transfer them into array
 * @param  {Object} obj Object form from numric
 * @param  {Function} fn sort function
 * @return {Array} the sorted attirbutes array
 */


/**
 * to check if an descriptor
 * @param {anything} desc
 */
function isDescriptor(desc) {
  if (!desc || !desc.hasOwnProperty) {
    return false;
  }

  var keys$$1 = ['value', 'initializer', 'get', 'set'];

  for (var i = 0, l = keys$$1.length; i < l; i++) {
    if (desc.hasOwnProperty(keys$$1[i])) {
      return true;
    }
  }
  return false;
}
/**
 * to check if the descirptor is an accessor descriptor
 * @param {descriptor} desc it should be a descriptor better
 */
function isAccessorDescriptor(desc) {
  return !!desc && (isFunction(desc.get) || isFunction(desc.set)) && isBoolean(desc.configurable) && isBoolean(desc.enumerable) && desc.writable === undefined;
}
/**
 * to check if the descirptor is an data descriptor
 * @param {descriptor} desc it should be a descriptor better
 */
function isDataDescriptor(desc) {
  return !!desc && desc.hasOwnProperty('value') && isBoolean(desc.configurable) && isBoolean(desc.enumerable) && isBoolean(desc.writable);
}
/**
 * to check if the descirptor is an initiallizer descriptor
 * @param {descriptor} desc it should be a descriptor better
 */
function isInitializerDescriptor(desc) {
  return !!desc && isFunction(desc.initializer) && isBoolean(desc.configurable) && isBoolean(desc.enumerable) && isBoolean(desc.writable);
}
/**
 * set one value on the object
 * @param {string} key
 */
function createDefaultSetter(key) {
  return function set(newValue) {
    _Object$defineProperty(this, key, {
      configurable: true,
      writable: true,
      // IS enumerable when reassigned by the outside word
      enumerable: true,
      value: newValue
    });
    return newValue;
  };
}

/**
 * Compress many function into one function, but this function only accept one arguments;
 * @param {Array<Function>} fns the array of function we need to compress into one function
 * @param {string} errmsg When we check that there is something is not function, we will throw an error, you can set your own error message
 */
function compressOneArgFnArray(fns) {
  var errmsg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'You must pass me an array of function';

  if (!isArray$1(fns) || fns.length < 1) {
    throw new TypeError(errmsg);
  }
  if (fns.length === 1) {
    if (!isFunction(fns[0])) {
      throw new TypeError(errmsg);
    }
    return fns[0];
  }
  return fns.reduce(function (prev, curr) {
    if (!isFunction(curr) || !isFunction(prev)) throw new TypeError(errmsg);
    return function (value) {
      return bind(curr, this)(bind(prev, this)(value));
    };
  });
}
/**
 * just a method to call console.warn, maybe i will add some handler on it someday
 * @param {anything} args
 */
function getOwnKeysFn() {
  var getOwnPropertyNames$$1 = _Object$getOwnPropertyNames,
      getOwnPropertySymbols$$1 = _Object$getOwnPropertySymbols;

  return isFunction(getOwnPropertySymbols$$1) ? function (obj) {
    // $FlowFixMe: do not support symwbol yet
    return _Array$from(getOwnPropertyNames$$1(obj).concat(getOwnPropertySymbols$$1(obj)));
  } : getOwnPropertyNames$$1;
}

var getOwnKeys = getOwnKeysFn();

function getOwnPropertyDescriptorsFn() {
  // $FlowFixMe: In some environment, Object.getOwnPropertyDescriptors has been implemented;
  return isFunction(_Object$getOwnPropertyDescriptors) ? _Object$getOwnPropertyDescriptors : function (obj) {
    return getOwnKeys(obj).reduce(function (descs, key) {
      descs[key] = getOwnPropertyDescriptor$3(obj, key);
      return descs;
    }, {});
  };
}

var getOwnPropertyDescriptors = getOwnPropertyDescriptorsFn();

function compressMultipleDecorators() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  if (!fns.length) throw new TypeError('You must pass in decorators in compressMultipleDecorators');
  fns.forEach(function (fn) {
    if (!isFunction(fn)) throw new TypeError('Decorators must be a function, but not "' + fn + '" in ' + (typeof fn === 'undefined' ? 'undefined' : _typeof(fn)));
  });
  if (fns.length === 1) return fns[0];
  return function (obj, prop, descirptor) {
    // $FlowFixMe: the reduce will return a descriptor
    return fns.reduce(function (descirptor, fn) {
      return fn(obj, prop, descirptor);
    }, descirptor);
  };
}

function accessor() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      get = _ref.get,
      set = _ref.set;

  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$preGet = _ref2.preGet,
      preGet = _ref2$preGet === undefined ? false : _ref2$preGet,
      _ref2$preSet = _ref2.preSet,
      preSet = _ref2$preSet === undefined ? true : _ref2$preSet;

  if (!isFunction(get) && !isFunction(set) && !(isArray$1(get) && get.length > 0) && !(isArray$1(set) && set.length > 0)) throw new TypeError("@accessor need a getter or setter. If you don't need to add setter/getter. You should remove @accessor");
  var errmsg = '@accessor only accept function or array of function as getter/setter';
  get = isArray$1(get) ? compressOneArgFnArray(get, errmsg) : get;
  set = isArray$1(set) ? compressOneArgFnArray(set, errmsg) : set;
  return function (obj, prop, descriptor) {
    var _ref3 = descriptor || {},
        _ref3$configurable = _ref3.configurable,
        configurable = _ref3$configurable === undefined ? true : _ref3$configurable,
        _ref3$enumerable = _ref3.enumerable,
        enumerable = _ref3$enumerable === undefined ? true : _ref3$enumerable;

    var hasGet = isFunction(get);
    var hasSet = isFunction(set);
    var handleGet = function handleGet(value) {
      // $FlowFixMe: it's really function here
      return hasGet ? bind(get, this)(value) : value;
    };
    var handleSet = function handleSet(value) {
      // $FlowFixMe: it's really function here
      return hasSet ? bind(set, this)(value) : value;
    };
    if (isAccessorDescriptor(descriptor)) {
      var originGet = descriptor.get,
          originSet = descriptor.set;

      var hasOriginGet = isFunction(originGet);
      var hasOriginSet = isFunction(originSet);
      var getter = hasOriginGet || hasGet ? function () {
        var _this = this;

        var boundGetter = bind(handleGet, this);
        var originBoundGetter = function originBoundGetter() {
          return hasOriginGet
          // $FlowFixMe: we have do a check here
          ? bind(originGet, _this)() : undefined;
        };
        var order = preGet ? [boundGetter, originBoundGetter] : [originBoundGetter, boundGetter];
        // $FlowFixMe: it's all function here
        return order.reduce(function (value, fn) {
          return fn(value);
        }, undefined);
      } : undefined;
      var setter = hasOriginSet || hasSet ? function (val) {
        var _this2 = this;

        var boundSetter = bind(handleSet, this);
        var originBoundSetter = function originBoundSetter(value) {
          return hasOriginSet
          // $FlowFixMe: flow act like a retarded child on optional property
          ? bind(originSet, _this2)(value) : value;
        };
        var order = preSet ? [boundSetter, originBoundSetter] : [originBoundSetter, boundSetter];
        return order.reduce(function (value, fn) {
          return fn(value);
        }, val);
      } : undefined;
      return {
        get: getter,
        set: setter,
        configurable: configurable,
        enumerable: enumerable
      };
    } else if (isInitializerDescriptor(descriptor)) {
      // $FlowFixMe: disjoint union is horrible, descriptor is initializerDescriptor now
      var initializer = descriptor.initializer;

      var value = void 0;
      var inited = false;
      return {
        get: function get() {
          var boundFn = bind(handleGet, this);
          if (inited) return boundFn(value);
          value = bind(initializer, this)();
          inited = true;
          return boundFn(value);
        },
        set: function set(val) {
          var boundFn = bind(handleSet, this);
          value = preSet ? boundFn(val) : val;
          inited = true;
          if (!preSet) {
            boundFn(value);
          }
          return value;
        },

        configurable: configurable,
        enumerable: enumerable
      };
    } else {
      // $FlowFixMe: disjoint union is horrible, descriptor is DataDescriptor now
      var _ref4 = descriptor || {},
          _value = _ref4.value;

      return {
        get: function get() {
          return bind(handleGet, this)(_value);
        },
        set: function set(val) {
          var boundFn = bind(handleSet, this);
          _value = preSet ? boundFn(val) : val;
          if (!preSet) {
            boundFn(_value);
          }
          return _value;
        },

        configurable: configurable,
        enumerable: enumerable
      };
    }
  };
}

function before() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  if (fns.length === 0) throw new Error("@before accept at least one parameter. If you don't need to preprocess before your function, do not add @before decorators");
  if (fns.length > 2 && isDescriptor(fns[2])) {
    throw new Error('You may use @before straightly, @before return decorators, you should call it before you set it as decorator.');
  }
  for (var i = fns.length - 1; i > -1; i--) {
    if (!isFunction(fns[i])) throw new TypeError('@before only accept function parameter');
  }
  return function (obj, prop, descriptor) {
    var _ref = descriptor || {},
        fn = _ref.value,
        configurable = _ref.configurable,
        enumerable = _ref.enumerable,
        writable = _ref.writable;

    if (!isFunction(fn)) throw new TypeError('@before can only be used on function, please check the property "' + prop + '" is a method or not.');
    var handler = function handler() {
      var _this = this;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var paras = fns.reduce(function (paras, fn) {
        var result = bind(fn, _this).apply(undefined, _toConsumableArray(paras));
        return result === undefined ? paras : isArray$1(result) ? result
        // $FlowFixMe: what the hell, it can be anything
        : [result];
      }, args);
      return bind(fn, this).apply(undefined, _toConsumableArray(paras));
    };
    return {
      value: handler,
      configurable: configurable,
      enumerable: enumerable,
      writable: writable
    };
  };
}

function initialize() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  if (fns.length === 0) throw new Error("@initialize accept at least one parameter. If you don't need to initialize your value, do not add @initialize.");
  if (fns.length > 2 && isDescriptor(fns[2])) {
    throw new Error('You may use @initialize straightly, @initialize return decorators, you need to call it');
  }
  var fn = compressOneArgFnArray(fns, '@initialize only accept function parameter');
  return function (obj, prop, descriptor) {
    if (descriptor === undefined) {
      return {
        value: bind(fn, obj)(),
        configurable: true,
        writable: true,
        enumerable: true
      };
    }
    if (isAccessorDescriptor(descriptor)) {
      var hasBeenReset = false;
      var originSet = descriptor.set;

      return accessor({
        get: function get(value) {
          if (hasBeenReset) return value;
          return bind(fn, this)(value);
        },

        set: originSet ? function (value) {
          hasBeenReset = true;
          return value;
        } : undefined
      })(obj, prop, descriptor);
    }
    /**
     * when we set decorator on propery
     * we will get a descriptor with initializer
     * as they will be attach on the instance later
     * so, we need to substitute the initializer function
     */
    if (isInitializerDescriptor(descriptor)) {
      // $FlowFixMe: useless disjoint union
      var initializer = descriptor.initializer;

      var handler = function handler() {
        return bind(fn, this)(bind(initializer, this)());
      };
      return {
        initializer: handler,
        configurable: descriptor.configurable,
        // $FlowFixMe: useless disjoint union
        writable: descriptor.writable,
        enumerable: descriptor.enumerable
      };
    }
    // $FlowFixMe: useless disjoint union
    var value = bind(fn, this)(descriptor.value);
    return {
      value: value,
      // $FlowFixMe: useless disjoint union
      writable: descriptor.writable,
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable
    };
  };
}

var getOwnPropertyDescriptor$1$1 = _Object$getOwnPropertyDescriptor;
var defineProperty$4 = _Object$defineProperty;

function setAlias(root, prop, _ref, obj, key, _ref2) {
  var configurable = _ref.configurable,
      enumerable = _ref.enumerable;
  var force = _ref2.force,
      omit = _ref2.omit;

  var originDesc = getOwnPropertyDescriptor$1$1(obj, key);
  if (originDesc !== undefined) {
    if (omit) return;
    // TODO: we should add an github link here
    if (!force) throw new Error('"' + prop + '" is an existing property, if you want to override it, please set "force" true in @alias option.');
    if (!originDesc.configurable) {
      throw new Error('property "' + prop + '" is unconfigurable.');
    }
  }
  defineProperty$4(obj, key, {
    get: function get() {
      return root[prop];
    },
    set: function set(value) {
      root[prop] = value;
      return prop;
    },

    configurable: configurable,
    enumerable: enumerable
  });
}
function alias(other, key, option) {
  // set argument into right position
  if (arguments.length === 2) {
    if (isString(other)) {
      // $FlowFixMe: i will check this later
      option = key;
      key = other;
      other = undefined;
    }
  } else if (arguments.length === 1) {
    // $FlowFixMe: i will check this later
    key = other;
    other = undefined;
  }
  // argument validate
  if (!isString(key)) throw new TypeError('@alias need a string as a key to find the porperty to set alias on');
  var illegalObjErrorMsg = 'If you want to use @alias to set alias on other instance, you must pass in a legal instance';
  if (other !== undefined && isPrimitive(other)) throw new TypeError(illegalObjErrorMsg);

  var _ref3 = isObject$1(option) ? option : { force: false, omit: false },
      force = _ref3.force,
      omit = _ref3.omit;

  return function (obj, prop, descriptor) {
    descriptor = descriptor || {
      value: undefined,
      configurable: true,
      writable: true,
      enumerable: true
    };
    function getTargetAndName(other, obj, key) {
      var target = isPrimitive(other) ? obj : other;
      var keys$$1 = key.split('.');

      var _keys$slice = keys$$1.slice(-1),
          _keys$slice2 = _slicedToArray(_keys$slice, 1),
          name = _keys$slice2[0];

      target = getDeepProperty(target, keys$$1.slice(0, -1), { throwError: true });
      if (isPrimitive(target)) {
        throw new TypeError(illegalObjErrorMsg);
      }
      return {
        target: target,
        name: name
      };
    }
    if (isInitializerDescriptor(descriptor)) {
      return initialize(function (value) {
        var _getTargetAndName = getTargetAndName(other, this, key),
            target = _getTargetAndName.target,
            name = _getTargetAndName.name;

        setAlias(this, prop, descriptor, target, name, { force: force, omit: omit });
        return value;
      })(obj, prop, descriptor);
    }
    if (isAccessorDescriptor(descriptor)) {
      var inited = void 0;
      var handler = function handler(value) {
        if (inited) return value;

        var _getTargetAndName2 = getTargetAndName(other, this, key),
            target = _getTargetAndName2.target,
            name = _getTargetAndName2.name;

        setAlias(this, prop, descriptor, target, name, { force: force, omit: omit });
        inited = true;
        return value;
      };
      return accessor({ get: handler, set: handler })(obj, prop, descriptor);
    }

    var _getTargetAndName3 = getTargetAndName(other, obj, key),
        target = _getTargetAndName3.target,
        name = _getTargetAndName3.name;

    setAlias(obj, prop, descriptor, target, name, { force: force, omit: omit });
    return descriptor;
  };
}

var defineProperty$1$1 = _Object$defineProperty;

function classify(decorator) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      requirement = _ref.requirement,
      _ref$customArgs = _ref.customArgs,
      customArgs = _ref$customArgs === undefined ? false : _ref$customArgs;

  return function () {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$exclude = _ref2.exclude,
        exclude = _ref2$exclude === undefined ? [] : _ref2$exclude,
        _ref2$include = _ref2.include,
        include = _ref2$include === undefined ? [] : _ref2$include,
        _ref2$construct = _ref2.construct,
        construct = _ref2$construct === undefined ? false : _ref2$construct,
        _ref2$self = _ref2.self,
        self = _ref2$self === undefined ? false : _ref2$self;

    if (!isArray$1(exclude)) throw new TypeError('options.exclude must be an array');
    if (!isArray$1(include)) throw new TypeError('options.include must be an array');
    return function (Klass) {
      var isClass = isFunction(Klass);
      if (!self && !isClass) throw new TypeError('@' + decorator.name + 'Class can only be used on class');
      if (self && isPrimitive(Klass)) throw new TypeError('@' + decorator.name + 'Class must be used on non-primitive type value in \'self\' mode');
      var prototype = self ? Klass : Klass.prototype;
      if (isVoid(prototype)) throw new Error('The prototype of the ' + Klass.name + ' is empty, please check it');
      var descs = getOwnPropertyDescriptors(prototype);
      getOwnKeys(prototype).concat(include).forEach(function (key) {
        var desc = descs[key];
        if (key === 'constructor' && !construct || self && isClass && ['name', 'length', 'prototype'].indexOf(key) > -1 || exclude.indexOf(key) > -1 || isFunction(requirement) && requirement(prototype, key, desc, { self: self }) === false) return;
        defineProperty$1$1(prototype, key, (customArgs ? decorator.apply(undefined, _toConsumableArray(args)) : decorator)(prototype, key, desc));
      });
    };
  };
}

var autobindClass = classify(autobind, {
  requirement: function requirement(obj, prop, desc) {
    // $FlowFixMe: it's data descriptor now
    return isDataDescriptor(desc) && isFunction(desc.value);
  }
});

var mapStore = void 0;
// save bound function for super
function getBoundSuper(obj, fn) {
  if (typeof _WeakMap === 'undefined') {
    throw new Error('Using @autobind on ' + fn.name + '() requires WeakMap support due to its use of super.' + fn.name + '()');
  }

  if (!mapStore) {
    mapStore = new _WeakMap();
  }

  if (mapStore.has(obj) === false) {
    mapStore.set(obj, new _WeakMap());
  }

  var superStore = mapStore.get(obj);
  // $FlowFixMe: already insure superStore is not undefined
  if (superStore.has(fn) === false) {
    // $FlowFixMe: already insure superStore is not undefined
    superStore.set(fn, bind(fn, obj));
  }
  // $FlowFixMe: already insure superStore is not undefined
  return superStore.get(fn);
}
/**
 * auto bind the function on the class, just support function
 * @param {Object} obj Target Object
 * @param {string} prop prop strong
 * @param {Object} descriptor
 */
function autobind(obj, prop, descriptor) {
  if (arguments.length === 1) return autobindClass()(obj);

  var _ref = descriptor || {},
      fn = _ref.value,
      configurable = _ref.configurable;

  if (!isFunction(fn)) {
    throw new TypeError('@autobind can only be used on functions, not "' + fn + '" in ' + (typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) + ' on property "' + prop + '"');
  }
  var constructor = obj.constructor;

  return {
    configurable: configurable,
    enumerable: false,
    get: function get() {
      var _this = this;

      var boundFn = function boundFn() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return fn.call.apply(fn, [_this].concat(_toConsumableArray(args)));
      };
      // Someone accesses the property directly on the prototype on which it is
      // actually defined on, i.e. Class.prototype.hasOwnProperty(key)
      if (this === obj) {
        return fn;
      }
      // Someone accesses the property directly on a prototype,
      // but it was found up the chain, not defined directly on it
      // i.e. Class.prototype.hasOwnProperty(key) == false && key in Class.prototype
      if (this.constructor !== constructor && _Object$getPrototypeOf(this).constructor === constructor) {
        return fn;
      }

      // Autobound method calling super.sameMethod() which is also autobound and so on.
      if (this.constructor !== constructor && prop in this.constructor.prototype) {
        return getBoundSuper(this, fn);
      }
      _Object$defineProperty(this, prop, {
        configurable: true,
        writable: true,
        // NOT enumerable when it's a bound method
        enumerable: false,
        value: boundFn
      });

      return boundFn;
    },

    set: createDefaultSetter(prop)
  };
}

var defineProperty$2$1 = _Object$defineProperty;
/**
 * make one attr only can be read, but could not be rewrited/ deleted
 * @param {Object} obj
 * @param {string} prop
 * @param {Object} descriptor
 * @return {descriptor}
 */

function frozen(obj, prop, descriptor) {
  if (descriptor === undefined) {
    /* istanbul ignore else  */
    return {
      value: undefined,
      writable: false,
      enumerable: false,
      configurable: false
    };
  }
  descriptor.enumerable = false;
  descriptor.configurable = false;
  if (isAccessorDescriptor(descriptor)) {
    var _get = descriptor.get;

    descriptor.set = undefined;
    if (!isFunction(_get)) {
      /* istanbul ignore else  */
      return;
    }
    return {
      get: function get() {
        var value = bind(_get, this)();
        defineProperty$2$1(this, prop, {
          value: value,
          writable: false,
          configurable: false,
          enumerable: false
        });
        return value;
      },

      set: undefined,
      configurable: false,
      enumerable: false
    };
  }
  // $FlowFixMe: comeon, can disjoint union be reliable?
  descriptor.writable = false;
  return descriptor;
}

var getOwnPropertyDescriptor$2$1 = _Object$getOwnPropertyDescriptor;
var defineProperty$3$1 = _Object$defineProperty;

function waituntil(key) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      other = _ref.other;

  if (!isFunction(key) && !isPromise(key) && !isString(key)) throw new TypeError('@waitUntil only accept Function, Promise or String');
  return function (obj, prop, descriptor) {
    var _ref2 = descriptor || {},
        _value = _ref2.value,
        configurable = _ref2.configurable;

    if (!isFunction(_value)) throw new TypeError('@waituntil can only be used on function, but not ' + _value + ' on property "' + prop + '"');
    var binded = false;
    var waitingQueue = [];
    var canIRun = isPromise(key) ? function () {
      return key;
    } : isFunction(key) ? key : function () {
      // $FlowFixMe: We have use isPromise to exclude
      var keys$$1 = key.split('.');
      var prop = keys$$1.slice(-1);
      var originTarget = isPrimitive(other) ? this : other;
      if (!binded) {
        var target = getDeepProperty(originTarget, keys$$1.slice(0, -1));
        if (isVoid(target)) return target;
        var _descriptor = getOwnPropertyDescriptor$2$1(target, prop);
        /**
         * create a setter hook here
         * when it get ture, it will run all function in waiting queue immediately
         */
        var set = function set(value) {
          if (value === true) {
            while (waitingQueue.length > 0) {
              waitingQueue[0]();
              waitingQueue.shift();
            }
          }
          return value;
        };
        var desc = isDescriptor(_descriptor) ? accessor({ set: set })(target, prop, _descriptor) : accessor({ set: set })(target, prop, {
          value: undefined,
          configurable: true,
          enumerable: true,
          writable: true
        });
        defineProperty$3$1(target, prop, desc);
        binded = true;
      }
      return getDeepProperty(originTarget, keys$$1);
    };
    return {
      value: function value() {
        var _this = this;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var boundFn = bind(_value, this);
        var runnable = bind(canIRun, this).apply(undefined, args);
        if (isPromise(runnable)) {
          return _Promise.resolve(runnable).then(function () {
            return bind(_value, _this).apply(undefined, args);
          });
        } else if (runnable === true) {
          return bind(_value, this).apply(undefined, args);
        } else {
          return new _Promise(function (resolve) {
            var cb = function cb() {
              boundFn.apply(undefined, args);
              resolve();
            };
            waitingQueue.push(cb);
          });
        }
      },

      // function should not be enmuerable
      enumerable: false,
      configurable: configurable,
      // as we have delay this function
      // it's not a good idea to change it
      writable: false
    };
  };
}

function nonenumerable(obj, prop, descriptor) {
  if (descriptor === undefined) {
    return {
      value: undefined,
      enumerable: false,
      configurable: true,
      writable: true
    };
  }
  descriptor.enumerable = false;
  return descriptor;
}

var defineProperty$6 = _Object$defineProperty;
var getOwnPropertyDescriptor$3$1 = _Object$getOwnPropertyDescriptor;


function applyDecorators(Class, props) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$self = _ref.self,
      self = _ref$self === undefined ? false : _ref$self,
      _ref$omit = _ref.omit,
      omit = _ref$omit === undefined ? false : _ref$omit;

  var isPropsFunction = isFunction(props);
  if (isPropsFunction || isArray$1(props)) {
    // apply decorators on class
    if (!isFunction(Class)) throw new TypeError('If you want to decorator class, you must pass it a legal class');
    // $FlowFixMe: Terrible union, it's function now
    if (isPropsFunction) props(Class);else {
      // $FlowFixMe: Terrible union, it's array now
      for (var i = 0, len = props.length; i < len; i++) {
        // $FlowFixMe: Terrible union, it's array now
        var fn = props[i];
        if (!isFunction(fn)) throw new TypeError('If you want to decorate an class, you must pass it function or array of function');
        fn(Class);
      }
    }
    return Class;
  }
  if (!self && !isFunction(Class)) throw new TypeError('applyDecorators only accept class as first arguments. If you want to modify instance, you should set options.self true.');
  if (self && isPrimitive(Class)) throw new TypeError("We can't apply docorators on a primitive value, even in self mode");
  if (!isObject$1(props)) throw new TypeError('applyDecorators only accept object as second arguments');
  var prototype = self ? Class : Class.prototype;
  if (isVoid(prototype)) throw new Error('The class muse have a prototype, please take a check');
  for (var key in props) {
    var value = props[key];
    var decorators = isArray$1(value) ? value : [value];
    var handler = void 0;
    try {
      handler = compressMultipleDecorators.apply(undefined, _toConsumableArray(decorators));
    } catch (err) {
      /* istanbul ignore else  */
      throw new Error('The decorators set on props must be Function or Array of Function');
    }
    var descriptor = getOwnPropertyDescriptor$3$1(prototype, key);
    if (descriptor && !descriptor.configurable) {
      if (!omit) throw new Error(key + ' of ' + prototype + ' is unconfigurable');
      continue;
    }
    defineProperty$6(prototype, key, handler(prototype, key, descriptor));
  }
  return Class;
}

var arrayChangeMethod = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse'];

function deepProxy(value, hook, _ref) {
  var _operateProps;

  var diff = _ref.diff,
      operationPrefix = _ref.operationPrefix;

  var mapStore = {};
  var arrayChanging = false;
  var proxyValue = new Proxy(value, {
    get: function get(target, property, receiver) {
      var value = target[property];
      if (isArray$1(target) && arrayChangeMethod.indexOf(property) > -1) {
        return function () {
          arrayChanging = true;
          bind(value, receiver).apply(undefined, arguments);
          arrayChanging = false;
          hook();
        };
      }
      if (mapStore[property] === true) return value;
      if (isObject$1(value) || isArray$1(value)) {
        var _proxyValue = mapStore[property] || deepProxy(value, hook, { diff: diff, operationPrefix: operationPrefix });
        mapStore[property] = _proxyValue;
        return _proxyValue;
      }
      mapStore[property] = true;
      return value;
    },
    set: function set(target, property, value) {
      var oldVal = target[property];
      var newVal = isObject$1(value) || isArray$1(value) ? deepProxy(value, hook, { diff: diff, operationPrefix: operationPrefix }) : value;
      target[property] = newVal;
      mapStore[property] = true;
      if (arrayChanging || diff && oldVal === newVal) return true;
      hook();
      return true;
    },
    deleteProperty: function deleteProperty(target, property) {
      delete target[property];
      delete mapStore[property];
      if (arrayChanging) return true;
      hook();
      return true;
    }
  });
  var operateProps = (_operateProps = {}, _defineProperty$1(_operateProps, operationPrefix + 'set', [initialize(function (method) {
    return function (property, val) {
      // $FlowFixMe: we have check the computed value
      proxyValue[property] = val;
    };
  }), nonenumerable]), _defineProperty$1(_operateProps, operationPrefix + 'del', [initialize(function (method) {
    return function (property) {
      // $FlowFixMe: we have check the computed value
      delete proxyValue[property];
    };
  }), nonenumerable]), _operateProps);
  applyDecorators(proxyValue, operateProps, { self: true });
  return proxyValue;
}

function deepObserve(value, hook, _ref2) {
  var _this = this,
      _operateProps2;

  var operationPrefix = _ref2.operationPrefix,
      diff = _ref2.diff;

  var mapStore = {};
  var arrayChanging = false;
  function getPropertyDecorators(keys$$1) {
    var oldVal = void 0;
    return keys$$1.reduce(function (props, key) {
      props[key] = [accessor({
        set: function set(value) {
          oldVal = this[key];
          return value;
        }
      }), accessor({
        get: function get(val) {
          if (mapStore[key]) return val;
          if (isObject$1(val) || isArray$1(val)) {
            deepObserve(val, hook, { operationPrefix: operationPrefix, diff: diff });
          }
          mapStore[key] = true;
          return val;
        },
        set: function set(val) {
          if (isObject$1(val) || isArray$1(val)) deepObserve(val, hook, { operationPrefix: operationPrefix, diff: diff });
          mapStore[key] = true;
          if (!arrayChanging && (!diff || oldVal !== val)) hook();
          return val;
        }
      }, { preSet: false })];
      return props;
    }, {});
  }
  var props = getPropertyDecorators(getOwnKeys(value));
  applyDecorators(value, props, { self: true, omit: true });
  if (isArray$1(value)) {
    var methodProps = arrayChangeMethod.reduce(function (props, key) {
      props[key] = [initialize(function (method) {
        method = isFunction(method) ? method
        // $FlowFixMe: we have check the key
        : Array.prototype[key];
        return function () {
          var originLength = value.length;
          arrayChanging = true;
          bind(method, value).apply(undefined, arguments);
          arrayChanging = false;
          if (originLength < value.length) {
            var keys$$1 = new Array(value.length - originLength).fill(1).map(function (value, index) {
              return (index + originLength).toString();
            });
            var _props = getPropertyDecorators(keys$$1);
            applyDecorators(value, _props, { self: true, omit: true });
          }
          hook();
        };
      }), nonenumerable];
      return props;
    }, {});
    applyDecorators(value, methodProps, { self: true });
  }
  var operateProps = (_operateProps2 = {}, _defineProperty$1(_operateProps2, operationPrefix + 'set', [initialize(function (method) {
    return function (property, val) {
      var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          disable = _ref3.disable,
          isNewVal = _ref3.isNewVal;

      isNewVal = isNewVal || getOwnKeys(value).indexOf(property) === -1;
      if (isFunction(method)) {
        bind(method, _this)(property, val, { disable: true, isNewVal: isNewVal });
      }
      if (isNewVal) {
        var _props2 = getPropertyDecorators([property]);
        applyDecorators(value, _props2, { self: true, omit: true });
      }
      if (!disable) {
        value[property] = val;
      }
    };
  }), nonenumerable]), _defineProperty$1(_operateProps2, operationPrefix + 'del', [initialize(function (method) {
    return function (property) {
      if (isFunction(method)) {
        bind(method, _this)(property);
      } else {
        delete value[property];
      }
      hook();
    };
  }), nonenumerable]), _operateProps2);
  applyDecorators(value, operateProps, { self: true });
  return value;
}

function watch() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var option = isObject$1(args[args.length - 1]) ? args[args.length - 1] : {};
  // $FlowFixMe: we have check if it's an object
  var deep = option.deep,
      omit = option.omit,
      other = option.other,
      _option$operationPref = option.operationPrefix,
      operationPrefix = _option$operationPref === undefined ? '__' : _option$operationPref,
      _option$diff = option.diff,
      diff = _option$diff === undefined ? true : _option$diff;
  // $FlowFixMe: we have check if it's an object

  var proxy = option.proxy;

  if (typeof Proxy !== 'function') {
    proxy = false;
    /* istanbul ignore else  */
    
  }
  if (!args.length) throw new TypeError('You must pass a function or a string to find the hanlder function.');
  if (other !== undefined && isPrimitive(other)) throw new TypeError('If you want us to trigger function on the other instance, you must pass in a legal instance');
  if (!isString(operationPrefix)) throw new TypeError('operationPrefix must be an string');
  return function (obj, prop, descriptor) {
    var fns = args.reduce(function (fns, keyOrFn, index) {
      if (!isString(keyOrFn) && !isFunction(keyOrFn)) {
        if (!index || index !== args.length - 1) throw new TypeError('You can only pass function or string as handler');
        return fns;
      }
      fns.push(isString(keyOrFn) ? function (newVal, oldVal) {
        var target = other || obj;
        // $FlowFixMe: we have ensure it must be a string
        var fn = getDeepProperty(target, keyOrFn);
        if (!isFunction(fn)) {
          if (!omit) throw new Error('You pass in a function for us to trigger, please ensure the property to be a function or set omit flag true');
          return;
        }
        return bind(fn, this)(newVal, oldVal);
      } : keyOrFn);
      return fns;
    }, []);
    var handler = function handler(newVal, oldVal) {
      var _this2 = this;

      fns.forEach(function (fn) {
        return bind(fn, _this2)(newVal, oldVal);
      });
    };
    var inited = false;
    var oldVal = void 0;
    var newVal = void 0;
    var proxyValue = void 0;
    return compressMultipleDecorators(accessor({
      set: function set(value) {
        var _this3 = this;

        oldVal = this[prop];
        proxyValue = undefined;
        var hook = function hook() {
          return bind(handler, _this3)(newVal, oldVal);
        };
        return deep && (isObject$1(value) || isArray$1(value)) ? proxy ? deepProxy(value, hook, { diff: diff, operationPrefix: operationPrefix }) : deepObserve(value, hook, { operationPrefix: operationPrefix, diff: diff }) : value;
      },
      get: function get(value) {
        var _this4 = this;

        if (proxyValue) return proxyValue;
        if (!inited) {
          inited = true;
          var hook = function hook() {
            return bind(handler, _this4)(newVal, oldVal);
          };
          if (deep && (isObject$1(value) || isArray$1(value))) {
            if (proxy) {
              proxyValue = deepProxy(value, hook, { diff: diff, operationPrefix: operationPrefix });
              oldVal = proxyValue;
              newVal = proxyValue;
              return proxyValue;
            }
            deepObserve(value, hook, { operationPrefix: operationPrefix, diff: diff });
          }
          oldVal = value;
          newVal = value;
        }
        return value;
      }
    }, { preSet: true }), accessor({
      set: function set(value) {
        newVal = value;
        if (!diff || oldVal !== value) bind(handler, this)(newVal, oldVal);
        oldVal = value;
        return value;
      }
    }, { preSet: false }))(obj, prop, descriptor);
  };
}

function runnable(key) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      other = _ref.other,
      backup = _ref.backup;

  if (!isFunction(key) && !isString(key)) throw new TypeError('@runnable only accept Function or String');
  return function (obj, prop, descriptor) {
    var _ref2 = descriptor || {},
        _value = _ref2.value,
        configurable = _ref2.configurable;

    if (!isFunction(_value)) throw new TypeError('@runnable can only be used on method, but not ' + _value + ' on property "' + prop + '".');
    var canIRun = isFunction(key) ? key : function () {
      var keys$$1 = key.split('.');
      var originTarget = isPrimitive(other) ? this : other;
      return getDeepProperty(originTarget, keys$$1);
    };
    backup = isFunction(backup) ? backup : function () {};
    return {
      value: function value() {
        if (bind(canIRun, this).apply(undefined, arguments) === true) {
          return bind(_value, this).apply(undefined, arguments);
        } else {
          // $FlowFixMe: I have reassign it when it's not a function
          return bind(backup, this).apply(undefined, arguments);
        }
      },

      // function should not be enmuerable
      enumerable: false,
      configurable: configurable,
      // as we have delay this function
      // it's not a good idea to change it
      writable: false
    };
  };
}

function nonconfigurable(obj, prop, descriptor) {
  if (descriptor === undefined) {
    return {
      value: undefined,
      enumerable: true,
      configurable: true,
      writable: true
    };
  }
  descriptor.configurable = true;
  return descriptor;
}

function string() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = isString(args[0]) ? args.shift() : '';
  args.unshift(function (value) {
    return isString(value) ? value : defaultValue;
  });
  return initialize.apply(undefined, args);
}

function boolean() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = isBoolean(args[0]) ? args.shift() : false;
  args.unshift(function (value) {
    return isBoolean(value) ? value : defaultValue;
  });
  return initialize.apply(undefined, args);
}

function string$1() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = isString(args[0]) ? args.shift() : '';
  args.unshift(function (value) {
    return isString(value) ? value : defaultValue;
  });
  return accessor({ set: args, get: args });
}

function boolean$1() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = isBoolean(args[0]) ? args.shift() : false;
  args.unshift(function (value) {
    return isBoolean(value) ? value : defaultValue;
  });
  return accessor({ set: args, get: args });
}

function number$1() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var defaultValue = isNumber(args[0]) ? args.shift() : 0;
  args.unshift(function (value) {
    return isNumber(value) ? value : defaultValue;
  });
  return accessor({ set: args, get: args });
}

var $JSON$1 = _core.JSON || (_core.JSON = { stringify: JSON.stringify });
var stringify$2 = function stringify(it) { // eslint-disable-line no-unused-vars
  return $JSON$1.stringify.apply($JSON$1, arguments);
};

var stringify = createCommonjsModule(function (module) {
module.exports = { "default": stringify$2, __esModule: true };
});

unwrapExports(stringify);

_export(_export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});

var isNan$1 = _core.Number.isNaN;

var isNan = createCommonjsModule(function (module) {
module.exports = { "default": isNan$1, __esModule: true };
});

var _Number$isNaN = unwrapExports(isNan);

/**
 * es-fullscreen v0.2.1
 * (c) 2017 toxic-johann
 * Released under MIT
 */

var VENDOR_PREFIXES = ['', 'o', 'ms', 'moz', 'webkit', 'webkitCurrent'];

var SYNONYMS = [['', ''], // empty
['exit', 'cancel'], // firefox & old webkits expect cancelFullScreen instead of exitFullscreen
['screen', 'Screen'] // firefox expects FullScreen instead of Fullscreen
];

var DESKTOP_FULLSCREEN_STYLE = {
  position: 'fixed',
  zIndex: '2147483647',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  width: '100%',
  height: '100%'
};

var FULLSCREEN_CHANGE = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];

var FULLSCREEN_ERROR = ['fullscreenerror', 'webkitfullscreenerror', 'mozfullscreenerror', 'MSFullscreenError'];

function setStyle$1(el, key, val) {
  if (isObject$1(key)) {
    for (var k in key) {
      setStyle$1(el, k, key[k]);
    }
  } else {
    // $FlowFixMe: we found it
    el.style[key] = val;
  }
}

function native(target, name) {
  var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (isObject$1(name)) {
    option = name;
  }
  if (isString(target)) {
    name = target;
  }
  if (!isElement(target)) {
    target = document;
  }
  if (!isString(name)) throw new Error('You must pass in a string as name, but not ' + (typeof name === 'undefined' ? 'undefined' : _typeof(name)) + '.');
  var _option = option,
      _option$keyOnly = _option.keyOnly,
      keyOnly = _option$keyOnly === undefined ? false : _option$keyOnly;

  for (var i = 0; i < SYNONYMS.length; i++) {
    name = name.replace(SYNONYMS[i][0], SYNONYMS[i][1]);
    for (var j = 0; j < VENDOR_PREFIXES.length; j++) {
      var prefixed = j === 0 ? name : VENDOR_PREFIXES[j] + name.charAt(0).toUpperCase() + name.substr(1);
      // $FlowFixMe: we support document computed property here
      if (target[prefixed] !== undefined) return keyOnly ? prefixed : target[prefixed];
    }
  }
  return keyOnly ? '' : undefined;
}

function dispatchEvent(element, name) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$bubbles = _ref.bubbles,
      bubbles = _ref$bubbles === undefined ? true : _ref$bubbles,
      _ref$cancelable = _ref.cancelable,
      cancelable = _ref$cancelable === undefined ? true : _ref$cancelable;

  var event = void 0;
  /* istanbul ignore else  */
  if (isFunction(Event)) {
    event = new Event(name, {
      bubbles: bubbles,
      cancelable: cancelable
    });
  } else if (document.createEvent) {
    event = document.createEvent('HTMLEvents');
    event.initEvent(name, true, true);
  } else if (document.createEventObject) {
    // $FlowFixMe: IE < 9
    event = document.createEventObject();
    event.eventType = name;
    event.eventName = name;
  }
  /* istanbul ignore next  */
  if (!isObject$1(event) && !isEvent(event)) throw new Error("We can't create an object on this browser, please report to author");
  /* istanbul ignore else  */
  if (element.dispatchEvent) {
    element.dispatchEvent(event);
    // $FlowFixMe: IE < 9
  } else if (element.fireEvent) {
    // $FlowFixMe: IE < 9
    element.fireEvent('on' + event.eventType, event); // can trigger only real event (e.g. 'click')
    // $FlowFixMe: support computed key
  } else if (element[name]) {
    // $FlowFixMe: support computed key
    element[name]();
    // $FlowFixMe: support computed key
  } else if (element['on' + name]) {
    // $FlowFixMe: support computed key
    element['on' + name]();
  }
}

var _dec$1$1;
var _dec2$1$1;
var _dec3$1$1;
var _dec4$1$1;
var _dec5$1$1;
var _class$1$1;
var _class2$1$1;

function _applyDecoratedDescriptor$1$1(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var fullscreenEnabled = native('fullscreenEnabled');

var ESFullScreen = (_dec$1$1 = autobindClass(), _dec2$1$1 = alias('requestFullscreen'), _dec3$1$1 = alias('exitFullscreen'), _dec4$1$1 = alias('addEventListener'), _dec5$1$1 = alias('removeEventListener'), _dec$1$1(_class$1$1 = (_class2$1$1 = function () {
  function ESFullScreen() {
    _classCallCheck(this, ESFullScreen);

    this._fullscreenElement = null;
    this.isNativelySupport = defined$1(native('fullscreenElement')) && (!defined$1(fullscreenEnabled) || fullscreenEnabled === true);
    this._openKey = native(document.body, 'requestFullscreen', { keyOnly: true });
    this._exitKey = native('exitFullscreen', { keyOnly: true });
  }

  _createClass(ESFullScreen, [{
    key: 'open',
    value: function open(element) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$force = _ref.force,
          force = _ref$force === undefined ? false : _ref$force;

      /* istanbul ignore else  */
      var originElement = this.fullscreenElement;
      if (originElement && originElement !== element) {
        if (!force) {
          dispatchEvent(document, 'fullscreenerror');
          return false;
        }
        this.exit();
      }

      if (this.isNativelySupport) {
        // $FlowFixMe: support computed key on HTMLElment here
        element[this._openKey]();
        return true;
      }
      this._savedStyles = _Object$keys(DESKTOP_FULLSCREEN_STYLE).reduce(function (styles, key) {
        // $FlowFixMe: support string here
        styles[key] = element.style[key];
        return styles;
      }, {});
      setStyle$1(element, DESKTOP_FULLSCREEN_STYLE);

      /* istanbul ignore else  */
      if (document.body) {
        this._bodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      }
      /* istanbul ignore else  */
      if (document.documentElement) {
        this._htmlOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
      }

      this._fullscreenElement = element;
      dispatchEvent(element, 'fullscreenchange');
      return true;
    }
  }, {
    key: 'exit',
    value: function exit() {
      if (!this.isFullscreen) return false;
      if (this.isNativelySupport) {
        // $FlowFixMe: support document computed key here
        document[this._exitKey]();
        return true;
      }
      // $FlowFixMe: element is an Elment here
      var element = this._fullscreenElement;
      setStyle$1(element, this._savedStyles);
      /* istanbul ignore else  */
      if (document.body) document.body.style.overflow = this._bodyOverflow;
      /* istanbul ignore else  */
      if (document.documentElement) document.documentElement.style.overflow = this._htmlOverflow;

      this._fullscreenElement = null;
      this._savedStyles = {};
      dispatchEvent(element, 'fullscreenchange');
      return true;
    }
  }, {
    key: 'on',
    value: function on(name, fn) {
      var element = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;

      this._handleEvent(element, 'addEventListener', name, fn);
    }
  }, {
    key: 'off',
    value: function off(name, fn) {
      var element = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;

      this._handleEvent(element, 'removeEventListener', name, fn);
    }
  }, {
    key: '_handleEvent',
    value: function _handleEvent(element, behavior, name, fn) {
      /* istanbul ignore else  */
      var names = name === 'fullscreenchange' ? FULLSCREEN_CHANGE : FULLSCREEN_ERROR;
      names.forEach(function (name) {
        // $FlowFixMe: support computed attribute here
        element[behavior](name, fn);
      });
    }
  }, {
    key: 'fullscreenElement',
    get: function get() {
      var element = ['fullscreenElement', 'webkitFullscreenElement', 'mozFullScreenElement', 'msFullscreenElement'].reduce(function (element, key) {
        // $FlowFixMe: support computed element on document
        return element || document[key];
      }, null);
      return element || this._fullscreenElement;
    }
  }, {
    key: 'isFullscreen',
    get: function get() {
      return isElement(this.fullscreenElement);
    }
  }]);

  return ESFullScreen;
}(), _applyDecoratedDescriptor$1$1(_class2$1$1.prototype, 'open', [_dec2$1$1], _Object$getOwnPropertyDescriptor(_class2$1$1.prototype, 'open'), _class2$1$1.prototype), _applyDecoratedDescriptor$1$1(_class2$1$1.prototype, 'exit', [_dec3$1$1], _Object$getOwnPropertyDescriptor(_class2$1$1.prototype, 'exit'), _class2$1$1.prototype), _applyDecoratedDescriptor$1$1(_class2$1$1.prototype, 'on', [_dec4$1$1], _Object$getOwnPropertyDescriptor(_class2$1$1.prototype, 'on'), _class2$1$1.prototype), _applyDecoratedDescriptor$1$1(_class2$1$1.prototype, 'off', [_dec5$1$1], _Object$getOwnPropertyDescriptor(_class2$1$1.prototype, 'off'), _class2$1$1.prototype), _class2$1$1)) || _class$1$1);


var index = new ESFullScreen();

/**
 * chimee v0.6.3
 * (c) 2017 toxic-johann
 * Released under MIT
 */

var videoEvents = ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'encrypted', 'ended', 'error', 'interruptbegin', 'interruptend', 'loadeddata', 'loadedmetadata', 'loadstart', 'mozaudioavailable', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting'];
var videoReadOnlyProperties = ['buffered', 'currentSrc', 'duration', 'error', 'ended', 'networkState', 'paused', 'readyState', 'seekable', 'sinkId', 'controlsList', 'tabIndex', 'dataset', 'offsetHeight', 'offsetLeft', 'offsetParent', 'offsetTop', 'offsetWidth'];
var domEvents = ['beforeinput', 'blur', 'click', 'compositionend', 'compositionstart', 'compositionupdate', 'dblclick', 'focus', 'focusin', 'focusout', 'input', 'keydown', 'keypress', 'keyup', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'select', 'wheel', 'mousewheel', 'fullscreenchange', 'contextmenu', 'touchstart', 'touchmove', 'touchend'];
var passiveEvents = ['wheel', 'mousewheel', 'touchstart', 'touchmove'];
var selfProcessorEvents = ['silentLoad', 'fullscreen'];
var kernelMethods = ['play', 'pause', 'seek'];
var dispatcherMethods = ['load'];
var kernelEvents = ['mediaInfo', 'heartbeat', 'error'];
var domMethods = ['focus', 'fullscreen', 'requestFullscreen', 'exitFullscreen'];
var videoMethods = ['canPlayType', 'captureStream', 'setSinkId'];

var _dec$2;
var _dec2$1;
var _dec3$1;
var _dec4$1;
var _class$2;

function _applyDecoratedDescriptor$2(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var secondaryReg = /^(before|after|_)/;
function secondaryChecker(key) {
  if (key.match(secondaryReg)) {
    /* istanbul ignore else  */
    return false;
  }
  return true;
}
/**
 * <pre>
 * event Bus class. Bus take charge of commuication between plugins and user.
 * Some of the event may trigger the kernel to do some task.
 * An event will run in four lifecycle
 * before -> processor -> main -> after -> side effect(_)
 * -------------------- emit period ----------------
 * before: once an event emit, it will run through plugins in bubble to know is it possible to run.
 * processor: if sth need to be done on kernel. It will tell kernel. If kernel will trigger event later, it will break down here. Else will run into trigger period
 * -------------------- trigger period -----------------
 * main: this procedure will trigger the main event in bubble, which means it can be stop in one plugin.
 * after: once event run through all events. It will trigger after event. This event will be trigger in broadcast way.
 * side effect(_): This events will always trigger once we bump into trigger period. So that you can know if the events been blocked. But it's not advice to listen on this effect.
 * </pre>
 */
var Bus = (_dec$2 = runnable(secondaryChecker), _dec2$1 = runnable(secondaryChecker, {
  backup: function backup() {
    return false;
  }
}), _dec3$1 = runnable(secondaryChecker), _dec4$1 = runnable(secondaryChecker, {
  backup: function backup() {
    return false;
  }
}), _class$2 = function () {
  /**
   * @param {Dispatcheer} dispatcher bus rely on dispatcher, so you mush pass dispatcher at first when you generate Bus.
   * @return {Bus}
   */

  /**
   * the handler set of all events
   * @type {Object}
   * @member events
   */
  function Bus(dispatcher) {
    _classCallCheck(this, Bus);

    this.events = {};
    this.onceMap = {};

    /**
     * the referrence to dispatcher
     * @type {Dispatcher}
     */
    this.__dispatcher = dispatcher;
  }
  /**
   * [Can only be called in dispatcher]bind event on bus.
   * @param  {string} id plugin's id
   * @param  {string} key event's name
   * @param  {fn} handler function
   */


  _createClass(Bus, [{
    key: 'on',
    value: function on(id, key, fn) {
      var _getEventStage2 = this._getEventStage(key),
          stage = _getEventStage2.stage,
          eventName = _getEventStage2.key;

      this._addEvent([eventName, stage, id], fn);
    }
    /**
     * [Can only be called in dispatcher]remove event off bus. Only suggest one by one.
     * @param  {string} id plugin's id
     * @param  {string} key event's name
     * @param  {fn} handler function
     */

  }, {
    key: 'off',
    value: function off(id, key, fn) {
      var _getEventStage3 = this._getEventStage(key),
          stage = _getEventStage3.stage,
          eventName = _getEventStage3.key;

      var keys$$1 = [eventName, stage, id];
      var deleted = this._removeEvent(keys$$1, fn);
      if (deleted) return;
      var handler = this._getHandlerFromOnceMap(keys$$1, fn);
      if (isFunction(handler)) {
        this._removeEvent(keys$$1, handler) && this._removeFromOnceMap(keys$$1, fn, handler);
      }
    }
    /**
     * [Can only be called in dispatcher]bind event on bus and remove it once event is triggered.
     * @param  {string} id plugin's id
     * @param  {string} key event's name
     * @param  {Function} fn handler function
     */

  }, {
    key: 'once',
    value: function once(id, key, fn) {
      var _getEventStage4 = this._getEventStage(key),
          stage = _getEventStage4.stage,
          eventName = _getEventStage4.key;

      var bus = this;
      var keys$$1 = [eventName, stage, id];
      var handler = function handler() {
        // keep the this so that it can run
        bind(fn, this).apply(undefined, arguments);
        bus._removeEvent(keys$$1, handler);
        bus._removeFromOnceMap(keys$$1, fn, handler);
      };
      this._addEvent(keys$$1, handler);
      this._addToOnceMap(keys$$1, fn, handler);
    }
    /**
     * [Can only be called in dispatcher]emit an event, which will run before -> processor period.
     * It may stop in before period.
     * @param  {string}    key event's name
     * @param  {anything} args other argument will be passed into handler
     * @return {Promise}  this promise maybe useful if the event would not trigger kernel event. In that will you can know if it runs successful. But you can know if the event been stopped by the promise.
     */

  }, {
    key: 'emit',
    value: function emit(key) {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var event = this.events[key];
      if (isEmpty(event)) {
        if (selfProcessorEvents.indexOf(key) > -1) return _Promise.resolve();
        // $FlowFixMe: conditional return here
        return this._eventProcessor.apply(this, [key, { sync: false }].concat(_toConsumableArray(args)));
      }
      var beforeQueue = this._getEventQueue(event.before, this.__dispatcher.order);
      return runRejectableQueue.apply(undefined, [beforeQueue].concat(_toConsumableArray(args))).then(function () {
        if (selfProcessorEvents.indexOf(key) > -1) return;
        return _this._eventProcessor.apply(_this, [key, { sync: false }].concat(_toConsumableArray(args)));
      }).catch(function (error) {
        if (isError(error)) _this.__dispatcher.throwError(error);
        return _Promise.reject(error);
      });
    }
    /**
     * [Can only be called in dispatcher]emit an event, which will run before -> processor period synchronize.
     * It may stop in before period.
     * @param  {string}    key event's name
     * @param  {anything} args other argument will be passed into handler
     * @return {Promise}  this promise maybe useful if the event would not trigger kernel event. In that will you can know if it runs successful. But you can know if the event been stopped by the promise.
     */

  }, {
    key: 'emitSync',
    value: function emitSync(key) {
      var event = this.events[key];

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      if (isEmpty(event)) {
        if (selfProcessorEvents.indexOf(key) > -1) return true;
        // $FlowFixMe: conditional return here
        return this._eventProcessor.apply(this, [key, { sync: true }].concat(_toConsumableArray(args)));
      }
      var beforeQueue = this._getEventQueue(event.before, this.__dispatcher.order);
      return runStoppableQueue.apply(undefined, [beforeQueue].concat(_toConsumableArray(args))) && (selfProcessorEvents.indexOf(key) > -1 ||
      // $FlowFixMe: conditional return here
      this._eventProcessor.apply(this, [key, { sync: true }].concat(_toConsumableArray(args))));
    }
    /**
     * [Can only be called in dispatcher]trigger an event, which will run main -> after -> side effect period
     * @param  {string}    key event's name
     * @param  {anything} args
     * @return {Promise|undefined}    you can know if event trigger finished~ However, if it's unlegal
     */

  }, {
    key: 'trigger',
    value: function trigger(key) {
      var _this2 = this;

      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      var event = this.events[key];
      if (isEmpty(event)) {
        return _Promise.resolve(true);
      }
      var mainQueue = this._getEventQueue(event.main, this.__dispatcher.order);
      return runRejectableQueue.apply(undefined, [mainQueue].concat(_toConsumableArray(args))).then(function () {
        var afterQueue = _this2._getEventQueue(event.after, _this2.__dispatcher.order);
        return runRejectableQueue.apply(undefined, [afterQueue].concat(_toConsumableArray(args)));
      }).then(function () {
        return _this2._runSideEffectEvent.apply(_this2, [key, _this2.__dispatcher.order].concat(_toConsumableArray(args)));
      }).catch(function (error) {
        if (isError(error)) _this2.__dispatcher.throwError(error);
        return _this2._runSideEffectEvent.apply(_this2, [key, _this2.__dispatcher.order].concat(_toConsumableArray(args)));
      });
    }
    /**
     * [Can only be called in dispatcher]trigger an event, which will run main -> after -> side effect period in synchronize
     * @param  {string}    key event's name
     * @param  {anything} args
     * @return {boolean}    you can know if event trigger finished~ However, if it's unlegal
     */

  }, {
    key: 'triggerSync',
    value: function triggerSync(key) {
      var event = this.events[key];
      if (isEmpty(event)) {
        return true;
      }
      var mainQueue = this._getEventQueue(event.main, this.__dispatcher.order);
      var afterQueue = this._getEventQueue(event.after, this.__dispatcher.order);

      for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      var result = runStoppableQueue.apply(undefined, [mainQueue].concat(_toConsumableArray(args))) && runStoppableQueue.apply(undefined, [afterQueue].concat(_toConsumableArray(args)));
      this._runSideEffectEvent.apply(this, [key, this.__dispatcher.order].concat(_toConsumableArray(args)));
      return result;
    }
    /**
     * destroy hook which will be called when object destroy
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      delete this.events;
      delete this.__dispatcher;
    }
    /**
     * add event into bus
     * @private
     * @param {Array} keys keys map pointing to position to put event handler
     * @param {function} fn handler to put
     */

  }, {
    key: '_addEvent',
    value: function _addEvent(keys$$1, fn) {
      keys$$1 = deepClone(keys$$1);
      var id = keys$$1.pop();
      var target = keys$$1.reduce(function (target, key) {
        target[key] = target[key] || {};
        return target[key];
      }, this.events);
      // events will store like {play: {main: {plugin: []}}}
      target[id] = target[id] || [];
      target[id].push(fn);
    }
    /**
     * remove event from bus
     * @private
     * @param {Array} keys keys map pointing to position to get event handler
     * @param {function} fn handler to put
     */

  }, {
    key: '_removeEvent',
    value: function _removeEvent(keys$$1, fn) {
      keys$$1 = deepClone(keys$$1);
      var id = keys$$1.pop();
      var target = this.events;
      for (var i = 0, len = keys$$1.length; i < len; i++) {
        var son = target[keys$$1[i]];
        // if we can't find the event binder, just return
        if (isEmpty(son)) return;
        target = son;
      }
      var queue = target[id] || [];
      var index$$1 = queue.indexOf(fn);
      var hasFn = index$$1 > -1;
      // if we found handler remove it
      if (hasFn) {
        queue.splice(index$$1, 1);
      }
      // if this plugin has no event binding, we remove this event session, which make us perform faster in emit & trigger period.
      if (queue.length < 1) {
        delete target[id];
      }
      return hasFn;
    }
  }, {
    key: '_addToOnceMap',
    value: function _addToOnceMap(keys$$1, fn, handler) {
      var key = keys$$1.join('-');
      var map$$1 = this.onceMap[key] = this.onceMap[key] || new _Map();
      if (!map$$1.has(fn)) map$$1.set(fn, []);
      var handlers = map$$1.get(fn);
      // $FlowFixMe: flow do not understand map yet
      handlers.push(handler);
    }
  }, {
    key: '_removeFromOnceMap',
    value: function _removeFromOnceMap(keys$$1, fn, handler) {
      var key = keys$$1.join('-');
      var map$$1 = this.onceMap[key];
      // do not need to check now
      // if(isVoid(map) || !map.has(fn)) return;
      var handlers = map$$1.get(fn);
      var index$$1 = handlers.indexOf(handler);
      handlers.splice(index$$1, 1);
      if (isEmpty(handlers)) map$$1.delete(fn);
    }
  }, {
    key: '_getHandlerFromOnceMap',
    value: function _getHandlerFromOnceMap(keys$$1, fn) {
      var key = keys$$1.join('-');
      var map$$1 = this.onceMap[key];
      if (isVoid(map$$1) || !map$$1.has(fn)) return;
      var handlers = map$$1.get(fn);
      return handlers[0];
    }
    /**
     * get event stage by evnet key name
     * @private
     * @param  {key} key event's name
     * @return {stage}  event stage
     */

  }, {
    key: '_getEventStage',
    value: function _getEventStage(key) {
      var secondaryCheck = key.match(secondaryReg);
      var stage = secondaryCheck && secondaryCheck[0] || 'main';
      if (secondaryCheck) {
        key = camelize(key.replace(secondaryReg, ''));
      }
      return { stage: stage, key: key };
    }
    /**
     * get event handlers queue to run
     * @private
     * @param  {Object} handlerSet the object include all handler
     * @param  {Array} Array form of plugin id
     * @return {Array<Function>} event handler in queue to run
     */

  }, {
    key: '_getEventQueue',
    value: function _getEventQueue(handlerSet, order) {
      var _this3 = this;

      order = isArray$1(order) ? order.concat(['_vm']) : ['_vm'];
      return isEmpty(handlerSet) ? [] : order.reduce(function (queue, id) {
        if (isEmpty(handlerSet[id]) || !isArray$1(handlerSet[id]) ||
        // in case plugins is missed
        // _vm indicate the user. This is the function for user
        !_this3.__dispatcher.plugins[id] && id !== '_vm') {
          return queue;
        }
        return queue.concat(handlerSet[id].map(function (fn) {
          // bind context for plugin instance
          return bind(fn, _this3.__dispatcher.plugins[id] || _this3.__dispatcher.vm);
        }));
      }, []);
    }
    /**
     * event processor period. If event needs call kernel function.
     * I will called here.
     * If kernel will reponse. I will stop here.
     * Else I will trigger next period.
     * @param  {string}    key event's name
     * @param  {boolean}  options.sync we will take triggerSync if true, otherwise we will run trigger. default is false
     * @param  {anything} args
     * @return {Promise|undefined}
     */

  }, {
    key: '_eventProcessor',
    value: function _eventProcessor(key, _ref) {
      var sync = _ref.sync;

      var isKernelMethod = kernelMethods.indexOf(key) > -1;
      var isDomMethod = domMethods.indexOf(key) > -1;
      var isDispatcherMethod = dispatcherMethods.indexOf(key) > -1;

      for (var _len5 = arguments.length, args = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
        args[_key5 - 2] = arguments[_key5];
      }

      if (isKernelMethod || isDomMethod || isDispatcherMethod) {
        if (isDispatcherMethod) {
          var _dispatcher;

          (_dispatcher = this.__dispatcher)[key].apply(_dispatcher, _toConsumableArray(args));
        } else {
          var _dispatcher2;

          (_dispatcher2 = this.__dispatcher[isKernelMethod ? 'kernel' : 'dom'])[key].apply(_dispatcher2, _toConsumableArray(args));
        }
        if (videoEvents.indexOf(key) > -1 || domEvents.indexOf(key) > -1) return true;
      }
      // $FlowFixMe: flow do not support computed sytax on classs, but it's ok here
      return this[sync ? 'triggerSync' : 'trigger'].apply(this, [key].concat(_toConsumableArray(args)));
    }
    /**
     * run side effect period
     * @param  {string}    key event's name
     * @param  {args} args
     */

  }, {
    key: '_runSideEffectEvent',
    value: function _runSideEffectEvent(key, order) {
      for (var _len6 = arguments.length, args = Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
        args[_key6 - 2] = arguments[_key6];
      }

      var event = this.events[key];
      if (isEmpty(event)) {
        return false;
      }
      var queue = this._getEventQueue(event._, order);
      queue.forEach(function (run) {
        return run.apply(undefined, _toConsumableArray(args));
      });
      return true;
    }
  }]);

  return Bus;
}(), _applyDecoratedDescriptor$2(_class$2.prototype, 'emit', [_dec$2], _Object$getOwnPropertyDescriptor(_class$2.prototype, 'emit'), _class$2.prototype), _applyDecoratedDescriptor$2(_class$2.prototype, 'emitSync', [_dec2$1], _Object$getOwnPropertyDescriptor(_class$2.prototype, 'emitSync'), _class$2.prototype), _applyDecoratedDescriptor$2(_class$2.prototype, 'trigger', [_dec3$1], _Object$getOwnPropertyDescriptor(_class$2.prototype, 'trigger'), _class$2.prototype), _applyDecoratedDescriptor$2(_class$2.prototype, 'triggerSync', [_dec4$1], _Object$getOwnPropertyDescriptor(_class$2.prototype, 'triggerSync'), _class$2.prototype), _class$2);

/**
 * checker for on, off, once function
 * @param {string} key
 * @param {Function} fn
 */
function eventBinderCheck(key, fn) {
  if (!isString(key)) throw new TypeError('key parameter must be String');
  if (!isFunction(fn)) throw new TypeError('fn parameter must be Function');
}
/**
 * checker for attr or css function
 */
function attrAndStyleCheck() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length > 2) {
    return ['set'].concat(args);
  }
  if (args.length === 2) {
    if (['video', 'container', 'wrapper', 'videoElement'].indexOf(args[0]) > -1) {
      return ['get'].concat(args);
    }
    return ['set', 'container'].concat(args);
  }
  return ['get', 'container'].concat(args);
}

var _dec$5;
var _dec2$3;
var _class$5;
var _descriptor$1;
var _descriptor2$1;
var _descriptor3$1;
var _descriptor4;
var _descriptor5;
var _descriptor6;
var _descriptor7;

function _initDefineProp$1(target, property, descriptor, context) {
  if (!descriptor) return;

  _Object$defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor$4(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function stringOrVoid(value) {
  return isString(value) ? value : undefined;
}

function accessorVideoProperty(property) {
  return accessor({
    get: function get$$1(value) {
      return this.dispatcher.videoConfigReady && this.inited ? this.dom.videoElement[property] : value;
    },
    set: function set(value) {
      if (!this.dispatcher.videoConfigReady) return value;
      this.dom.videoElement[property] = value;
      return value;
    }
  });
}

function accessorVideoAttribute(attribute) {
  var _ref = isObject$1(attribute) ? attribute : {
    set: attribute,
    get: attribute,
    isBoolean: false
  },
      _set = _ref.set,
      _get$$1 = _ref.get,
      isBoolean$$1 = _ref.isBoolean;

  return accessor({
    get: function get$$1(value) {
      return this.dispatcher.videoConfigReady && this.inited ? this.dom.videoElement[_get$$1] : value;
    },
    set: function set(value) {
      if (!this.dispatcher.videoConfigReady) return value;
      var val = isBoolean$$1 ? value ? '' : undefined : value === null ? undefined : value;
      this.dom.setAttr('video', _set, val);
      return value;
    }
  });
}

function accessorCustomAttribute(attribute, isBoolean$$1) {
  return accessor({
    get: function get$$1(value) {
      var attrValue = this.dom.getAttr('video', attribute);
      return this.dispatcher.videoConfigReady && this.inited ? isBoolean$$1 ? !!attrValue : attrValue : value;
    },
    set: function set(value) {
      if (!this.dispatcher.videoConfigReady) return value;
      var val = isBoolean$$1 ? value || undefined : value === null ? undefined : value;
      this.dom.setAttr('video', attribute, val);
      return value;
    }
  });
}

function accessorWidthAndHeight(property) {
  return accessor({
    get: function get$$1(value) {
      if (!this.dispatcher.videoConfigReady || !this.inited) return value;
      var attr = this.dom.getAttr('video', property);
      var prop = this.dom.videoElement[property];
      if (isNumeric(attr) && isNumber(prop)) return prop;
      return attr || undefined;
    },
    set: function set(value) {
      if (!this.dispatcher.videoConfigReady) return value;
      var val = void 0;
      if (value === undefined || isNumber(value)) {
        val = value;
      } else if (isString(value) && !_Number$isNaN(parseFloat(value))) {
        val = value;
      }
      this.dom.setAttr('video', property, val);
      return val;
    }
  });
}

var accessorMap = {
  src: [string$1(), accessor({
    set: function set(val) {
      // must check val !== this.src here
      // as we will set config.src in the video
      // the may cause dead lock
      if (this.dispatcher.readySync && this.autoload && val !== this.src) this.needToLoadSrc = true;
      return val;
    }
  }), accessor({
    set: function set(val) {
      if (this.needToLoadSrc) {
        // unlock it at first, to avoid deadlock
        this.needToLoadSrc = false;
        this.dispatcher.bus.emit('load', val);
      }
      return val;
    }
  }, { preSet: false })],
  autoload: boolean$1(),
  autoplay: [boolean$1(), accessorVideoProperty('autoplay')],
  controls: [boolean$1(), accessorVideoProperty('controls')],
  width: [accessorWidthAndHeight('width')],
  height: [accessorWidthAndHeight('height')],
  crossOrigin: [accessor({ set: stringOrVoid }), accessorVideoAttribute({ set: 'crossorigin', get: 'crossOrigin' })],
  loop: [boolean$1(), accessorVideoProperty('loop')],
  defaultMuted: [boolean$1(), accessorVideoAttribute({ get: 'defaultMuted', set: 'muted', isBoolean: true })],
  muted: [boolean$1(), accessorVideoProperty('muted')],
  preload: [accessor({ set: stringOrVoid }), accessorVideoAttribute('preload')],
  poster: [
  // ??????????????? video ????????????????????????????????????????????????????????????????????????????????????
  // ????????????????????????
  string$1(), accessor({
    get: function get$$1(value) {
      return this.dispatcher.videoConfigReady && this.inited ? this.dom.videoElement.poster : value;
    },
    set: function set(value) {
      if (!this.dispatcher.videoConfigReady) return value;
      if (value.length) this.dom.setAttr('video', 'poster', value);
      return value;
    }
  })],
  playsInline: [accessor({
    get: function get$$1(value) {
      var playsInline = this.dom.videoElement.playsInline;
      return this.dispatcher.videoConfigReady && this.inited ? playsInline === undefined ? value : playsInline : value;
    },
    set: function set(value) {
      if (!this.dispatcher.videoConfigReady) return value;
      this.dom.videoElement.playsInline = value;
      var val = value ? '' : undefined;
      this.dom.setAttr('video', 'playsinline', val);
      this.dom.setAttr('video', 'webkit-playsinline', val);
      this.dom.setAttr('video', 'x5-video-player-type', value ? 'h5' : undefined);
      return value;
    }
  }), boolean$1()],
  x5VideoPlayerFullscreen: [accessor({
    set: function set(value) {
      return !!value;
    },
    get: function get$$1(value) {
      return !!value;
    }
  }), accessorCustomAttribute('x5-video-player-fullscreen', true)],
  x5VideoOrientation: [accessor({ set: stringOrVoid }), accessorCustomAttribute('x5-video-orientation')],
  xWebkitAirplay: [accessor({
    set: function set(value) {
      return !!value;
    },
    get: function get$$1(value) {
      return !!value;
    }
  }), accessorCustomAttribute('x-webkit-airplay', true)],
  playbackRate: [number$1(1), accessorVideoProperty('playbackRate')],
  defaultPlaybackRate: [accessorVideoProperty('defaultPlaybackRate'), number$1(1)],
  disableRemotePlayback: [boolean$1(), accessorVideoProperty('disableRemotePlayback')],
  volume: [number$1(1), accessorVideoProperty('volume')]
};

var VideoConfig = (_dec$5 = boolean(), _dec2$3 = string(function (str) {
  return str.toLocaleLowerCase();
}), _class$5 = function () {

  // ??????????????????
  function VideoConfig(dispatcher, config) {
    _classCallCheck(this, VideoConfig);

    _initDefineProp$1(this, 'needToLoadSrc', _descriptor$1, this);

    _initDefineProp$1(this, 'changeWatchable', _descriptor2$1, this);

    _initDefineProp$1(this, 'inited', _descriptor3$1, this);

    this.src = '';

    _initDefineProp$1(this, 'isLive', _descriptor4, this);

    _initDefineProp$1(this, 'box', _descriptor5, this);

    this.preset = {};
    this.autoload = true;
    this.autoplay = false;
    this.controls = false;
    this.width = '100%';
    this.height = '100%';
    this.crossOrigin = undefined;
    this.loop = false;
    this.defaultMuted = false;
    this.muted = false;
    this.preload = 'auto';
    this.poster = undefined;
    this.playsInline = false;
    this.x5VideoPlayerFullscreen = false;
    this.x5VideoOrientation = undefined;
    this.xWebkitAirplay = false;
    this.playbackRate = 1;
    this.defaultPlaybackRate = 1;
    this.disableRemotePlayback = false;
    this.volume = 1;

    _initDefineProp$1(this, '_kernelProperty', _descriptor6, this);

    _initDefineProp$1(this, '_realDomAttr', _descriptor7, this);

    applyDecorators(this, accessorMap, { self: true });
    Object.defineProperty(this, 'dispatcher', {
      value: dispatcher,
      enumerable: false,
      writable: false,
      configurable: false
    });
    Object.defineProperty(this, 'dom', {
      value: dispatcher.dom,
      enumerable: false,
      writable: false,
      configurable: false
    });
    deepAssign(this, config);
  }

  // ?????? box ????????????????????? kernel ??????????????????????????? kernel ?????????????????????????????????
  // ?????? bug ?????? https://github.com/Chimeejs/chimee-kernel/issues/1

  // kernels ?????? videoConfig ???????????????????????????????????????


  _createClass(VideoConfig, [{
    key: 'init',
    value: function init() {
      var _this = this;

      this._realDomAttr.forEach(function (key) {
        // $FlowFixMe: we have check the computed here
        _this[key] = _this[key];
      });
      this.inited = true;
    }
  }]);

  return VideoConfig;
}(), _descriptor$1 = _applyDecoratedDescriptor$4(_class$5.prototype, 'needToLoadSrc', [nonenumerable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor2$1 = _applyDecoratedDescriptor$4(_class$5.prototype, 'changeWatchable', [nonenumerable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor3$1 = _applyDecoratedDescriptor$4(_class$5.prototype, 'inited', [nonenumerable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor4 = _applyDecoratedDescriptor$4(_class$5.prototype, 'isLive', [_dec$5, nonconfigurable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor5 = _applyDecoratedDescriptor$4(_class$5.prototype, 'box', [_dec2$3, nonconfigurable], {
  enumerable: true,
  initializer: function initializer() {
    return '';
  }
}), _descriptor6 = _applyDecoratedDescriptor$4(_class$5.prototype, '_kernelProperty', [frozen], {
  enumerable: true,
  initializer: function initializer() {
    return ['isLive', 'box', 'preset', 'kernels'];
  }
}), _descriptor7 = _applyDecoratedDescriptor$4(_class$5.prototype, '_realDomAttr', [frozen], {
  enumerable: true,
  initializer: function initializer() {
    return ['src', 'controls', 'width', 'height', 'crossOrigin', 'loop', 'muted', 'preload', 'poster', 'autoplay', 'playsInline', 'x5VideoPlayerFullscreen', 'x5VideoOrientation', 'xWebkitAirplay', 'playbackRate', 'defaultPlaybackRate', 'autoload', 'disableRemotePlayback', 'defaultMuted', 'volume'];
  }
}), _class$5);

var _dec$4;
var _dec2$2;
var _dec3$2;
var _dec4$2;
var _dec5$1;
var _dec6;
var _dec7;
var _dec8;
var _dec9;
var _dec10;
var _dec11;
var _dec12;
var _dec13;
var _dec14;
var _dec15;
var _dec16;
var _dec17;
var _dec18;
var _dec19;
var _class$4;
var _class2$1;

function _applyDecoratedDescriptor$3(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var VideoWrapper = (_dec$4 = autobindClass(), _dec2$2 = alias('silentLoad'), _dec3$2 = alias('fullScreen'), _dec4$2 = alias('$fullScreen'), _dec5$1 = alias('fullscreen'), _dec6 = alias('emit'), _dec7 = alias('emitSync'), _dec8 = alias('on'), _dec9 = alias('addEventListener'), _dec10 = before(eventBinderCheck), _dec11 = alias('off'), _dec12 = alias('removeEventListener'), _dec13 = before(eventBinderCheck), _dec14 = alias('once'), _dec15 = before(eventBinderCheck), _dec16 = alias('css'), _dec17 = before(attrAndStyleCheck), _dec18 = alias('attr'), _dec19 = before(attrAndStyleCheck), _dec$4(_class$4 = (_class2$1 = function () {
  function VideoWrapper() {
    _classCallCheck(this, VideoWrapper);

    this.__events = {};
    this.__unwatchHandlers = [];
  }

  _createClass(VideoWrapper, [{
    key: '__wrapAsVideo',
    value: function __wrapAsVideo(videoConfig) {
      var _this = this;

      // bind video read only properties on instance, so that you can get info like buffered
      videoReadOnlyProperties.forEach(function (key) {
        _Object$defineProperty(_this, key, {
          get: function get$$1() {
            return this.__dispatcher.dom.videoElement[key];
          },

          set: undefined,
          configurable: false,
          enumerable: false
        });
      });
      // bind videoMethods like canplaytype on instance
      videoMethods.forEach(function (key) {
        _Object$defineProperty(_this, key, {
          get: function get$$1() {
            var video = this.__dispatcher.dom.videoElement;
            return bind(video[key], video);
          },

          set: undefined,
          configurable: false,
          enumerable: false
        });
      });
      // bind video config properties on instance, so that you can just set src by this
      var props = videoConfig._realDomAttr.concat(videoConfig._kernelProperty).reduce(function (props, key) {
        props[key] = [accessor({
          get: function get$$1() {
            // $FlowFixMe: support computed key here
            return videoConfig[key];
          },
          set: function set(value) {
            // $FlowFixMe: support computed key here
            videoConfig[key] = value;
            return value;
          }
        }), nonenumerable];
        return props;
      }, {});
      applyDecorators(this, props, { self: true });
      kernelMethods.forEach(function (key) {
        _Object$defineProperty(_this, key, {
          value: function value() {
            var _this2 = this;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return new _Promise(function (resolve) {
              var _dispatcher$bus;

              _this2.__dispatcher.bus.once(_this2.__id, '_' + key, resolve);
              (_dispatcher$bus = _this2.__dispatcher.bus)[/^(seek)$/.test(key) ? 'emitSync' : 'emit'].apply(_dispatcher$bus, [key].concat(_toConsumableArray(args)));
            });
          },

          configurable: true,
          enumerable: false,
          writable: true
        });
      });
      domMethods.forEach(function (key) {
        if (key === 'fullscreen') return;
        _Object$defineProperty(_this, key, {
          value: function value() {
            var _dispatcher$dom;

            return (_dispatcher$dom = this.__dispatcher.dom)[key].apply(_dispatcher$dom, arguments);
          },

          configurable: true,
          enumerable: false,
          writable: true
        });
      });
    }
  }, {
    key: '$watch',
    value: function $watch(key, handler) {
      var _this3 = this;

      var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          deep = _ref.deep,
          _ref$diff = _ref.diff,
          diff = _ref$diff === undefined ? true : _ref$diff,
          other = _ref.other,
          _ref$proxy = _ref.proxy,
          proxy = _ref$proxy === undefined ? false : _ref$proxy;

      if (!isString(key) && !isArray$1(key)) throw new TypeError('$watch only accept string and Array<string> as key to find the target to spy on, but not ' + key + ', whose type is ' + (typeof key === 'undefined' ? 'undefined' : _typeof(key)));
      var watching = true;
      var watcher = function watcher() {
        if (watching && (!(this instanceof VideoConfig) || this.dispatcher.changeWatchable)) bind(handler, this).apply(undefined, arguments);
      };
      var unwatcher = function unwatcher() {
        watching = false;
        var index$$1 = _this3.__unwatchHandlers.indexOf(unwatcher);
        if (index$$1 > -1) _this3.__unwatchHandlers.splice(index$$1, 1);
      };
      var keys$$1 = isString(key) ? key.split('.') : key;
      var property = keys$$1.pop();
      var videoConfig = this.__dispatcher.videoConfig;
      var target = keys$$1.length === 0 && !other && videoConfig._realDomAttr.indexOf(property) > -1 ? videoConfig : ['isFullscreen', 'fullscreenElement'].indexOf(property) > -1 ? this.__dispatcher.dom : getDeepProperty(other || this, keys$$1, { throwError: true });
      applyDecorators(target, _defineProperty$1({}, property, watch(watcher, { deep: deep, diff: diff, proxy: proxy })), { self: true });
      this.__unwatchHandlers.push(unwatcher);
      return unwatcher;
    }
  }, {
    key: '$set',
    value: function $set(obj, property, value) {
      if (!isObject$1(obj) && !isArray$1(obj)) throw new TypeError('$set only support Array or Object, but not ' + obj + ', whose type is ' + (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)));
      // $FlowFixMe: we have custom this function
      if (!isFunction(obj.__set)) {
        /* istanbul ignore else  */
        obj[property] = value;
        return;
      }
      obj.__set(property, value);
    }
  }, {
    key: '$del',
    value: function $del(obj, property) {
      if (!isObject$1(obj) && !isArray$1(obj)) throw new TypeError('$del only support Array or Object, but not ' + obj + ', whose type is ' + (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)));
      // $FlowFixMe: we have custom this function
      if (!isFunction(obj.__del)) {
        /* istanbul ignore else  */
        delete obj[property];
        return;
      }
      obj.__del(property);
    }
  }, {
    key: 'load',
    value: function load() {
      var _this4 = this;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return new _Promise(function (resolve) {
        var _dispatcher$bus2;

        _this4.__dispatcher.bus.once(_this4.__id, '_load', resolve);
        (_dispatcher$bus2 = _this4.__dispatcher.bus).emit.apply(_dispatcher$bus2, ['load'].concat(args));
      });
    }
  }, {
    key: '$silentLoad',
    value: function $silentLoad() {
      var _this5 = this;

      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return this.__dispatcher.bus.emit('silentLoad').then(function () {
        var _dispatcher;

        return (_dispatcher = _this5.__dispatcher).silentLoad.apply(_dispatcher, args);
      }).then(function (result) {
        _this5.__dispatcher.bus.trigger('silentLoad', result);
      });
    }

    /**
     * call fullscreen api on some specific element
     * @param {boolean} flag true means fullscreen and means exit fullscreen
     * @param {string} element the element you want to fullscreen, default it's container, you can choose from video | container | wrapper
     */

  }, {
    key: '$fullscreen',
    value: function $fullscreen() {
      var flag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'container';

      if (!this.__dispatcher.bus.emitSync('fullscreen', flag, element)) return false;
      var result = this.__dispatcher.dom.fullscreen(flag, element);
      this.__dispatcher.bus.triggerSync('fullscreen', flag, element);
      return result;
    }

    /**
     * emit an event
     * @param  {string}    key event's name
     * @param  {...args} args
     */

  }, {
    key: '$emit',
    value: function $emit(key) {
      var _dispatcher$bus3;

      if (!isString(key)) throw new TypeError('emit key parameter must be String');
      /* istanbul ignore else  */
      for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      (_dispatcher$bus3 = this.__dispatcher.bus).emit.apply(_dispatcher$bus3, [key].concat(_toConsumableArray(args)));
    }

    /**
     * emit a sync event
     * @param  {string}    key event's name
     * @param  {...args} args
     */

  }, {
    key: '$emitSync',
    value: function $emitSync(key) {
      var _dispatcher$bus4;

      if (!isString(key)) throw new TypeError('emitSync key parameter must be String');

      for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        args[_key5 - 1] = arguments[_key5];
      }

      return (_dispatcher$bus4 = this.__dispatcher.bus).emitSync.apply(_dispatcher$bus4, [key].concat(_toConsumableArray(args)));
    }

    /**
     * bind event handler through this function
     * @param  {string} key event's name
     * @param  {Function} fn event's handler
     */

  }, {
    key: '$on',
    value: function $on(key, fn) {
      this.__dispatcher.bus.on(this.__id, key, fn);
      // set on __events as mark so that i can destroy it when i destroy
      this.__addEvents(key, fn);
    }
    /**
     * remove event handler through this function
     * @param  {string} key event's name
     * @param  {Function} fn event's handler
     */

  }, {
    key: '$off',
    value: function $off(key, fn) {
      this.__dispatcher.bus.off(this.__id, key, fn);
      this.__removeEvents(key, fn);
    }
    /**
     * bind one time event handler
     * @param {string} key event's name
     * @param {Function} fn event's handler
     */

  }, {
    key: '$once',
    value: function $once(key, fn) {
      var self = this;
      var boundFn = function boundFn() {
        bind(fn, this).apply(undefined, arguments);
        self.__removeEvents(key, boundFn);
      };
      self.__addEvents(key, boundFn);
      this.__dispatcher.bus.once(this.__id, key, boundFn);
    }

    /**
     * set style
     * @param {string} element optional, default to be video, you can choose from video | container | wrapper
     * @param {string} attribute the atrribue name
     * @param {any} value optional, when it's no offer, we consider you want to get the attribute's value. When it's offered, we consider you to set the attribute's value, if the value you passed is undefined, that means you want to remove the value;
     */

  }, {
    key: '$css',
    value: function $css(method) {
      var _dispatcher$dom2;

      for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        args[_key6 - 1] = arguments[_key6];
      }

      return (_dispatcher$dom2 = this.__dispatcher.dom)[method + 'Style'].apply(_dispatcher$dom2, args);
    }

    /**
     * set attr
     * @param {string} element optional, default to be video, you can choose from video | container | wrapper
     * @param {string} attribute the atrribue name??
     * @param {any} value optional, when it's no offer, we consider you want to get the attribute's value. When it's offered, we consider you to set the attribute's value, if the value you passed is undefined, that means you want to remove the value;
     */

  }, {
    key: '$attr',
    value: function $attr(method) {
      var _dispatcher$dom3;

      for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
        args[_key7 - 1] = arguments[_key7];
      }

      if (method === 'set' && /video/.test(args[0])) {
        if (!this.__dispatcher.videoConfigReady) {
          /* istanbul ignore else  */
          return args[2];
        }
        if (this.__dispatcher.videoConfig._realDomAttr.indexOf(args[1]) > -1) {
          var key = args[1],
              val = args[2];

          this.__dispatcher.videoConfig[key] = val;
          return val;
        }
      }
      return (_dispatcher$dom3 = this.__dispatcher.dom)[method + 'Attr'].apply(_dispatcher$dom3, args);
    }
  }, {
    key: '__addEvents',
    value: function __addEvents(key, fn) {
      this.__events[key] = this.__events[key] || [];
      this.__events[key].push(fn);
    }
  }, {
    key: '__removeEvents',
    value: function __removeEvents(key, fn) {
      if (isEmpty(this.__events[key])) return;
      var index$$1 = this.__events[key].indexOf(fn);
      if (index$$1 < 0) return;
      this.__events[key].splice(index$$1, 1);
      if (isEmpty(this.__events[key])) delete this.__events[key];
    }
  }, {
    key: '__destroy',
    value: function __destroy() {
      var _this6 = this;

      this.__unwatchHandlers.forEach(function (unwatcher) {
        return unwatcher();
      });
      _Object$keys(this.__events).forEach(function (key) {
        if (!isArray$1(_this6.__events[key])) return;
        _this6.__events[key].forEach(function (fn) {
          return _this6.$off(key, fn);
        });
      });
      delete this.__events;
    }
  }, {
    key: 'currentTime',
    get: function get$$1() {
      return this.__dispatcher.kernel.currentTime;
    },
    set: function set(second) {
      this.__dispatcher.bus.emitSync('seek', second);
    }
  }, {
    key: '$plugins',
    get: function get$$1() {
      return this.__dispatcher.plugins;
    }
  }, {
    key: '$pluginOrder',
    get: function get$$1() {
      return this.__dispatcher.order;
    }
  }, {
    key: '$wrapper',
    get: function get$$1() {
      return this.__dispatcher.dom.wrapper;
    }
  }, {
    key: '$container',
    get: function get$$1() {
      return this.__dispatcher.dom.container;
    }
  }, {
    key: '$video',
    get: function get$$1() {
      return this.__dispatcher.dom.videoElement;
    }
  }, {
    key: 'isFullscreen',
    get: function get$$1() {
      return this.__dispatcher.dom.isFullscreen;
    }
  }, {
    key: 'fullscreenElement',
    get: function get$$1() {
      return this.__dispatcher.dom.fullscreenElement;
    }
  }, {
    key: 'container',
    get: function get$$1() {
      return this.__dispatcher.containerConfig;
    },
    set: function set(config) {
      if (!isObject$1(config)) {
        throw new Error('The config of container must be Object, but not ' + (typeof config === 'undefined' ? 'undefined' : _typeof(config)) + '.');
      }
      deepAssign(this.__dispatcher.containerConfig, config);
      return this.__dispatcher.container;
    }
  }]);

  return VideoWrapper;
}(), _applyDecoratedDescriptor$3(_class2$1.prototype, '$silentLoad', [_dec2$2], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$silentLoad'), _class2$1.prototype), _applyDecoratedDescriptor$3(_class2$1.prototype, '$fullscreen', [_dec3$2, _dec4$2, _dec5$1], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$fullscreen'), _class2$1.prototype), _applyDecoratedDescriptor$3(_class2$1.prototype, '$emit', [_dec6], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$emit'), _class2$1.prototype), _applyDecoratedDescriptor$3(_class2$1.prototype, '$emitSync', [_dec7], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$emitSync'), _class2$1.prototype), _applyDecoratedDescriptor$3(_class2$1.prototype, '$on', [_dec8, _dec9, _dec10], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$on'), _class2$1.prototype), _applyDecoratedDescriptor$3(_class2$1.prototype, '$off', [_dec11, _dec12, _dec13], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$off'), _class2$1.prototype), _applyDecoratedDescriptor$3(_class2$1.prototype, '$once', [_dec14, _dec15], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$once'), _class2$1.prototype), _applyDecoratedDescriptor$3(_class2$1.prototype, '$css', [_dec16, _dec17], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$css'), _class2$1.prototype), _applyDecoratedDescriptor$3(_class2$1.prototype, '$attr', [_dec18, _dec19], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$attr'), _class2$1.prototype), _applyDecoratedDescriptor$3(_class2$1.prototype, '$plugins', [nonenumerable], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$plugins'), _class2$1.prototype), _applyDecoratedDescriptor$3(_class2$1.prototype, '$pluginOrder', [nonenumerable], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$pluginOrder'), _class2$1.prototype), _applyDecoratedDescriptor$3(_class2$1.prototype, '$wrapper', [nonenumerable], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$wrapper'), _class2$1.prototype), _applyDecoratedDescriptor$3(_class2$1.prototype, '$container', [nonenumerable], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$container'), _class2$1.prototype), _applyDecoratedDescriptor$3(_class2$1.prototype, '$video', [nonenumerable], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$video'), _class2$1.prototype), _class2$1)) || _class$4);

var _dec$3;
var _class$3;

/**
 * <pre>
 * Plugin is the class for plugin developer.
 * When we use a plugin, we will generate an instance of plugin.
 * Developer can do most of things base on this plugin
 * </pre>
 */
var Plugin = (_dec$3 = autobindClass(), _dec$3(_class$3 = function (_VideoWrapper) {
  _inherits(Plugin, _VideoWrapper);

  /**
   * <pre>
   * to create a plugin, we need three parameter
   * 1. the config of a plugin
   * 2. the dispatcher
   * 3. this option for plugin to read
   * this is the plugin base class, which you can get on Chimee
   * You can just extends it and then install
   * But in that way you must remember to pass the arguments to super()
   * </pre>
   * @param  {string}  PluginConfig.id        camelize from plugin's name or class name.
   * @param  {string}  PluginConfig.name      plugin's name or class name
   * @param  {Number}  PluginConfig.level     the level of z-index
   * @param  {Boolean} PluginConfig.operable  to tell if the plugin can be operable, if not, we will add pointer-events: none on it.
   * @param  {Function}  PluginConfig.create  the create function which we will called when plugin is used. sth like constructor in object style.
   * @param  {Function}  PluginConfig.destroy   function to be called when we destroy a plugin
   * @param  {Object}  PluginConfig.events    You can set some events handler in this object, we will bind it once you use the plugin.
   * @param  {Object}  PluginConfig.data      dataset we will bind on data in object style
   * @param  {Object<{get: Function, set: Function}}  PluginConfig.computed  dataset we will handle by getter and setter
   * @param  {Object<Function>}  PluginConfig.methods   some function we will bind on plugin
   * @param  {string|HTMLElment}  PluginConfig.el  can be string or HTMLElement, we will use this to create the dom for plugin
   * @param  {boolean} PluginConfig.penetrate boolean to let us do we need to forward the dom events for this plugin.
   * @param  {Dispatcher}  dispatcher referrence of dispatcher
   * @param  {Object}  option  PluginOption that will pass to the plugin
   * @return {Plugin}  plugin instance
   */
  function Plugin() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        id = _ref.id,
        name = _ref.name,
        _ref$level = _ref.level,
        level = _ref$level === undefined ? 0 : _ref$level,
        _ref$operable = _ref.operable,
        operable = _ref$operable === undefined ? true : _ref$operable,
        beforeCreate = _ref.beforeCreate,
        create = _ref.create,
        init = _ref.init,
        inited = _ref.inited,
        destroy = _ref.destroy,
        _ref$events = _ref.events,
        events = _ref$events === undefined ? {} : _ref$events,
        _ref$data = _ref.data,
        data = _ref$data === undefined ? {} : _ref$data,
        _ref$computed = _ref.computed,
        computed = _ref$computed === undefined ? {} : _ref$computed,
        _ref$methods = _ref.methods,
        methods = _ref$methods === undefined ? {} : _ref$methods,
        el = _ref.el,
        _ref$penetrate = _ref.penetrate,
        penetrate = _ref$penetrate === undefined ? false : _ref$penetrate,
        _ref$inner = _ref.inner,
        inner = _ref$inner === undefined ? true : _ref$inner,
        autoFocus = _ref.autoFocus,
        className = _ref.className;

    var dispatcher = arguments[1];
    var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { name: name };

    _classCallCheck(this, Plugin);

    var _this = _possibleConstructorReturn(this, (Plugin.__proto__ || _Object$getPrototypeOf(Plugin)).call(this));

    _this.destroyed = false;
    _this.VERSION = '0.6.3';
    _this.__operable = true;
    _this.__level = 0;

    if (isEmpty(dispatcher)) {
      /* istanbul ignore else  */
      throw new TypeError('lack of dispatcher');
    }
    if (!isString(id)) {
      throw new TypeError('id of PluginConfig must be string');
    }
    _this.__id = id;
    _this.__dispatcher = dispatcher;
    _this.$videoConfig = _this.__dispatcher.videoConfig;
    _this.__wrapAsVideo(_this.$videoConfig);
    _this.beforeCreate = _this.beforeCreate || beforeCreate;
    try {
      isFunction(_this.beforeCreate) && _this.beforeCreate({
        events: events,
        data: data,
        computed: computed,
        methods: methods
      }, option);
    } catch (error) {
      _this.$throwError(error);
    }
    // bind plugin methods into instance
    if (!isEmpty(methods) && isObject$1(methods)) {
      _Object$keys(methods).forEach(function (key) {
        var fn = methods[key];
        if (!isFunction(fn)) throw new TypeError('plugins methods must be Function');
        _Object$defineProperty(_this, key, {
          value: bind(fn, _this),
          writable: true,
          enumerable: false,
          configurable: true
        });
      });
    }
    // hook plugin events on bus
    if (!isEmpty(events) && isObject$1(events)) {
      _Object$keys(events).forEach(function (key) {
        if (!isFunction(events[key])) throw new TypeError('plugins events hook must bind with Function');
        _this.$on(key, events[key]);
      });
    }
    // bind data into plugin instance
    if (!isEmpty(data) && isObject$1(data)) {
      deepAssign(_this, data);
    }
    // set the computed member by getter and setter
    if (!isEmpty(computed) && isObject$1(computed)) {
      var props = _Object$keys(computed).reduce(function (props, key) {
        var val = computed[key];
        if (isFunction(val)) {
          props[key] = accessor({ get: val });
          return props;
        }
        if (isObject$1(val) && (isFunction(val.get) || isFunction(val.set))) {
          props[key] = accessor(val);
          return props;
        }
        /* istanbul ignore else  */
        return props;
      }, {});
      applyDecorators(_this, props, { self: true });
    }
    /**
     * the create Function of plugin
     * @type {Function}
     */
    _this.create = _this.create || create;
    /**
     * this init Function of plugin
     * which will be called when we start to create the video player
     * the plugin can handle some config here
     * @type {Function}
     */
    _this.init = _this.init || init;
    /**
     * this inited Function of plugin
     * which will be called when we have created the video player
     * @type {Function}
     */
    _this.inited = _this.inited || inited;
    /**
     * the destroy Function of plugin
     * @type {Function}
     */
    _this.destroy = _this.destroy || destroy;
    /**
     * the dom node of whole plugin
     * @type {HTMLElement}
     */
    _this.$dom = _this.__dispatcher.dom.insertPlugin(_this.__id, el, { penetrate: penetrate, inner: inner, autoFocus: autoFocus, className: className });
    // now we can frozen inner, autoFocus and penetrate
    _this.$inner = inner;
    _this.$autoFocus = autoFocus;
    _this.$penetrate = penetrate;
    applyDecorators(_this, {
      $inner: frozen,
      $autoFocus: frozen,
      $penetrate: frozen
    }, { self: true });
    /**
     * to tell us if the plugin can be operable, can be dynamic change
     * @type {boolean}
     */
    _this.$operable = isBoolean(option.operable) ? option.operable : operable;
    _this.__level = isInteger(option.level) ? option.level : level;
    /**
     * pluginOption, so it's easy for plugin developer to check the config
     * @type {Object}
     */
    _this.$config = option;
    try {
      isFunction(_this.create) && _this.create();
    } catch (error) {
      _this.$throwError(error);
    }
    return _this;
  }
  /**
   * call for init lifecycle hook, which mainly handle the original config of video and kernel.
   * @param {VideoConfig} videoConfig the original config of the videoElement or Kernel
   */


  _createClass(Plugin, [{
    key: '__init',
    value: function __init(videoConfig) {
      try {
        isFunction(this.init) && this.init(videoConfig);
      } catch (error) {
        this.$throwError(error);
      }
    }
    /**
     * call for inited lifecycle hook, which just to tell the plugin we have inited.
     */

  }, {
    key: '__inited',
    value: function __inited() {
      var _this2 = this;

      var result = void 0;
      try {
        result = isFunction(this.inited) && this.inited();
      } catch (error) {
        this.$throwError(error);
      }
      this.readySync = !isPromise(result);
      this.ready = this.readySync ? _Promise.resolve()
      // $FlowFixMe: it's promise now
      : result.then(function (ret) {
        _this2.readySync = true;
        return ret;
      }).catch(function (error) {
        if (isError(error)) return _this2.$throwError(error);
        return _Promise.reject(error);
      });
      return this.readySync || this.ready;
    }

    /**
     * set the plugin to be the top of all plugins
     */

  }, {
    key: '$bumpToTop',
    value: function $bumpToTop() {
      var topLevel = this.__dispatcher._getTopLevel(this.$inner);
      this.$level = topLevel + 1;
    }
  }, {
    key: '$throwError',
    value: function $throwError(error) {
      this.__dispatcher.throwError(error);
    }
    /**
     * officail destroy function for plugin
     * we will call user destory function in this method
     */

  }, {
    key: '$destroy',
    value: function $destroy() {
      isFunction(this.destroy) && this.destroy();
      _get(Plugin.prototype.__proto__ || _Object$getPrototypeOf(Plugin.prototype), '__destroy', this).call(this);
      this.__dispatcher.dom.removePlugin(this.__id);
      delete this.__dispatcher;
      delete this.$dom;
      this.destroyed = true;
    }
    /**
     * to tell us if the plugin can be operable, can be dynamic change
     * @type {boolean}
     */

  }, {
    key: '$operable',
    set: function set(val) {
      if (!isBoolean(val)) return;
      this.$dom.style.pointerEvents = val ? 'auto' : 'none';
      this.__operable = val;
    },
    get: function get$$1() {
      return this.__operable;
    }
    /**
     * the z-index level, higher when you set higher
     * @type {boolean}
     */

  }, {
    key: '$level',
    set: function set(val) {
      if (!isInteger(val)) return;
      this.__level = val;
      this.__dispatcher._sortZIndex();
    },
    get: function get$$1() {
      return this.__level;
    }
  }]);

  return Plugin;
}(VideoWrapper)) || _class$3);

var _dec$6;
var _dec2$4;
var _dec3$3;
var _dec4$3;
var _dec5$2;
var _dec6$1;
var _class$6;

function _applyDecoratedDescriptor$5(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function targetCheck(target) {
  if (target === 'video') target = 'videoElement';
  if (!isElement(this[target])) throw new TypeError('Your target "' + target + '" is not a legal HTMLElement');

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return [target].concat(args);
}
function attrOperationCheck(target, attr, val) {
  if (!isString(attr)) throw new TypeError('to handle dom\'s attribute or style, your attr parameter must be string, but not ' + attr + ' in ' + (typeof attr === 'undefined' ? 'undefined' : _typeof(attr)));
  if (!isString(target)) throw new TypeError('to handle dom\'s attribute or style, your target parameter must be string, , but not ' + target + ' in ' + (typeof target === 'undefined' ? 'undefined' : _typeof(target)));
  return [target, attr, val];
}
/**
 * <pre>
 * Dom work for Dispatcher.
 * It take charge of dom management of Dispatcher.
 * </pre>
 */
var Dom = (_dec$6 = waituntil('__dispatcher.videoConfigReady'), _dec2$4 = before(attrOperationCheck, targetCheck), _dec3$3 = before(attrOperationCheck, targetCheck), _dec4$3 = before(attrOperationCheck, targetCheck), _dec5$2 = before(attrOperationCheck, targetCheck), _dec6$1 = before(targetCheck), _class$6 = function () {
  /**
   * to mark is the mouse in the video area
   */

  /**
   * Array to store all video dom event handler
   */

  /**
   * Array to store all video dom event handler
   */

  /**
   * the html to restore when we are destroyed
   */
  function Dom(wrapper, dispatcher) {
    var _this = this;

    _classCallCheck(this, Dom);

    this.plugins = {};
    this.originHTML = '';
    this.videoEventHandlerList = [];
    this.videoDomEventHandlerList = [];
    this.containerDomEventHandlerList = [];
    this.wrapperDomEventHandlerList = [];
    this.__domEventHandlerList = {};
    this.__mouseInVideo = false;
    this.__videoExtendedNodes = [];
    this.isFullscreen = false;
    this.fullscreenElement = undefined;

    this.__dispatcher = dispatcher;
    if (!isElement(wrapper) && !isString(wrapper)) throw new TypeError('Wrapper can only be string or HTMLElement, but not ' + (typeof wrapper === 'undefined' ? 'undefined' : _typeof(wrapper)));
    var $wrapper = $(wrapper);
    if ($wrapper.length === 0) {
      throw new TypeError('Can not get dom node accroding wrapper. Please check your wrapper');
    }
    /**
     * the referrence of the dom wrapper of whole Chimee
     */
    // $FlowFixMe: support computed key on nodewrap
    this.wrapper = $wrapper[0];
    this.originHTML = this.wrapper.innerHTML;
    // if we find video element inside wrapper
    // we use it
    // or we create a video element by ourself.
    // $FlowFixMe: support computed key on nodewrap
    var videoElement = $wrapper.find('video')[0];
    if (!videoElement) {
      videoElement = document.createElement('video');
    }
    /**
     * referrence of video's dom element
     */
    this.installVideo(videoElement);
    this._addDomEvents(this.container, this.containerDomEventHandlerList, function (key) {
      return function () {
        var _dispatcher$bus;

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return (_dispatcher$bus = _this.__dispatcher.bus).triggerSync.apply(_dispatcher$bus, ['c_' + key].concat(_toConsumableArray(args)));
      };
    });
    this._addDomEvents(this.wrapper, this.wrapperDomEventHandlerList, function (key) {
      return function () {
        var _dispatcher$bus2;

        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        return (_dispatcher$bus2 = _this.__dispatcher.bus).triggerSync.apply(_dispatcher$bus2, ['w_' + key].concat(_toConsumableArray(args)));
      };
    });
    this._fullscreenMonitor();
    index.on('fullscreenchange', this._fullscreenMonitor);
  }
  /**
   * collection of video extension nodes
   * some nodes can be regarded as part of video (such as penetrate element)
   * so we store them here
   */

  /**
   * Object to store different plugin's dom event handlers
   */

  /**
   * Array to store all container dom event handler
   */

  /**
   * Array to store all video event handler
   */

  /**
   * all plugin's dom element set
   */


  _createClass(Dom, [{
    key: 'installVideo',
    value: function installVideo(videoElement) {
      var _this2 = this;

      this.__videoExtendedNodes.push(videoElement);
      setAttr(videoElement, 'tabindex', -1);
      this._autoFocusToVideo(videoElement);
      if (!isElement(this.container)) {
        // create container
        if (videoElement.parentElement && isElement(videoElement.parentElement) && videoElement.parentElement !== this.wrapper) {
          this.container = videoElement.parentElement;
        } else {
          this.container = document.createElement('container');
          $(this.container).append(videoElement);
        }
      } else {
        var container = this.container;
        if (container.childNodes.length === 0) {
          container.appendChild(videoElement);
        } else {
          container.insertBefore(videoElement, container.childNodes[0]);
        }
      }
      // check container.position
      if (this.container.parentElement !== this.wrapper) {
        $(this.wrapper).append(this.container);
      }
      videoEvents.forEach(function (key) {
        var fn = function fn() {
          var _dispatcher$bus3;

          for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          return (_dispatcher$bus3 = _this2.__dispatcher.bus).trigger.apply(_dispatcher$bus3, [key].concat(_toConsumableArray(args)));
        };
        _this2.videoEventHandlerList.push(fn);
        addEvent(videoElement, key, fn);
      });
      this._addDomEvents(videoElement, this.videoDomEventHandlerList, function (key) {
        return _this2._getEventHandler(key, { penetrate: true });
      });
      this.videoElement = videoElement;
      return videoElement;
    }
  }, {
    key: 'removeVideo',
    value: function removeVideo() {
      var _this3 = this;

      var videoElement = this.videoElement;
      this._autoFocusToVideo(this.videoElement, false);
      videoEvents.forEach(function (key, index$$1) {
        removeEvent(_this3.videoElement, key, _this3.videoEventHandlerList[index$$1]);
      });
      this.videoEventHandlerList = [];
      domEvents.forEach(function (key, index$$1) {
        removeEvent(_this3.videoElement, key, _this3.videoDomEventHandlerList[index$$1]);
      });
      this.videoDomEventHandlerList = [];
      $(videoElement).remove();
      delete this.videoElement;
      return videoElement;
    }

    /**
     * each plugin has its own dom node, this function will create one or them.
     * we support multiple kind of el
     * 1. Element, we will append this dom node on wrapper straight
     * 2. HTMLString, we will create dom based on this HTMLString and append it on wrapper
     * 3. string, we will transfer this string into hypen string, then we create a custom elment called by this and bind it on wrapper
     * 4. nothing, we will create a div and bind it on the wrapper
     */

  }, {
    key: 'insertPlugin',
    value: function insertPlugin(id, el) {
      var _this4 = this;

      var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (!isString(id)) throw new TypeError('insertPlugin id parameter must be string');
      if (isElement(this.plugins[id])) {
        /* istanbul ignore else  */
        this.removePlugin(id);
      }
      if (isString(el)) {
        if (isHTMLString(el)) {
          var outer = document.createElement('div');
          outer.innerHTML = el;
          el = outer.children[0];
        } else {
          el = document.createElement(hypenate(el));
        }
      } else if (isObject$1(el)) {
        // $FlowFixMe: we have check el's type here and make sure it's an object
        option = el;
      }
      var _option = option,
          inner = _option.inner,
          penetrate = _option.penetrate,
          autoFocus = _option.autoFocus;
      var _option2 = option,
          className = _option2.className;

      var node = el && isElement(el) ? el : document.createElement('div');
      if (isArray$1(className)) {
        className = className.join(' ');
      }
      if (isString(className)) {
        addClassName(node, className);
      }
      this.plugins[id] = node;
      var outerElement = inner ? this.container : this.wrapper;
      var originElement = inner ? this.videoElement : this.container;
      if (isBoolean(autoFocus) ? autoFocus : inner) this._autoFocusToVideo(node);
      // auto forward the event if this plugin can be penetrate
      if (penetrate) {
        this.__domEventHandlerList[id] = this.__domEventHandlerList[id] || [];
        this._addDomEvents(node, this.__domEventHandlerList[id], function (key) {
          return _this4._getEventHandler(key, { penetrate: penetrate });
        });
        this.__videoExtendedNodes.push(node);
      }
      if (outerElement.lastChild === originElement) {
        outerElement.appendChild(node);
        return node;
      }
      outerElement.insertBefore(node, originElement.nextSibling);
      return node;
    }

    /**
     * remove plugin's dom
     */

  }, {
    key: 'removePlugin',
    value: function removePlugin(id) {
      var _this5 = this;

      if (!isString(id)) return;
      var dom = this.plugins[id];
      if (isElement(dom)) {
        dom.parentNode && dom.parentNode.removeChild(dom);
        this._autoFocusToVideo(dom, true);
      }
      if (!isEmpty(this.__domEventHandlerList[id])) {
        domEvents.forEach(function (key, index$$1) {
          removeEvent(_this5.plugins[id], key, _this5.__domEventHandlerList[id][index$$1]);
        });
        delete this.__domEventHandlerList[id];
      }
      delete this.plugins[id];
    }

    /**
     * Set zIndex for a plugins list
     */

  }, {
    key: 'setPluginsZIndex',
    value: function setPluginsZIndex(plugins) {
      var _this6 = this;

      // $FlowFixMe: there are videoElment and container here
      plugins.forEach(function (key, index$$1) {
        return setStyle(key.match(/^(videoElement|container)$/) ? _this6[key] : _this6.plugins[key], 'z-index', ++index$$1);
      });
    }

    /**
     * set attribute on our dom
     * @param {string} attr attribute's name
     * @param {anything} val attribute's value
     * @param {string} target the HTMLElemnt string name, only support video/wrapper/container now
     */

  }, {
    key: 'setAttr',
    value: function setAttr$$1(target, attr, val) {
      // $FlowFixMe: flow do not support computed property/element on class, which is silly here.
      setAttr(this[target], attr, val);
    }
  }, {
    key: 'getAttr',
    value: function getAttr$$1(target, attr) {
      // $FlowFixMe: flow do not support computed property/element on class, which is silly here.
      return getAttr(this[target], attr);
    }
  }, {
    key: 'setStyle',
    value: function setStyle$$1(target, attr, val) {
      // $FlowFixMe: flow do not support computed property/element on class, which is silly here.
      setStyle(this[target], attr, val);
    }
  }, {
    key: 'getStyle',
    value: function getStyle$$1(target, attr) {
      // $FlowFixMe: flow do not support computed property/element on class, which is silly here.
      return getStyle(this[target], attr);
    }
  }, {
    key: 'requestFullscreen',
    value: function requestFullscreen(target) {
      // $FlowFixMe: flow do not support computed property/element on document, which is silly here.
      return index.open(this[target]);
    }
  }, {
    key: 'exitFullscreen',
    value: function exitFullscreen() {
      return index.exit();
    }
  }, {
    key: 'fullscreen',
    value: function fullscreen() {
      var request = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'container';

      for (var _len5 = arguments.length, args = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
        args[_key5 - 2] = arguments[_key5];
      }

      return request ? this.requestFullscreen.apply(this, [target].concat(_toConsumableArray(args))) : this.exitFullscreen.apply(this, _toConsumableArray(args));
    }
  }, {
    key: 'focus',
    value: function focus() {
      this.videoElement.focus();
    }

    /**
     * function called when we distory
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      var _this7 = this;

      this.removeVideo();
      domEvents.forEach(function (key, index$$1) {
        removeEvent(_this7.container, key, _this7.containerDomEventHandlerList[index$$1]);
        removeEvent(_this7.wrapper, key, _this7.wrapperDomEventHandlerList[index$$1]);
      });
      index.off('fullscreenchange', this._fullscreenMonitor);
      this.wrapper.innerHTML = this.originHTML;
      delete this.wrapper;
      delete this.plugins;
    }

    /**
     * bind all dom events on one element
     * we will use passive mode if it support
     */

  }, {
    key: '_addDomEvents',
    value: function _addDomEvents(element, handlerList, handlerGenerate) {
      domEvents.forEach(function (key) {
        var fn = handlerGenerate(key);
        handlerList.push(fn);
        if (passiveEvents.indexOf(key) > -1) {
          addEvent(element, key, fn, false, { passive: true });
          return;
        }
        addEvent(element, key, fn);
      });
    }
  }, {
    key: '_autoFocusToVideo',
    value: function _autoFocusToVideo(element) {
      var remove = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      (remove ? removeEvent : addEvent)(element, 'mouseup', this._focusToVideo, false, true);
      (remove ? removeEvent : addEvent)(element, 'touchend', this._focusToVideo, false, true);
    }
  }, {
    key: '_focusToVideo',
    value: function _focusToVideo() {
      var x = window.scrollX;
      var y = window.scrollY;
      isFunction(this.videoElement.focus) && this.videoElement.focus();
      window.scrollTo(x, y);
    }
  }, {
    key: '_fullscreenMonitor',
    value: function _fullscreenMonitor(evt) {
      var element = index.fullscreenElement;
      var original = this.isFullscreen;
      if (!element || !isPosterityNode(this.wrapper, element) && element !== this.wrapper) {
        this.isFullscreen = false;
        this.fullscreenElement = undefined;
      } else {
        this.isFullscreen = true;
        this.fullscreenElement = this.wrapper === element ? 'wrapper' : this.container === element ? 'container' : this.videoElement === element ? 'video' : element;
      }
      if (isEvent(evt) && original !== this.isFullscreen) {
        this.__dispatcher.bus.triggerSync('fullscreenchange', evt);
      }
    }

    /**
     * get the event handler for dom to bind
     */

  }, {
    key: '_getEventHandler',
    value: function _getEventHandler(key, _ref) {
      var _this8 = this;

      var penetrate = _ref.penetrate;

      if (!penetrate || ['mouseenter', 'mouseleave'].indexOf(key) < 0) {
        return function () {
          var _dispatcher$bus4;

          for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
            args[_key6] = arguments[_key6];
          }

          (_dispatcher$bus4 = _this8.__dispatcher.bus).triggerSync.apply(_dispatcher$bus4, [key].concat(args));
        };
      }
      var insideVideo = function insideVideo(node) {
        return _this8.__videoExtendedNodes.indexOf(node) > -1 || _this8.__videoExtendedNodes.reduce(function (flag, video) {
          if (flag) return flag;
          return isPosterityNode(video, node);
        }, false);
      };
      return function () {
        for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
          args[_key7] = arguments[_key7];
        }

        var _args$ = args[0],
            toElement = _args$.toElement,
            currentTarget = _args$.currentTarget,
            relatedTarget = _args$.relatedTarget,
            type = _args$.type;

        var to = toElement || relatedTarget;
        if (_this8.__mouseInVideo && type === 'mouseleave' && !insideVideo(to)) {
          var _dispatcher$bus5;

          _this8.__mouseInVideo = false;
          return (_dispatcher$bus5 = _this8.__dispatcher.bus).triggerSync.apply(_dispatcher$bus5, ['mouseleave'].concat(args));
        }
        if (!_this8.__mouseInVideo && type === 'mouseenter' && insideVideo(currentTarget)) {
          var _dispatcher$bus6;

          _this8.__mouseInVideo = true;
          return (_dispatcher$bus6 = _this8.__dispatcher.bus).triggerSync.apply(_dispatcher$bus6, ['mouseenter'].concat(args));
        }
      };
    }
  }]);

  return Dom;
}(), _applyDecoratedDescriptor$5(_class$6.prototype, 'setAttr', [_dec$6, _dec2$4], _Object$getOwnPropertyDescriptor(_class$6.prototype, 'setAttr'), _class$6.prototype), _applyDecoratedDescriptor$5(_class$6.prototype, 'getAttr', [_dec3$3], _Object$getOwnPropertyDescriptor(_class$6.prototype, 'getAttr'), _class$6.prototype), _applyDecoratedDescriptor$5(_class$6.prototype, 'setStyle', [_dec4$3], _Object$getOwnPropertyDescriptor(_class$6.prototype, 'setStyle'), _class$6.prototype), _applyDecoratedDescriptor$5(_class$6.prototype, 'getStyle', [_dec5$2], _Object$getOwnPropertyDescriptor(_class$6.prototype, 'getStyle'), _class$6.prototype), _applyDecoratedDescriptor$5(_class$6.prototype, 'requestFullscreen', [_dec6$1], _Object$getOwnPropertyDescriptor(_class$6.prototype, 'requestFullscreen'), _class$6.prototype), _applyDecoratedDescriptor$5(_class$6.prototype, '_focusToVideo', [autobind], _Object$getOwnPropertyDescriptor(_class$6.prototype, '_focusToVideo'), _class$6.prototype), _applyDecoratedDescriptor$5(_class$6.prototype, '_fullscreenMonitor', [autobind], _Object$getOwnPropertyDescriptor(_class$6.prototype, '_fullscreenMonitor'), _class$6.prototype), _class$6);

var defaultContainerConfig = {
  width: '100%',
  height: '100%',
  position: 'relative',
  display: 'block'
};

// base css controller for container and wrapper

var Vessel = function Vessel(dispatcher, target, config) {
  var _this = this;

  _classCallCheck(this, Vessel);

  this.__dispatcher = dispatcher;
  this.__target = target;
  ['width', 'height', 'position', 'display'].forEach(function (key) {
    _Object$defineProperty(_this, key, {
      get: function get$$1() {
        return this.__dispatcher.dom.getStyle(this.__target, key);
      },
      set: function set(value) {
        if (isNumber(value)) {
          value = value + 'px';
        }
        if (!isString(value)) {
          throw new Error('The value of ' + key + ' in ' + this.__target + 'Config must be string, but not ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value)) + '.');
        }
        this.__dispatcher.dom.setStyle(this.__target, key, value);
        return value;
      },

      configurable: true,
      enumerable: true
    });
  });
  deepAssign(this, config);
};

var _dec$1;
var _dec2;
var _dec3;
var _dec4;
var _dec5;
var _class$1;

function _applyDecoratedDescriptor$1(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var pluginConfigSet = {};
var kernelsSet = {};
function convertNameIntoId(name) {
  if (!isString(name)) throw new Error('Plugin\'s name must be a string, but not "' + name + '" in ' + (typeof name === 'undefined' ? 'undefined' : _typeof(name)));
  return camelize(name);
}
function checkPluginConfig(config) {
  if (isFunction(config)) {
    if (!(config.prototype instanceof Plugin)) {
      throw new TypeError('Your are trying to install plugin ' + config.name + ', but it\'s not extends from Chimee.plugin.');
    }
    return;
  }
  if (!isObject$1(config) || isEmpty(config)) throw new TypeError('plugin\'s config must be an Object, but not "' + config + '" in ' + (typeof config === 'undefined' ? 'undefined' : _typeof(config)));
  var name = config.name;

  if (!isString(name) || name.length < 1) throw new TypeError('plugin must have a legal namea, but not "' + name + '" in ' + (typeof name === 'undefined' ? 'undefined' : _typeof(name)));
}
/**
 * <pre>
 * Dispatcher is the hub of plugins, user, and video kernel.
 * It take charge of plugins install, use and remove
 * It also offer a bridge to let user handle video kernel.
 * </pre>
 */
var Dispatcher = (_dec$1 = before(convertNameIntoId), _dec2 = before(checkPluginConfig), _dec3 = before(convertNameIntoId), _dec4 = before(convertNameIntoId), _dec5 = before(convertNameIntoId), _class$1 = function () {
  /**
   * @param  {UserConfig} config UserConfig for whole Chimee player
   * @param  {Chimee} vm referrence of outer class
   * @return {Dispatcher}
   */

  /**
   * the synchronous ready flag
   * @type {boolean}
   * @member readySync
   */

  /**
   * all plugins instance set
   * @type {Object}
   * @member plugins
   */
  function Dispatcher(config, vm) {
    var _this = this;

    _classCallCheck(this, Dispatcher);

    this.plugins = {};
    this.order = [];
    this.readySync = false;
    this.zIndexMap = {
      inner: [],
      outer: []
    };
    this.changeWatchable = true;
    this.kernelEventHandlerList = [];

    if (!isObject$1(config)) throw new TypeError('UserConfig must be an Object, but not "' + config + '" in ' + (typeof config === 'undefined' ? 'undefined' : _typeof(config)));
    /**
     * dom Manager
     * @type {Dom}
     */
    this.dom = new Dom(config.wrapper, this);
    /**
     * eventBus
     * @type {Bus}
     */
    this.bus = new Bus(this);
    /**
     * Chimee's referrence
     * @type {[type]}
     */
    this.vm = vm;
    /**
     * tell user have Chimee installed finished
     * @type {Promises}
     */
    this.videoConfigReady = false;
    // create the videoconfig
    this.videoConfig = new VideoConfig(this, config);
    // support both plugin and plugins here as people often cofuse both
    // $FlowFixMe: we support plugins here, which should be illegal
    if (isArray$1(config.plugins) && !isArray$1(config.plugin)) {
      config.plugin = config.plugins;
      delete config.plugins;
    }
    // use the plugin user want to use
    this._initUserPlugin(config.plugin);
    // add default config for container
    var containerConfig = deepAssign({}, defaultContainerConfig, config.container || {});
    // trigger the init life hook of plugin
    this.order.forEach(function (key) {
      return _this.plugins[key].__init(_this.videoConfig, containerConfig);
    });
    this.videoConfigReady = true;
    this.videoConfig.init();
    this.containerConfig = new Vessel(this, 'container', containerConfig);
    /**
     * video kernel
     * @type {Kernel}
     */
    this.kernel = this._createKernel(this.dom.videoElement, this.videoConfig);
    this._bindKernelEvents(this.kernel);
    // trigger auto load event
    var asyncInitedTasks = [];
    this.order.forEach(function (key) {
      var ready = _this.plugins[key].__inited();
      if (isPromise(ready)) {
        asyncInitedTasks.push(ready);
      }
    });
    this.readySync = asyncInitedTasks.length === 0;
    // tell them we have inited the whold player
    this.ready = this.readySync ? _Promise.resolve() : _Promise.all(asyncInitedTasks).then(function () {
      _this.readySync = true;
      _this.bus.trigger('ready');
      _this._autoloadVideoSrcAtFirst();
    });
    if (this.readySync) this._autoloadVideoSrcAtFirst();
  }
  /**
   * use a plugin, which means we will new a plugin instance and include int this Chimee instance
   * @param  {Object|string} option you can just set a plugin name or plugin config
   * @return {Promise}
   */

  // to save the kernel event handler, so that we can remove it when we destroy the kernel

  /**
   * the z-index map of the dom, it contain some important infomation
   * @type {Object}
   * @member zIndexMap
   */

  /**
   * plugin's order
   * @type {Array<string>}
   * @member order
   */


  _createClass(Dispatcher, [{
    key: 'use',
    value: function use(option) {
      if (isString(option)) option = { name: option, alias: undefined };
      if (!isObject$1(option) || isObject$1(option) && !isString(option.name)) {
        throw new TypeError('pluginConfig do not match requirement');
      }
      if (!isString(option.alias)) option.alias = undefined;
      var _option = option,
          name = _option.name,
          alias$$1 = _option.alias;

      option.name = alias$$1 || name;
      delete option.alias;
      var key = camelize(name);
      var id = camelize(alias$$1 || name);
      var pluginOption = option;
      var pluginConfig = Dispatcher.getPluginConfig(key);
      if (isEmpty(pluginConfig)) throw new TypeError('You have not installed plugin ' + key);
      if (isObject$1(pluginConfig)) {
        pluginConfig.id = id;
      }
      var plugin = isFunction(pluginConfig) ? new pluginConfig({ id: id }, this, pluginOption) // eslint-disable-line 
      : new Plugin(pluginConfig, this, pluginOption);
      this.plugins[id] = plugin;
      _Object$defineProperty(this.vm, id, {
        value: plugin,
        configurable: true,
        enumerable: false,
        writable: false
      });
      this.order.push(id);
      this._sortZIndex();
      if (this.videoConfigReady) plugin.__inited();
      return plugin.ready;
    }
    /**
     * unuse an plugin, we will destroy the plugin instance and exlude it
     * @param  {string} name plugin's name
     */

  }, {
    key: 'unuse',
    value: function unuse(id) {
      var plugin = this.plugins[id];
      if (!isObject$1(plugin) || !isFunction(plugin.$destroy)) {
        delete this.plugins[id];
        return;
      }
      plugin.$destroy();
      var orderIndex = this.order.indexOf(id);
      if (orderIndex > -1) {
        this.order.splice(orderIndex, 1);
      }
      delete this.plugins[id];
      delete this.vm[id];
    }
  }, {
    key: 'throwError',
    value: function throwError(error) {
      this.vm.__throwError(error);
    }
  }, {
    key: 'silentLoad',
    value: function silentLoad(src) {
      var _this2 = this;

      var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _option$duration = option.duration,
          duration = _option$duration === undefined ? 3 : _option$duration,
          _option$bias = option.bias,
          bias = _option$bias === undefined ? 0 : _option$bias,
          _option$repeatTimes = option.repeatTimes,
          repeatTimes = _option$repeatTimes === undefined ? 0 : _option$repeatTimes,
          _option$increment = option.increment,
          increment = _option$increment === undefined ? 0 : _option$increment,
          _option$isLive = option.isLive,
          isLive = _option$isLive === undefined ? this.videoConfig.isLive : _option$isLive,
          _option$box = option.box,
          box = _option$box === undefined ? this.videoConfig.box : _option$box,
          _option$kernels = option.kernels,
          kernels = _option$kernels === undefined ? this.videoConfig.kernels : _option$kernels,
          _option$preset = option.preset,
          preset = _option$preset === undefined ? this.videoConfig.preset : _option$preset;
      // all live stream seem as immediate mode
      // it's impossible to seek on live stream

      var immediate = option.immediate || isLive;
      // form the base config for kernel
      // it should be the same as the config now
      var config = { isLive: isLive, box: box, src: src, kernels: kernels, preset: preset };
      // build tasks accroding repeat times
      var tasks = new Array(repeatTimes + 1).fill(1).map(function (value, index$$1) {
        return function () {
          return new _Promise(function (resolve, reject) {
            // if abort, give up and reject
            if (option.abort) reject({ error: true, message: 'user abort the mission' });
            var video = document.createElement('video');
            var idealTime = _this2.kernel.currentTime + duration + increment * index$$1;
            video.muted = true;
            var newVideoReady = false;
            var kernel = void 0;
            var _videoError = void 0;
            var videoCanplay = void 0;
            var videoLoadedmetadata = void 0;
            // bind time update on old video
            // when we bump into the switch point and ready
            // we switch
            var oldVideoTimeupdate = function oldVideoTimeupdate() {
              var currentTime = _this2.kernel.currentTime;
              if (bias <= 0 && currentTime >= idealTime || bias > 0 && (Math.abs(idealTime - currentTime) <= bias && newVideoReady || currentTime - idealTime > bias)) {
                removeEvent(_this2.dom.videoElement, 'timeupdate', oldVideoTimeupdate);
                removeEvent(video, 'error', _videoError, true);
                if (!newVideoReady) {
                  removeEvent(video, 'canplay', videoCanplay, true);
                  removeEvent(video, 'loadedmetadata', videoLoadedmetadata, true);
                  kernel.destroy();
                  return resolve();
                }
                return reject({
                  error: false,
                  video: video,
                  kernel: kernel
                });
              }
            };
            videoCanplay = function videoCanplay() {
              newVideoReady = true;
              // you can set it immediately run by yourself
              if (immediate) {
                removeEvent(_this2.dom.videoElement, 'timeupdate', oldVideoTimeupdate);
                removeEvent(video, 'error', _videoError, true);
                return reject({
                  error: false,
                  video: video,
                  kernel: kernel
                });
              }
            };
            videoLoadedmetadata = function videoLoadedmetadata() {
              if (!isLive) kernel.seek(idealTime);
            };
            _videoError = function videoError(evt) {
              removeEvent(video, 'canplay', videoCanplay, true);
              removeEvent(video, 'loadedmetadata', videoLoadedmetadata, true);
              removeEvent(_this2.dom.videoElement, 'timeupdate', oldVideoTimeupdate);
              kernel.off('error', _videoError);
              var error = void 0;
              if (evt.target === kernel) {
                var message = evt.data.errmsg;

                Log.error("chimee's silent bump into a kernel error", message);
                error = new Error(message);
              } else {
                error = !isEmpty(video.error) ? new Error(video.error.message) : new Error('unknow video error');
                Log.error("chimee's silentload", error.message);
              }
              kernel.destroy();
              _this2._silentLoadTempKernel = undefined;
              return index$$1 === repeatTimes ? reject(error) : resolve(error);
            };
            addEvent(video, 'canplay', videoCanplay, true);
            addEvent(video, 'loadedmetadata', videoLoadedmetadata, true);
            addEvent(video, 'error', _videoError, true);
            kernel = _this2._createKernel(video, config);
            _this2._silentLoadTempKernel = kernel;
            kernel.on('error', _videoError);
            addEvent(_this2.dom.videoElement, 'timeupdate', oldVideoTimeupdate);
            kernel.load();
          });
        };
      });
      return runRejectableQueue(tasks).then(function () {
        var message = 'The silentLoad for ' + src + ' timed out. Please set a longer duration or check your network';
        /* istanbul ignore else  */
        return _Promise.reject(new Error(message));
      }).catch(function (data) {
        if (isError(data)) {
          return _Promise.reject(data);
        }
        if (data.error) {
          /* istanbul ignore else  */
          return _Promise.reject(new Error(data.message));
        }
        var video = data.video,
            kernel = data.kernel;

        if (option.abort) {
          kernel.destroy();
          return _Promise.reject(new Error('user abort the mission'));
        }
        var paused = _this2.dom.videoElement.paused;
        if (paused) {
          _this2.switchKernel({ video: video, kernel: kernel, config: config });
          return _Promise.resolve();
        }
        return new _Promise(function (resolve) {
          addEvent(video, 'play', function () {
            _this2.switchKernel({ video: video, kernel: kernel, config: config });
            resolve();
          }, true);
          video.play();
        });
      });
    }
  }, {
    key: 'load',
    value: function load(src) {
      var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!isEmpty(option)) {
        var videoConfig = this.videoConfig;

        var _option$isLive2 = option.isLive,
            _isLive = _option$isLive2 === undefined ? videoConfig.isLive : _option$isLive2,
            _option$box2 = option.box,
            _box = _option$box2 === undefined ? videoConfig.box : _option$box2,
            _option$preset2 = option.preset,
            _preset = _option$preset2 === undefined ? videoConfig.preset : _option$preset2,
            _option$kernels2 = option.kernels,
            _kernels = _option$kernels2 === undefined ? videoConfig.kernels : _option$kernels2;

        var video = document.createElement('video');
        var config = { isLive: _isLive, box: _box, preset: _preset, src: src, kernels: _kernels };
        var kernel = this._createKernel(video, config);
        this.switchKernel({ video: video, kernel: kernel, config: config });
      }
      var originAutoLoad = this.videoConfig.autoload;
      this._changeUnwatchable(this.videoConfig, 'autoload', false);
      this.videoConfig.src = src || this.videoConfig.src;
      this.kernel.load(this.videoConfig.src);
      this._changeUnwatchable(this.videoConfig, 'autoload', originAutoLoad);
    }
  }, {
    key: 'switchKernel',
    value: function switchKernel(_ref) {
      var _this3 = this;

      var video = _ref.video,
          kernel = _ref.kernel,
          config = _ref.config;

      var oldKernel = this.kernel;
      var originVideoConfig = deepClone(this.videoConfig);
      this.dom.removeVideo();
      this.dom.installVideo(video);
      // as we will reset the currentVideoConfig on the new video
      // it will trigger the watch function as they maybe differnet
      // because video config will return the real situation
      // so we need to stop them
      this.videoConfig.changeWatchable = false;
      this.videoConfig.autoload = false;
      this.videoConfig.src = config.src;
      this.videoConfig._realDomAttr.forEach(function (key) {
        // $FlowFixMe: support computed key here
        if (key !== 'src') _this3.videoConfig[key] = originVideoConfig[key];
      });
      this.videoConfig.changeWatchable = true;
      this._bindKernelEvents(oldKernel, true);
      this._bindKernelEvents(kernel);
      this.kernel = kernel;
      this._silentLoadTempKernel = undefined;
      var isLive = config.isLive,
          box = config.box,
          preset = config.preset,
          kernels = config.kernels;

      _Object$assign(this.videoConfig, { isLive: isLive, box: box, preset: preset, kernels: kernels });
      // const config = {}
      oldKernel.destroy();
    }
    /**
     * destroy function called when dispatcher destroyed
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      for (var key in this.plugins) {
        this.unuse(key);
      }
      this.bus.destroy();
      delete this.bus;
      this.dom.destroy();
      delete this.dom;
      this._bindKernelEvents(this.kernel, true);
      this.kernel.destroy();
      delete this.kernel;
      delete this.vm;
      delete this.plugins;
      delete this.order;
    }
    /**
     * use a set of plugin
     * @param  {Array<UserPluginConfig>}  configs  a set of plugin config
     * @return {Array<Promise>}   a set of Promise indicate the plugin install stage
     */

  }, {
    key: '_initUserPlugin',
    value: function _initUserPlugin() {
      var _this4 = this;

      var configs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (!isArray$1(configs)) {
        /* istanbul ignore else  */
        configs = [];
      }
      return configs.map(function (config) {
        return _this4.use(config);
      });
    }
    /**
     * sort zIndex of plugins to make plugin display in order
     */

  }, {
    key: '_sortZIndex',
    value: function _sortZIndex() {
      var _this5 = this;

      var _order$reduce = this.order.reduce(function (levelSet, key) {
        var plugin = _this5.plugins[key];
        if (isEmpty(plugin)) return levelSet;
        var set = levelSet[plugin.$inner ? 'inner' : 'outer'];
        var level = plugin.$level;
        set[level] = set[level] || [];
        set[level].push(key);
        return levelSet;
      }, { inner: {}, outer: {} }),
          inner = _order$reduce.inner,
          outer = _order$reduce.outer;

      inner[0] = inner[0] || [];
      inner[0].unshift('videoElement');
      outer[0] = outer[0] || [];
      outer[0].unshift('container');
      var innerOrderArr = transObjectAttrIntoArray(inner);
      var outerOrderArr = transObjectAttrIntoArray(outer);
      this.dom.setPluginsZIndex(innerOrderArr);
      this.dom.setPluginsZIndex(outerOrderArr);
      this.zIndexMap.inner = innerOrderArr;
      this.zIndexMap.outer = outerOrderArr;
    }
    /**
     * get the top element's level
     * @param {boolean} inner get the inner array or the outer array
     */

  }, {
    key: '_getTopLevel',
    value: function _getTopLevel(inner) {
      var arr = this.zIndexMap[inner ? 'inner' : 'outer'];
      var plugin = this.plugins[arr[arr.length - 1]];
      return isEmpty(plugin) ? 0 : plugin.$level;
    }
  }, {
    key: '_autoloadVideoSrcAtFirst',
    value: function _autoloadVideoSrcAtFirst() {
      if (this.videoConfig.autoload) {
        if ("production" !== 'prodution' && !this.videoConfig.src) {
          Log.warn('You have not set the src, so you better set autoload to be false. Accroding to https://github.com/Chimeejs/chimee/blob/master/doc/zh-cn/chimee-api.md#src.');
          return;
        }
        this.bus.emit('load', this.videoConfig.src);
      }
    }
  }, {
    key: '_changeUnwatchable',
    value: function _changeUnwatchable(object, property, value) {
      this.changeWatchable = false;
      object[property] = value;
      this.changeWatchable = true;
    }
  }, {
    key: '_createKernel',
    value: function _createKernel(video, config) {
      var kernels = config.kernels,
          preset = config.preset;
      /* istanbul ignore else  */

      var newPreset = isArray$1(kernels) ? kernels.reduce(function (kernels, key) {
        if (!isFunction(kernelsSet[key])) {
          Log.warn('You have not installed kernel for ' + key + '.');
          return kernels;
        }
        kernels[key] = kernelsSet[key];
        return kernels;
      }, {}) : isObject$1(kernels) ? kernels : {};
      config.preset = _Object$assign(newPreset, preset);
      var kernel = new Kernel(video, config);
      return kernel;
    }
  }, {
    key: '_bindKernelEvents',
    value: function _bindKernelEvents(kernel) {
      var _this6 = this;

      var remove = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      kernelEvents.forEach(function (key, index$$1) {
        if (!remove) {
          var _fn = function _fn() {
            var _bus;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return (_bus = _this6.bus).triggerSync.apply(_bus, [key].concat(_toConsumableArray(args)));
          };
          kernel.on(key, _fn);
          _this6.kernelEventHandlerList.push(_fn);
          return;
        }
        var fn = _this6.kernelEventHandlerList[index$$1];
        kernel.off(key, fn);
      });
      if (remove) {
        this.kernelEventHandlerList = [];
        kernel.off('error', this.throwError);
      } else {
        kernel.on('error', this.throwError);
      }
    }
    /**
     * static method to install plugin
     * we will store the plugin config
     * @type {string} plugin's id
     */

  }], [{
    key: 'install',
    value: function install(config) {
      var name = config.name;

      var id = camelize(name);
      if (!isEmpty(pluginConfigSet[id])) {
        /* istanbul ignore else  */
        
      }
      var pluginConfig = isFunction(config) ? config : deepAssign({ id: id }, config);
      pluginConfigSet[id] = pluginConfig;
      return id;
    }
  }, {
    key: 'hasInstalled',
    value: function hasInstalled(id) {
      return !isEmpty(pluginConfigSet[id]);
    }
  }, {
    key: 'uninstall',
    value: function uninstall(id) {
      delete pluginConfigSet[id];
    }
    /**
     * get Plugin config based on plugin's id
     * @type {[type]}
     */

  }, {
    key: 'getPluginConfig',
    value: function getPluginConfig(id) {
      return pluginConfigSet[id];
    }
  }, {
    key: 'installKernel',
    value: function installKernel(key, value) {
      var tasks = isObject$1(key) ? _Object$entries(key) : [[key, value]];
      tasks.forEach(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            key = _ref3[0],
            value = _ref3[1];

        if (!isFunction(value)) throw new Error('The kernel you install on ' + key + ' must be a Function, but not ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value)));
        if (isFunction(kernelsSet[key])) Log.warn('You have alrady install a kenrle on ' + key + ', and now we will replace it');
        kernelsSet[key] = value;
      });
    }

    // only use for debug in internal

  }, {
    key: 'uninstallKernel',
    value: function uninstallKernel(key) {
      delete kernelsSet[key];
    }
  }, {
    key: 'hasInstalledKernel',
    value: function hasInstalledKernel(key) {
      return isFunction(kernelsSet[key]);
    }
  }]);

  return Dispatcher;
}(), _applyDecoratedDescriptor$1(_class$1.prototype, 'unuse', [_dec$1], _Object$getOwnPropertyDescriptor(_class$1.prototype, 'unuse'), _class$1.prototype), _applyDecoratedDescriptor$1(_class$1.prototype, 'throwError', [autobind], _Object$getOwnPropertyDescriptor(_class$1.prototype, 'throwError'), _class$1.prototype), _applyDecoratedDescriptor$1(_class$1, 'install', [_dec2], _Object$getOwnPropertyDescriptor(_class$1, 'install'), _class$1), _applyDecoratedDescriptor$1(_class$1, 'hasInstalled', [_dec3], _Object$getOwnPropertyDescriptor(_class$1, 'hasInstalled'), _class$1), _applyDecoratedDescriptor$1(_class$1, 'uninstall', [_dec4], _Object$getOwnPropertyDescriptor(_class$1, 'uninstall'), _class$1), _applyDecoratedDescriptor$1(_class$1, 'getPluginConfig', [_dec5], _Object$getOwnPropertyDescriptor(_class$1, 'getPluginConfig'), _class$1), _class$1);

var _class$7;
var _descriptor$2;

function _initDefineProp$2(target, property, descriptor, context) {
  if (!descriptor) return;

  _Object$defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor$6(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var GlobalConfig = (_class$7 = function () {
  _createClass(GlobalConfig, [{
    key: 'silent',
    get: function get$$1() {
      return this._silent;
    },
    set: function set(val) {
      var _this = this;

      val = !!val;
      this._silent = val;
      _Object$keys(this.log).forEach(function (key) {
        _this.log[key] = !val;
      });
    }
  }]);

  function GlobalConfig() {
    _classCallCheck(this, GlobalConfig);

    this.log = {
      error: true,
      info: true,
      warn: true,
      debug: true,
      verbose: true
    };

    _initDefineProp$2(this, '_silent', _descriptor$2, this);

    this.errorHandler = undefined;

    var props = _Object$keys(this.log).reduce(function (props, key) {
      props[key] = accessor({
        get: function get$$1() {
          // $FlowFixMe: we have check the keys
          return Log['ENABLE_' + key.toUpperCase()];
        },
        set: function set(val) {
          // $FlowFixMe: we have check the keys
          Log['ENABLE_' + key.toUpperCase()] = val;
          if (val === true) this.silent = false;
          return val;
        }
      });
      return props;
    }, {});
    applyDecorators(this.log, props, { self: true });
  }

  return GlobalConfig;
}(), _descriptor$2 = _applyDecoratedDescriptor$6(_class$7.prototype, '_silent', [nonenumerable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _class$7);

var _dec;
var _class;
var _class2;
var _descriptor;
var _descriptor2;
var _descriptor3;
var _init;
var _init2;
var _init3;
var _init4;
var _init5;
var _init6;
var _init7;
var _init8;
var _init9;
var _class3;
var _temp;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;

  _Object$defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var Chimee = (_dec = autobindClass(), _dec(_class = (_class2 = (_temp = _class3 = function (_VideoWrapper) {
  _inherits(Chimee, _VideoWrapper);

  function Chimee(config) {
    _classCallCheck(this, Chimee);

    var _this = _possibleConstructorReturn(this, (Chimee.__proto__ || _Object$getPrototypeOf(Chimee)).call(this));

    _this.destroyed = false;

    _initDefineProp(_this, '__id', _descriptor, _this);

    _initDefineProp(_this, 'version', _descriptor2, _this);

    _initDefineProp(_this, 'config', _descriptor3, _this);

    if (isString(config) || isElement(config)) {
      config = {
        wrapper: config,
        controls: true
      };
    } else if (isObject$1(config)) {
      if (!config.wrapper) throw new Error('You must pass in an legal object');
    } else {
      throw new Error('You must pass in an Object containing wrapper or string or element to new a Chimee');
    }
    // $FlowFixMe: we have check wrapper here
    _this.__dispatcher = new Dispatcher(config, _this);
    _this.ready = _this.__dispatcher.ready;
    _this.readySync = _this.__dispatcher.readySync;
    _this.__wrapAsVideo(_this.__dispatcher.videoConfig);
    return _this;
  }

  _createClass(Chimee, [{
    key: 'destroy',
    value: function destroy() {
      _get(Chimee.prototype.__proto__ || _Object$getPrototypeOf(Chimee.prototype), '__destroy', this).call(this);
      this.__dispatcher.destroy();
      this.destroyed = true;
    }
  }, {
    key: 'use',
    value: function use(option) {
      this.__dispatcher.use(option);
    }
  }, {
    key: 'unuse',
    value: function unuse(name) {
      this.__dispatcher.unuse(name);
    }
  }, {
    key: '__throwError',
    value: function __throwError(error) {
      if (isString(error)) error = new Error(error);
      var errorHandler = this.config.errorHandler || Chimee.config.errorHandler;
      if (isFunction(errorHandler)) return errorHandler(error);
      if (Chimee.config.silent) return;
      throw error;
    }
  }]);

  return Chimee;
}(VideoWrapper), _class3.plugin = Plugin, _class3.config = new GlobalConfig(), _class3.install = Dispatcher.install, _class3.uninstall = Dispatcher.uninstall, _class3.hasInstalled = Dispatcher.hasInstalled, _class3.installKernel = Dispatcher.installKernel, _class3.uninstallKernel = Dispatcher.uninstallKernel, _class3.hasInstalledKernel = Dispatcher.hasInstalledKernel, _class3.getPluginConfig = Dispatcher.getPluginConfig, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, '__id', [frozen], {
  enumerable: true,
  initializer: function initializer() {
    return '_vm';
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'version', [frozen], {
  enumerable: true,
  initializer: function initializer() {
    return '0.6.3';
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'config', [frozen], {
  enumerable: true,
  initializer: function initializer() {
    return {
      errorHandler: undefined
    };
  }
}), _applyDecoratedDescriptor(_class2, 'plugin', [frozen], (_init = _Object$getOwnPropertyDescriptor(_class2, 'plugin'), _init = _init ? _init.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function initializer() {
    return _init;
  }
}), _class2), _applyDecoratedDescriptor(_class2, 'config', [frozen], (_init2 = _Object$getOwnPropertyDescriptor(_class2, 'config'), _init2 = _init2 ? _init2.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function initializer() {
    return _init2;
  }
}), _class2), _applyDecoratedDescriptor(_class2, 'install', [frozen], (_init3 = _Object$getOwnPropertyDescriptor(_class2, 'install'), _init3 = _init3 ? _init3.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function initializer() {
    return _init3;
  }
}), _class2), _applyDecoratedDescriptor(_class2, 'uninstall', [frozen], (_init4 = _Object$getOwnPropertyDescriptor(_class2, 'uninstall'), _init4 = _init4 ? _init4.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function initializer() {
    return _init4;
  }
}), _class2), _applyDecoratedDescriptor(_class2, 'hasInstalled', [frozen], (_init5 = _Object$getOwnPropertyDescriptor(_class2, 'hasInstalled'), _init5 = _init5 ? _init5.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function initializer() {
    return _init5;
  }
}), _class2), _applyDecoratedDescriptor(_class2, 'installKernel', [frozen], (_init6 = _Object$getOwnPropertyDescriptor(_class2, 'installKernel'), _init6 = _init6 ? _init6.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function initializer() {
    return _init6;
  }
}), _class2), _applyDecoratedDescriptor(_class2, 'uninstallKernel', [frozen], (_init7 = _Object$getOwnPropertyDescriptor(_class2, 'uninstallKernel'), _init7 = _init7 ? _init7.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function initializer() {
    return _init7;
  }
}), _class2), _applyDecoratedDescriptor(_class2, 'hasInstalledKernel', [frozen], (_init8 = _Object$getOwnPropertyDescriptor(_class2, 'hasInstalledKernel'), _init8 = _init8 ? _init8.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function initializer() {
    return _init8;
  }
}), _class2), _applyDecoratedDescriptor(_class2, 'getPluginConfig', [frozen], (_init9 = _Object$getOwnPropertyDescriptor(_class2, 'getPluginConfig'), _init9 = _init9 ? _init9.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function initializer() {
    return _init9;
  }
}), _class2), _class2)) || _class);

/**
 * chimee-plugin-mobile-controlbar v0.0.7
 * (c) 2017 yandeqiang
 * Released under ISC
 */

function __$styleInject(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  head.appendChild(style);
  
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  return returnValue;
}

__$styleInject("container{position:relative;-webkit-tap-highlight-color:rgba(255,255,255,0)}container,video{display:block;width:100%;height:100%;background:#000;outline:none}video:focus{outline:none}.chimee-flex-component svg:hover g,.chimee-flex-component svg g{fill:#fff;stroke:#fff}chimee-clarity-list,chimee-control-state-pause,chimee-control-state-play,chimee-screen-full,chimee-screen-small{display:none}chimee-control.full chimee-screen-full,chimee-control.pause chimee-control-state-pause,chimee-control.play chimee-control-state-play,chimee-control.small chimee-screen-small{display:inline-block;width:1.4em;height:100%}chimee-control{position:absolute;bottom:0;left:0;display:block;width:100%;height:4em;font-size:10px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;overflow:hidden;font-family:Roboto,Arial,Helvetica,sans-serif;-webkit-transition:visibility .5s ease;transition:visibility .5s ease}chimee-control:focus{outline:none}chimee-control-wrap{position:absolute;left:0;bottom:0;width:100%;height:4em;line-height:4em;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start;-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start;background:rgba(0,0,0,.5);-webkit-transition:bottom .5s ease;transition:bottom .5s ease;pointer-events:auto}.chimee-flex-component{-webkit-box-ordinal-group:2;-ms-flex-order:1;order:1;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;height:4em;cursor:pointer}.chimee-flex-component svg{vertical-align:middle;width:1.8em;height:1.8em}chimee-control-state.chimee-flex-component{-ms-flex-preferred-size:3em;flex-basis:3em;text-align:right;margin-right:1em}chimee-control-state .left,chimee-control-state .right{-webkit-transition:d .2s ease-in-out;transition:d .2s ease-in-out}chimee-current-time.chimee-flex-component,chimee-total-time.chimee-flex-component{color:#fff;font-size:1.5em;font-weight:400;text-align:center;white-space:nowrap}chimee-progressbar.chimee-flex-component{position:relative;-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;margin:0 1.5em}.chimee-progressbar-line{position:absolute;top:1.8em;left:0;display:inline-block;height:8px;border-radius:4px}chimee-progressbar-bg{width:100%;background:#4c4c4c}chimee-progressbar-buffer{width:0;background:#6f6f6f}chimee-progressbar-all{background:#de698c}chimee-progressbar-ball{content:\"\";position:absolute;right:-1em;top:-.4em;display:inline-block;width:1.4em;height:1.4em;border-radius:1.4em;background:#fff;pointer-events:none}chimee-screen.chimee-flex-component{-ms-flex-preferred-size:3em;flex-basis:3em;text-align:left;margin-left:1em}", undefined);

/**
 * chimee-plugin-gesture v0.0.11
 * (c) 2017 yandeqiang
 * Released under ISC
 */

function unwrapExports$1 (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule$1(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var classCallCheck$1 = createCommonjsModule$1(function (module, exports) {
exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
});

var _classCallCheck$1 = unwrapExports$1(classCallCheck$1);

var _global$2 = createCommonjsModule$1(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core$2 = createCommonjsModule$1(function (module) {
var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

var _core_1$1 = _core$2.version;

var _aFunction$2 = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx$2 = function (fn, that, length) {
  _aFunction$2(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var _isObject$2 = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject$2 = function (it) {
  if (!_isObject$2(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails$2 = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors$2 = !_fails$2(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document$1$1 = _global$2.document;
// typeof document.createElement is 'object' in old IE
var is$1 = _isObject$2(document$1$1) && _isObject$2(document$1$1.createElement);
var _domCreate$2 = function (it) {
  return is$1 ? document$1$1.createElement(it) : {};
};

var _ie8DomDefine$2 = !_descriptors$2 && !_fails$2(function () {
  return Object.defineProperty(_domCreate$2('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive$2 = function (it, S) {
  if (!_isObject$2(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject$2(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject$2(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject$2(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP$4 = Object.defineProperty;

var f$8 = _descriptors$2 ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject$2(O);
  P = _toPrimitive$2(P, true);
  _anObject$2(Attributes);
  if (_ie8DomDefine$2) try {
    return dP$4(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp$2 = {
	f: f$8
};

var _propertyDesc$2 = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide$2 = _descriptors$2 ? function (object, key, value) {
  return _objectDp$2.f(object, key, _propertyDesc$2(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var PROTOTYPE$3 = 'prototype';

var $export$2 = function (type, name, source) {
  var IS_FORCED = type & $export$2.F;
  var IS_GLOBAL = type & $export$2.G;
  var IS_STATIC = type & $export$2.S;
  var IS_PROTO = type & $export$2.P;
  var IS_BIND = type & $export$2.B;
  var IS_WRAP = type & $export$2.W;
  var exports = IS_GLOBAL ? _core$2 : _core$2[name] || (_core$2[name] = {});
  var expProto = exports[PROTOTYPE$3];
  var target = IS_GLOBAL ? _global$2 : IS_STATIC ? _global$2[name] : (_global$2[name] || {})[PROTOTYPE$3];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? _ctx$2(out, _global$2)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE$3] = C[PROTOTYPE$3];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? _ctx$2(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export$2.R && expProto && !expProto[key]) _hide$2(expProto, key, out);
    }
  }
};
// type bitmap
$export$2.F = 1;   // forced
$export$2.G = 2;   // global
$export$2.S = 4;   // static
$export$2.P = 8;   // proto
$export$2.B = 16;  // bind
$export$2.W = 32;  // wrap
$export$2.U = 64;  // safe
$export$2.R = 128; // real proto method for `library`
var _export$2 = $export$2;

// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
_export$2(_export$2.S + _export$2.F * !_descriptors$2, 'Object', { defineProperty: _objectDp$2.f });

var $Object$4 = _core$2.Object;
var defineProperty$2$2 = function defineProperty(it, key, desc) {
  return $Object$4.defineProperty(it, key, desc);
};

var defineProperty$6$1 = createCommonjsModule$1(function (module) {
module.exports = { "default": defineProperty$2$2, __esModule: true };
});

unwrapExports$1(defineProperty$6$1);

var createClass$1 = createCommonjsModule$1(function (module, exports) {
exports.__esModule = true;



var _defineProperty2 = _interopRequireDefault(defineProperty$6$1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (_defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
});

var _createClass$1 = unwrapExports$1(createClass$1);

function getDistance(x, y, x1, y1) {

  return Math.sqrt(Math.pow(x1 - x, 2) + Math.pow(y1 - y, 2));
}

function getSpeed(s, t) {
  return s / t;
}

function isArray$1$1(arr) {
  return Array.isArray(arr);
}

/**
 * ??????????????????
 * 
 * ?????????????????????
 * 
 * ????????????
 * 
 * tap
 * swipe
 * drag
 */

var Gesture = function () {
  function Gesture() {
    _classCallCheck$1(this, Gesture);

    // this.events = events;
    // ['tap', 'swipe', 'panstart', 'panmove', 'panend', 'press'].forEach(item => {
    //   this[item] = events[item].bind(host);
    // })

    // ???????????????????????????
    // none tapping pressing

    this.event = {};
    this.status = 'none';
  }

  _createClass$1(Gesture, [{
    key: 'touchstart',
    value: function touchstart(evt) {

      // ????????????
      this.status = 'tapping';

      // ?????? touch ???
      this.startTouch = evt.changedTouches[0];

      // ????????????
      this.startTime = Date.now();
    }
  }, {
    key: 'touchmove',
    value: function touchmove(evt) {

      var touch = evt.changedTouches[0];

      var distance = getDistance(this.startTouch.clientX, this.startTouch.clientY, touch.clientX, touch.clientY);

      if (this.status === 'tapping' && distance > 10) {
        this.status = 'panning';
        this.fire('panstart', evt);
      } else if (this.status === 'panning') {
        this.fire('panmove', evt);
      }
    }
  }, {
    key: 'touchend',
    value: function touchend(evt) {

      this.endTouch = evt.changedTouches[0];

      var distance = getDistance(this.startTouch.clientX, this.startTouch.clientY, this.endTouch.clientX, this.endTouch.clientY);

      var interval = Date.now() - this.startTime;

      // ?????? <= 250ms ???????????? 10 px ???????????? tap
      if (interval <= 250 && distance < 10) this.fire('tap', evt);

      // ?????? > 250ms ???????????? 10 px ???????????? press    
      if (interval > 250 && distance < 10) this.fire('press', evt);

      var speed = getSpeed(distance, interval);

      // ???????????? 10 px , ???????????? 0.3 ???????????? swipe
      if (speed > 0.3 && distance >= 10) this.fire('swipe', evt);

      // ?????? panning ????????? panend ??????
      if (this.status === 'panning') this.fire('panend', evt);

      this.status = 'none';
    }
  }, {
    key: 'touchcancel',
    value: function touchcancel(evt) {}
  }, {
    key: 'on',
    value: function on(type, func) {
      if (isArray$1$1(this.event[type])) {
        this.event[type].push(func);
      } else {
        this.event[type] = [func];
      }
    }
  }, {
    key: 'fire',
    value: function fire(type, evt) {
      if (!isArray$1$1(this.event[type])) return;
      this.event[type].forEach(function (item) {
        item(evt);
      });
    }
  }]);

  return Gesture;
}();

var baseMobileEvent = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];

function gestureFactory() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$name = _ref.name,
      name = _ref$name === undefined ? 'chimeeGesture' : _ref$name,
      el = _ref.el,
      _ref$level = _ref.level,
      level = _ref$level === undefined ? 0 : _ref$level,
      _ref$inner = _ref.inner,
      inner = _ref$inner === undefined ? true : _ref$inner,
      autoFocus = _ref.autoFocus,
      className = _ref.className,
      _beforeCreate = _ref.beforeCreate,
      _create = _ref.create,
      init = _ref.init,
      inited = _ref.inited,
      _destroy = _ref.destroy,
      data = _ref.data,
      computed = _ref.computed,
      _ref$events = _ref.events,
      events = _ref$events === undefined ? {} : _ref$events,
      _ref$methods = _ref.methods,
      methods = _ref$methods === undefined ? {} : _ref$methods,
      _ref$penetrate = _ref.penetrate,
      penetrate = _ref$penetrate === undefined ? false : _ref$penetrate,
      _ref$operable = _ref.operable,
      operable = _ref$operable === undefined ? true : _ref$operable;

  return {
    name: name,
    el: el,
    level: level,
    inner: inner,
    autoFocus: autoFocus,
    className: className,
    data: data,
    computed: computed,
    beforeCreate: function beforeCreate(config) {
      var _this = this;

      this.gesture = new Gesture();
      this.c_gesture = new Gesture();
      this.w_gesture = new Gesture();
      this.d_gesture = new Gesture();
      baseMobileEvent.forEach(function (item) {
        config.events[item] = function (evt) {
          _this.gesture[item](evt);
        };
        config.events['c_' + item] = function (evt) {
          _this.c_gesture[item](evt);
        };
        config.events['w_' + item] = function (evt) {
          _this.w_gesture[item](evt);
        };
      });

      ['tap', 'swipe', 'panstart', 'panmove', 'panend', 'press'].forEach(function (item) {
        _this.gesture.on(item, function (evt) {
          var func = config.events[item];
          func && func.call(_this, evt);
        });
        _this.c_gesture.on(item, function (evt) {
          var func = config.events['c_' + item];
          func && func.call(_this, evt);
        });
        _this.w_gesture.on(item, function (evt) {
          var func = config.events['w_' + item];
          func && func.call(_this, evt);
        });
        _this.d_gesture.on(item, function (evt) {
          var func = config.events['d_' + item];
          func && func.call(_this, evt);
        });
      });

      _beforeCreate && _beforeCreate.call(this);
    },
    create: function create() {
      var _this2 = this;

      this._i = this._i || 0;
      this._i++;
      baseMobileEvent.forEach(function (item) {
        var key = '__' + item;
        _this2[key] = function (evt) {
          _this2.d_gesture[item](evt);
        };
        addEvent(_this2.$dom, item, _this2[key]);
      });

      _create && _create.call(this);
    },

    init: init,
    inited: inited,
    destroy: function destroy() {
      var _this3 = this;

      baseMobileEvent.forEach(function (item) {
        var key = '__' + item;
        removeEvent(_this3.$dom, item, _this3[key]);
      });

      _destroy && _destroy.call(this);
    },

    methods: methods,
    penetrate: penetrate,
    operable: operable,
    events: events
  };
}

function unwrapExports$1$1 (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule$1$1(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

// 7.2.1 RequireObjectCoercible(argument)
var _defined$2 = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// 7.1.13 ToObject(argument)

var _toObject$2 = function (it) {
  return Object(_defined$2(it));
};

var hasOwnProperty$1 = {}.hasOwnProperty;
var _has$2 = function (it, key) {
  return hasOwnProperty$1.call(it, key);
};

var toString$2 = {}.toString;

var _cof$2 = function (it) {
  return toString$2.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject$2 = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof$2(it) == 'String' ? it.split('') : Object(it);
};

// to indexed object, toObject with fallback for non-array-like ES3 strings


var _toIobject$2 = function (it) {
  return _iobject$2(_defined$2(it));
};

// 7.1.4 ToInteger
var ceil$1 = Math.ceil;
var floor$2 = Math.floor;
var _toInteger$2 = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor$2 : ceil$1)(it);
};

// 7.1.15 ToLength

var min$2 = Math.min;
var _toLength$2 = function (it) {
  return it > 0 ? min$2(_toInteger$2(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max$1 = Math.max;
var min$1$1 = Math.min;
var _toAbsoluteIndex$2 = function (index, length) {
  index = _toInteger$2(index);
  return index < 0 ? max$1(index + length, 0) : min$1$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes



var _arrayIncludes$2 = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject$2($this);
    var length = _toLength$2(O.length);
    var index = _toAbsoluteIndex$2(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var _global$1$1 = createCommonjsModule$1$1(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var SHARED$1 = '__core-js_shared__';
var store$1 = _global$1$1[SHARED$1] || (_global$1$1[SHARED$1] = {});
var _shared$2 = function (key) {
  return store$1[key] || (store$1[key] = {});
};

var id$2 = 0;
var px$1 = Math.random();
var _uid$2 = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id$2 + px$1).toString(36));
};

var shared$2 = _shared$2('keys');

var _sharedKey$2 = function (key) {
  return shared$2[key] || (shared$2[key] = _uid$2(key));
};

var arrayIndexOf$1 = _arrayIncludes$2(false);
var IE_PROTO$3 = _sharedKey$2('IE_PROTO');

var _objectKeysInternal$2 = function (object, names) {
  var O = _toIobject$2(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO$3) _has$2(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (_has$2(O, key = names[i++])) {
    ~arrayIndexOf$1(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys$2 = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)



var _objectKeys$2 = Object.keys || function keys(O) {
  return _objectKeysInternal$2(O, _enumBugKeys$2);
};

var _core$1$1 = createCommonjsModule$1$1(function (module) {
var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

var _core_1$1$1 = _core$1$1.version;

var _aFunction$1$1 = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx$1$1 = function (fn, that, length) {
  _aFunction$1$1(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var _isObject$1$1 = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject$1$1 = function (it) {
  if (!_isObject$1$1(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails$1$1 = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors$1$1 = !_fails$1$1(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document$2$1 = _global$1$1.document;
// typeof document.createElement is 'object' in old IE
var is$1$1 = _isObject$1$1(document$2$1) && _isObject$1$1(document$2$1.createElement);
var _domCreate$1$1 = function (it) {
  return is$1$1 ? document$2$1.createElement(it) : {};
};

var _ie8DomDefine$1$1 = !_descriptors$1$1 && !_fails$1$1(function () {
  return Object.defineProperty(_domCreate$1$1('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive$1$1 = function (it, S) {
  if (!_isObject$1$1(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject$1$1(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject$1$1(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject$1$1(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP$1$1 = Object.defineProperty;

var f$1$1 = _descriptors$1$1 ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject$1$1(O);
  P = _toPrimitive$1$1(P, true);
  _anObject$1$1(Attributes);
  if (_ie8DomDefine$1$1) try {
    return dP$1$1(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp$1$1 = {
	f: f$1$1
};

var _propertyDesc$1$1 = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide$1$1 = _descriptors$1$1 ? function (object, key, value) {
  return _objectDp$1$1.f(object, key, _propertyDesc$1$1(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var PROTOTYPE$1$1 = 'prototype';

var $export$1$1 = function (type, name, source) {
  var IS_FORCED = type & $export$1$1.F;
  var IS_GLOBAL = type & $export$1$1.G;
  var IS_STATIC = type & $export$1$1.S;
  var IS_PROTO = type & $export$1$1.P;
  var IS_BIND = type & $export$1$1.B;
  var IS_WRAP = type & $export$1$1.W;
  var exports = IS_GLOBAL ? _core$1$1 : _core$1$1[name] || (_core$1$1[name] = {});
  var expProto = exports[PROTOTYPE$1$1];
  var target = IS_GLOBAL ? _global$1$1 : IS_STATIC ? _global$1$1[name] : (_global$1$1[name] || {})[PROTOTYPE$1$1];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? _ctx$1$1(out, _global$1$1)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE$1$1] = C[PROTOTYPE$1$1];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? _ctx$1$1(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export$1$1.R && expProto && !expProto[key]) _hide$1$1(expProto, key, out);
    }
  }
};
// type bitmap
$export$1$1.F = 1;   // forced
$export$1$1.G = 2;   // global
$export$1$1.S = 4;   // static
$export$1$1.P = 8;   // proto
$export$1$1.B = 16;  // bind
$export$1$1.W = 32;  // wrap
$export$1$1.U = 64;  // safe
$export$1$1.R = 128; // real proto method for `library`
var _export$1$1 = $export$1$1;

// most Object methods by ES6 should accept primitives



var _objectSap$2 = function (KEY, exec) {
  var fn = (_core$1$1.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  _export$1$1(_export$1$1.S + _export$1$1.F * _fails$1$1(function () { fn(1); }), 'Object', exp);
};

// 19.1.2.14 Object.keys(O)



_objectSap$2('keys', function () {
  return function keys(it) {
    return _objectKeys$2(_toObject$2(it));
  };
});

var keys$1$1 = _core$1$1.Object.keys;

var keys$3 = createCommonjsModule$1$1(function (module) {
module.exports = { "default": keys$1$1, __esModule: true };
});

var _Object$keys$1 = unwrapExports$1$1(keys$3);

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


var IE_PROTO$1$1 = _sharedKey$2('IE_PROTO');
var ObjectProto$2 = Object.prototype;

var _objectGpo$2 = Object.getPrototypeOf || function (O) {
  O = _toObject$2(O);
  if (_has$2(O, IE_PROTO$1$1)) return O[IE_PROTO$1$1];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto$2 : null;
};

// 19.1.2.9 Object.getPrototypeOf(O)



_objectSap$2('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return _objectGpo$2(_toObject$2(it));
  };
});

var getPrototypeOf$1$1 = _core$1$1.Object.getPrototypeOf;

var getPrototypeOf$4 = createCommonjsModule$1$1(function (module) {
module.exports = { "default": getPrototypeOf$1$1, __esModule: true };
});

var _Object$getPrototypeOf$1 = unwrapExports$1$1(getPrototypeOf$4);

var classCallCheck$1$1 = createCommonjsModule$1$1(function (module, exports) {
exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
});

var _classCallCheck$1$1 = unwrapExports$1$1(classCallCheck$1$1);

// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
_export$1$1(_export$1$1.S + _export$1$1.F * !_descriptors$1$1, 'Object', { defineProperty: _objectDp$1$1.f });

var $Object$1$1 = _core$1$1.Object;
var defineProperty$3$2 = function defineProperty(it, key, desc) {
  return $Object$1$1.defineProperty(it, key, desc);
};

var defineProperty$1$2 = createCommonjsModule$1$1(function (module) {
module.exports = { "default": defineProperty$3$2, __esModule: true };
});

unwrapExports$1$1(defineProperty$1$2);

var createClass$1$1 = createCommonjsModule$1$1(function (module, exports) {
exports.__esModule = true;



var _defineProperty2 = _interopRequireDefault(defineProperty$1$2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
});

var _createClass$1$1 = unwrapExports$1$1(createClass$1$1);

// true  -> String#at
// false -> String#codePointAt
var _stringAt$2 = function (TO_STRING) {
  return function (that, pos) {
    var s = String(_defined$2(that));
    var i = _toInteger$2(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

var _library$2 = true;

var _redefine$2 = _hide$1$1;

var _objectDps$2 = _descriptors$1$1 ? Object.defineProperties : function defineProperties(O, Properties) {
  _anObject$1$1(O);
  var keys = _objectKeys$2(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) _objectDp$1$1.f(O, P = keys[i++], Properties[P]);
  return O;
};

var document$3 = _global$1$1.document;
var _html$2 = document$3 && document$3.documentElement;

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



var IE_PROTO$2$1 = _sharedKey$2('IE_PROTO');
var Empty$1 = function () { /* empty */ };
var PROTOTYPE$2$1 = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict$1 = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate$1$1('iframe');
  var i = _enumBugKeys$2.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  _html$2.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict$1 = iframeDocument.F;
  while (i--) delete createDict$1[PROTOTYPE$2$1][_enumBugKeys$2[i]];
  return createDict$1();
};

var _objectCreate$2 = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty$1[PROTOTYPE$2$1] = _anObject$1$1(O);
    result = new Empty$1();
    Empty$1[PROTOTYPE$2$1] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$2$1] = O;
  } else result = createDict$1();
  return Properties === undefined ? result : _objectDps$2(result, Properties);
};

var _wks$2 = createCommonjsModule$1$1(function (module) {
var store = _shared$2('wks');

var Symbol = _global$1$1.Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid$2)('Symbol.' + name));
};

$exports.store = store;
});

var def$1 = _objectDp$1$1.f;

var TAG$2 = _wks$2('toStringTag');

var _setToStringTag$2 = function (it, tag, stat) {
  if (it && !_has$2(it = stat ? it : it.prototype, TAG$2)) def$1(it, TAG$2, { configurable: true, value: tag });
};

var IteratorPrototype$1 = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide$1$1(IteratorPrototype$1, _wks$2('iterator'), function () { return this; });

var _iterCreate$2 = function (Constructor, NAME, next) {
  Constructor.prototype = _objectCreate$2(IteratorPrototype$1, { next: _propertyDesc$1$1(1, next) });
  _setToStringTag$2(Constructor, NAME + ' Iterator');
};

var ITERATOR$5 = _wks$2('iterator');
var BUGGY$1 = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR$1 = '@@iterator';
var KEYS$1 = 'keys';
var VALUES$1 = 'values';

var returnThis$1 = function () { return this; };

var _iterDefine$2 = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  _iterCreate$2(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY$1 && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS$1: return function keys() { return new Constructor(this, kind); };
      case VALUES$1: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES$1;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR$5] || proto[FF_ITERATOR$1] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = _objectGpo$2($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      _setToStringTag$2(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!_library$2 && !_has$2(IteratorPrototype, ITERATOR$5)) _hide$1$1(IteratorPrototype, ITERATOR$5, returnThis$1);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES$1) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!_library$2 || FORCED) && (BUGGY$1 || VALUES_BUG || !proto[ITERATOR$5])) {
    _hide$1$1(proto, ITERATOR$5, $default);
  }
  // Plug for library
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES$1),
      keys: IS_SET ? $default : getMethod(KEYS$1),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) _redefine$2(proto, key, methods[key]);
    } else _export$1$1(_export$1$1.P + _export$1$1.F * (BUGGY$1 || VALUES_BUG), NAME, methods);
  }
  return methods;
};

var $at$1 = _stringAt$2(true);

// 21.1.3.27 String.prototype[@@iterator]()
_iterDefine$2(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at$1(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

var _iterStep$2 = function (done, value) {
  return { value: value, done: !!done };
};

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
var es6_array_iterator$2 = _iterDefine$2(Array, 'Array', function (iterated, kind) {
  this._t = _toIobject$2(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return _iterStep$2(1);
  }
  if (kind == 'keys') return _iterStep$2(0, index);
  if (kind == 'values') return _iterStep$2(0, O[index]);
  return _iterStep$2(0, [index, O[index]]);
}, 'values');

var TO_STRING_TAG$1 = _wks$2('toStringTag');

var DOMIterables$1 = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i$1 = 0; i$1 < DOMIterables$1.length; i$1++) {
  var NAME$1 = DOMIterables$1[i$1];
  var Collection$1 = _global$1$1[NAME$1];
  var proto$1 = Collection$1 && Collection$1.prototype;
  if (proto$1 && !proto$1[TO_STRING_TAG$1]) _hide$1$1(proto$1, TO_STRING_TAG$1, NAME$1);
  
}

var f$2$1 = _wks$2;

var _wksExt$2 = {
	f: f$2$1
};

var iterator$2$1 = _wksExt$2.f('iterator');

var iterator$4 = createCommonjsModule$1$1(function (module) {
module.exports = { "default": iterator$2$1, __esModule: true };
});

unwrapExports$1$1(iterator$4);

var _meta$2 = createCommonjsModule$1$1(function (module) {
var META = _uid$2('meta');


var setDesc = _objectDp$1$1.f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !_fails$1$1(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!_isObject$1$1(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!_has$2(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!_has$2(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !_has$2(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};
});

var _meta_1$1 = _meta$2.KEY;
var _meta_2$1 = _meta$2.NEED;
var _meta_3$1 = _meta$2.fastKey;
var _meta_4$1 = _meta$2.getWeak;
var _meta_5$1 = _meta$2.onFreeze;

var defineProperty$5$2 = _objectDp$1$1.f;
var _wksDefine$2 = function (name) {
  var $Symbol = _core$1$1.Symbol || (_core$1$1.Symbol = _library$2 ? {} : _global$1$1.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty$5$2($Symbol, name, { value: _wksExt$2.f(name) });
};

var f$3$1 = Object.getOwnPropertySymbols;

var _objectGops$2 = {
	f: f$3$1
};

var f$4$1 = {}.propertyIsEnumerable;

var _objectPie$2 = {
	f: f$4$1
};

// all enumerable object keys, includes symbols



var _enumKeys$2 = function (it) {
  var result = _objectKeys$2(it);
  var getSymbols = _objectGops$2.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = _objectPie$2.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

// 7.2.2 IsArray(argument)

var _isArray$2 = Array.isArray || function isArray$$1(arg) {
  return _cof$2(arg) == 'Array';
};

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

var hiddenKeys$1 = _enumBugKeys$2.concat('length', 'prototype');

var f$6$1 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return _objectKeysInternal$2(O, hiddenKeys$1);
};

var _objectGopn$2 = {
	f: f$6$1
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window

var gOPN$1$1 = _objectGopn$2.f;
var toString$1$1 = {}.toString;

var windowNames$1 = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames$1 = function (it) {
  try {
    return gOPN$1$1(it);
  } catch (e) {
    return windowNames$1.slice();
  }
};

var f$5$1 = function getOwnPropertyNames(it) {
  return windowNames$1 && toString$1$1.call(it) == '[object Window]' ? getWindowNames$1(it) : gOPN$1$1(_toIobject$2(it));
};

var _objectGopnExt$2 = {
	f: f$5$1
};

var gOPD$1$1 = Object.getOwnPropertyDescriptor;

var f$7$1 = _descriptors$1$1 ? gOPD$1$1 : function getOwnPropertyDescriptor(O, P) {
  O = _toIobject$2(O);
  P = _toPrimitive$1$1(P, true);
  if (_ie8DomDefine$1$1) try {
    return gOPD$1$1(O, P);
  } catch (e) { /* empty */ }
  if (_has$2(O, P)) return _propertyDesc$1$1(!_objectPie$2.f.call(O, P), O[P]);
};

var _objectGopd$2 = {
	f: f$7$1
};

// ECMAScript 6 symbols shim





var META$1 = _meta$2.KEY;


















var gOPD$3 = _objectGopd$2.f;
var dP$2$1 = _objectDp$1$1.f;
var gOPN$3 = _objectGopnExt$2.f;
var $Symbol$1 = _global$1$1.Symbol;
var $JSON$2 = _global$1$1.JSON;
var _stringify$1 = $JSON$2 && $JSON$2.stringify;
var PROTOTYPE$3$1 = 'prototype';
var HIDDEN$1 = _wks$2('_hidden');
var TO_PRIMITIVE$1 = _wks$2('toPrimitive');
var isEnum$2 = {}.propertyIsEnumerable;
var SymbolRegistry$1 = _shared$2('symbol-registry');
var AllSymbols$1 = _shared$2('symbols');
var OPSymbols$1 = _shared$2('op-symbols');
var ObjectProto$1$1 = Object[PROTOTYPE$3$1];
var USE_NATIVE$2 = typeof $Symbol$1 == 'function';
var QObject$1 = _global$1$1.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter$1 = !QObject$1 || !QObject$1[PROTOTYPE$3$1] || !QObject$1[PROTOTYPE$3$1].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc$1 = _descriptors$1$1 && _fails$1$1(function () {
  return _objectCreate$2(dP$2$1({}, 'a', {
    get: function () { return dP$2$1(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD$3(ObjectProto$1$1, key);
  if (protoDesc) delete ObjectProto$1$1[key];
  dP$2$1(it, key, D);
  if (protoDesc && it !== ObjectProto$1$1) dP$2$1(ObjectProto$1$1, key, protoDesc);
} : dP$2$1;

var wrap$1 = function (tag) {
  var sym = AllSymbols$1[tag] = _objectCreate$2($Symbol$1[PROTOTYPE$3$1]);
  sym._k = tag;
  return sym;
};

var isSymbol$1 = USE_NATIVE$2 && typeof $Symbol$1.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol$1;
};

var $defineProperty$1 = function defineProperty(it, key, D) {
  if (it === ObjectProto$1$1) $defineProperty$1(OPSymbols$1, key, D);
  _anObject$1$1(it);
  key = _toPrimitive$1$1(key, true);
  _anObject$1$1(D);
  if (_has$2(AllSymbols$1, key)) {
    if (!D.enumerable) {
      if (!_has$2(it, HIDDEN$1)) dP$2$1(it, HIDDEN$1, _propertyDesc$1$1(1, {}));
      it[HIDDEN$1][key] = true;
    } else {
      if (_has$2(it, HIDDEN$1) && it[HIDDEN$1][key]) it[HIDDEN$1][key] = false;
      D = _objectCreate$2(D, { enumerable: _propertyDesc$1$1(0, false) });
    } return setSymbolDesc$1(it, key, D);
  } return dP$2$1(it, key, D);
};
var $defineProperties$1 = function defineProperties(it, P) {
  _anObject$1$1(it);
  var keys = _enumKeys$2(P = _toIobject$2(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty$1(it, key = keys[i++], P[key]);
  return it;
};
var $create$1 = function create(it, P) {
  return P === undefined ? _objectCreate$2(it) : $defineProperties$1(_objectCreate$2(it), P);
};
var $propertyIsEnumerable$1 = function propertyIsEnumerable(key) {
  var E = isEnum$2.call(this, key = _toPrimitive$1$1(key, true));
  if (this === ObjectProto$1$1 && _has$2(AllSymbols$1, key) && !_has$2(OPSymbols$1, key)) return false;
  return E || !_has$2(this, key) || !_has$2(AllSymbols$1, key) || _has$2(this, HIDDEN$1) && this[HIDDEN$1][key] ? E : true;
};
var $getOwnPropertyDescriptor$2 = function getOwnPropertyDescriptor(it, key) {
  it = _toIobject$2(it);
  key = _toPrimitive$1$1(key, true);
  if (it === ObjectProto$1$1 && _has$2(AllSymbols$1, key) && !_has$2(OPSymbols$1, key)) return;
  var D = gOPD$3(it, key);
  if (D && _has$2(AllSymbols$1, key) && !(_has$2(it, HIDDEN$1) && it[HIDDEN$1][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames$1 = function getOwnPropertyNames(it) {
  var names = gOPN$3(_toIobject$2(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!_has$2(AllSymbols$1, key = names[i++]) && key != HIDDEN$1 && key != META$1) result.push(key);
  } return result;
};
var $getOwnPropertySymbols$1 = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto$1$1;
  var names = gOPN$3(IS_OP ? OPSymbols$1 : _toIobject$2(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (_has$2(AllSymbols$1, key = names[i++]) && (IS_OP ? _has$2(ObjectProto$1$1, key) : true)) result.push(AllSymbols$1[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE$2) {
  $Symbol$1 = function Symbol() {
    if (this instanceof $Symbol$1) throw TypeError('Symbol is not a constructor!');
    var tag = _uid$2(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto$1$1) $set.call(OPSymbols$1, value);
      if (_has$2(this, HIDDEN$1) && _has$2(this[HIDDEN$1], tag)) this[HIDDEN$1][tag] = false;
      setSymbolDesc$1(this, tag, _propertyDesc$1$1(1, value));
    };
    if (_descriptors$1$1 && setter$1) setSymbolDesc$1(ObjectProto$1$1, tag, { configurable: true, set: $set });
    return wrap$1(tag);
  };
  _redefine$2($Symbol$1[PROTOTYPE$3$1], 'toString', function toString() {
    return this._k;
  });

  _objectGopd$2.f = $getOwnPropertyDescriptor$2;
  _objectDp$1$1.f = $defineProperty$1;
  _objectGopn$2.f = _objectGopnExt$2.f = $getOwnPropertyNames$1;
  _objectPie$2.f = $propertyIsEnumerable$1;
  _objectGops$2.f = $getOwnPropertySymbols$1;

  if (_descriptors$1$1 && !_library$2) {
    _redefine$2(ObjectProto$1$1, 'propertyIsEnumerable', $propertyIsEnumerable$1, true);
  }

  _wksExt$2.f = function (name) {
    return wrap$1(_wks$2(name));
  };
}

_export$1$1(_export$1$1.G + _export$1$1.W + _export$1$1.F * !USE_NATIVE$2, { Symbol: $Symbol$1 });

for (var es6Symbols$1 = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j$1 = 0; es6Symbols$1.length > j$1;)_wks$2(es6Symbols$1[j$1++]);

for (var wellKnownSymbols$1 = _objectKeys$2(_wks$2.store), k$1 = 0; wellKnownSymbols$1.length > k$1;) _wksDefine$2(wellKnownSymbols$1[k$1++]);

_export$1$1(_export$1$1.S + _export$1$1.F * !USE_NATIVE$2, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return _has$2(SymbolRegistry$1, key += '')
      ? SymbolRegistry$1[key]
      : SymbolRegistry$1[key] = $Symbol$1(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol$1(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry$1) if (SymbolRegistry$1[key] === sym) return key;
  },
  useSetter: function () { setter$1 = true; },
  useSimple: function () { setter$1 = false; }
});

_export$1$1(_export$1$1.S + _export$1$1.F * !USE_NATIVE$2, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create$1,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty$1,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties$1,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor$2,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames$1,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols$1
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON$2 && _export$1$1(_export$1$1.S + _export$1$1.F * (!USE_NATIVE$2 || _fails$1$1(function () {
  var S = $Symbol$1();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify$1([S]) != '[null]' || _stringify$1({ a: S }) != '{}' || _stringify$1(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    if (it === undefined || isSymbol$1(it)) return; // IE8 returns string on undefined
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    replacer = args[1];
    if (typeof replacer == 'function') $replacer = replacer;
    if ($replacer || !_isArray$2(replacer)) replacer = function (key, value) {
      if ($replacer) value = $replacer.call(this, key, value);
      if (!isSymbol$1(value)) return value;
    };
    args[1] = replacer;
    return _stringify$1.apply($JSON$2, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol$1[PROTOTYPE$3$1][TO_PRIMITIVE$1] || _hide$1$1($Symbol$1[PROTOTYPE$3$1], TO_PRIMITIVE$1, $Symbol$1[PROTOTYPE$3$1].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
_setToStringTag$2($Symbol$1, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
_setToStringTag$2(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
_setToStringTag$2(_global$1$1.JSON, 'JSON', true);

_wksDefine$2('asyncIterator');

_wksDefine$2('observable');

var symbol$2$1 = _core$1$1.Symbol;

var symbol$4 = createCommonjsModule$1$1(function (module) {
module.exports = { "default": symbol$2$1, __esModule: true };
});

unwrapExports$1$1(symbol$4);

var _typeof_1$1 = createCommonjsModule$1$1(function (module, exports) {
exports.__esModule = true;



var _iterator2 = _interopRequireDefault(iterator$4);



var _symbol2 = _interopRequireDefault(symbol$4);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
});

unwrapExports$1$1(_typeof_1$1);

var possibleConstructorReturn$1 = createCommonjsModule$1$1(function (module, exports) {
exports.__esModule = true;



var _typeof3 = _interopRequireDefault(_typeof_1$1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};
});

var _possibleConstructorReturn$1 = unwrapExports$1$1(possibleConstructorReturn$1);

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)

var $getOwnPropertyDescriptor$1$1 = _objectGopd$2.f;

_objectSap$2('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor$1$1(_toIobject$2(it), key);
  };
});

var $Object$2$1 = _core$1$1.Object;
var getOwnPropertyDescriptor$1$2 = function getOwnPropertyDescriptor(it, key) {
  return $Object$2$1.getOwnPropertyDescriptor(it, key);
};

var getOwnPropertyDescriptor$4 = createCommonjsModule$1$1(function (module) {
module.exports = { "default": getOwnPropertyDescriptor$1$2, __esModule: true };
});

var _Object$getOwnPropertyDescriptor$1 = unwrapExports$1$1(getOwnPropertyDescriptor$4);

var get$1 = createCommonjsModule$1$1(function (module, exports) {
exports.__esModule = true;



var _getPrototypeOf2 = _interopRequireDefault(getPrototypeOf$4);



var _getOwnPropertyDescriptor2 = _interopRequireDefault(getOwnPropertyDescriptor$4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);

  if (desc === undefined) {
    var parent = (0, _getPrototypeOf2.default)(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};
});

var _get$1 = unwrapExports$1$1(get$1);

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */


var check$1 = function (O, proto) {
  _anObject$1$1(O);
  if (!_isObject$1$1(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
var _setProto$2 = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = _ctx$1$1(Function.call, _objectGopd$2.f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check$1(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check$1
};

// 19.1.3.19 Object.setPrototypeOf(O, proto)

_export$1$1(_export$1$1.S, 'Object', { setPrototypeOf: _setProto$2.set });

var setPrototypeOf$2$1 = _core$1$1.Object.setPrototypeOf;

var setPrototypeOf$4 = createCommonjsModule$1$1(function (module) {
module.exports = { "default": setPrototypeOf$2$1, __esModule: true };
});

unwrapExports$1$1(setPrototypeOf$4);

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
_export$1$1(_export$1$1.S, 'Object', { create: _objectCreate$2 });

var $Object$3$1 = _core$1$1.Object;
var create$2$1 = function create(P, D) {
  return $Object$3$1.create(P, D);
};

var create$4 = createCommonjsModule$1$1(function (module) {
module.exports = { "default": create$2$1, __esModule: true };
});

unwrapExports$1$1(create$4);

var inherits$1 = createCommonjsModule$1$1(function (module, exports) {
exports.__esModule = true;



var _setPrototypeOf2 = _interopRequireDefault(setPrototypeOf$4);



var _create2 = _interopRequireDefault(create$4);



var _typeof3 = _interopRequireDefault(_typeof_1$1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};
});

var _inherits$1 = unwrapExports$1$1(inherits$1);

/**
 * ???HTML????????????????????????
 * @param {HTMLElement} host ????????????
 * @param {String} selector ?????????????????????
 * @param {String} type ????????????
 * @param {Function} handler ????????????
 * @param {Boolean} capture ???????????????????????????
 */
function addDelegate$1(host, selector, type, handler) {
  var el = host.$dom;
  var handlerWrap = function handlerWrap(e) {
    var targetElsArr = findParents(e.target || e.srcElement, el, true);
    var targetElArr = query(selector, el, true);
    var retEl = void 0;
    if (targetElArr.find) {
      retEl = targetElArr.find(function (seEl) {
        return targetElsArr.find(function (tgEl) {
          return seEl === tgEl;
        });
      });
    } else {
      // Fixed IE11 Array.find not defined bug
      targetElArr.forEach(function (seEl) {
        return !retEl && targetElsArr.forEach(function (tgEl) {
          if (!retEl && seEl === tgEl) {
            retEl = tgEl;
          }
        });
      });
    }
    retEl && handler.apply(retEl, arguments);
  };
  /* ??????????????????????????????????????? */
  addEventCache(el, type + '_delegate_' + selector, handler, handlerWrap);
  host.events[type] = isArray$1(host.events[type]) ? host.events[type] : [];
  host.events[type].push(handlerWrap);
}

/**
 * ???HTML????????????????????????
 * @param {HTMLElement} host ????????????
 * @param {String} selector ?????????????????????
 * @param {String} type ????????????
 * @param {Function} handler ????????????
 * @param {Boolean} capture ???????????????????????????
 */
function removeDelegate$1(host, selector, type, handler) {
  var el = host.$dom;
  /* ?????????????????????????????????????????? */
  var handlerWrap = removeEventCache(el, type + '_delegate_' + selector, handler);
  if (handlerWrap) {
    var index = host.events[type].indexOf(handlerWrap);
    host.events[type].splice(index, 1);
  }
}

function fireEvent(host, type, evt) {
  isArray$1(host.events[type]) && host.events[type].forEach(function (item) {
    item(evt);
  });
}

var Base = function () {
  function Base(parent) {
    _classCallCheck$1$1(this, Base);

    this.parent = parent;
  }

  _createClass$1$1(Base, [{
    key: 'create',
    value: function create() {
      this.createEl();
      this.addAllEvent();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.removeAllEvent();
    }
  }, {
    key: 'createEl',
    value: function createEl() {
      this.$dom = document.createElement(this.option.tag);
      this.$dom.innerHTML = this.option.html;
      this.parent.$wrap.appendChild(this.$dom);
    }
  }, {
    key: 'addAllEvent',
    value: function addAllEvent() {
      var _this = this;

      this.option.defaultEvent && _Object$keys$1(this.option.defaultEvent).forEach(function (item) {
        var key = _this.option.defaultEvent[item];
        _this[key] = bind(_this[key], _this);
        addDelegate$1(_this.parent, _this.option.tag, item, _this[key], false, false);
      });
      this.option.event && _Object$keys$1(this.option.event).forEach(function (item) {
        var key = '__' + item;
        _this[key] = bind(_this.option.event[item], _this);
        addDelegate$1(_this.parent, _this.option.tag, item, _this[key], false, false);
      });
    }
  }, {
    key: 'removeAllEvent',
    value: function removeAllEvent() {
      var _this2 = this;

      this.option.defaultEvent && _Object$keys$1(this.option.defaultEvent).forEach(function (item) {
        var key = _this2.option.defaultEvent[item];
        _this2[key] = bind(_this2[key], _this2);
        removeDelegate$1(_this2.parent, _this2.option.tag, item, _this2[key], false, false);
      });
      this.option.event && _Object$keys$1(this.option.event).forEach(function (item) {
        var key = '__' + item;
        _this2[key] = bind(_this2.option.event[item], _this2);
        removeDelegate$1(_this2.parent, _this2.option.tag, item, _this2[key], false, false);
      });
    }
  }]);

  return Base;
}();

/**
 * ?????????????????????
 */

var Component = function (_Base) {
  _inherits$1(Component, _Base);

  function Component(parent, option) {
    _classCallCheck$1$1(this, Component);

    var _this = _possibleConstructorReturn$1(this, (Component.__proto__ || _Object$getPrototypeOf$1(Component)).call(this, parent));

    _this.option = option;
    _this.init();
    return _this;
  }

  _createClass$1$1(Component, [{
    key: 'init',
    value: function init() {
      _get$1(Component.prototype.__proto__ || _Object$getPrototypeOf$1(Component.prototype), 'create', this).call(this);
      addClassName(this.$dom, 'chimee-flex-component');
    }
  }]);

  return Component;
}(Base);

/**
 * play ??????
 */

var defaultOption = {
  tag: 'chimee-control-state',
  html: '\n    <chimee-control-state-play></chimee-control-state-play>\n    <chimee-control-state-pause></chimee-control-state-pause>\n  ',
  animate: {
    icon: '\n      <svg viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n        <g fill="#ffffff" stroke="#ffffff">\n          <path class="left"></path>\n          <path class="right"></path>\n        </g>\n      </svg>\n    ',
    path: {
      play: {
        left: 'M0.921875,0.265625L0.921875,197.074852L95.7890625,149L96.2929688,49Z',
        right: 'M90.3142151,45.9315226L90.3142151,151.774115L201.600944,99.9938782L201.600944,98.0237571Z'
      },
      pause: {
        left: 'M0.921875,1.265625L0.921875,198.074852L79.3611677,198.074852L79.3611677,0.258923126Z',
        right: 'M126.921875,1.265625L126.921875,198.074852L205.361168,198.074852L205.361168,0.258923126Z'
      }
    }
  },
  defaultEvent: {
    tap: 'tap'
  }
};

var Play = function (_Base) {
  _inherits$1(Play, _Base);

  function Play(parent, option) {
    _classCallCheck$1$1(this, Play);

    var _this = _possibleConstructorReturn$1(this, (Play.__proto__ || _Object$getPrototypeOf$1(Play)).call(this, parent));

    _this.option = deepAssign(defaultOption, isObject$1(option) ? option : {});
    _this.animate = false;
    _this.init();
    return _this;
  }

  _createClass$1$1(Play, [{
    key: 'init',
    value: function init() {
      // ?????? html ??? ????????????
      _get$1(Play.prototype.__proto__ || _Object$getPrototypeOf$1(Play.prototype), 'create', this).call(this);
      this.$dom = $(this.$dom);
      this.$dom.addClass('chimee-flex-component');

      // ??????????????????????????????????????? icon
      if (this.option.icon && this.option.icon.play && this.option.icon.pause) {
        this.$play = this.$dom.find('chimee-control-state-play');
        this.$pause = this.$dom.find('chimee-control-state-pause');
        this.$play.html(this.option.icon.play);
        this.$pause.html(this.option.icon.pause);
      } else if (!this.option.bitmap) {
        this.animate = true;
        this.option.animate.path = this.option.path ? this.option.path : this.option.animate.path;
        this.$dom.html(this.option.animate.icon);
        this.$left = this.$dom.find('.left');
        this.$right = this.$dom.find('.right');
      }
      this.changeState('pause');
    }
  }, {
    key: 'changeState',
    value: function changeState(state) {
      var nextState = state === 'play' ? 'pause' : 'play';
      this.state = state;
      addClassName(this.parent.$dom, nextState);
      removeClassName(this.parent.$dom, state);
      this.animate && this.setPath(nextState);
    }
  }, {
    key: 'setPath',
    value: function setPath(state) {
      var path = this.option.animate.path;
      if (state === 'play') {
        this.$left.attr('d', path.play.left);
        this.$right.attr('d', path.play.right);
      } else {
        this.$left.attr('d', path.pause.left);
        this.$right.attr('d', path.pause.right);
      }
    }
  }, {
    key: 'tap',
    value: function tap(e) {
      var nextState = this.state === 'play' ? 'pause' : 'play';
      this.changeState(nextState);
      this.parent.$emit(nextState);
    }
  }]);

  return Play;
}(Base);

var _class$2$1;

function _applyDecoratedDescriptor$2$1(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

/**
 * Screen ??????
 */

var defaultOption$1 = {
  tag: 'chimee-screen',
  html: '\n    <chimee-screen-full>\n      <svg viewBox="0 0 67 66" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n          <!-- Generator: Sketch 43.1 (39012) - http://www.bohemiancoding.com/sketch -->\n          <desc>Created with Sketch.</desc>\n          <defs></defs>\n          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n              <g id="screen-small" transform="translate(33.756308, 32.621867) rotate(45.000000) translate(-33.756308, -32.621867) translate(18.756308, -10.378133)" fill="#FFFFFF">\n                  <polygon id="Path" transform="translate(14.967695, 66.389245) rotate(180.000000) translate(-14.967695, -66.389245) " points="11.5190786 46.9431778 11.7210093 70.7913773 0.565180527 70.7913773 15.4674455 85.8353125 29.3702096 70.7913773 18.5573247 70.7702156 18.5573247 46.9431778"></polygon>\n                  <polygon id="Path" points="11.5190786 0.274130278 11.7210093 24.1223298 0.565180527 24.1223298 15.4674455 39.1662649 29.3702096 24.1223298 18.5573247 24.1011681 18.5573247 0.274130278"></polygon>\n              </g>\n          </g>\n      </svg>\n    </chimee-screen-full>\n    <chimee-screen-small>\n      <svg viewBox="0 0 61 62" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n        <!-- Generator: Sketch 43.1 (39012) - http://www.bohemiancoding.com/sketch -->\n        <desc>Created with Sketch.</desc>\n        <defs></defs>\n        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n            <g id="Group" transform="translate(30.756308, 30.621867) rotate(45.000000) translate(-30.756308, -30.621867) translate(15.756308, -12.378133)" fill="#FFFFFF">\n                <polygon id="Path" points="11.5190786 46.9431778 11.7210093 70.7913773 0.565180527 70.7913773 15.4674455 85.8353125 29.3702096 70.7913773 18.5573247 70.7702156 18.5573247 46.9431778"></polygon>\n                <polygon id="Path" transform="translate(14.967695, 19.720198) rotate(180.000000) translate(-14.967695, -19.720198) " points="11.5190786 0.274130278 11.7210093 24.1223298 0.565180527 24.1223298 15.4674455 39.1662649 29.3702096 24.1223298 18.5573247 24.1011681 18.5573247 0.274130278"></polygon>\n            </g>\n        </g>\n      </svg>\n    </chimee-screen-small>\n  ',
  defaultEvent: {
    tap: 'tap'
  }
};

var Screen = (_class$2$1 = function (_Base) {
  _inherits$1(Screen, _Base);

  function Screen(parent, option) {
    _classCallCheck$1$1(this, Screen);

    var _this = _possibleConstructorReturn$1(this, (Screen.__proto__ || _Object$getPrototypeOf$1(Screen)).call(this, parent));

    _this.state = 'small';
    _this.option = deepAssign(defaultOption$1, isObject$1(option) ? option : {});
    _this.init();
    return _this;
  }

  _createClass$1$1(Screen, [{
    key: 'init',
    value: function init() {
      _get$1(Screen.prototype.__proto__ || _Object$getPrototypeOf$1(Screen.prototype), 'create', this).call(this);
      this.$dom = $(this.$dom);
      this.changeState(this.state);
      // addClassName(this.$dom, 'flex-item');
      this.$dom.addClass('chimee-flex-component');

      this.$full = this.$dom.find('chimee-screen-full');
      this.$small = this.$dom.find('chimee-screen-small');
      // ??????????????????????????????????????? icon
      if (this.option.icon && this.option.icon.full && this.option.icon.small) {
        // if((!this.option.icon.play && this.option.icon.puase) || (this.option.icon.play && !this.option.icon.puase)) {
        //   console.warn(`Please provide a play and pause icon???If you can't, we will use default icon!`);
        // }
        this.$full.html(this.option.icon.full);
        this.$small.html(this.option.icon.small);
      } else if (this.option.bitmap) {
        this.$full.html('');
        this.$small.html('');
      }
    }
  }, {
    key: 'changeState',
    value: function changeState(state) {
      var removeState = state === 'small' ? 'full' : 'small';
      addClassName(this.parent.$dom, state);
      removeClassName(this.parent.$dom, removeState);
    }
  }, {
    key: 'tap',
    value: function tap() {
      var full = false;
      if (this.state === 'small') {
        this.state = 'full';
        full = true;
      } else {
        this.state = 'small';
        full = false;
      }
      this.changeState(this.state);
      this.parent.$fullscreen(full, 'container');
      if (full) {
        this.watch_screen = this.parent.$watch('isFullscreen', this.screenChange);
      } else {
        this.watch_screen();
      }
    }
  }, {
    key: 'screenChange',
    value: function screenChange() {
      if (!this.parent.fullscreenElement) return;
      this.state = 'small';
      this.changeState('small');
      this.parent.$fullscreen(false, 'container');
    }
  }]);

  return Screen;
}(Base), _applyDecoratedDescriptor$2$1(_class$2$1.prototype, 'screenChange', [autobind], _Object$getOwnPropertyDescriptor$1(_class$2$1.prototype, 'screenChange'), _class$2$1.prototype), _class$2$1);

var _class$1$2;

function _applyDecoratedDescriptor$1$2(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var defaultOption$2 = {
  tag: 'chimee-progressbar',
  html: '\n    <chimee-progressbar-bg class="chimee-progressbar-line"></chimee-progressbar-bg>\n    <chimee-progressbar-buffer class="chimee-progressbar-line"></chimee-progressbar-buffer>\n    <chimee-progressbar-all class="chimee-progressbar-line">\n      <chimee-progressbar-ball></chimee-progressbar-ball>\n    </chimee-progressbar-all>\n  '
};

var ProgressBar = (_class$1$2 = function (_Base) {
  _inherits$1(ProgressBar, _Base);

  function ProgressBar(parent, option) {
    _classCallCheck$1$1(this, ProgressBar);

    var _this = _possibleConstructorReturn$1(this, (ProgressBar.__proto__ || _Object$getPrototypeOf$1(ProgressBar)).call(this, parent));

    _this.option = deepAssign(defaultOption$2, isObject$1(option) ? option : {});
    _this.visiable = option !== false;
    _this.init();
    return _this;
  }

  _createClass$1$1(ProgressBar, [{
    key: 'init',
    value: function init() {
      _get$1(ProgressBar.prototype.__proto__ || _Object$getPrototypeOf$1(ProgressBar.prototype), 'create', this).call(this);
      this.$dom = $(this.$dom);
      this.$buffer = this.$dom.find('chimee-progressbar-buffer');
      this.$all = this.$dom.find('chimee-progressbar-all');
      this.$ball = this.$dom.find('chimee-progressbar-ball');
      this.$dom.addClass('chimee-flex-component');

      // css ??????
      !this.visiable && this.$dom.css('visibility', 'hidden');
      this.addEvent();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.removeEvent();
      // ????????????????????????
      this.watch_screen && this.watch_screen();
      _get$1(ProgressBar.prototype.__proto__ || _Object$getPrototypeOf$1(ProgressBar.prototype), 'destroy', this).call(this);
    }
  }, {
    key: 'addEvent',
    value: function addEvent$$1() {
      addDelegate$1(this.parent, 'chimee-progressbar', 'tap', this.tap);
      addDelegate$1(this.parent, 'chimee-progressbar', 'panstart', this.mousedown);
    }
  }, {
    key: 'removeEvent',
    value: function removeEvent$$1() {
      removeDelegate$1(this.parent, 'chimee-progressbar', 'tap', this.tap);
      removeDelegate$1(this.parent, 'chimee-progressbar', 'panstart', this.mousedown);
    }

    /**
     * ????????????????????? progress ??????
     */

  }, {
    key: 'progress',
    value: function progress() {
      var buffer = 0;
      try {
        buffer = this.parent.buffered.end(0);
      } catch (e) {}
      var bufferWidth = buffer / this.parent.duration * 100 + '%';
      this.$buffer.css('width', bufferWidth);
    }

    /**
     * requestAnimationFrame ??????????????????, timeupdate ??????
     */

  }, {
    key: 'update',
    value: function update() {
      var time = this._currentTime !== undefined ? this._currentTime : this.parent.currentTime;
      var timePer = time ? time / this.parent.duration : 0;
      this.$all.css('width', timePer * 100 + '%');
    }
  }, {
    key: 'tap',
    value: function tap(e) {
      this._currentTime = (e.clientX - this.$dom[0].offsetLeft) / this.$dom[0].offsetWidth * this.parent.duration;
      this.update();
      this.parent.currentTime = this._currentTime;
    }
  }, {
    key: 'mousedown',
    value: function mousedown(e) {

      this._currentTime = (e.clientX - this.$dom[0].offsetLeft) / this.$dom[0].offsetWidth * this.parent.duration;
      this.startX = e.clientX;
      this.startTime = this._currentTime;
      addDelegate$1(this.parent, this.option.tag, 'panmove', this.draging);
      addDelegate$1(this.parent, this.option.tag, 'panend', this.dragEnd);
    }

    /**
     * ????????????
     * @param {EventObject} e ????????????
     */

  }, {
    key: 'draging',
    value: function draging(e) {
      this.endX = e.clientX;
      var dragTime = (this.endX - this.startX) / this.$dom[0].offsetWidth * this.parent.duration;
      var dragAfterTime = +(this.startTime + dragTime).toFixed(2);
      this._currentTime = dragAfterTime < 0 ? 0 : dragAfterTime > this.parent.duration ? this.parent.duration : dragAfterTime;
      this.update();
    }

    /**
     * ????????????
     */

  }, {
    key: 'dragEnd',
    value: function dragEnd() {
      this.startX = 0;
      this.startTime = 0;
      this.parent.currentTime = this._currentTime;
      this._currentTime = undefined;
      removeDelegate$1(this.parent, this.option.tag, 'panmove', this.draging);
      removeDelegate$1(this.parent, this.option.tag, 'panend', this.dragEnd);
    }
  }]);

  return ProgressBar;
}(Base), _applyDecoratedDescriptor$1$2(_class$1$2.prototype, 'tap', [autobind], _Object$getOwnPropertyDescriptor$1(_class$1$2.prototype, 'tap'), _class$1$2.prototype), _applyDecoratedDescriptor$1$2(_class$1$2.prototype, 'mousedown', [autobind], _Object$getOwnPropertyDescriptor$1(_class$1$2.prototype, 'mousedown'), _class$1$2.prototype), _applyDecoratedDescriptor$1$2(_class$1$2.prototype, 'draging', [autobind], _Object$getOwnPropertyDescriptor$1(_class$1$2.prototype, 'draging'), _class$1$2.prototype), _applyDecoratedDescriptor$1$2(_class$1$2.prototype, 'dragEnd', [autobind], _Object$getOwnPropertyDescriptor$1(_class$1$2.prototype, 'dragEnd'), _class$1$2.prototype), _class$1$2);

/**
 * currentTime ??????
 */

var defaultOption$3 = {
  tag: 'chimee-current-time',
  html: '\n    00:00\n  '
};

var CurrentTime = function (_Base) {
  _inherits$1(CurrentTime, _Base);

  function CurrentTime(parent, option) {
    _classCallCheck$1$1(this, CurrentTime);

    var _this = _possibleConstructorReturn$1(this, (CurrentTime.__proto__ || _Object$getPrototypeOf$1(CurrentTime)).call(this, parent));

    _this.option = deepAssign(defaultOption$3, isObject$1(option) ? option : {});
    _this.init();
    return _this;
  }

  _createClass$1$1(CurrentTime, [{
    key: 'init',
    value: function init() {
      _get$1(CurrentTime.prototype.__proto__ || _Object$getPrototypeOf$1(CurrentTime.prototype), 'create', this).call(this);
      this.$dom = $(this.$dom);
      this.$dom.addClass('chimee-flex-component');
    }
  }, {
    key: 'updateCurrent',
    value: function updateCurrent() {
      this.$dom.text(formatTime(this.parent.currentTime));
    }
  }]);

  return CurrentTime;
}(Base);

/**
 * totalTime ??????
 */

var defaultOption$4 = {
  tag: 'chimee-total-time',
  html: '\n    00:00\n  '
};

var TotalTime = function (_Base) {
  _inherits$1(TotalTime, _Base);

  function TotalTime(parent, option) {
    _classCallCheck$1$1(this, TotalTime);

    var _this = _possibleConstructorReturn$1(this, (TotalTime.__proto__ || _Object$getPrototypeOf$1(TotalTime)).call(this, parent));

    _this.option = deepAssign(defaultOption$4, isObject$1(option) ? option : {});
    _this.init();
    return _this;
  }

  _createClass$1$1(TotalTime, [{
    key: 'init',
    value: function init() {
      _get$1(TotalTime.prototype.__proto__ || _Object$getPrototypeOf$1(TotalTime.prototype), 'create', this).call(this);
      this.$dom = $(this.$dom);
      this.$dom.addClass('chimee-flex-component');
    }
  }, {
    key: 'updateTotal',
    value: function updateTotal() {
      this.$dom.text(formatTime(this.parent.duration));
    }
  }]);

  return TotalTime;
}(Base);

function hundleChildren(plugin) {
  var childConfig = {};
  if (!plugin.$config.children) {
    childConfig = plugin.isLive ? {
      play: true, // ????????????????????????
      currentTime: false, // ????????????
      progressBar: false, // ?????????????????????
      totalTime: false, // ?????????
      screen: true // ????????????
    } : {
      play: true, // ????????????????????????
      currentTime: true, // ????????????
      progressBar: true, // ?????????????????????
      totalTime: true, // ?????????
      screen: true // ????????????
    };
  } else {
    childConfig = plugin.$config.children;
  }
  return childConfig;
}

/**
 * 1. ???????????? ui component ????????? html ?????????
 * 2. ????????? component ?????????????????????
 * @param {*} dom ?????? ui ??????????????????
 * @param {*} config ?????? ui ??????????????????
 * @return {Array} ???????????????
 */

function createChild(plugin) {
  var childConfig = plugin.config.children = hundleChildren(plugin);
  var children = {};
  _Object$keys$1(childConfig).forEach(function (item) {
    switch (item) {
      case 'play':
        if (childConfig.play) {
          children.play = new Play(plugin, childConfig.play);
        }
        break;
      case 'currentTime':
        if (childConfig.currentTime) {
          children.currentTime = new CurrentTime(plugin, childConfig.currentTime);
        }
        break;
      case 'progressBar':
        children.progressBar = new ProgressBar(plugin, childConfig.progressBar);
        break;
      case 'totalTime':
        if (childConfig.totalTime) {
          children.totalTime = new TotalTime(plugin, childConfig.totalTime);
        }
        break;
      case 'screen':
        if (childConfig.screen) {
          children.screen = new Screen(plugin, childConfig.screen);
        }
        break;
      default:
        children[item] = new Component(plugin, childConfig[item]);
        break;
    }
  });

  return children;
}

var majorColorStyle = '\n  .chimee-flex-component svg *{\n    fill: majorColor;\n    stroke: majorColor;\n  }\n  chimee-progressbar-all{\n    background: majorColor;\n  }\n  chimee-volume.chimee-flex-component chimee-volume-bar-all{\n    background: majorColor;    \n  }\n  chimee-clarity-list li:hover,\n  chimee-clarity-list li.active {\n    color: majorColor;\n  }\n';

var hoverColorStyle = '\n  .chimee-flex-component svg:hover *{\n    fill: hoverColor;\n    stroke: hoverColor;\n  }\n';

/**
 * ??????????????????
 */

var defaultConfig$1$1 = {};

var mobiControlbar = gestureFactory({
  name: 'chimeeMobiControlbar',
  el: 'chimee-control',
  data: {
    children: {},
    show: false,
    disabled: false
  },
  level: 99,
  operable: true,
  penetrate: false,
  create: function create() {
    this.environment = new uaParser().getResult();
  },
  init: function init(videoConfig) {
    if (videoConfig.controls) {
      this.show = true;
      videoConfig.controls = false;
    }
    var _this = this;
    applyDecorators(videoConfig, {
      controls: accessor({
        get: function get() {
          return _this.show;
        },
        set: function set(value) {
          _this.show = Boolean(value);
          _this._display();
          return false;
        }
      }, { preSet: true })
    }, { self: true });
    this.config = isObject$1(this.$config) ? deepAssign(defaultConfig$1$1, this.$config) : defaultConfig$1$1;
    this.$dom.innerHTML = '<chimee-control-wrap></chimee-control-wrap>';
    this.$wrap = this.$dom.querySelector('chimee-control-wrap');

    this.events = {};
    this.children = createChild(this);
    this._setStyle();

    // ?????? window / document ???????????????
    this._addGlobalEvent();

    // ??????????????????

    this.watch_fullscreen = this.$watch('isFullscreen', this._mousemove);
  },
  destroy: function destroy() {
    window.clearTimeout(this.timeId);
    this._removeGlobalEvent();
    this.watch_fullscreen && this.watch_fullscreen();
  },
  inited: function inited() {
    for (var i in this.children) {
      this.children[i].inited && this.children[i].inited();
    }
  },

  events: {
    // ????????????
    loadstart: function loadstart() {
      this._disable(true);
    },
    loadedmetadata: function loadedmetadata() {
      this._disable(false);
    },
    play: function play() {
      this.children.play && this.children.play.changeState('play');
      this._hideItself();
    },
    pause: function pause() {
      this.children.play && this.children.play.changeState('pause');
      this._showItself();
    },
    load: function load() {},
    durationchange: function durationchange() {
      this.children.totalTime && this.children.totalTime.updateTotal();
    },
    timeupdate: function timeupdate() {
      this._progressUpdate();
    },
    progress: function progress() {
      this.children.progressBar && this.children.progressBar.progress();
    },
    volumechange: function volumechange() {
      this.children.volume && this.children.volume.update();
    },
    tap: function tap(evt) {
      this._mousemove();
    },
    d_tap: function d_tap(evt) {
      !this.paused && this._mousemove();
      fireEvent(this, 'tap', evt.changedTouches[0]);
    },
    d_panstart: function d_panstart(evt) {
      !this.paused && this._mousemove();
      fireEvent(this, 'panstart', evt.changedTouches[0]);
    },
    d_panmove: function d_panmove(evt) {
      !this.paused && this._mousemove();
      fireEvent(this, 'panmove', evt.changedTouches[0]);
    },
    d_panend: function d_panend(evt) {
      !this.paused && this._mousemove();
      fireEvent(this, 'panend', evt.changedTouches[0]);
    }
  },
  methods: {
    _progressUpdate: function _progressUpdate() {
      this.children.progressBar && this.children.progressBar.update();
      this.children.currentTime && this.children.currentTime.updateCurrent();
    },
    _hideItself: function _hideItself() {
      var _this2 = this;

      window.clearTimeout(this.timeId);
      this.timeId = setTimeout(function () {
        var bottom = -_this2.$wrap.offsetHeight;
        setStyle(_this2.$wrap, {
          bottom: bottom + 'px'
        });
        setStyle(_this2.$dom, {
          visibility: 'hidden'
        });
      }, 2000);
    },
    _showItself: function _showItself() {
      window.clearTimeout(this.timeId);
      setStyle(this.$wrap, {
        bottom: '0'
      });
      setStyle(this.$dom, {
        visibility: 'visible'
      });
    },
    _display: function _display() {
      var display = this.show ? 'block' : 'none';
      setStyle(this.$dom, {
        display: display
      });
    },
    _mousemove: function _mousemove(e) {
      if (this.paused) return;
      this._showItself();
      this._hideItself();
    },

    // controlbar ????????????
    // ??????????????????????????????
    _disable: function _disable(disabled) {
      if (!this.show) return;
      this.disabled = disabled;
      setStyle(this.$wrap, 'pointerEvents', disabled ? 'none' : 'auto');
    },
    _setStyle: function _setStyle() {
      var css = '';
      css += this.config.majorColor ? majorColorStyle.replace(/majorColor/g, this.config.majorColor) : '';
      css += this.config.hoverColor ? hoverColorStyle.replace(/hoverColor/g, this.config.hoverColor) : '';
      var style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.innerHTML = css;
      document.head.appendChild(style);
    },
    _weixinJSBridgeReady: function _weixinJSBridgeReady() {
      // console.log(this.environment.os === 'iOS', window.WeixinJSBridge)
      window.WeixinJSBridge && this.environment.os.name === 'iOS' && this.load();
    },

    // ??????????????????????????????
    _addGlobalEvent: function _addGlobalEvent() {
      addEvent(window, 'orientationchange', this._mousemove);
      addEvent(document, 'WeixinJSBridgeReady', this._weixinJSBridgeReady);
    },

    // ??????????????????????????????
    _removeGlobalEvent: function _removeGlobalEvent() {
      removeEvent(window, 'orientationchange', this._mousemove);
      removeEvent(document, 'WeixinJSBridgeReady', this._weixinJSBridgeReady);
    }
  }
});

/**
 * chimee-plugin-gesture v0.0.11
 * (c) 2017 yandeqiang
 * Released under ISC
 */

function unwrapExports$2 (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule$2(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var classCallCheck$2 = createCommonjsModule$2(function (module, exports) {
exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
});

var _classCallCheck$2 = unwrapExports$2(classCallCheck$2);

var _global$3 = createCommonjsModule$2(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core$3 = createCommonjsModule$2(function (module) {
var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

var _core_1$2 = _core$3.version;

var _aFunction$3 = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx$3 = function (fn, that, length) {
  _aFunction$3(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var _isObject$3 = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject$3 = function (it) {
  if (!_isObject$3(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails$3 = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors$3 = !_fails$3(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document$3$1 = _global$3.document;
// typeof document.createElement is 'object' in old IE
var is$2 = _isObject$3(document$3$1) && _isObject$3(document$3$1.createElement);
var _domCreate$3 = function (it) {
  return is$2 ? document$3$1.createElement(it) : {};
};

var _ie8DomDefine$3 = !_descriptors$3 && !_fails$3(function () {
  return Object.defineProperty(_domCreate$3('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive$3 = function (it, S) {
  if (!_isObject$3(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject$3(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject$3(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject$3(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP$5 = Object.defineProperty;

var f$9 = _descriptors$3 ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject$3(O);
  P = _toPrimitive$3(P, true);
  _anObject$3(Attributes);
  if (_ie8DomDefine$3) try {
    return dP$5(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp$3 = {
	f: f$9
};

var _propertyDesc$3 = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide$3 = _descriptors$3 ? function (object, key, value) {
  return _objectDp$3.f(object, key, _propertyDesc$3(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var PROTOTYPE$4 = 'prototype';

var $export$3 = function (type, name, source) {
  var IS_FORCED = type & $export$3.F;
  var IS_GLOBAL = type & $export$3.G;
  var IS_STATIC = type & $export$3.S;
  var IS_PROTO = type & $export$3.P;
  var IS_BIND = type & $export$3.B;
  var IS_WRAP = type & $export$3.W;
  var exports = IS_GLOBAL ? _core$3 : _core$3[name] || (_core$3[name] = {});
  var expProto = exports[PROTOTYPE$4];
  var target = IS_GLOBAL ? _global$3 : IS_STATIC ? _global$3[name] : (_global$3[name] || {})[PROTOTYPE$4];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? _ctx$3(out, _global$3)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE$4] = C[PROTOTYPE$4];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? _ctx$3(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export$3.R && expProto && !expProto[key]) _hide$3(expProto, key, out);
    }
  }
};
// type bitmap
$export$3.F = 1;   // forced
$export$3.G = 2;   // global
$export$3.S = 4;   // static
$export$3.P = 8;   // proto
$export$3.B = 16;  // bind
$export$3.W = 32;  // wrap
$export$3.U = 64;  // safe
$export$3.R = 128; // real proto method for `library`
var _export$3 = $export$3;

// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
_export$3(_export$3.S + _export$3.F * !_descriptors$3, 'Object', { defineProperty: _objectDp$3.f });

var $Object$5 = _core$3.Object;
var defineProperty$2$3 = function defineProperty(it, key, desc) {
  return $Object$5.defineProperty(it, key, desc);
};

var defineProperty$7 = createCommonjsModule$2(function (module) {
module.exports = { "default": defineProperty$2$3, __esModule: true };
});

unwrapExports$2(defineProperty$7);

var createClass$2 = createCommonjsModule$2(function (module, exports) {
exports.__esModule = true;



var _defineProperty2 = _interopRequireDefault(defineProperty$7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (_defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
});

var _createClass$2 = unwrapExports$2(createClass$2);

function getDistance$1(x, y, x1, y1) {

  return Math.sqrt(Math.pow(x1 - x, 2) + Math.pow(y1 - y, 2));
}

function getSpeed$1(s, t) {
  return s / t;
}

function isArray$2(arr) {
  return Array.isArray(arr);
}

/**
 * ??????????????????
 * 
 * ?????????????????????
 * 
 * ????????????
 * 
 * tap
 * swipe
 * drag
 */

var Gesture$1 = function () {
  function Gesture() {
    _classCallCheck$2(this, Gesture);

    // this.events = events;
    // ['tap', 'swipe', 'panstart', 'panmove', 'panend', 'press'].forEach(item => {
    //   this[item] = events[item].bind(host);
    // })

    // ???????????????????????????
    // none tapping pressing

    this.event = {};
    this.status = 'none';
  }

  _createClass$2(Gesture, [{
    key: 'touchstart',
    value: function touchstart(evt) {

      // ????????????
      this.status = 'tapping';

      // ?????? touch ???
      this.startTouch = evt.changedTouches[0];

      // ????????????
      this.startTime = Date.now();
    }
  }, {
    key: 'touchmove',
    value: function touchmove(evt) {

      var touch = evt.changedTouches[0];

      var distance = getDistance$1(this.startTouch.clientX, this.startTouch.clientY, touch.clientX, touch.clientY);

      if (this.status === 'tapping' && distance > 10) {
        this.status = 'panning';
        this.fire('panstart', evt);
      } else if (this.status === 'panning') {
        this.fire('panmove', evt);
      }
    }
  }, {
    key: 'touchend',
    value: function touchend(evt) {

      this.endTouch = evt.changedTouches[0];

      var distance = getDistance$1(this.startTouch.clientX, this.startTouch.clientY, this.endTouch.clientX, this.endTouch.clientY);

      var interval = Date.now() - this.startTime;

      // ?????? <= 250ms ???????????? 10 px ???????????? tap
      if (interval <= 250 && distance < 10) this.fire('tap', evt);

      // ?????? > 250ms ???????????? 10 px ???????????? press    
      if (interval > 250 && distance < 10) this.fire('press', evt);

      var speed = getSpeed$1(distance, interval);

      // ???????????? 10 px , ???????????? 0.3 ???????????? swipe
      if (speed > 0.3 && distance >= 10) this.fire('swipe', evt);

      // ?????? panning ????????? panend ??????
      if (this.status === 'panning') this.fire('panend', evt);

      this.status = 'none';
    }
  }, {
    key: 'touchcancel',
    value: function touchcancel(evt) {}
  }, {
    key: 'on',
    value: function on(type, func) {
      if (isArray$2(this.event[type])) {
        this.event[type].push(func);
      } else {
        this.event[type] = [func];
      }
    }
  }, {
    key: 'fire',
    value: function fire(type, evt) {
      if (!isArray$2(this.event[type])) return;
      this.event[type].forEach(function (item) {
        item(evt);
      });
    }
  }]);

  return Gesture;
}();

var baseMobileEvent$1 = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];

function gestureFactory$1() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$name = _ref.name,
      name = _ref$name === undefined ? 'chimeeGesture' : _ref$name,
      el = _ref.el,
      _ref$level = _ref.level,
      level = _ref$level === undefined ? 0 : _ref$level,
      _ref$inner = _ref.inner,
      inner = _ref$inner === undefined ? true : _ref$inner,
      autoFocus = _ref.autoFocus,
      className = _ref.className,
      _beforeCreate = _ref.beforeCreate,
      _create = _ref.create,
      init = _ref.init,
      inited = _ref.inited,
      _destroy = _ref.destroy,
      data = _ref.data,
      computed = _ref.computed,
      _ref$events = _ref.events,
      events = _ref$events === undefined ? {} : _ref$events,
      _ref$methods = _ref.methods,
      methods = _ref$methods === undefined ? {} : _ref$methods,
      _ref$penetrate = _ref.penetrate,
      penetrate = _ref$penetrate === undefined ? false : _ref$penetrate,
      _ref$operable = _ref.operable,
      operable = _ref$operable === undefined ? true : _ref$operable;

  return {
    name: name,
    el: el,
    level: level,
    inner: inner,
    autoFocus: autoFocus,
    className: className,
    data: data,
    computed: computed,
    beforeCreate: function beforeCreate(config) {
      var _this = this;

      this.gesture = new Gesture$1();
      this.c_gesture = new Gesture$1();
      this.w_gesture = new Gesture$1();
      this.d_gesture = new Gesture$1();
      baseMobileEvent$1.forEach(function (item) {
        config.events[item] = function (evt) {
          _this.gesture[item](evt);
        };
        config.events['c_' + item] = function (evt) {
          _this.c_gesture[item](evt);
        };
        config.events['w_' + item] = function (evt) {
          _this.w_gesture[item](evt);
        };
      });

      ['tap', 'swipe', 'panstart', 'panmove', 'panend', 'press'].forEach(function (item) {
        _this.gesture.on(item, function (evt) {
          var func = config.events[item];
          func && func.call(_this, evt);
        });
        _this.c_gesture.on(item, function (evt) {
          var func = config.events['c_' + item];
          func && func.call(_this, evt);
        });
        _this.w_gesture.on(item, function (evt) {
          var func = config.events['w_' + item];
          func && func.call(_this, evt);
        });
        _this.d_gesture.on(item, function (evt) {
          var func = config.events['d_' + item];
          func && func.call(_this, evt);
        });
      });

      _beforeCreate && _beforeCreate.call(this);
    },
    create: function create() {
      var _this2 = this;

      this._i = this._i || 0;
      this._i++;
      baseMobileEvent$1.forEach(function (item) {
        var key = '__' + item;
        _this2[key] = function (evt) {
          _this2.d_gesture[item](evt);
        };
        addEvent(_this2.$dom, item, _this2[key]);
      });

      _create && _create.call(this);
    },

    init: init,
    inited: inited,
    destroy: function destroy() {
      var _this3 = this;

      baseMobileEvent$1.forEach(function (item) {
        var key = '__' + item;
        removeEvent(_this3.$dom, item, _this3[key]);
      });

      _destroy && _destroy.call(this);
    },

    methods: methods,
    penetrate: penetrate,
    operable: operable,
    events: events
  };
}

/**
 * chimee-plugin-mobile-state v0.0.6
 * (c) 2017 yandeqiang
 * Released under ISC
 */

function __$styleInject$1(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  head.appendChild(style);
  
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  return returnValue;
}

__$styleInject$1("video::-webkit-media-controls-start-playback-button{display:none}@-webkit-keyframes a{0%{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes a{0%{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}chimee-state{position:absolute;top:0;left:0;width:100%;height:100%;font-size:24px}chimee-state-error,chimee-state-loading,chimee-state-play{display:none}chimee-state.error chimee-state-error,chimee-state.loading chimee-state-loading,chimee-state.play chimee-state-play{display:inline-block}chimee-state-error,chimee-state-loading,chimee-state-play{position:absolute;left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}chimee-state-play{background-image:url(\"data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjkycHgiIGhlaWdodD0iOTJweCIgdmlld0JveD0iMCAwIDkyIDkyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0Ny4xICg0NTQyMikgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwiIGZpbGwtb3BhY2l0eT0iMC41IiBmaWxsPSIjMDAwMDAwIiBjeD0iNDYiIGN5PSI0NiIgcj0iNDYiPjwvY2lyY2xlPgogICAgICAgIDxwb2x5Z29uIGlkPSJUcmlhbmdsZSIgZmlsbD0iI0ZGRkZGRiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTEuMDAwMDAwLCA0Ni41MDAwMDApIHJvdGF0ZSg5MC4wMDAwMDApIHRyYW5zbGF0ZSgtNTEuMDAwMDAwLCAtNDYuNTAwMDAwKSAiIHBvaW50cz0iNTEgMjYgNzYgNjcgMjYgNjciPjwvcG9seWdvbj4KICAgIDwvZz4KPC9zdmc+\");background-position:110% 50%;-webkit-box-sizing:content-box;box-sizing:content-box;-webkit-box-sizing:initial;box-sizing:initial}chimee-state-loading,chimee-state-play{width:2em;height:2em;background-origin:content-box;background-size:auto 100%;background-repeat:no-repeat}chimee-state-loading{-webkit-transform:none;transform:none;margin:-1em;background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAASTklEQVR4Xu2dS+xfRRXHz1EBQVBUIqASwIUoagB1ISyEaiImPnCDiSvAkKArQHe6ABJ1JUhXCmKkCyVgfAAugIRYWFBYoCWgQBO0BsKjsVopFgH1mG87Fy6//u/vzsyd95xJ/in6n+f3zOc/r3NnmDSoAqrApAKs2qgCqsC0AgqI9g5VYI0CCoh2D1VAAdE+oAr4KaAjiJ9umqoTBRSQTgytzfRTQAHx001TdaKAAtKJobWZfgooIH66aapOFFBAOjG0NtNPAQXETzdN1YkCCkgnhtZm+imggPjppqk6UUAB6cTQ2kw/BRQQP900VScKKCCdGFqb6aeAAuKnm6bqRAEFpBNDazP9FFBA/HTTVJ0ooIAUYGgROZyI8HOIqc4rRPQiM79YQPW6roICktH8IgL9305Eh01U4yUi+gczS8Zqdl20ApLR/CLyjjVwDDV7iZn/nrGaXRetgGQyv5lWHW1Z/B6dblkqFTiaAhJYUNvsLEcPHUVsBY0UTwGJJOxctiJyLBG9YS6e+f3/mPk5y7gaLaACCkhAMV2yEpHjXeIz8zMu8TVuGAUUkDA6OueigDhLliWBApJFdiIFJJPwjsUqII6ChYqugIRSMm4+CkhcfSdzV0AyCe9YrALiKFio6ApIKCXj5qOAxNVXR5BM+oYqVgEJpaRjPjqCOAqWKXqTgIgIXDguJaJzRrreSES3MvOeTFq/rthaARGRNxIR9H3nqEF7iWgXM/+3BG1D1qE5QETkdCL6nTHiqlaAYxMzbw8pok9eNQJi/MfeT0Rv2qDN/yGiHa35jDUFyAwcg02LgKQ2QGbgGLRtDpLWAPkDEWEEmQuA5OSc062aADHTqg9PjByrWu9j5kfnDFDL75sBxIweAMQ2bGXmTbaRQ8erDBBMq45y0OBhZn7ZIX6xUVsC5EoiusJR6cuZ+VrHNEGi1wKIiLyLiE5wbPTTrThXtgTIZUT0A0dDIvoZORbtNQBi1h2nemi6k5l3e6QrLklLgGBLF7tXrmGngSTp9m/pgJh1xwctPgneSO/HmfkFV0OUGL8ZQCCuiKCzn+gh9I3MfJFHOu8kFQACHY/xaCC+oX/EI12RSVoD5EIi+qmn0hcxMw4Tk4SSARERHAKe5ClEM9MrtL8pQMwospWIzvYwLqZYWI9gFIoeSgVERA4lIkytNjoMnNNlLzPvmItU0+9bBARuEOjkb/MwxHZmPsMjnXOSggEBHEc4N4gIbibY3m3K3aQ5QMwo8iUi+rWHkZFkMzNjRyxqKBEQEXkvEeEyCZ/QzMJ83PgmATGQ4HwDDos+Af5amKpFC6UBIiJHEtEpng1+jpmf8kxbdLJmATGQwCnxNA8LRHdFKQkQR1eSVTmbci1ZbVzrgMAvCyOBz3okqitKYYC4upIM/QjrjT+14lay0R/SpgExo8iSrd9oriilAOLpSjL0paa2dLsExEDyGyI6z2OqhSRRXFFKAGSBKwl0wX3BT3hqWk2y5kcQAwi2frEe8Tllj+KKkhuQha4keJbh0da2dLsdQQwkWI+4uMOP9QruilIAIL6uJNAF644uHvfpYgQZerqI+LjED8mDuqLkvLx6oStJM67sNvO8rgAxI0kRrii5nj9QVxIbLF6L0yMgRbii5HpAR0TUlcSBke4AMaPIEleUq5gZU7XFwXIUCfYE20JXkidyfsO/WGzPDLoExECS3RUl5SOe6kriR0i3gBhIfF1RcEB2sp/kB6dK8Qy0iOBWkqnXdNc1pWlXkjkb9g7IEleUoLtac4Za8vsFu1ZwJYGXbhdbul2fg0x1MBHxdUW5h5nHV5su6cNR04qIr69V864kc8J3PYKMzkd8XFFaB6QLVxIFZE6BA5c9+LiiPMTMNrc4WtQgbhRzqR4unbYN3biSzAmiI4hRyONmxi3MjOlZ8UFEcAHD+Db2uTp340oyJ4QCMlLI0RUl+leHc8az/b3jFm9XriRzGiogKwqJCK7+uWBGuGpGj9E6y2YU2Z3qVpe5jlnK7xWQDSwxA0mSSx1idJCZk3SFYwPRFZCJnmjm7bjdZFiIw8kRbu9J7s2KAQjyNM6KWI8Mt7XvM69DNXEbe2jdFJDQimp+TSmggDRlTm1MaAWSASIiuFnkfCI619wy8k8i+iMR/YKZ8a8GVeB1CojIW4kIl9mh7+AqVDzx9iwRPcXMr6SQKwkgIvIh83YH/t0oPElE24joDma+M0XDtYwyFTBfWh5HRPg5ZKKW+OOKg9rnY7ciOiAigteJ0Olt76ZC4xFfYYlt/ULyt4RitbYYQe6N7UiZAhB8d4GplU9QWHxUqyCNJxSrLXuSmR+K2dyogJjR4/5ADRhguY+I7mJm/G8NlSggIpgu4WJsTJ2wzTw1fXJt0d0xR5HYgJyFRbhriy3j34FpmMJiqVaGaCtQAIwYYVvM9xBjA/JZIvpJDFVW8lRYEohsU0QiKMZVqRoQLNBDTbFs7IM4gAU7YncyM3bHNERWwHwyPEydYo0UU62od4qFFonIXUQ0tb0b2XT7z1luUVjCyzyCYjinCF/IfI7PM/O989H8Y0SdYhlAYq5DXFqOxf03dFRxkezguAYM+Ke5fF+yrNDp1NjmjXoWEh0QA8mXzUFhLKFc8sWTBhhVNDgqYLyBS/mKEu9JRn/VKgkgBhKsR7654EzE0ZyT0bE9fL66t7jJadw+PumWKkpsrCt3xNzaHdc6GSBDocYnC/5Y2OHCvzkCFvBfzVFwrWWKyMfNGUaOJsD/Cj94CzGJD9bQyOSAjNXNCQszvyeHpWss02zdpv5jlg2KrCPIVAfJAAumWVi4a5hRwFw8d2YCoYqAokhAVsUXEUzBhmkY3J5Dh1PVXcVO0ogjCKZLw9QJ/xYXsk6xbNWIAAv2z/EMgAZLBUQEU6wQ/lPFQ1HFCLJmKhZiZLmGma+27Bsa7cCBL64vxY9PqAqKqgEZV15EcAg57IjhRNcm4HQd6w/1BrZRy8Qx0yysQ2ynu7gM4jkigkt61MM8h2Y4R61iimXTKvPVIg4kMcJMwYIPsXBQqHDYiLoSx0CC7d6pU/QmoGhmBFkzDYPvF0AZdl7wF+wWZoYjo4aFCogIHBLxR2hYk+zGYrvmkWJKkmZGkIU21+SqwIYKKCDaMVSBNQooINo9VAEFRPuAKuCngI4gfrppqk4UUEA6MbQ2008BBcRPN03ViQIKSCeG1mb6KaCA+OmmqTpRQAHpxNDaTD8FFBA/3TRVJwooIJ0YWpvpp4AC4qebpupEAQWkE0NrM/0UUED8dNNUnSiggHRiaG2mnwJNAiIipxDR2UT0MSPLXiK6nZnv8ZNJU40VEJETiQgaH2r+/2eIaGfMdzpyWaAZQAwUnyOic4jo3ROCbiWiq5gZwGhwVEBEAMRn1ugLXXeaq0HxlWH1oWpARAQjBEaKdVCsGulxIvqaQuLWdw0cnyeiYyxTDrBgZMEIU2WoDhARGYAAFEd5qn49M1/vmbbLZOaP0TBlddXgJTOyAJa/uibOGb8KQAJBMdZ5LzNvyil8bWWLyAVEdFiAelcFS5GAiAhGho+aqdOSkWKdPTfpNMuuu5vp1YV2sZ1iFQ9LMYAYKMbTJyelPSJfwswPeqTrLomIHE9EX0jQcCzw9/8w88sJypstIisgGaB4VRBmxgVoGiwUiDiCrCu9CFiSA5ITipE17mFmvHalwVIBEcH27kmW0UNHywZLMkBEBGcTV4wO70KLaJvfC0SE6RW2ezVYKmDeCME0azgctEwZPBrs9vtU68ckgIgIhAUcJQQcFN5eQkVqq4O54R2bJiWErcy8I3ZFogNi9s+vi90Qi/yxIAccT1vE1SgTCoymyFPeCim1g/tQ1EPIFID8zPjtpBRuKAt/YX5LRPhro2AEtIABBWsSvBmS6830vzHzrwI266CsogJi1h23xWzABnnDIRE+Vw8qFGmUN7BgKxjApF7I3xRzPRIbEMxXv5/ATAMUGCnUETGB4FNFmC3hAZQUsESdZsUGBL47sdYfCkVGEGyKTgRL1YBgIRdqioXt2f1TJ7Om0JHCppcWEmcEC/oERpZQ28U3xjx1jzqCwDYiciURwU3aJwxQYOoEODQ0ooCIjKdhvrDsiN0vUgCCvxg/J6IjLW2rUFgK1Uo0T1jgq/XL2GvO6ICYUQSfZ+KgcOoZYexlD1MnHSla6fke7RjBgl2xqe998LUiZhXRv1pMAoiBBI3FiTo8dvHfWEPsP6dQtw+PntRBEuPeMpyz4FsUuMfjg6vHY647xtImA6QDe2oTG1RAAWnQqNqkcAooIBNaisj7iOhTRHSyifIIEd3NzLvCyZ8+JxE5mohOG514P0tEDzDznvS1Kb9EBWQDG4nIpUT06Qnz3cbMN5Rv2oNrKCLnEtEnJuq+nZlvrbFdMeusgKyoOwPHEBsjyeaYhgmdt4icR0Snz+SrkKwIpICMBBGRrxARfmzCt5n5YZuIueOYrVPcSmITsH2qN1AapRQQI4RZc1xr04NMnGpGEcvRY9z065gZa5PugwJywB3mLUQEOI516BF/YWasVYoPZtqIxbltwIIdkPzbNkGr8RSQA4B8a83idcr2jzAz0hUfzKVvrq7njzHzzcU3LnIFuwdERLBb5TMStA4Iut6tzLw9ch8sOvuuATHrju84OFKOjbmZme8u2rqvra+we4VdLNeAKdaWntcjvQOCdQcOBF3DLma+2DXRVHwROZOI8HOCifMkEW1j5m0By8Ao6bIOGYp+lpljffQWqnnR8ukWEBFBB/+ip7JBtnhF5Ag8xbDmUgvcAfUjZt7nWc9Xkzlu9a4Wdz8z37m0DjWm7xIQEcFpsu8CG5cE3BTC2CKC2x2nPgEYioDn6jWBylt3kj5XxM3M/NhcpNZ+3x0gZkv3x57rjmBbu2ZaZXtjOj4rDTLdEpFLiOg4j46M9QjWXV1t/fYIyHeJ6CMeHeRf2O0K5axoOXoM1cSnpVd71PmgJMZZEZC82SM/3Lq+xSNdtUm6AsTRlWTVqN9j5vtDWVpEsEFwuGV++5j5csu4s9FExHdXC3l35YrSDSAeriTjjhbcrUREnHaGmBl/9YMFD/eTcdnduKJ0AYinK8nQIfD9B6ZWmGIFCwUAgikWoPPZ+u3GFaUXQHxcSQYYLmPmPwcjw2SUGxBUQ0SwWPcdmbpwRWkekAWuJOhDNzBzqIvvXsdYCYAYSLDlje1fn9C8K0rTgCx0JYnqa1UKIAYSfCvi6syIpNjyxXqk2c91WwfE15UE642LQ687xn+iCwME6xG4ovhs/TbtitIsICW4kqybs5QEiBlFMILYfnW42rRmXVGaBGShK0mSSxlKA8RAssQVBV6/eGyzqdAcIKW4ksz1khIBMZCoK8rIeC0CUoQrScWA4FxEXVGMAZsCZOGWbtIPoEodQcwossQVpamt39YAgZeuy8ULwx/64K4ktY4gQ70XuKLsqe3OsHW2agYQEYGHLqZXriGKK8lcJUoeQcwossQVpZkFe0uAuFz6Nu6/UVxJagfEQOLritLMNKt3QKK5krQAiIHExxWlGZf4lgDB5QsuNyNGdSVpBRADiasrCjY8mnA/aQYQY0hcKD08V7Cuj0Z3JWkMEBdXlKZcT1oDBKMIFuq4SnQqAA7cShLchX0OivHvS1+kr7bFuMZjJFnnr9XcPVpNAWJGkXWQFAGHqWfWLwpdYB5t/WLRPgVJc3Cg3c0BYjofRhBcKTp+LAa3IMKpLuiXgT4drVZARtu/HzCvVA3Nx/1deFukuRtPmgTEt9OmTFfbFCulNiWVpYBksoYCkkl4x2IVEEfBQkVXQEIpGTcfBSSuvpO5KyCZhHcsVgFxFCxUdAUklJJx81FA4uqrI0gmfUMVq4CEUtIxHx1BHAXLFF0BySS8ApJJeMdiFRBHwUJFd7y8+kVmvixU2ZqPvQIKiL1WQWPmev4gaCM6yEwByWTkXA/oZGputcUqIBlNZzmKBHs8J2NTqy1aAcloOvOI59fXvFO4g4h+GOIRz4zNrLpoBaQA85np1lkrz0DfF+pdwgKaWG0VFJBqTacVT6GAApJCZS2jWgUUkGpNpxVPoYACkkJlLaNaBRSQak2nFU+hgAKSQmUto1oFFJBqTacVT6GAApJCZS2jWgUUkGpNpxVPoYACkkJlLaNaBRSQak2nFU+hgAKSQmUto1oFFJBqTacVT6GAApJCZS2jWgUUkGpNpxVPoYACkkJlLaNaBRSQak2nFU+hgAKSQmUto1oFFJBqTacVT6GAApJCZS2jWgX+D3+uQyNp1WuSAAAAAElFTkSuQmCC\");background-position:50%;-webkit-animation:.9s a linear infinite;animation:.9s a linear infinite}chimee-state-error{display:none;font-size:16px;z-index:1;color:#ffcf00;text-shadow:0 0 3px red;font-weight:100}", undefined);

var chimeeState = gestureFactory$1({
  name: 'chimeeState',
  el: '\n    <chimee-state>\n      <chimee-state-loading></chimee-state-loading>\n      <chimee-state-play>\n      </chimee-state-play>\n      <chimee-state-error>\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u91CD\u8BD5</chimee-state-error>\n    </chimee-state>\n  ',
  create: function create() {
    this.volueArea = this.$dom.querySelector('chimee-state-volume');
    this.volumeBar = this.$dom.querySelector('chimee-state-volume-bar-value');
  },
  inited: function inited() {
    this.src && this.showState('loading', true);
  },

  penetrate: true,
  operable: true,
  destroy: function destroy() {
    this.clearTimeout();
  },

  events: {
    pause: function pause() {
      this.showState('play', true);
    },
    play: function play() {
      this.showState('play', false);
    },
    loadedmetadata: function loadedmetadata() {
      this.playing();
      this.showState('play', true);
    },
    playing: function playing() {
      this.playing();
    },
    loadstart: function loadstart() {
      this.waiting('loadstart');
    },
    waiting: function waiting() {
      this.waiting();
    },

    // ??????(FLV|HLS?????????????????????????????????)
    // stalled () {
    //   this.showLoading();
    // },
    timeupdate: function timeupdate() {
      this.clearTimeout();
    },
    panstart: function panstart(evt) {
      this.emit('state_panstart', evt);
    },
    panmove: function panmove(evt) {
      this.emit('state_panmove', evt);
    },
    panend: function panend(evt) {
      this.emit('state_panend', evt);
    },
    d_tap: function d_tap(evt) {
      if (evt.target.tagName === 'CHIMEE-STATE-PLAY') this.play();
    }
  },
  methods: {
    playing: function playing() {
      this.clearTimeout();
      this.showState('loading', false);
      this.showState('error', false);
    },
    waiting: function waiting(status) {
      var _this = this;

      this.clearTimeout();
      // ????????????20????????????????????????
      this._timeout = setTimeout(function () {
        return _this.showState('error', true);
      }, 3e4);
      (status === 'loadstart' || !this.paused) && this.showState('loading', true);
    },
    clearTimeout: function (_clearTimeout) {
      function clearTimeout() {
        return _clearTimeout.apply(this, arguments);
      }

      clearTimeout.toString = function () {
        return _clearTimeout.toString();
      };

      return clearTimeout;
    }(function () {
      if (this._timeout) {
        clearTimeout(this._timeout);
        this._timeout = null;
      }
    }),
    showState: function showState(state, show) {
      this.$dom.className = show ? state : '';
    }
  }
});

/**
 * chimee-plugin-gesture v0.0.6
 * (c) 2017 yandeqiang
 * Released under ISC
 */

function unwrapExports$3 (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule$3(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var classCallCheck$3 = createCommonjsModule$3(function (module, exports) {
exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
});

var _classCallCheck$3 = unwrapExports$3(classCallCheck$3);

var _global$4 = createCommonjsModule$3(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core$4 = createCommonjsModule$3(function (module) {
var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

var _core_1$3 = _core$4.version;

var _aFunction$4 = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx$4 = function (fn, that, length) {
  _aFunction$4(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var _isObject$4 = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject$4 = function (it) {
  if (!_isObject$4(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails$4 = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors$4 = !_fails$4(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document$4 = _global$4.document;
// typeof document.createElement is 'object' in old IE
var is$3 = _isObject$4(document$4) && _isObject$4(document$4.createElement);
var _domCreate$4 = function (it) {
  return is$3 ? document$4.createElement(it) : {};
};

var _ie8DomDefine$4 = !_descriptors$4 && !_fails$4(function () {
  return Object.defineProperty(_domCreate$4('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive$4 = function (it, S) {
  if (!_isObject$4(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject$4(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject$4(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject$4(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP$6 = Object.defineProperty;

var f$10 = _descriptors$4 ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject$4(O);
  P = _toPrimitive$4(P, true);
  _anObject$4(Attributes);
  if (_ie8DomDefine$4) try {
    return dP$6(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp$4 = {
	f: f$10
};

var _propertyDesc$4 = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide$4 = _descriptors$4 ? function (object, key, value) {
  return _objectDp$4.f(object, key, _propertyDesc$4(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var PROTOTYPE$5 = 'prototype';

var $export$4 = function (type, name, source) {
  var IS_FORCED = type & $export$4.F;
  var IS_GLOBAL = type & $export$4.G;
  var IS_STATIC = type & $export$4.S;
  var IS_PROTO = type & $export$4.P;
  var IS_BIND = type & $export$4.B;
  var IS_WRAP = type & $export$4.W;
  var exports = IS_GLOBAL ? _core$4 : _core$4[name] || (_core$4[name] = {});
  var expProto = exports[PROTOTYPE$5];
  var target = IS_GLOBAL ? _global$4 : IS_STATIC ? _global$4[name] : (_global$4[name] || {})[PROTOTYPE$5];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? _ctx$4(out, _global$4)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE$5] = C[PROTOTYPE$5];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? _ctx$4(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export$4.R && expProto && !expProto[key]) _hide$4(expProto, key, out);
    }
  }
};
// type bitmap
$export$4.F = 1;   // forced
$export$4.G = 2;   // global
$export$4.S = 4;   // static
$export$4.P = 8;   // proto
$export$4.B = 16;  // bind
$export$4.W = 32;  // wrap
$export$4.U = 64;  // safe
$export$4.R = 128; // real proto method for `library`
var _export$4 = $export$4;

// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
_export$4(_export$4.S + _export$4.F * !_descriptors$4, 'Object', { defineProperty: _objectDp$4.f });

var $Object$6 = _core$4.Object;
var defineProperty$2$4 = function defineProperty(it, key, desc) {
  return $Object$6.defineProperty(it, key, desc);
};

var defineProperty$8 = createCommonjsModule$3(function (module) {
module.exports = { "default": defineProperty$2$4, __esModule: true };
});

unwrapExports$3(defineProperty$8);

var createClass$3 = createCommonjsModule$3(function (module, exports) {
exports.__esModule = true;



var _defineProperty2 = _interopRequireDefault(defineProperty$8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (_defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
});

var _createClass$3 = unwrapExports$3(createClass$3);

function getDistance$2(x, y, x1, y1) {

  return Math.sqrt(Math.pow(x1 - x, 2) + Math.pow(y1 - y, 2));
}

function getSpeed$2(s, t) {
  return s / t;
}

function isArray$3(arr) {
  return Array.isArray(arr);
}

/**
 * ??????????????????
 * 
 * ?????????????????????
 * 
 * ????????????
 * 
 * tap
 * swipe
 * drag
 */

var Gesture$2 = function () {
  function Gesture() {
    _classCallCheck$3(this, Gesture);

    // this.events = events;
    // ['tap', 'swipe', 'panstart', 'panmove', 'panend', 'press'].forEach(item => {
    //   this[item] = events[item].bind(host);
    // })

    // ???????????????????????????
    // none tapping pressing

    this.event = {};
    this.status = 'none';
  }

  _createClass$3(Gesture, [{
    key: 'touchstart',
    value: function touchstart(evt) {

      // ????????????
      this.status = 'tapping';

      // ?????? touch ???
      this.startTouch = evt.changedTouches[0];

      // ????????????
      this.startTime = Date.now();
    }
  }, {
    key: 'touchmove',
    value: function touchmove(evt) {

      var touch = evt.changedTouches[0];

      var distance = getDistance$2(this.startTouch.clientX, this.startTouch.clientY, touch.clientX, touch.clientY);

      if (this.status === 'tapping' && distance > 10) {
        this.status = 'panning';
        this.fire('panstart', evt);
      } else if (this.status === 'panning') {
        this.fire('panmove', evt);
      }
    }
  }, {
    key: 'touchend',
    value: function touchend(evt) {

      this.endTouch = evt.changedTouches[0];

      var distance = getDistance$2(this.startTouch.clientX, this.startTouch.clientY, this.endTouch.clientX, this.endTouch.clientY);

      var interval = Date.now() - this.startTime;

      // ?????? <= 250ms ???????????? 10 px ???????????? tap
      if (interval <= 250 && distance < 10) this.fire('tap', evt);

      // ?????? > 250ms ???????????? 10 px ???????????? press    
      if (interval > 250 && distance < 10) this.fire('press', evt);

      var speed = getSpeed$2(distance, interval);

      // ???????????? 10 px , ???????????? 0.3 ???????????? swipe
      if (speed > 0.3 && distance >= 10) this.fire('swipe', evt);

      // ?????? panning ????????? panend ??????
      if (this.status === 'panning') this.fire('panend', evt);

      this.status = 'none';
    }
  }, {
    key: 'touchcancel',
    value: function touchcancel(evt) {}
  }, {
    key: 'on',
    value: function on(type, func) {
      if (isArray$3(this.event[type])) {
        this.event[type].push(func);
      } else {
        this.event[type] = [func];
      }
    }
  }, {
    key: 'fire',
    value: function fire(type, evt) {
      if (!isArray$3(this.event[type])) return;
      this.event[type].forEach(function (item) {
        item(evt);
      });
    }
  }]);

  return Gesture;
}();

var baseMobileEvent$2 = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];

function gestureFactory$3() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$name = _ref.name,
      name = _ref$name === undefined ? 'chimeeGesture' : _ref$name,
      el = _ref.el,
      _ref$level = _ref.level,
      level = _ref$level === undefined ? 0 : _ref$level,
      _ref$inner = _ref.inner,
      inner = _ref$inner === undefined ? true : _ref$inner,
      autoFocus = _ref.autoFocus,
      className = _ref.className,
      _beforeCreate = _ref.beforeCreate,
      _create = _ref.create,
      init = _ref.init,
      inited = _ref.inited,
      _destroy = _ref.destroy,
      data = _ref.data,
      computed = _ref.computed,
      _ref$events = _ref.events,
      events = _ref$events === undefined ? {} : _ref$events,
      _ref$methods = _ref.methods,
      methods = _ref$methods === undefined ? {} : _ref$methods,
      _ref$penetrate = _ref.penetrate,
      penetrate = _ref$penetrate === undefined ? false : _ref$penetrate,
      _ref$operable = _ref.operable,
      operable = _ref$operable === undefined ? true : _ref$operable;

  var gesture = new Gesture$2();
  var c_gesture = new Gesture$2();
  var w_gesture = new Gesture$2();
  var d_gesture = new Gesture$2();

  return {
    name: name,
    el: el,
    level: level,
    inner: inner,
    autoFocus: autoFocus,
    className: className,
    data: data,
    computed: computed,
    beforeCreate: function beforeCreate(config) {
      var _this = this;

      baseMobileEvent$2.forEach(function (item) {
        config.events[item] = function (evt) {
          gesture[item](evt);
        };
        config.events['c_' + item] = function (evt) {
          c_gesture[item](evt);
        };
        config.events['w_' + item] = function (evt) {
          w_gesture[item](evt);
        };
      });

      ['tap', 'swipe', 'panstart', 'panmove', 'panend', 'press'].forEach(function (item) {
        gesture.on(item, function (evt) {
          var func = config.events[item];
          func && func.call(_this, evt);
        });
        c_gesture.on(item, function (evt) {
          var func = config.events['c_' + item];
          func && func.call(_this, evt);
        });
        w_gesture.on(item, function (evt) {
          var func = config.events['w_' + item];
          func && func.call(_this, evt);
        });
        d_gesture.on(item, function (evt) {
          var func = config.events['d_' + item];
          func && func.call(_this, evt);
        });
      });

      _beforeCreate && _beforeCreate.call(this);
    },
    create: function create() {
      var _this2 = this;

      baseMobileEvent$2.forEach(function (item) {
        var key = '__' + item;
        _this2[key] = function (evt) {
          d_gesture[item](evt);
        };
        addEvent(_this2.$dom, item, _this2[key]);
      });

      _create && _create.call(this);
    },

    init: init,
    inited: inited,
    destroy: function destroy() {
      var _this3 = this;

      baseMobileEvent$2.forEach(function (item) {
        var key = '__' + item;
        removeEvent(_this3.$dom, item, _this3[key]);
      });

      _destroy && _destroy.call(this);
    },

    methods: methods,
    penetrate: penetrate,
    operable: operable,
    events: events
  };
}

function uiIsAvailable(defaultDisableUA, ua) {
  return defaultDisableUA.every(function (item) {
    return item !== ua.browser.name;
  });
}

var DEFAULT_DISABLE_UA = ['UCBrowser', 'UCBrowser', 'QQBrowser'];

Chimee.install(mobiControlbar);
Chimee.install(chimeeState);

var ChimeeMobilePlayer = function (_Chimee) {
  _inherits(ChimeeMobilePlayer, _Chimee);

  function ChimeeMobilePlayer(config) {
    _classCallCheck(this, ChimeeMobilePlayer);

    if (!isObject$1(config)) throw new TypeError('You must pass an Object as config when you new ChimeePlayer');
    var defaultDisableUA = config.disableUA === undefined ? DEFAULT_DISABLE_UA : config.disableUA;
    var ua = new uaParser().getResult();
    var isUIAvailable = uiIsAvailable(defaultDisableUA, ua);

    // ??????UI??????
    if (isUIAvailable) {
      config.plugin = config.plugin || config.plugins;
      if (!isArray$1(config.plugin)) config.plugin = [];
      var innerPlugins = [mobiControlbar.name, chimeeState.name];
      var configPluginNames = config.plugin.map(function (item) {
        return isObject$1(item) ? item.name : item;
      });
      innerPlugins.forEach(function (name) {
        if (configPluginNames.indexOf(name) > -1) return;
        config.plugin.push(name);
      });
    }

    config.box = config.box === undefined ? 'native' : config.box;

    return _possibleConstructorReturn(this, (ChimeeMobilePlayer.__proto__ || _Object$getPrototypeOf(ChimeeMobilePlayer)).call(this, config));
  }

  return ChimeeMobilePlayer;
}(Chimee);
// ????????????????????????


ChimeeMobilePlayer.gestureFactory = gestureFactory$3;

return ChimeeMobilePlayer;

})));
