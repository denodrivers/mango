import { assert } from "https://deno.land/std@0.74.0/testing/asserts.ts";
import { BufReader } from "../deps.ts";
import { MessageHeader, parseHeader, serializeHeader } from "./header.ts";

export class MongoProtocol {
  #reader: BufReader;
  #socket: Deno.Writer & Deno.Closer;

  constructor(socket: Deno.Reader & Deno.Writer & Deno.Closer) {
    this.#reader = new BufReader(socket);
    this.#socket = socket;
  }

  async send(header: MessageHeader, body: Uint8Array) {
    const buf = serializeHeader(header);
    await Deno.writeAll(this.#socket, buf);
    await Deno.writeAll(this.#socket, body);
  }

  async receive() {
    const buf = await this.#reader.readFull(new Uint8Array(16));
    assert(buf);
    const header = parseHeader(buf);

    const message = await this.#reader.readFull(
      new Uint8Array(header.messageLength - 16),
    );
    assert(message);
    return [header, message] as const;
  }

  close() {
    this.#socket.close();
  }
}
