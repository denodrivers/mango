import { to_bson_document } from "./build/mango_bson.js";

function toHexString(byteArray: Uint8Array) {
  return Array.from(byteArray, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}

function ObjectID(oid: string) {
  return { $oid: oid };
}

function DateTime(ms: number) {
  return { $date: { $numberLong: String(ms) } };
}

function Double(val: number) {
  return { $numberDouble: String(val) };
}

function Int32(val: number) {
  return { $numberInt: String(val) };
}

function Int64(val: number) {
  return { $numberLong: String(val) };
}

function Regex(val: RegExp) {
  return { $regularExpression: { pattern: val.source, options: val.flags } };
}

function Timestamp(t: number, i: number) {
  return { $timestamp: { t, i } };
}

function MaxKey() {
  return { $maxKey: 1 };
}

function MinKey() {
  return { $minKey: 1 };
}

console.log(
  toHexString(
    to_bson_document({
      id: ObjectID("5d505646cf6d4fe581014ab2"),
      maxk: MaxKey(),
      minK: MinKey(),
      dt: DateTime(1565546054692),
      d: Double(123.2),
      i32: Int32(123),
      i64: Int64(123),
      re: Regex(/hello (world?)/),
      stamp: Timestamp(123, 1),
    })
  )
);
