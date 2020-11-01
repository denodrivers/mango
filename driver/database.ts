import { MongoProtocol } from "../protocol/mod.ts";
import { Collection } from "./collection.ts";
import {
  Collection as CollectionInterface,
  Database as DatabaseInterface,
} from "./types.ts";

export class Database implements DatabaseInterface {
  #procotol: MongoProtocol;
  #name: string;

  constructor(protocol: MongoProtocol, name: string) {
    this.#procotol = protocol;
    this.#name = name;
  }

  collection(name: string): CollectionInterface {
    return new Collection(this.#procotol, this.#name, name);
  }
}
