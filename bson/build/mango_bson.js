

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachegetFloat64Memory0 = null;
function getFloat64Memory0() {
    if (cachegetFloat64Memory0 === null || cachegetFloat64Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachegetFloat64Memory0;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
};

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
* @param {any} target
* @returns {Uint8Array}
*/
export function to_bson_document(target) {
    try {
        const retptr = wasm.__wbindgen_export_2.value - 16;
        wasm.__wbindgen_export_2.value = retptr;
        wasm.to_bson_document(retptr, addBorrowedObject(target));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
    } finally {
        wasm.__wbindgen_export_2.value += 16;
        heap[stack_pointer++] = undefined;
    }
}

function handleError(f) {
    return function () {
        try {
            return f.apply(this, arguments);

        } catch (e) {
            wasm.__wbindgen_exn_store(addHeapObject(e));
        }
    };
}

const imports = {
    __wbindgen_placeholder__: {
        __wbindgen_is_object: function(arg0) {
            const val = getObject(arg0);
            var ret = typeof(val) === 'object' && val !== null;
            return ret;
        },
        __wbindgen_string_new: function(arg0, arg1) {
            var ret = getStringFromWasm0(arg0, arg1);
            return addHeapObject(ret);
        },
        __wbg_ownKeys_328c4007fe203386: handleError(function(arg0) {
            var ret = Reflect.ownKeys(getObject(arg0));
            return addHeapObject(ret);
        }),
        __wbg_length_079c4e509ec6d375: function(arg0) {
            var ret = getObject(arg0).length;
            return ret;
        },
        __wbg_get_27693110cb44e852: function(arg0, arg1) {
            var ret = getObject(arg0)[arg1 >>> 0];
            return addHeapObject(ret);
        },
        __wbg_get_0e3f2950cdf758ae: handleError(function(arg0, arg1) {
            var ret = Reflect.get(getObject(arg0), getObject(arg1));
            return addHeapObject(ret);
        }),
        __wbindgen_object_drop_ref: function(arg0) {
            takeObject(arg0);
        },
        __wbindgen_number_get: function(arg0, arg1) {
            const obj = getObject(arg1);
            var ret = typeof(obj) === 'number' ? obj : undefined;
            getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
            getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
        },
        __wbindgen_is_string: function(arg0) {
            var ret = typeof(getObject(arg0)) === 'string';
            return ret;
        },
        __wbindgen_boolean_get: function(arg0) {
            const v = getObject(arg0);
            var ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
            return ret;
        },
        __wbindgen_is_null: function(arg0) {
            var ret = getObject(arg0) === null;
            return ret;
        },
        __wbg_instanceof_Date_472140c286aaa82b: function(arg0) {
            var ret = getObject(arg0) instanceof Date;
            return ret;
        },
        __wbg_isArray_8719d1387c4e1aca: function(arg0) {
            var ret = Array.isArray(getObject(arg0));
            return ret;
        },
        __wbg_instanceof_Set_1ea76a954bbc7c45: function(arg0) {
            var ret = getObject(arg0) instanceof Set;
            return ret;
        },
        __wbg_instanceof_Map_e2eca54729addc7b: function(arg0) {
            var ret = getObject(arg0) instanceof Map;
            return ret;
        },
        __wbg_getTime_29addd71c7089c47: function(arg0) {
            var ret = getObject(arg0).getTime();
            return ret;
        },
        __wbg_keys_84471a9240844b4d: function(arg0) {
            var ret = getObject(arg0).keys();
            return addHeapObject(ret);
        },
        __wbg_next_2966fa909601a075: handleError(function(arg0) {
            var ret = getObject(arg0).next();
            return addHeapObject(ret);
        }),
        __wbg_done_037d0a173aef1834: function(arg0) {
            var ret = getObject(arg0).done;
            return ret;
        },
        __wbg_value_e60bbfb7d52af62f: function(arg0) {
            var ret = getObject(arg0).value;
            return addHeapObject(ret);
        },
        __wbg_keys_7cb794f873cec791: function(arg0) {
            var ret = getObject(arg0).keys();
            return addHeapObject(ret);
        },
        __wbg_get_6f7c002bf77d49ca: function(arg0, arg1) {
            var ret = getObject(arg0).get(getObject(arg1));
            return addHeapObject(ret);
        },
        __wbindgen_string_get: function(arg0, arg1) {
            const obj = getObject(arg1);
            var ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            getInt32Memory0()[arg0 / 4 + 1] = len0;
            getInt32Memory0()[arg0 / 4 + 0] = ptr0;
        },
        __wbindgen_throw: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbindgen_rethrow: function(arg0) {
            throw takeObject(arg0);
        },
    },

};

const file = new URL(import.meta.url).pathname;
const wasmFile = file.substring(0, file.lastIndexOf(Deno.build.os === 'windows' ? '\\' : '/') + 1) + 'mango_bson_bg.wasm';
const wasmModule = new WebAssembly.Module(Deno.readFileSync(wasmFile));
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
const wasm = wasmInstance.exports;
