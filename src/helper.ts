import { Client } from "pg";

const config = {
  host: process.env.POSTGRES_HOST || "localhost",
  port: Number(process.env.POSTGRES_PORT || 5432),
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE || "postgres",
};

const runWithDefaultDatabaseConnection = async (
  fn: (client: Client) => Promise<void>
): Promise<void> => {
  const client = new Client(config);
  await client.connect();
  await fn(client);
  await client.end();
};

/**
 * Creates a new database using template0 and
 * returns a `Client` connected to the newly created database.
 *
 * @returns `Client`
 */
export const createTestDatabase = async (): Promise<Client> => {
  if (process.env.VITEST === undefined) {
    throw new Error("Function was not executed with Vitest.");
  }

  const database = `vitest-db-${crypto.randomUUID()}`;
  await runWithDefaultDatabaseConnection(async (client) => {
    await client.query(`CREATE DATABASE "${database}" TEMPLATE template0;`);
  });
  const client = new Client({ ...config, database });
  await client.connect();
  return client;
};

/**
 * Closes the connection and drops the database.
 */
export const teardownTestDatabase = async (client: Client): Promise<void> => {
  if (process.env.VITEST === undefined) {
    throw new Error("Function was not executed with Vitest.");
  }
  const database = await client
    .query<{ current_database: string }>("SELECT current_database();")
    .then(({ rows }) => rows[0].current_database);
  await client.end();

  await runWithDefaultDatabaseConnection(async (client) => {
    await client.query(`DROP DATABASE "${database}";`);
  });
};
