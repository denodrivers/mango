export class MongoProtocolError extends Error {
  name = "MongoProtocolError";
  constructor(message: string) {
    super(message);
  }
}
