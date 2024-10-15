const { Client } = require('pg');
const client = new Client({
  connectionString:
    process.env.DATABASE_URL || 'postgress://localhost/Haircare_Products',
});

async function init() {
  try {
    await client.connect();
    console.log('Connected to database');

    // await client.query('DROP TABLE IF EXISTS Comment CASCADE;');
    // await client.query('DROP TABLE IF EXISTS Review CASCADE;');
    // await client.query('DROP TABLE IF EXISTS Item CASCADE;');
    // await client.query('DROP TABLE IF EXISTS "User" CASCADE;');

    await client.query(`
    CREATE TABLE IF NOT EXISTS "User"(
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    review VARCHAR (255) NOT NULL,
    comment VARCHAR (255) NOT NULL
    );
    `);

    await client.query(`
    CREATE TABLE IF NOT EXISTS Item(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    avgScore INT NOT NULL,
    reviews VARCHAR(255) NOT NULL
    );
    `);

    await client.query(`
    CREATE TABLE IF NOT EXISTS Review(
    id SERIAL PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES "User"(id) NOT NULL,
    item_id INTEGER REFERENCES Item(id) NOT NULL
    );
    `);

    await client.query(`
    CREATE TABLE IF NOT EXISTS Comment(
    id SERIAL PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES "User"(id) NOT NULL,
    review_id INTEGER REFERENCES Review(id) NOT NULL
    );
    `);

    console.log('Database tables has been created.');
  } catch (err) {
    console.error('Database initialization error', err);
  } finally {
    await client.end();
    console.log('Database client disconnected');
  }
}

init();
