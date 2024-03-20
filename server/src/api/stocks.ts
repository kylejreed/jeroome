import { Hono } from "hono";
import { streamSSE } from "hono/streaming";

import { type HonoContext } from "@types";
import stocks from "@lib/stocks";


const StocksRouter = new Hono<HonoContext>();

// Routes
StocksRouter.get("/:ticker/price", async (c) => {
    const ticker = c.req.param("ticker");
    const priceInfo = await stocks.getLatestPrice(ticker);
    return c.json(priceInfo);
});

StocksRouter.get("/:ticker/price/watch", async (c) => {
    const ticker = c.req.param("ticker");
    return streamSSE(c, async (stream) => {
        while (true) {
            const priceInfo = await stocks.getLatestPrice(ticker);
            await stream.writeSSE({
                data: JSON.stringify(priceInfo),
                event: 'price-update',
                id: Date.now().toString()
            });
            await stream.sleep(1000);
        }
    });
});


export default StocksRouter;
