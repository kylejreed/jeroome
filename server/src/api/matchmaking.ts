import { Hono } from "hono";
import { streamSSE } from "hono/streaming";

import { type HonoContext } from "@types";
import { requiresAuth } from "middleware/auth";
import Matchmaking from "@lib/matchmaking";

const matchmaking = new Matchmaking({ numberOfTeams: 2, playersPerTeam: 1 });
matchmaking.run();

const MatchmakingRouter = new Hono<HonoContext>().use(requiresAuth);

// Routes

// Post
MatchmakingRouter.post("/queue", async c => {
    const userId = c.var.user!.id;

    return streamSSE(c, async (stream) => {
        let queueing = true;
        matchmaking.addToQueue(userId, async match => {
            queueing = false;
            await stream.writeSSE({
                id: Date.now().toString(),
                event: 'match-found',
                data: JSON.stringify(match),
            });
            await stream.close();
        });
        stream.onAbort(() => {
            matchmaking.removeFromQueue(userId);
            queueing = false;
        });
        while (queueing) {
            const queueStatus = matchmaking.getQueueStatus(userId);
            await stream.writeSSE({
                data: JSON.stringify(queueStatus),
                event: 'queue-status',
                id: Date.now().toString()
            });

            await stream.sleep(1000);
        }
        await stream.close();
    });
});


export default MatchmakingRouter;
