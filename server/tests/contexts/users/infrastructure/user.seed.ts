import { createPostgresqlClient } from "../../../../src/contexts/users/infrastructure/persistence/postgresql/PostgresqlConfig";

/**
 * Seeds initial data into the 'users' table.
 * - Creates the table if it does not exist.
 * - Inserts default records.
 */
export async function upSeedUsers() {
  const clientPostgresql = createPostgresqlClient();
  await clientPostgresql.connect();

  try {
    // Start a new transaction
    await clientPostgresql.query("BEGIN");

    // Check if the 'users' table already exists
    const result = await clientPostgresql.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    // Create the 'users' table if it doesn't exist
    if (!result.rows[0].exists) {
      await clientPostgresql.query(`
        CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
          name VARCHAR(100) NOT NULL,                   
          email VARCHAR(255) UNIQUE NOT NULL,             
          password VARCHAR(255) NOT NULL                 
        );
      `);
    }

    // Insert sample user records into the table
    await clientPostgresql.query(`
      INSERT INTO users (id, name, email, password)
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440000', 'admin', 'admin@admin.com', '1234'),
        ('550e8400-e29b-41d4-a716-446655440012', 'user1', 'user1@user1.com', '12345');
    `);

    // Commit the transaction
    await clientPostgresql.query("COMMIT");
  } catch (e) {
    console.error(e);
    // Rollback the transaction in case of any errors and close the connection
    await clientPostgresql.query("ROLLBACK");
    await clientPostgresql.end();
  }
}

/**
 * Rolls back the seeded user data.
 * - Deletes all records from the 'users' table.
 */
export async function downSeedUSer() {
  const clientPostgresql = createPostgresqlClient();

  try {
    await clientPostgresql.connect();
    await clientPostgresql.query("BEGIN");

    // Delete all users from the table
    await clientPostgresql.query("DELETE FROM users");

    await clientPostgresql.query("COMMIT");
  } catch (e) {
    // Rollback the transaction on error
    await clientPostgresql.query("ROLLBACK");
  } finally {
    // Ensure the connection is closed in all cases
    await clientPostgresql.end();
  }
}
