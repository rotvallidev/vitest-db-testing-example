import { describe, test, expect, afterEach, beforeEach } from "vitest";
import { Client } from "pg";
import { createTestDatabase, teardownTestDatabase } from "./helper";
import { createPerson } from "./person";
import { runMigrations } from "./migrations";

describe("person", () => {
  let client: Client;

  beforeEach(async () => {
    client = await createTestDatabase();
    await runMigrations(client);
  });

  afterEach(async () => {
    await teardownTestDatabase(client);
  });

  test("should create persons", async () => {
    await expect(createPerson(client, { name: "John", age: 29 })).resolves
      .toMatchInlineSnapshot(`
      {
        "age": 29,
        "id": 1,
        "name": "John",
      }
    `);

    await expect(createPerson(client, { name: "Violet", age: 35 })).resolves
      .toMatchInlineSnapshot(`
      {
        "age": 35,
        "id": 2,
        "name": "Violet",
      }
    `);
  });

  test.each([...Array(10).keys()])(
    "should create a person with age %s and id 1",
    async (age) => {
      const person = await createPerson(client, { name: "Violet", age });
      expect(person.id).toEqual(1);
      expect(person.age).toEqual(age);
    }
  );
});
