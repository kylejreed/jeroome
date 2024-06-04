import { Http, t } from "@leserver";
import type { AppContext } from "context";

const v = {
  numericId: t.Object({ id: t.Numeric() }),
  newTodo: t.Object({ text: t.String() }),
  updateTodo: t.Object({ text: t.String() }),
  todoResponse: t.Object({ id: t.Number(), text: t.String() }),
  todoListResponse: t.Array(t.Object({ id: t.Number(), text: t.String() })),
};

const TodoRouter = Http.router<AppContext, "/todos">("/todos");
TodoRouter.get(
  "/",
  async ({ db }) => {
    return await db.todos.findMany();
  },
  {
    response: v.todoListResponse,
    detail: { tags: ["todos"] },
  },
);

TodoRouter.get(
  "/:id",
  async ({ params, db }) => {
    return await db.todos.findOne({ id: params["id"] });
  },
  {
    params: v.numericId,
    response: v.todoResponse,
    detail: { tags: ["todos"] },
  },
);

TodoRouter.post(
  "/",
  async ({ body, user, db }) => {
    return await db.todos.create(body);
  },
  {
    body: v.newTodo,
    detail: { tags: ["todos"] },
  },
);

TodoRouter.put(
  "/:id",
  async ({ params, body, user, db }) => {
    return await db.todos.update({ id: params["id"] }, body, true);
  },
  {
    params: v.numericId,
    body: v.updateTodo,
    response: v.todoResponse,
    detail: { tags: ["todos"] },
  },
);

TodoRouter.delete(
  "/:id",
  async ({ params, db }) => {
    await db.todos.delete({ id: params["id"] });
    return { success: true, id: params["id"] };
  },
  {
    params: v.numericId,
    detail: { tags: ["todos"] },
  },
);

export default TodoRouter;
