export class MongoDriverError extends Error {
  name = "MongoDriverError";
  constructor(message: string) {
    super(message);
  }
}

export class MongoRequestError extends Error {
  name = "MongoRequestError";
  code: number;
  codeName: string;
  constructor(code: number, codeName: string, message: string) {
    super(`${codeName}: ${message}`);
    this.code = code;
    this.codeName = codeName;
  }
}
