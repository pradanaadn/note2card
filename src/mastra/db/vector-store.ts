import { QdrantVector } from "@mastra/qdrant";
import { QueryResult } from "@mastra/core/vector";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import logger from "@/logger";
import { deterministicIdFromDoc } from "@/utils";
type VectorStoreMetrics = "cosine" | "euclidean" | "dotproduct" | undefined;

export class VectorStore {
  private client: QdrantVector;

  constructor(url: string, apiKey: string, https: boolean) {
    this.client = new QdrantVector({
      url: url,
      apiKey: apiKey,
      https: https,
    });
    logger.info(`VectorStore initialized with Qdrant at ${url}`);
  }

  async createCollection(
    collectionName: string,
    vectorSize: number = 3072,
    metrics: VectorStoreMetrics = "cosine",
  ) {
    const list_collections = await this.client.listIndexes();
    if (!list_collections.includes(collectionName)) {
      logger.info(`Creating collection ${collectionName}`);
      await this.client.createIndex({
        indexName: collectionName,
        dimension: vectorSize,
        metric: metrics,
      });
      logger.info(`Collection ${collectionName} created`);
    }
    logger.info(`Collection ${collectionName} already exists`);
  }
  async addDocuments(
    collectionName: string,
    vectors: number[][],
    metadata?: Record<string, number | string | boolean>[],
  ) {
    const stringIds = vectors.map((vector, i) =>
      deterministicIdFromDoc({ vector: vector }),
    );
    logger.info(
      `Adding ${vectors.length} documents to collection ${collectionName}`,
    );
    await this.client.upsert({
      indexName: collectionName,
      vectors: vectors,
      metadata: metadata,
      ids: stringIds,
    });
  }

  async queryCollection(
    collectionName: string,
    queryVector: number[],
    topK: number,
    filter?: Record<string, number | string | boolean>,
  ): Promise<QueryResult[]> {
    const result = await this.client.query({
      indexName: collectionName,
      queryVector: queryVector,
      topK: topK,
      filter: filter,
    });
    return result;
  }
}

export class VectorStoreSingleton {
  private static instance: VectorStore | null = null;

  public static getInstance(
    url: string,
    apiKey: string,
    secure: boolean,
  ): VectorStore {
    if (!VectorStoreSingleton.instance) {
      logger.info("Initializing VectorStoreSingleton");
      VectorStoreSingleton.instance = new VectorStore(url, apiKey, secure);
      logger.info("VectorStoreSingleton initialized");
    }
    logger.info("VectorStoreSingleton instance retrieved");
    return VectorStoreSingleton.instance;
  }

  public static setInstance(store: VectorStore) {
    logger.info("Setting VectorStoreSingleton instance");
    VectorStoreSingleton.instance = store;
  }
}

// import { randomUUID } from "crypto";
// import { appConfig } from "@/config";

// const vectorStore = new VectorStore(
//   `http://localhost:${appConfig.qdrant.HTTP_PORT}`,
//   appConfig.qdrant.API_KEY,
//   true,
// );
// const run = async () => {
//   console.log("Running vector store example...");
//   await vectorStore.createCollection("test-collection", 1536, "cosine");
//   await vectorStore.addDocuments(
//     "test-collection",
//     [
//       Array(1536)
//         .fill(0)
//         .map(() => Math.random()),
//       Array(1536)
//         .fill(0)
//         .map(() => Math.random()),
//       Array(1536)
//         .fill(0)
//         .map(() => Math.random()),
//     ],
//     [{ text: "Document 1" }, { text: "Document 2" }, { text: "Document 3" }],
//     [randomUUID(), randomUUID(), randomUUID()],
//   );

//   const results = await vectorStore.queryCollection(
//     "test-collection",
//     Array(1536)
//       .fill(0)
//       .map(() => Math.random()),
//     2,
//   );
//   console.log("Query Results:", results);
// };

// // Uncomment to run the example
// run();
