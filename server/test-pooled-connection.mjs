import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://neondb_owner:npg_ZJ5druqQbhD7@ep-empty-violet-adi1vooc-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function testConnection() {
  const client = new Client({ connectionString });
  
  try {
    console.log('🔄 Testing pooled connection...');
    await client.connect();
    console.log('✅ SUCCESS: Pooled connection works!');
    
    const version = await client.query('SELECT version()');
    console.log('📊 PostgreSQL:', version.rows[0].version.split(',')[0]);
    
    await client.end();
    return true;
  } catch (error) {
    console.error('❌ Pooled connection failed:', error.message);
    return false;
  }
}

testConnection();