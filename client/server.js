// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });
const client = require("./client");
fastify.register(require("@fastify/formbody"));

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
      console.log(data.todo);
      return data.todo;
    });
    return reply.view("./views/index.ejs", { todo: todo });
  } catch {
    return reply.status(400).send({ mgs: "error" });
  }
});

fastify.post("/add", async (request, reply) => {
  let newTodo = {
    title: request.body.title,
    body: request.body.body,
  };
  client.insert(newTodo, (err, data) => {
    if (err) throw err;
    console.log("Todo created successfully", data);
  });
  return reply.redirect("/");
});

fastify.post("/update", async (request, reply) => {
  const updateTodo = {
    id: request.body.id,
    title: request.body.title,
    body: request.body.body,
  };

  client.update(updateTodo, (err, data) => {
    if (err) throw err;
    console.log("Todo updated successfully", data);
  });
  return reply.redirect("/");
});

fastify.post("/delete", async (request, reply) => {
  client.remove({ id: request.body.id }, (err, _) => {
    if (err) throw err;
    console.log("Todo removed successfully");
  });
  return reply.redirect("/");
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
