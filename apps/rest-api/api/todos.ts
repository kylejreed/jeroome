import type { AppContext } from "../context";
import type { Context } from "@leserver/http";

export const getAllTodos = ({ db }: Context<AppContext>) => {
  return db.todos.findMany();
};

export const getTodoById = ({ db, params }: Context<AppContext>) => {
  const id = params["id"];
  return db.todos.findOne({ id });
};

export const createTodo = async ({ db, body }: Context<AppContext>) => {
  return db.todos.create(body as any, true);
};

export const updateTodo = async ({ db, body, params }: Context<AppContext>) => {
  const id = params["id"];
  return db.todos.update({ id }, body as any, true);
};

export const deleteTodo = ({ db, params }: Context<AppContext>) => {
  const id = params["id"];
  db.todos.delete({ id });
  return { success: true, id };
};
