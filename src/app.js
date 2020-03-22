const Hapi = require("@hapi/hapi");

const { routes } = require('./routes/tasks.routes');

const init = async () => {
    const server = new Hapi.Server({
        port: 4000,
        host: "localhost"
    });

    routes(server);

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

process.on("unhandledRejection", err => {
    console.log(err);
    process.exit(1);
});

module.exports = {
    init
};