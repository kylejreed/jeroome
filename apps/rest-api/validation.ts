import { t } from "@leserver";

export const numericId = t.Object({ id: t.Numeric() });
export const newTodo = t.Object({ text: t.String() });
export const updateTodo = t.Object({ text: t.String() });
export const todoResponse = t.Object({ id: t.Number(), text: t.String() });
export const todoListResponse = t.Array(t.Object({ id: t.Number(), text: t.String() }));
