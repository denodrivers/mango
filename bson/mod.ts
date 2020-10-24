import { to_bson_document as toBsonDocument } from "./build/mango_bson.js";
import * as types from "./types.ts";

import { BinarySubtype } from "./types.ts";
export { BinarySubtype, types };

export function ObjectID(oid: string): types.ObjectID {
  return { $oid: oid };
}

export function DateTime(ms: number): types.DateTime {
  return { $date: Int64(ms) };
}

export function Double(val: number): types.Double {
  return { $numberDouble: String(val) };
}

export function Int32(val: number): types.Int32 {
  return { $numberInt: String(val) };
}

export function Int64(val: number): types.Int64 {
  return { $numberLong: String(val) };
}

export function Regex(val: RegExp): types.RegularExpression {
  return { $regularExpression: { pattern: val.source, options: val.flags } };
}

export function Timestamp(t: number, i: number): types.Timestamp {
  return { $timestamp: { t, i } };
}

export function Binary(
  payload: Uint8Array,
  subType: types.BinarySubtype
): types.Binary {
  const output: string = Array.from(payload)
    .map((val): string => String.fromCharCode(val))
    .join("");
  const base64 = btoa(output);
  return { $binary: { base64, subType } };
}

export function MaxKey(): types.MaxKey {
  return { $maxKey: 1 };
}

export function MinKey(): types.MinKey {
  return { $minKey: 1 };
}

export function encode(object: types.BsonObject): types.Document {
  return toBsonDocument(JSON.stringify(object, replacer));
}

function replacer(this: types.BsonObject, key: any, value: any) {
  const val = this[key];
  if (val instanceof Date) {
    return DateTime(val.getTime());
  }
  if (val instanceof Map) {
    return Object.fromEntries([...val]);
  }
  if (val instanceof Set) {
    return [...val];
  }
  return value;
}

const date = new Date();
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
