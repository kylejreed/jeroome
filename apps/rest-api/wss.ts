import { t } from "leserver";
import server from "./server";

server.ws("/", {
  body: t.Object({
    type: t.String(),
    message: t.Any(),
  }),
  message: (ws, msg) => {
    switch (msg.type) {
      case "ping":
        ws.send({ type: "pong" });
    }
  },
});
