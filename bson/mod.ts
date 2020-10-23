import { to_bson_document } from "./build/mango_bson.js";
import * as types from "./types.ts";

export function ObjectID(oid: string): types.ObjectID {
  return { $oid: oid };
}

export function DateTime(ms: number): types.DateTime {
  return { $date: { $numberLong: String(ms) } };
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
  subType: types.BinarySubtype,
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
  return to_bson_document(object);
}
