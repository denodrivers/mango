import { BsonObject } from "../bson/types.ts";
import { MongoRequestError } from "./error.ts";

export function assertOk(body: BsonObject) {
  if (body.ok !== 1) {
    throw new MongoRequestError(
      body.code as number,
      body.codeName as string,
      body.errmsg as string,
    );
  }
}
