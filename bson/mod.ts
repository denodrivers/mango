import {
  from_bson_document as fromBsonDocument,
  to_bson_document as toBsonDocument,
} from "./wasm/mango_bson.js";

import * as types from "./types.ts";

import { BinarySubtype } from "./types.ts";
export { BinarySubtype, types };

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

export function encode(object: types.BsonObject): Uint8Array {
  return toBsonDocument(object);
}

export function encodeDocuments(object: types.BsonObject[]): Uint8Array {
  const buffers = object.map(toBsonDocument);
  let total = 0;
  for (const buffer of buffers) {
    total += buffer.byteLength;
  }
  const final = new Uint8Array(total);
  let seek = 0;
  for (const buffer of buffers) {
    final.set(buffer, seek);
    seek += buffer.byteLength;
  }
  return final;
}

export function decode(buf: Uint8Array): types.BsonObject {
  // TODO(lucacasonato): rehydrate this
  return JSON.parse(fromBsonDocument(buf));
}

/**
 * This function decodes all of the documents in the Uint8Array.
*/
export function decodeDocuments(buf: Uint8Array): types.BsonObject[] {
  const view = new DataView(buf.buffer);
  let seek = 0;
  const documents = [];
  while (seek < buf.length) {
    const len = view.getInt32(seek, true);
    documents.push(decode(buf.subarray(seek, seek + len + 1)));
    seek += len;
  }
  return documents;
}
