import { Deferred, deferred } from "../deps.ts";
import { Document } from "../bson/types.ts";
import { MongoProtocol } from "../protocol/mod.ts";
import { assertOk } from "./util.ts";
import { Int64 } from "../bson/mod.ts";

interface CursorOptions {
  database: string;
  collection: string;
}

export class Cursor<T extends Document> implements AsyncIterable<T> {
  #protocol: MongoProtocol;
  #id: number;
  #buffer: T[];
  #options: CursorOptions;
  #waitingForMore: Deferred<void>[] = [];
  #requesting = false;
  #done = false;

  constructor(
    protocol: MongoProtocol,
    cursor: { id: number; firstBatch: T[] },
    options: CursorOptions,
  ) {
    this.#protocol = protocol;
    this.#id = cursor.id;
    this.#buffer = cursor.firstBatch;
    this.#options = options;
  }

  async *[Symbol.asyncIterator]() {
    while (!this.#done || this.#buffer.length > 0) {
      if (this.#buffer.length === 0) {
        if (this.#requesting === false) {
          this.#requesting = true;
          const req = {
            getMore: Int64(this.#id),
            collection: this.#options.collection,
            "$db": this.#options.database,
          };
          console.log(req);
          const res = await this.#protocol.executeKind0OpMsg(req);

          assertOk(res);
          console.log(res);
          this.#done = true;

          this.#requesting = false;
          for (const waiter of this.#waitingForMore) {
            waiter.resolve();
          }
        } else {
          const wait = deferred<void>();
          this.#waitingForMore.push(wait);
          await wait;
        }
      } else {
        yield this.#buffer.shift() as T;
      }
    }
  }
}
