import { MongoProtocol } from "../protocol/mod.ts";
import { Database } from "./database.ts";
import { MongoDriverError } from "./error.ts";
import {
  Database as DatabaseInterface,
  MongoClient as MongoClientInterface,
} from "./types.ts";
import { assertOk } from "./util.ts";

export async function connect(
  connectionURI: string,
): Promise<MongoClientInterface> {
  const url = typeof connectionURI === "string"
    ? new URL(connectionURI)
    : connectionURI;

  if (url.protocol !== "mongodb:") {
    throw new MongoDriverError(
      `${url.protocol} is not supported. Only 'mongodb:' protocol is supported`,
    );
  }

  const hostname = url.hostname;
  const port = parseInt(url.port || "27017");

  // TODO(lucacasonato): validate all of the incoming search parameters
  if (url.search) {
    throw new MongoDriverError(
      `${url.search} connection options are not yet supported.`,
    );
  }

  // TODO(lucacasonato): tls support
  const socket = await Deno.connect({ hostname, port, transport: "tcp" });

  const client = new MongoClient(socket);

  // TODO(lucacasonato): handshake the password and wire protocol version
  if (url.username || url.pathname) {
    throw new MongoDriverError(`Authentication is not yet supported.`);
  }

  return client;
}

class MongoClient implements MongoClientInterface {
  #protocol: MongoProtocol;
  constructor(socket: Deno.Reader & Deno.Writer & Deno.Closer) {
    this.#protocol = new MongoProtocol(socket);
  }

  database(name: string): DatabaseInterface {
    return new Database(this.#protocol, name);
  }

  close() {
    this.#protocol.close();
  }
}
