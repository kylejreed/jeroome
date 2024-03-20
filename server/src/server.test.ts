import { describe, test, expect } from "bun:test";
import server from "./server";

describe("server", () => {
    test("username/password login", async () => {
        const res = await server.request("/api/login", {
            method: "POST",
            body: JSON.stringify({ username: "admin", password: "admin1234!@#$" }),
            headers: { "Content-Type": "application/json" }
        });
        expect(res.status).toBe(200);

        const json: any = await res.json();
        expect(json.success).toBeTrue();
        expect(json.userId).toBeDefined();
        expect(json.token).toBeDefined();
    });
})
