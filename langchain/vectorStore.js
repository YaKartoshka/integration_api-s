const { VectorStore } = require("@langchain/core/vectorstores");
const { Document } = require("@langchain/core/documents");
const { similarity: ml_distance_similarity } = require("ml-distance");

class CustomVectorStore extends VectorStore {
  memoryVectors = [];

  _vectorstoreType() {
    return "custom";
  }

  constructor(embeddings, fields = {}) {
    super(embeddings, fields);
  }

  async addDocuments(documents) {
    const texts = documents.map(({ pageContent }) => pageContent);
    return this.addVectors(
      await this.embeddings.embedDocuments(texts),
      documents
    );
  }

  async addVectors(vectors, documents) {
    const memoryVectors = vectors.map((embedding, idx) => ({
      content: documents[idx].pageContent,
      embedding,
      metadata: documents[idx].metadata,
    }));

    this.memoryVectors = this.memoryVectors.concat(memoryVectors);
  }

  async deleteDocuments(docIds) {
    this.memoryVectors = this.memoryVectors.filter(
      (vector) => !docIds.includes(vector.metadata.id)
    );
  }

  async similaritySearchVectorWithScore(query, k, filter) {
    const filterFunction = (memoryVector) => {
      if (!filter) {
        return true;
      }

      const doc = new Document({
        metadata: memoryVector.metadata,
        pageContent: memoryVector.content,
      });
      return filter(doc);
    };
    const filteredMemoryVectors = this.memoryVectors.filter(filterFunction);
    const searches = filteredMemoryVectors
      .map((vector, index) => ({
        similarity: ml_distance_similarity.cosine(query, vector.embedding),
        index,
      }))
      .sort((a, b) => (a.similarity > b.similarity ? -1 : 0))
      .slice(0, k);

    const result = searches.map((search) => [
      new Document({
        metadata: filteredMemoryVectors[search.index].metadata,
        pageContent: filteredMemoryVectors[search.index].content,
      }),
      search.similarity,
    ]);

    return result;
  }

  static async fromTexts(texts, metadatas, embeddings, dbConfig) {
    const docs = [];
    for (let i = 0; i < texts.length; i += 1) {
      const metadata = Array.isArray(metadatas) ? metadatas[i] : metadatas;
      const newDoc = new Document({
        pageContent: texts[i],
        metadata,
      });
      docs.push(newDoc);
    }
    return this.fromDocuments(docs, embeddings, dbConfig);
  }

  static async fromDocuments(docs, embeddings, dbConfig) {
    const instance = new this(embeddings, dbConfig);
    await instance.addDocuments(docs);
    return instance;
  }
}

module.exports = {
  CustomVectorStore,
};
