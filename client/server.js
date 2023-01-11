// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });
const client = require("./client");

fastify.register(require("point-of-view"), {
  engine: {
    ejs: require("ejs"),
  },
});

// Declare a route

fastify.get("/", async (request, reply) => {
  let todo = [
    {
      id: 1,
      title: "Title 1",
      body: "Body 1",
    },
    {
      id: 2,
      title: "Title 2",
      body: "Body 2",
    },
    {
      id: 3,
      title: "Title 3",
      body: "Body 3",
    },
  ];

  try {
    await client.getAll(null, (err, data) => {
      return data.todo;
    });
    return reply.view("./views/index.ejs", { todo: todo });
  } catch {
    return res.status(400).send({ mgs: "error" });
  }
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
