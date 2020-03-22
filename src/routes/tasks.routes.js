const Joi = require("@hapi/joi");
const Task = require("../models/Task");

const routesTask = {};

routesTask.routes = (server) => {
    server.route({
        method: "POST",
        path: "/tasks",
        options: {
            validate: {
                payload: Joi.object({
                    name: Joi.string()
                        .min(5)
                        .required(),
                    description: Joi.string()
                }),
                failAction: (request, h, error) => {
                    return error.isJoi
                        ? h.response(error.details[0]).takeover()
                        : h.response(error).takeover();
                }
            }
        },
        handler: async (request, h) => {
            try {
                const task = new Task(request.payload);
                const taskSaved = await task.save();
                return h.response(taskSaved);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    server.route({
        method: "GET",
        path: "/tasks",
        handler: async (request, h) => {
            try {
                const tasks = await Task.find();
                return h.response(tasks);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    server.route({
        method: "GET",
        path: "/tasks/{id}",
        handler: async (request, h) => {
            try {
                const task = await Task.findById(request.params.id);
                if (task) {
                    return h.response(task);
                }
                return h.response().code(404);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    server.route({
        method: "PUT",
        path: "/tasks/{id}",
        options: {
            validate: {
                payload: Joi.object({
                    name: Joi.string().min(5).optional(),
                    description: Joi.string().optional()
                }),
                failAction: (request, h, error) => {
                    return error.isJoi
                        ? h.response(error.details[0]).takeover()
                        : h.response(error).takeover();
                }
            }
        },
        handler: async (request, h) => {
            try {
                const updatedTask = await Task.findByIdAndUpdate(
                    request.params.id,
                    request.payload,
                    {
                        new: true
                    }
                );
                if (updatedTask) {
                    return h.response(updatedTask);
                }
                return h.response().code(404);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });

    server.route({
        method: "DELETE",
        path: "/tasks/{id}",
        handler: async (request, h) => {
            try {
                const deletedTask = await Task.findByIdAndDelete(request.params.id);
                if (deletedTask) {
                    return h.response(deletedTask);
                }
                return h.response().code(404);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });
}

module.exports = routesTask;