import Elysia, { StatusMap } from "elysia";
import { color } from "../utils/cli";

export const logger = () => {
  return new Elysia({ name: "leserver/logger" })
    .state("startTime", 0)
    .onRequest((c) => {
      c.store = { ...c.store, startTime: performance.now() };
    })
    .onResponse({ as: "global" }, ({ request, set, store }) => {
      const method = request.method;
      const path = new URL(request.url).pathname;
      const ms = performance.now() - store.startTime;
      logResponseTime(method, path, ms, set.status);
    });
};

function logResponseTime(method: string, path: string, ms: number, status?: number | keyof StatusMap) {
  console.log(`${colorResponseStatus(status)} ${colorMethod(method)} ${path} ${ms.toFixed(2)}ms`);
}

function colorResponseStatus(status?: number | keyof StatusMap) {
  if (!status) return color.red("N/A");
  const s = typeof status === "number" ? status : StatusMap[status];
  if (s.toString().startsWith("2")) {
    return color.green(s);
  } else if (s.toString().startsWith("5")) {
    return color.red(s);
  } else {
    return color.yellow(s);
  }
}

function colorMethod(method: string): string {
  switch (method) {
    case "GET":
      return color.white("GET");
    case "POST":
      return color.yellow("POST");
    case "PUT":
      return color.blue("PUT");
    case "DELETE":
      return color.red("DELETE");
    case "PATCH":
      return color.green("PATCH");
    default:
      return method;
  }
}
