import { Http, t } from "@leserver";
import type { AppContext } from "context";

const v = {
  uploadBody: t.Object({
    document: t.File(),
  }),
};

const DocumentsRouter = Http.router<AppContext, "/documents">("/documents");

DocumentsRouter.get("/:file", async ({ params, uploads }) => {
  return uploads.get(params.file);
});

DocumentsRouter.post(
  "/",
  async ({ request, body, uploads }) => {
    const file = body.document;
    await uploads.write(file.name, file);
    const publicPath = new URL(request.url);
    publicPath.pathname = `documents/${file.name}`;

    return { ok: true, path: publicPath.toString() };
  },
  { body: v.uploadBody },
);

DocumentsRouter.delete("/:file", async ({ params, uploads }) => {
  await uploads.remove(params.file);
  return { ok: true };
});

export default DocumentsRouter;
