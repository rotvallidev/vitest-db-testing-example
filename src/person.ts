import type { Client } from "pg";

export type Person = {
  id: number;
  name: string;
  age: number;
};

export const createPerson = async (
  client: Client,
  person: Omit<Person, "id">
): Promise<Person> => {
  return client
    .query<Person>(
      "INSERT INTO person(name, age) VALUES($1, $2) RETURNING id, name, age;",
      [person.name, person.age]
    )
    .then(({ rows }) => rows[0]);
};
