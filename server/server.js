const PROTO_PATH = "./todo.proto";

var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

var todoProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
const todo = [
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

server.addService(todoProto.TodoService.service, {
  getAll: (_, callback) => {
    callback(null, { todo });
  },

  get: (call, callback) => {
    let item = todo.find((n) => n.id == call.request.id);

    if (item) {
      callback(null, item);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },

  insert: (call, callback) => {
    let id 
    let item = call.request;
    if(todo.length >0){
     id = todo[todo.length - 1].id + 1;
    }else{
      id = 1
    }

    item.id = id;
    todo.push(item);
    callback(null, item);
  },

  update: (call, callback) => {
    let item = todo.find((n) => n.id == call.request.id);

    if (item) {
      item.title = call.request.title;
      item.body = call.request.body;
      callback(null, item);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },

  remove: (call, callback) => {
    let item = todo.findIndex((n) => n.id == call.request.id);

    if (item != -1) {
      todo.splice(item, 1);
      callback(null, {});
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },
});

server.bind("127.0.0.1:20027", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:20027");
server.start();
