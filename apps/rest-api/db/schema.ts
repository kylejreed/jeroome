import { users, type User, type UserInsert, type UserUpdate } from "./users/schema";
import { todos, type Todo, type TodoInsert, type TodoUpdate } from "./todos/schema";
import { sessions, type Session, type SessionInsert, type SessionUpdate } from "./sessions/schema";

export type { User, UserInsert, UserUpdate, Todo, TodoInsert, TodoUpdate, Session, SessionInsert, SessionUpdate };
export const schema = { users, todos, sessions };
