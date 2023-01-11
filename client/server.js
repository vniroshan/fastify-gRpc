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

fastify.get("/", (request, reply) => {
	client.getAll(null, (err, data) => {
		if (!err) {
			reply.view("./views/index.ejs", {
				todo: data.todo
			});
		}
	});
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
