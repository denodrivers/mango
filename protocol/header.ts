export interface MessageHeader {
  messageLength: number;
  requestID: number;
  responseTo: number;
  opCode: number;
}

export function serializeHeader(header: MessageHeader): Uint8Array {
  const view = new DataView(new ArrayBuffer(16));
  view.setInt32(0, header.messageLength, true);
  view.setInt32(4, header.requestID, true);
  view.setInt32(8, header.responseTo, true);
  view.setInt32(12, header.opCode, true);
  return new Uint8Array(view.buffer);
}

export function parseHeader(buf: Uint8Array): MessageHeader {
  const view = new DataView(buf.buffer);
  return {
    messageLength: view.getInt32(0, true),
    requestID: view.getInt32(4, true),
    responseTo: view.getInt32(8, true),
    opCode: view.getInt32(12, true),
  };
}
