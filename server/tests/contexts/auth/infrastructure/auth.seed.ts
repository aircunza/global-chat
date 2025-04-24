import { createPostgresqlClient } from "../../../../src/contexts/auth/infrastructure/persistence/postgresql/PostgresqlConfig";

/**
 * Seeds the PostgreSQL database for the auth context.
 * - Ensures the 'users' table exists.
 * - Inserts a set of predefined users.
 */
export async function upSeedAuth() {
  const clientPostgresql = createPostgresqlClient();
  await clientPostgresql.connect();
  try {
    await clientPostgresql.query("BEGIN");

    // Check if the 'users' table exists
    const result = await clientPostgresql.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    // Create 'users' table if it does not exist
    if (result.rows[0].exists === false) {
      await clientPostgresql.query(`
        CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
          name VARCHAR(100) NOT NULL,                   
          email VARCHAR(255) UNIQUE NOT NULL,             
          password VARCHAR(255) NOT NULL                 
        );
      `);
    }

    // Insert initial user records
    await clientPostgresql.query(`
      INSERT INTO users (id, name, email, password)
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440000', 'admin', 'admin@admin.com', '1234'),
        ('550e8400-e29b-41d4-a716-446655440012', 'user1', 'user1@user1.com', '12345');
    `);

    await clientPostgresql.query("COMMIT");
  } catch (e) {
    console.error(e);
    await clientPostgresql.query("ROLLBACK");
  } finally {
    await clientPostgresql.end();
  }
}

/**
 * Clears the seed data from the 'users' table in the auth context.
 */
export async function downSeedAuth() {
  const clientPostgresql = createPostgresqlClient();

  try {
    await clientPostgresql.connect();
    await clientPostgresql.query("BEGIN");

    // Delete all records from the users table
    await clientPostgresql.query("DELETE FROM users");

    await clientPostgresql.query("COMMIT");
  } catch (e) {
    console.error(e);
    await clientPostgresql.query("ROLLBACK");
  } finally {
    await clientPostgresql.end();
  }
}
