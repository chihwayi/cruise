import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';

dotenv.config();

const elasticsearchClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://elasticsearch:9200',
  // For development, if security is disabled
  auth: process.env.ELASTIC_PASSWORD
    ? {
        username: 'elastic',
        password: process.env.ELASTIC_PASSWORD,
      }
    : undefined,
});

export const connectElasticsearch = async (): Promise<void> => {
  try {
    const health = await elasticsearchClient.cluster.health();
    console.log('✅ Elasticsearch connected:', health.status);
  } catch (error) {
    console.error('❌ Elasticsearch connection error:', error);
    throw error;
  }
};

export default elasticsearchClient;

