import {
  decode,
  decodeDocuments,
  encode,
  encodeDocuments,
  types,
} from "../bson/mod.ts";
import { assertEquals } from "../deps.ts";

export type Section = Section0 | Section1;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export interface OpMsg {
  sections: Section[];
}

export function serializeOpMsg(op: OpMsg): Uint8Array {
  const sections = op.sections.map(serializeSection);
  let sectionLen = 0;
  for (const section of sections) {
    sectionLen += section.byteLength;
  }

  const len = 4 + sectionLen;

  const view = new DataView(new ArrayBuffer(len));
  // flag bits
  view.setInt32(0, 0, true);
  let seek = 4;
  for (const section of sections) {
    console.log(new Uint8Array(view.buffer));
    new Uint8Array(view.buffer).set(section, seek);
    seek += section.byteLength;
  }
  return new Uint8Array(view.buffer);
}

function serializeSection(section: Section): Uint8Array {
  if (section.kind === 0) {
    return serializeSection0(section);
  } else if (section.kind === 1) {
    return serializeSection1(section);
  }
  throw new TypeError("Invalid section kind");
}

export interface Section0 {
  kind: 0;
  body: types.BsonObject;
}

function serializeSection0(section: Section0): Uint8Array {
  const body = encode(section.body);
  const buf = new Uint8Array(1 + body.byteLength);
  buf[0] = 0;
  buf.set(body, 1);
  return buf;
}

export interface Section1 {
  kind: 1;
  documentSequenceIdentifier: string;
  objects: types.BsonObject[];
}

function serializeSection1(section: Section1): Uint8Array {
  const documentSequenceIdentifier = encoder.encode(
    section.documentSequenceIdentifier,
  );
  const objects = encodeDocuments(section.objects);
  const buf = new Uint8Array(
    1 + 4 + documentSequenceIdentifier.byteLength + 1 + objects.byteLength,
  );
  buf[0] = 0;
  new DataView(buf.buffer).setInt32(
    1,
    4 + documentSequenceIdentifier.byteLength + 1 + objects.byteLength,
    true,
  );
  buf.set(documentSequenceIdentifier, 1 + 4);
  buf.set(objects, 1 + 4 + documentSequenceIdentifier.byteLength + 1);
  return buf;
}

export function parseOpMsg(buf: Uint8Array): OpMsg {
  const view = new DataView(buf.buffer);
  const flagBits = view.getInt32(0, true);
  assertEquals(flagBits >> 16, 0);

  const sections: Section[] = [];
  let seek = 4;
  while (seek < buf.byteLength) {
    const kind = view.getInt8(seek);
    seek++;
    if (kind === 0) {
      const len = view.getInt32(seek, true);
      sections.push({ kind: 0, body: decode(buf.slice(seek, seek + len)) });
      seek += len;
    } else if (kind === 1) {
      const len = view.getInt32(seek, true);
      let documentSequenceIdentifierLen = 0;
      for (const byte of buf) {
        if (byte === 0) {
          break;
        }
        documentSequenceIdentifierLen++;
      }
      const documentSequenceIdentifier = decoder.decode(
        buf.subarray(4, 4 + documentSequenceIdentifierLen),
      );
      const objects = decodeDocuments(
        buf.slice(4 + documentSequenceIdentifierLen + 1),
      );
      sections.push({ kind: 1, documentSequenceIdentifier, objects });
    } else {
      throw new Error("Invalid section kind");
    }
  }

  return { sections };
}
