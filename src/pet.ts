import type { Client } from "pg";

type Pet = {
  id: number;
  name: string;
  species: "cat" | "dog";
  owner_id: number;
};

export const createPet = async (
  client: Client,
  pet: Omit<Pet, "id">
): Promise<Pet> => {
  return client
    .query<Pet>(
      "INSERT INTO pet(name, species, owner_id) VALUES($1, $2, $3) RETURNING id, name, species, owner_id;",
      [pet.name, pet.species, pet.owner_id]
    )
    .then(({ rows }) => rows[0]);
};
