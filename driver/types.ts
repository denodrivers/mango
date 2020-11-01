import { Document } from "../bson/types.ts";

export interface MongoClient {
  database(name: string): Database;
  close(): void;
}

export interface Database {
  collection(name: string): Collection;
}

export interface Collection {
  /**
   * Finds the documents matching the model.
   *
   * Note: The filter parameter below equates to the $query meta operator. It cannot
   * contain other meta operators like $maxScan. However, do not validate this document
   * as it would be impossible to be forwards and backwards compatible. Let the server
   * handle the validation.
   *
   * Note: If $explain is specified in the modifiers, the return value is a single
   * document. This could cause problems for static languages using strongly typed entities.
   *
   * Note: result iteration should be backed by a cursor. Depending on the implementation,
   * the cursor may back the returned Iterable instance or an iterator that it produces.
   *
   * @see https://docs.mongodb.com/manual/core/read-operations-introduction/
   */
  find(
    filter: Document,
    options?: FindOptions,
  ): AsyncIterable<Document>;
}

export interface FindOptions {
  /**
   * Enables writing to temporary files on the server. When set to true, the server
   * can write temporary data to disk while executing the find operation.
   *
   * This option is sent only if the caller explicitly provides a value. The default
   * is to not send a value.
   *
   * This option is only supported by servers >= 4.4. Older servers >= 3.2 will report an error for using this option.
   * For servers < 3.2, the driver MUST raise an error if the caller explicitly provides a value.
   *
   * @see https://docs.mongodb.com/manual/reference/command/find/
   */
  allowDiskUse?: boolean;

  /**
   * Get partial results from a mongos if some shards are down (instead of throwing an error).
   *
   * This option is sent only if the caller explicitly provides a value. The default is to not send a value.
   * For servers < 3.2, the Partial wire protocol flag is used and defaults to false.
   *
   * @see https://docs.mongodb.com/manual/reference/command/find/
   */
  allowPartialResults?: boolean;

  /**
   * The number of documents to return per batch.
   *
   * This option is sent only if the caller explicitly provides a value. The default is to not send a value.
   * For servers < 3.2, this is combined with limit to create the wire protocol numberToReturn value.
   * If specified, drivers SHOULD apply this option to both the original query operation and subsequent
   * getMore operations on the cursor.
   *
   * @see https://docs.mongodb.com/manual/reference/command/find/
   */
  batchSize?: number;

  /**
   * Specifies a collation.
   *
   * This option is sent only if the caller explicitly provides a value. The default is to not send a value.
   * For servers < 3.4, the driver MUST raise an error if the caller explicitly provides a value.
   *
   * @see https://docs.mongodb.com/manual/reference/command/find/
   */
  collation?: Document;

  /**
   * Attaches a comment to the query.
   *
   * This option is sent only if the caller explicitly provides a value. The default is to not send a value.
   *
   * @see https://docs.mongodb.com/manual/reference/command/find/
   */
  comment?: string;

  /**
   * Indicates the type of cursor to use. This value includes both
   * the tailable and awaitData options.
   *
   * This option is sent only if the caller explicitly provides a value. The default is to not send a value.
   * For servers < 3.2, the AwaitData and Tailable wire protocol flags are used and default to false.
   *
   * @see https://docs.mongodb.com/manual/reference/command/find/
   */
  cursorType?: CursorType;

  /**
   * The index to use. Specify either the index name as a string or the index key pattern.
   * If specified, then the query system will only consider plans using the hinted index.
   *
   * This option is sent only if the caller explicitly provides a value. The default is to not send a value.
   *
   * @see https://docs.mongodb.com/manual/reference/command/find/
   */
  hint?: string | Document;

  /**
   * The maximum number of documents to return.
   *
   * This option is sent only if the caller explicitly provides a value. The default is to not send a value.
   * For servers < 3.2, this is combined with batchSize to create the wire protocol numberToReturn value.
   *
   * A negative limit implies that the caller has requested a single batch of results. For servers >= 3.2, singleBatch
   * should be set to true and limit should be converted to a positive value. For servers < 3.2, the wire protocol
   * numberToReturn value may be negative.
   *
   * @see https://docs.mongodb.com/manual/reference/command/find/
   */
  limit?: bigint;

  /**
   * The exclusive upper bound for a specific index.
   *
   * This option is sent only if the caller explicitly provides a value. The default is to not send a value.
   *
   * @see https://docs.mongodb.com/manual/reference/command/find/
   */
  max?: Document;

  /**
   * The maximum amount of time for the server to wait on new documents to satisfy a tailable cursor
   * query. This only applies to a TAILABLE_AWAIT cursor. When the cursor is not a TAILABLE_AWAIT cursor,
   * this option is ignored.
   *
   * This option is sent only if the caller explicitly provides a value. The default is to not send a value.
   * For servers < 3.2, this option is ignored and not sent as maxTimeMS does not exist in the OP_GET_MORE wire protocol.
   *
   * Note: This option is specified as "maxTimeMS" in the getMore command and not provided as part of the
   * initial find command.
   *
   * @see https://docs.mongodb.com/manual/reference/command/find/
   */
  maxAwaitTimeMS?: bigint;

  /**
   * Maximum number of documents or index keys to scan when executing the query.
   *
   * This option is sent only if the caller explicitly provides a value. The default is to not send a value.
   *
   * @see https://docs.mongodb.com/manual/reference/command/find/
   * @deprecated 4.0
   */
  maxScan?: bigint;

  /**
   * The maximum amount of time to allow the query to run.
   *
   * This option is sent only if the caller explicitly provides a value. The default is to not send a value.
   *
   * @see https://docs.mongodb.com/manual/reference/command/find/
   */
  maxTimeMS?: bigint;

  /**
   * The inclusive lower bound for a specific index.
   *
   * This option is sent only if the caller explicitly provides a value. The default is to not send a value.
   *
   * @see https://docs.mongodb.com/manual/reference/command/find/
   */
  min?: Document;

  /**
   * The server normally times out idle cursors after an inactivity period (10 minutes)
   * to prevent excess memory use. Set this option to prevent that.
   *
   * This option is sent only if the caller explicitly provides a value. The default is to not send a value.
   * For servers < 3.2, the NoCursorTimeout wire protocol flag is used and defaults to false.
   *
   * @see https://docs.mongodb.com/manual/reference/command/find/
   */
  noCursorTimeout?: boolean;

  /**
   * Enables optimization when querying the oplog for a range of ts values
   *
   * Note: this option is intended for internal replication use only.
   *
   * This option is sent only if the caller explicitly provides a value. The default is to not send a value.
   * For servers < 3.2, the OplogReplay wire protocol flag is used and defaults to false.
   * For servers >= 4.4, the server will ignore this option if set (see: SERVER-36186).
   *
   * @see https://docs.mongodb.com/manual/reference/command/find/
   * @deprecated 4.4
   */
  oplogReplay?: boolean;

  /**
   * Limits the fields to return for all matching documents.
   *
   * This option is sent only if the caller explicitly provides a value. The default is to not send a value.
   *
   * @see https://docs.mongodb.com/manual/reference/command/find/
   */
  projection?: Document;

  /**
   * If true, returns only the index keys in the resulting documents.
   *
   * This option is sent only if the caller explicitly provides a value. The default is to not send a value.
   *
   * @see https://docs.mongodb.com/manual/reference/command/find/
   */
  returnKey?: boolean;

  /**
   * Determines whether to return the record identifier for each document. If true, adds a field $recordId to the returned documents.
   *
   * This option is sent only if the caller explicitly provides a value. The default is to not send a value.
   *
   * @see https://docs.mongodb.com/manual/reference/command/find/
   */
  showRecordId?: boolean;

  /**
   * The number of documents to skip before returning.
   *
   * This option is sent only if the caller explicitly provides a value. The default is to not send a value.
   * For servers < 3.2, this is a wire protocol parameter that defaults to 0.
   *
   * @see https://docs.mongodb.com/manual/reference/command/find/
   */
  skip?: bigint;

  /**
   * Prevents the cursor from returning a document more than once because of an intervening write operation.
   *
   * This option is sent only if the caller explicitly provides a value. The default is to not send a value.
   *
   * @see https://docs.mongodb.com/manual/reference/command/find/
   * @deprecated 4.0
   */
  snapshot?: boolean;

  /**
   * The order in which to return matching documents.
   *
   * This option is sent only if the caller explicitly provides a value. The default is to not send a value.
   *
   * @see https://docs.mongodb.com/manual/reference/command/find/
   */
  sort?: Document;
}

export enum CursorType {
  /**
   * The default value. A vast majority of cursors will be of this type.
   */
  NON_TAILABLE,
  /**
   * Tailable means the cursor is not closed when the last data is retrieved.
   * Rather, the cursor marks the final object’s position. You can resume
   * using the cursor later, from where it was located, if more data were
   * received. Like any “latent cursor”, the cursor may become invalid at
   * some point (CursorNotFound) – for example if the final object it
   * references were deleted.
   *
   * @see https://docs.mongodb.com/meta-driver/latest/legacy/mongodb-wire-protocol/#op-query
   */
  TAILABLE,
  /**
   * Combines the tailable option with awaitData, as defined below.
   *
   * Use with TailableCursor. If we are at the end of the data, block for a
   * while rather than returning no data. After a timeout period, we do return
   * as normal. The default is true.
   *
   * @see https://docs.mongodb.com/meta-driver/latest/legacy/mongodb-wire-protocol/#op-query
   */
  TAILABLE_AWAIT,
}
