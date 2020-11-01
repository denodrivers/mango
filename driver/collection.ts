import { BsonObject, Document, Int64 } from "../bson/types.ts";
import { MongoProtocol } from "../protocol/mod.ts";
import { Cursor } from "./cursor.ts";
import { Collection as CollectionInterface, FindOptions } from "./types.ts";
import { assertOk } from "./util.ts";

export class Collection implements CollectionInterface {
  #procotol: MongoProtocol;
  #database: string;
  #name: string;

  constructor(protocol: MongoProtocol, database: string, name: string) {
    this.#procotol = protocol;
    this.#database = database;
    this.#name = name;
  }

  async *find(
    filter: Document,
    options?: FindOptions,
  ): AsyncIterable<Document> {
    // TODO(lucacasonato): actually respect the options

    const body = await this.#procotol.executeKind0OpMsg<{
      ok: number;
      cursor: { firstBatch: Document[]; id: number };
    }>({
      find: this.#name,
      "$db": this.#database,
      filter,
      batchSize: 1,
      noCursorTimeout: true,
    });
    assertOk(body);

    const cursor = new Cursor(
      this.#procotol,
      body.cursor,
      { database: this.#database, collection: this.#name },
    );

    for await (const doc of cursor) {
      yield doc;
    }
  }
}
