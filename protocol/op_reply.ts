interface OpReply {
  responseFlag: number;
  cursorID: bigint;
  startingFrom: number;
  numberReturned: number;
  // TODO(lucacasonato): should be types.BsonObject[]
  documents: Uint8Array;
}

export function parseOpReply(buf: Uint8Array): OpReply {
  const view = new DataView(buf.buffer);
  return {
    responseFlag: view.getInt32(0, true),
    cursorID: view.getBigInt64(4, true),
    startingFrom: view.getInt32(12, true),
    numberReturned: view.getInt32(16, true),
    documents: buf.subarray(20),
  };
}
