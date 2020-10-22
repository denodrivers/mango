const conn = await Deno.connect({
  hostname: "0.0.0.0", // or "mango_mongo" if this script is ran inside a container
  port: 27017
})

async function listen () {
  (async () => {
    try {
      for await (const chunk of Deno.iter(conn)) {
        console.log('got msg')
        const response = new TextDecoder().decode(chunk)
        console.log(response)
      }
    } catch (e) {
      console.log('got error')
      console.error(e.stack);
    }
  })();
}

await listen()

// see https://docs.mongodb.com/manual/reference/mongodb-wire-protocol/#standard-message-header
type MsgHeader = {
  messageLength: number // total message size, including this
  requestID: number // Identifier for this message
  opCode: number // Request type, see https://docs.mongodb.com/manual/reference/mongodb-wire-protocol/#request-opcodes
}
type ResponseHeader = MsgHeader & {
  responseTo: number // requestId from the original request (used in response from db)
}
// Base type for OP's, to reuse between all actual OP's. Not official
type OP_BASE = {
  header: MsgHeader,
  flags: number,
  fullCollectionName: string // "<dbname>.<collection>"
}
// TODO
type document = {}
// see https://docs.mongodb.com/manual/reference/mongodb-wire-protocol/#op-query
type OP_QUERY = OP_BASE  & {
  numberToSkip: number // Number of documents to skip
  numberToReturn: number // Number of documents to return
  query: document // query object, see link above
  returnFieldsSelector?: document // Optional. Selector indicating the fields to return. See link above for more details
}
// TODO :: add all other `OP_*`
// ...
const query: OP_QUERY = {
  header: {
    messageLength: 0,
    requestID: 1,
    opCode: 2004
  },
  flags: 5,
  fullCollectionName: "juanportal.profiles",
  numberToSkip: 0,
  numberToReturn: 1,
  query: "" // TODO
}

//await conn.write(new TextEncoder().encode(JSON.stringify(query)))
