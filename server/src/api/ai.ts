import { Hono } from "hono";
import { stream } from "hono/streaming";

import { type HonoContext } from "@types";
import llvm from "@lib/llvm/inference";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const validation = {
    chat: zValidator('json', z.object({ question: z.string() })),
};


const AIRouter = new Hono<HonoContext>();

// Routes
AIRouter.post("/chat", validation.chat, async (c) => {
    const { question } = c.req.valid("json");
    return stream(c, async (stream) => {
        for await (const output of await llvm.chatStream(question)) {
            console.log(output);
            stream.write(output.token.text);
        }
        await stream.close();
    });
});

export default AIRouter;
