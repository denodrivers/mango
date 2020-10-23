import { to_bson_document } from "./build/mango_bson.js";

export namespace types {
  export interface ObjectID {
    $oid: string;
  }
  export interface DateTime {
    $date: {
      $numberLong: String;
    };
  }
  export interface Double {
    $numberDouble: String;
  }
  export interface Int32 {
    $numberInt: String;
  }
  export interface Int64 {
    $numberLong: String;
  }
  export interface RegularExpression {
    $regularExpression: {
      pattern: string;
      options: string;
    };
  }
  export interface Timestamp {
    $timestamp: {
      t: number;
      i: number;
    };
  }
  export enum BinarySubtype {
    Generic = "00",
    Function = "01",
    _Binary = "02",
    _UUID = "03",
    UUID = "04",
    MD5 = "05",
    Encrypted = "06",
    UserDefined = "80",
  }
  export interface Binary {
    $binary: {
      base64: string;
      subType: BinarySubtype;
    };
  }
  export interface MaxKey {
    $maxKey: 1;
  }
  export interface MinKey {
    $minKey: 1;
  }
  export type BsonField =
    | BsonObject
    | ObjectID
    | DateTime
    | Double
    | Int32
    | Int64
    | RegularExpression
    | Timestamp
    | Binary
    | MaxKey
    | MinKey
    | number
    | Date
    | string;
  export interface BsonObject {
    [key: string]: BsonField;
  }
  export type Document = Uint8Array;
}

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
  let output: string = Array.from(payload)
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
