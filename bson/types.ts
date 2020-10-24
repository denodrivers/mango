export interface ObjectID {
  $oid: string;
}
export interface DateTime {
  $date: Int64;
}
export interface Double {
  $numberDouble: string;
}
export interface Int32 {
  $numberInt: string;
}
export interface Int64 {
  $numberLong: string;
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
  | Map<string, BsonField>
  | Set<BsonField>
  | string;
export interface BsonObject {
  [key: string]: BsonField;
}
export type Document = Uint8Array;
