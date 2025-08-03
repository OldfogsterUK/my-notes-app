const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "NotesDB";
const containerId = "Notes";

let client;
let container;

module.exports = async function (context, req) {
  if (!client) {
    client = new CosmosClient({ endpoint, key });
    const database = client.database(databaseId);
    container = database.container(containerId);
  }

  if (req.method === "POST") {
    const note = req.body;

    if (!note || !note.content) {
      context.res = {
        status: 400,
        body: "Note content is required",
      };
      return;
    }

    // Assign id and createdAt if not present
    note.id = note.id || new Date().getTime().toString();
    note.createdAt = new Date().toISOString();

    try {
      const { resource: createdItem } = await container.items.create(note);
      context.res = {
        status: 201,
        body: createdItem,
      };
    } catch (error) {
      context.log.error("Error saving note", error);
      context.res = {
        status: 500,
        body: "Error saving note",
      };
    }
  } else {
    context.res = {
      status: 405,
      body: "Method not allowed",
    };
  }
};