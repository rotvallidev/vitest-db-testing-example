import { Client } from "pg";

export const runMigrations = async (client: Client): Promise<void> => {
  await client.query(
    `
        CREATE TABLE person (id SERIAL PRIMARY KEY, name TEXT NOT NULL, age INTEGER NOT NULL); 
        CREATE TABLE pet (id SERIAL PRIMARY KEY, name TEXT NOT NULL, species TEXT NOT NULL, owner_id INTEGER REFERENCES person (id));
    `
  );
};
