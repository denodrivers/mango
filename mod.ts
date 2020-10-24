import { MongoProtocol } from "./protocol/mod.ts";
import { serializeOpQuery } from "./protocol/op_query.ts";
import { parseOpReply } from "./protocol/op_reply.ts";

const socket = await Deno.connect({ port: 27017, transport: "tcp" });
console.log("Connected");

const protocol = new MongoProtocol(socket);

const op = serializeOpQuery(
  {
    flags: 0,
    numberToReturn: 3,
    numberToSkip: 0,
    fullCollectionName: "juanportal.profiles",
    query: {},
  },
);

await protocol.send(
  {
    messageLength: op.byteLength + 16,
    opCode: 2004,
    requestID: 10,
    responseTo: 0,
  },
  op,
);

const [header, buf] = await protocol.receive();
console.log("recieved:", header.opCode);
const resp = parseOpReply(buf);

console.log(resp);

protocol.close();
console.log("Closed");
