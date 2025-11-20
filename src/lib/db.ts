export type ContactMessage = {
  name: string;
  email: string;
  message: string;
  ip?: string | null;
  userAgent?: string | null;
  createdAt?: Date;
};

async function getClient() {
  // lazy-load mongodb so tests can run without installation
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { MongoClient } = require('mongodb');

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI');

  // reuse global client in serverless environment
  const globalAny: any = globalThis as any;
  if (globalAny.__mongoClient) return globalAny.__mongoClient;

  const client = new MongoClient(uri);
  await client.connect();
  globalAny.__mongoClient = client;
  return client;
}

export async function saveContactMessage(msg: ContactMessage) {
  const client = await getClient();
  const dbName = process.env.MONGODB_DB || 'portfolio';
  const db = client.db(dbName);
  const collection = db.collection('messages');
  const result = await collection.insertOne({ ...msg, createdAt: new Date() });
  return result;
}
