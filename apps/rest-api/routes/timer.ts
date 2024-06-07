import { Http } from "leserver";
import type { AppContext } from "context";
import { avg } from "../utils/math";
import { zip } from "../utils/array";

const TimerRouter = Http.router<AppContext, "/timers">("/timers");
TimerRouter.get("/", async ({ db }) => {
  return await db.timers.getAll();
});

TimerRouter.get("/:label", async ({ db, params }) => {
  const label = params["label"];
  const timer = !isNaN(Number(label)) ? await db.timers.findOne({ id: +label }) : await db.timers.getRunningTimer(label);

  const duration = (timer.endedAt?.getTime() ?? Date.now()) - timer.startedAt.getTime();
  return {
    ...timer,
    duration,
  };
});

TimerRouter.get("/:label/analyze", async ({ db, params }) => {
  const label = params["label"];
  const timers = await db.timers.where({ label });
  return {
    label,
    count: timers.length,
    avgDuration: avg(timers.filter((t) => !!t.endedAt).map((t) => t.endedAt!.getTime() - t.startedAt.getTime())),
    avgTimeBetween: avg(zip(timers.slice(0, timers.length - 1), timers.slice(1)).map(([t1, t2]) => t2.startedAt.getTime() - t1.startedAt.getTime())),
    timers,
  };
});

TimerRouter.post("/:label/start", async ({ db, params }) => {
  const label = params["label"];
  const id = await db.timers.start(label);
  return { id };
});

TimerRouter.post("/:label/stop", async ({ db, params }) => {
  const labelParam = params["label"];
  const id = await getExistingTimerId(labelParam, db);
  const { label, duration } = await db.timers.stop(id);
  return { label, duration };
});

TimerRouter.delete("/clear", async ({ db }) => {
  await db.timers.clear();
  return { ok: true };
});

async function getExistingTimerId(labelOrId: string, db: AppContext["db"]) {
  return !isNaN(Number(labelOrId)) ? +labelOrId : (await db.timers.getRunningTimer(labelOrId))?.id;
}

export default TimerRouter;
