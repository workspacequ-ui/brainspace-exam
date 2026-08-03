import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool, neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Helper to check Neon DB connection
const getDatabaseUrl = () => {
  const raw = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || '';
  return raw.trim().replace(/^["']|["']$/g, '');
};

function getPool() {
  const connectionString = getDatabaseUrl();
  if (!connectionString) return null;
  return new Pool({ connectionString });
}

// Initialize tables in Neon DB automatically
async function initNeonTables() {
  const dbUrl = getDatabaseUrl();
  if (!dbUrl) {
    console.log('[Neon DB] No DATABASE_URL provided. App is running with client storage mode.');
    return false;
  }

  try {
    const sql = neon(dbUrl);
    console.log('[Neon DB] Connecting & initializing tables...');

    await sql`
      CREATE TABLE IF NOT EXISTS bsa_app_store (
        key VARCHAR(100) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS bsa_users (
        id VARCHAR(100) PRIMARY KEY,
        username VARCHAR(100) UNIQUE,
        email VARCHAR(150),
        data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS bsa_exams (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255),
        mode VARCHAR(50),
        data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS bsa_results (
        id VARCHAR(100) PRIMARY KEY,
        exam_id VARCHAR(100),
        student_id VARCHAR(100),
        data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('[Neon DB] ✅ Tables initialized successfully in Neon PostgreSQL!');
    return true;
  } catch (err) {
    console.error('[Neon DB] ❌ Initialization failed:', err);
    return false;
  }
}

// --- API ROUTES --- //

// Health & Neon DB Status
app.get('/api/neon/status', async (req, res) => {
  const dbUrl = getDatabaseUrl();
  if (!dbUrl) {
    return res.json({
      connected: false,
      urlSet: false,
      message: 'DATABASE_URL belum dikonfigurasi di Settings / Secret Keys.'
    });
  }

  try {
    const sql = neon(dbUrl);
    const result = await sql`SELECT NOW() as now, current_database() as db_name, version() as ver`;
    return res.json({
      connected: true,
      urlSet: true,
      message: 'Koneksi ke Neon Database PostgreSQL Berhasil!',
      dbName: result[0]?.db_name,
      serverTime: result[0]?.now,
      version: result[0]?.ver
    });
  } catch (error: any) {
    return res.json({
      connected: false,
      urlSet: true,
      message: 'Gagal terhubung ke Neon DB: ' + (error?.message || String(error))
    });
  }
});

// Sync data store (Key-Value fallback or full structured store)
app.get('/api/neon/get-store/:key', async (req, res) => {
  const dbUrl = getDatabaseUrl();
  if (!dbUrl) return res.status(400).json({ error: 'DATABASE_URL_MISSING' });

  try {
    const sql = neon(dbUrl);
    const rows = await sql`SELECT data FROM bsa_app_store WHERE key = ${req.params.key}`;
    if (rows.length === 0) {
      return res.json({ found: false, data: null });
    }
    return res.json({ found: true, data: rows[0].data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/neon/set-store/:key', async (req, res) => {
  const dbUrl = getDatabaseUrl();
  if (!dbUrl) return res.status(400).json({ error: 'DATABASE_URL_MISSING' });

  try {
    const sql = neon(dbUrl);
    const key = req.params.key;
    const data = JSON.stringify(req.body);

    await sql`
      INSERT INTO bsa_app_store (key, data, updated_at)
      VALUES (${key}, ${data}::jsonb, NOW())
      ON CONFLICT (key)
      DO UPDATE SET data = ${data}::jsonb, updated_at = NOW();
    `;

    return res.json({ success: true, key });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Bulk sync entire state to Neon
app.post('/api/neon/bulk-sync', async (req, res) => {
  const dbUrl = getDatabaseUrl();
  if (!dbUrl) return res.status(400).json({ error: 'DATABASE_URL_MISSING' });

  try {
    const sql = neon(dbUrl);
    const payload = req.body; // { users, exams, results, classes, categories, materials, products, institution }

    for (const [key, value] of Object.entries(payload)) {
      const jsonStr = JSON.stringify(value);
      await sql`
        INSERT INTO bsa_app_store (key, data, updated_at)
        VALUES (${key}, ${jsonStr}::jsonb, NOW())
        ON CONFLICT (key)
        DO UPDATE SET data = ${jsonStr}::jsonb, updated_at = NOW();
      `;
    }

    return res.json({ success: true, message: 'Semua data berhasil disingkronkan ke database Neon PostgreSQL!' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Fetch all keys from Neon for client initial state
app.get('/api/neon/bulk-load', async (req, res) => {
  const dbUrl = getDatabaseUrl();
  if (!dbUrl) return res.status(400).json({ error: 'DATABASE_URL_MISSING' });

  try {
    const sql = neon(dbUrl);
    const rows = await sql`SELECT key, data FROM bsa_app_store`;
    const resultObj: Record<string, any> = {};
    for (const row of rows) {
      resultObj[row.key] = row.data;
    }
    return res.json({ success: true, data: resultObj });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Setup Vite Development or Static Production Middleware
async function startServer() {
  await initNeonTables();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Brain Space Academy App running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
