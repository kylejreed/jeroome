import type { AppContext } from "~/context";
import type { Routes } from "~/lib/types";

export default {
  "GET /": (c) => {
    const todos = c.var.db.todos.findMany();
    return c.json(todos);
  },
  "GET /:id": (c) => {
    const id = +c.req.param("id");
    const todo = c.var.db.todos.findOne({ id });
    return c.json(todo);
  },
  "POST /": async (c) => {
    const data = await c.req.json();
    const newTodo = c.var.db.todos.create(data, true);
    return c.json(newTodo);
  },
  "PUT /:id": async (c) => {
    const id = +c.req.param("id");
    const data = await c.req.json();
    const updatedTodo = c.var.db.todos.update({ id }, data, true);
    return c.json(updatedTodo);
  },
  "DELETE /:id": async (c) => {
    const id = +c.req.param("id");
    c.var.db.todos.delete({ id });
    return c.json({ success: true, id });
  },
} as Routes<AppContext>;
