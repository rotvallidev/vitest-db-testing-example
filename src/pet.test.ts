import { describe, test, expect, afterEach, beforeEach } from "vitest";
import { Client } from "pg";
import { createTestDatabase, teardownTestDatabase } from "./helper";
import { runMigrations } from "./migrations";
import { createPet } from "./pet";

describe("pet", () => {
  let client: Client;

  beforeEach(async () => {
    client = await createTestDatabase();
    await runMigrations(client);

    // Seed person data
    await client.query(
      `INSERT INTO person(name, age) VALUES ('John', 29), ('Violet', 35), ('James', 41), ('Daisy', 55), ('V', 23);`
    );
  });

  afterEach(async () => {
    await teardownTestDatabase(client);
  });

  test("should create a pet", async () => {
    await expect(
      createPet(client, { name: "Nibbles", species: "cat", owner_id: 5 })
    ).resolves.toMatchInlineSnapshot(`
      {
        "id": 1,
        "name": "Nibbles",
        "owner_id": 5,
        "species": "cat",
      }
    `);
  });
});
