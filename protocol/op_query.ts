import { encode, types } from "../bson/mod.ts";

export interface OpQuery {
  flags: number;
  fullCollectionName: string;
  numberToSkip: number;
  numberToReturn: number;
  query: types.BsonObject;
  returnFieldsSelector?: types.BsonObject;
}

const encoder = new TextEncoder();

export function serializeOpQuery(op: OpQuery): Uint8Array {
  const fullCollectionName = encoder.encode(op.fullCollectionName);
  const query = encode(op.query);
  const returnFieldsSelector = op.returnFieldsSelector
    ? encode(op.returnFieldsSelector)
    : new Uint8Array();

  const len = 4 + (fullCollectionName.length + 1) + 4 + 4 + query.byteLength +
    returnFieldsSelector.byteLength;

  const view = new DataView(new ArrayBuffer(len));
  view.setInt32(0, op.flags, true);
  new Uint8Array(view.buffer).set(fullCollectionName, 4);
  view.setInt32(4 + (fullCollectionName.length + 1), op.numberToSkip, true);
  view.setInt32(
    4 + (fullCollectionName.length + 1) + 4,
    op.numberToReturn,
    true,
  );
  new Uint8Array(view.buffer).set(
    query,
    4 + (fullCollectionName.length + 1) + 4 + 4,
  );
  new Uint8Array(view.buffer).set(
    returnFieldsSelector,
    4 + (fullCollectionName.length + 1) + 4 + 4 + query.byteLength,
  );
  return new Uint8Array(view.buffer);
}
