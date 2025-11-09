import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://neondb_owner:npg_ZJ5druqQbhD7@ep-empty-violet-adi1vooc.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function testConnection() {
  const client = new Client({ connectionString });
  
  try {
    console.log('🔄 Connecting to Neon database...');
    await client.connect();
    console.log('✅ SUCCESS: Connected to database!');
    
    const version = await client.query('SELECT version()');
    console.log('📊 PostgreSQL:', version.rows[0].version.split(',')[0]);
    
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📋 Existing tables:', tables.rows.map(row => row.table_name));
    
    await client.end();
    console.log('🎉 Database is ready for Prisma!');
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

testConnection();