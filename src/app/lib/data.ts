import { neon } from '@neondatabase/serverless';

// Create the table (run once, e.g., in a migration script)
export async function createPdfTable() {
  'use server';
  const sql = neon(`${process.env.DATABASE_URL}`);
  await sql.query(`
    CREATE TABLE IF NOT EXISTS pdf_files (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      "group" TEXT NOT NULL,
      file BYTEA NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

// Insert a PDF file
export async function uploadPdf(formData: FormData) {
  'use server';
  const sql = neon(process.env.DATABASE_URL!);
  const title = formData.get('title') as string;
  const group = formData.get('group') as string;
  const file = formData.get('file') as File;

  // Read file as ArrayBuffer and convert to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await sql.query(
    'INSERT INTO pdf_files (title, "group", file) VALUES ($1, $2, $3)',
    [title, group, buffer]
  );
}

// Retrieve all PDF files metadata
export async function getPdfFiles() {
  'use server';
  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql.query('SELECT id, title, "group", created_at FROM pdf_files');
  return result;
}

// Retrieve a single PDF file by id
export async function getPdfFileById(id: number) {
  'use server';
  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql.query('SELECT * FROM pdf_files WHERE id = $1', [id]);
  return result[0];
}

// Delete a PDF file by id
export async function deletePdfFile(id: number) {
  'use server';
  const sql = neon(process.env.DATABASE_URL!);
  await sql.query('DELETE FROM pdf_files WHERE id = $1', [id]);
}
