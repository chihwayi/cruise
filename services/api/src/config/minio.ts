import { Client } from 'minio';
import * as dotenv from 'dotenv';

dotenv.config();

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'minio',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin_change_in_prod',
});

export const initializeMinIO = async (): Promise<void> => {
  try {
    // Check if bucket exists, create if not
    const bucketName = 'cruise-documents';
    const exists = await minioClient.bucketExists(bucketName);
    
    if (!exists) {
      await minioClient.makeBucket(bucketName, 'us-east-1');
      console.log(`✅ Created MinIO bucket: ${bucketName}`);
    } else {
      console.log(`✅ MinIO bucket exists: ${bucketName}`);
    }
  } catch (error) {
    console.error('❌ MinIO initialization error:', error);
    throw error;
  }
};

export default minioClient;

