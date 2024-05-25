import { createClient } from "redis";

let client;
async function initializeRedis() {
  try {
    client = await createClient();
    await client.connect();
    return client; 
  } catch (error) {
    console.error(error);
  }
}

initializeRedis()
  .then()
  .catch((e) => console.log(e));

