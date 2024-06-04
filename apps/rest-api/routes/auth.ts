import { Http } from "@leserver";
import type { AppContext } from "../context";

const AuthRouter = Http.router<AppContext, "">("");

AuthRouter.get(
  "/asdf",
  ({ user, session }) => {
    return { user, session };
  },
  {},
);

AuthRouter.get(
  "/whoami",
  ({ user }) => {
    return user;
  },
  {
    beforeHandle: ({ user, error }) => !user && error(403),
    detail: { tags: ["auth"] },
  },
);

AuthRouter.post(
  "/login",
  async ({ db, auth, body }) => {
    const user = await db.users.findOne({ email: (body as any).email });
    return { token: auth.sign(user) };
  },
  {
    detail: { tags: ["auth"] },
  },
);

AuthRouter.post(
  "/register",
  async ({ db, auth, body }) => {
    const newUser = await db.users.create({ email: (body as any).email }, true);
    return { token: auth.sign(newUser) };
  },
  {
    detail: { tags: ["auth"] },
  },
);

export default AuthRouter;
