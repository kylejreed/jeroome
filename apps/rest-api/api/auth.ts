import type { Context } from "../context";

export const registerUser = async ({ body, db, auth }: Context) => {
  const newUser = db.users.create({ email: (body as any).email }, true);
  if (!newUser) throw new Error("nah");
  return { token: auth.sign(newUser) };
};

export const loginUser = async ({ body, db, auth }: Context) => {
  const user = db.users.findOne({ email: (body as any).email });
  return { token: auth.sign(user) };
};

export const whoami = ({ db, user }: Context) => {
  const fullUser = db.users.findOne({ id: user!.id });
  return { user: fullUser };
};
