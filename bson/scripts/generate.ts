/// wasm-bindgen -> deno (without --allow-read)
/// Generate a single javascript file that handles wasm loading from a const var

const configuration = {
  in: {
    dir: "build",
    wasm: "mango_bson_bg.wasm",
    glue: "mango_bson.js",
  },
  out: {
    dir: "wasm",
    file: "mango_bson.js",
  },
};

// ... do the magic ...

import { basename, join } from "https://deno.land/std@0.74.0/path/mod.ts";
import { encode } from "https://deno.land/std@0.74.0/encoding/base64.ts";
import { minify } from "https://jspm.dev/terser@5.3.8";

configuration.in.wasm = join(configuration.in.dir, configuration.in.wasm);
configuration.in.glue = join(configuration.in.dir, configuration.in.glue);
configuration.out.file = join(configuration.out.dir, configuration.out.file);

const wasmsrc = await Deno.readFile(configuration.in.wasm);
const gluesrc = await Deno.readTextFile(configuration.in.glue);

const wasmencoded = encode(wasmsrc);

const target = `const file = new URL(import.meta.url).pathname;
const wasmFile = file.substring(0, file.lastIndexOf(Deno.build.os === 'windows' ? '\\\\' : '/') + 1) + '${
  basename(configuration.in.wasm)
}';
const wasmModule = new WebAssembly.Module(Deno.readFileSync(wasmFile));`;

const replace =
  `import { decode } from "https://deno.land/std@0.74.0/encoding/base64.ts";
const encoded = "${wasmencoded}";
const source = decode(encoded);
const wasmModule = new WebAssembly.Module(source);`;

const data = gluesrc.replace(target, replace);

const output = await minify(data, {
  mangle: { module: true },
  output: {
    preamble: "//deno-fmt-ignore-file",
  },
});

await Deno.writeTextFile(configuration.out.file, output.code);
