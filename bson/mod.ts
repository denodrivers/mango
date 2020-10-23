import { to_bson_document } from "./build/mango_bson.js";

export function ObjectID(oid: string) {
  return { $oid: oid };
}

export function DateTime(ms: number) {
  return { $date: { $numberLong: String(ms) } };
}

export function Double(val: number) {
  return { $numberDouble: String(val) };
}

export function Int32(val: number) {
  return { $numberInt: String(val) };
}

export function Int64(val: number) {
  return { $numberLong: String(val) };
}

export function Regex(val: RegExp) {
  return { $regularExpression: { pattern: val.source, options: val.flags } };
}

export function Timestamp(t: number, i: number) {
  return { $timestamp: { t, i } };
}

enum BinaryTypes {
  Generic = "00",
  Function = "01",
  _Binary = "02",
  _UUID = "03",
  UUID = "04",
  MD5 = "05",
  Encrypted = "06",
  UserDefined = "80",
}

export function Binary(payload: Uint8Array, subType: BinaryTypes | string) {
  let output: string = Array.from(payload)
    .map((val): string => String.fromCharCode(val))
    .join("");
  const base64 = btoa(output);
  return { $binary: { base64, subType } };
}

export function MaxKey() {
  return { $maxKey: 1 };
}

export function MinKey() {
  return { $minKey: 1 };
}

// testing...

function toHexString(byteArray: Uint8Array) {
  return Array.from(byteArray, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
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
      a: Binary(new Uint8Array([1, 2, 3, 4]), BinaryTypes.UserDefined),
    }),
  ),
);
