import { describe, test, expect, afterEach, beforeEach } from "vitest";
import { Client } from "pg";
import { createTestDatabase, teardownTestDatabase } from "./helper";

describe("helper utils", () => {
  let client: Client;

  beforeEach(async () => {
    client = await createTestDatabase();
  });

  afterEach(async () => {
    await teardownTestDatabase(client);
  });

  test("should have a connection to test database", async () => {
    await expect(
      client
        .query<{ current_database: string }>("SELECT current_database();")
        .then(({ rows }) => rows[0].current_database)
    ).resolves.toEqual(expect.stringContaining("vitest-db-"));
  });

  test("should drop database on teardown", async () => {
    const tmpClient = await createTestDatabase();
    const tmpClientDatabase = await tmpClient
      .query<{ current_database: string }>("SELECT current_database();")
      .then(({ rows }) => rows[0].current_database);
    await teardownTestDatabase(tmpClient);

    await expect(
      client
        .query<{ datname: string }>("SELECT datname FROM pg_database;")
        .then(({ rows }) => rows.map(({ datname }) => datname))
    ).resolves.not.toContain(tmpClientDatabase);
  });
});
