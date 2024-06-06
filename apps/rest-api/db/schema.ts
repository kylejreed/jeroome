import { users, type User, type UserInsert, type UserUpdate } from "./users/schema";
import { todos, type Todo, type TodoInsert, type TodoUpdate } from "./todos/schema";
import { sessions, type Session, type SessionInsert, type SessionUpdate } from "./sessions/schema";
import { timer, type Timer, type TimerInsert, type TimerUpdate } from "./timer/schema";

export type { User, UserInsert, UserUpdate, Todo, TodoInsert, TodoUpdate, Session, SessionInsert, SessionUpdate, Timer, TimerInsert, TimerUpdate };
export const schema = { users, todos, sessions, timer };
