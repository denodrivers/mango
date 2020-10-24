import { Binary, encode } from "../mod.ts";
import { BinarySubtype } from "../types.ts";
import {
  bench,
  runBenchmarks,
} from "https://deno.land/std@0.74.0/testing/bench.ts";

bench({
  name: "encode",
  runs: 10,
  func(b) {
    const date = new Date();
    const data = encode(
      {
        foo: "bar",
        hello: 55,
        date,
        binary: Binary(new Uint8Array(128), BinarySubtype.Generic),
      },
    );
    b.start();
    for (let i = 0; i < 50000; i++) {
      const data = encode(
        {
          foo: "bar",
          hello: 55,
          date,
          binary: Binary(new Uint8Array(128), BinarySubtype.Generic),
        },
      );
    }
    b.stop();
  },
});

await runBenchmarks();
