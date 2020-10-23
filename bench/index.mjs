import bson from "bson";
import { performance } from "perf_hooks";

const date = new Date();
const data = bson.serialize(
  {
    foo: "bar",
    hello: 55,
    date,
    binary: new Buffer.alloc(128),
  },
);

const start = performance.now();

for (let i = 0; i < 50000; i++) {
  const date = new Date();
  const data = bson.serialize(
    {
      foo: "bar",
      hello: 55,
      date,
      binary: new Buffer.alloc(128),
    },
  );
}

const stop = performance.now();
console.log(stop - start);
