module.exports = async function (context, req) {
  const note = req.body;

  // TEMP: Just return the note (we'll connect to Cosmos DB later)
  context.res = {
    status: 200,
    body: {
      message: "Note received!",
      note: note,
    },
  };