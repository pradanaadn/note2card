
import { QdrantVector } from '@mastra/qdrant';
import { QueryResult } from '@mastra/core/vector';
import { UUID } from 'crypto';
type VectorStoreMetrics = 'cosine' | 'euclidean' | 'dotproduct' | undefined;

export class VectorStore {
    private client: QdrantVector;

    constructor(url: string, apiKey: string, https: boolean) {
        this.client = new QdrantVector({
            url: url,
            apiKey: apiKey,
            https: https
        });
        console.log("VectorStore initialized with Qdrant at", url);
    }

    async createCollection(collectionName: string, vectorSize: number, metrics: VectorStoreMetrics) {
        await this.client.createIndex({
            indexName: collectionName,
            dimension: vectorSize,
            metric: metrics
        });
    }
    async addDocuments(collectionName: string, vectors: number[][], metadata?: Record<string, number|string|boolean>[], ids?: UUID[] | number[]) {
        let stringIds: string[] | undefined = undefined;
        if (ids) {
            stringIds = ids.map(id => id.toString());
        }
        await this.client.upsert({
            indexName: collectionName,
            vectors: vectors,
            metadata: metadata,
            ids: stringIds
        });
    }

    async queryCollection(collectionName: string, queryVector: number[], topK: number, filter?: Record<string, number|string|boolean>): Promise<QueryResult[]> {
        const result = await this.client.query({
            indexName: collectionName,
            queryVector: queryVector,
            topK: topK,
            filter: filter
        });
        return result;
    }
}

// import { randomUUID } from 'crypto';

// const vectorStore = new VectorStore('http://localhost:6333', 'api_key', true);
// const run = async () => {
//     console.log("Running vector store example...");
//     await vectorStore.createCollection('test-collection', 1536, 'cosine');
//     await vectorStore.addDocuments('test-collection', [
//         Array(1536).fill(0).map(() => Math.random()),
//         Array(1536).fill(0).map(() => Math.random()),
//         Array(1536).fill(0).map(() => Math.random()),
//     ], [
//         { text: 'Document 1' },
//         { text: 'Document 2' },
//         { text: 'Document 3' },
//     ], [randomUUID(), randomUUID(), randomUUID()]);

//     const results = await vectorStore.queryCollection('test-collection', Array(1536).fill(0).map(() => Math.random()), 2);
//     console.log('Query Results:', results);
// };

// // Uncomment to run the example
// run();