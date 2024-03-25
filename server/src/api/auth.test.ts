import { describe, test, expect } from "bun:test";
import server from "../server";
import { testUsers } from "../../test.setup";

describe("auth routes", () => {
    describe("/login", () => {
        test("happy path", async () => {
            const body = {
                username: testUsers[0].username,
                password: testUsers[0].id.toString()
            };
            const res = await server.request("/api/login", {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" }
            });
            expect(res.status).toBe(200);

            const json: any = await res.json();
            expect(json.success).toBeTrue();
            expect(json.userId).toBeDefined();
            expect(json.token).toBeDefined();
            expect(json.password).toBeUndefined();
        });

        test("invalid credentials", async () => {
            const body = {
                username: testUsers[0].username,
                password: "some_wrong_password"
            };
            const res = await server.request("/api/login", {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" }
            });
            expect(res.status).toBe(401);
        });
    });

    describe("register", () => {
        test("happy path", async () => {
            const body = {
                username: "some_user",
                password: "happy1234",
                email: "someemail@email.com",
                name: "Test user"
            };
            const res = await server.request("/api/register", {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" }
            });
            expect(res.status).toBe(200);

            const json: any = await res.json();
            expect(json.success).toBeTrue();
            expect(json.userId).toBeDefined();
            expect(json.token).toBeDefined();
            expect(json.password).toBeUndefined();
        });

        const passwordTests: [string, string, number][] = [
            ["Too short", "a1234", 400],
            ["Missing number", "abcdefg", 400],
            ["Happy", "abcdefg1234", 200],
        ];

        for (const [testName, password, expectedStatusCode] of passwordTests) {
            test(`invalid password criteria: ${testName}`, async () => {
                const body = {
                    username: `user_${Date.now()}`,
                    password,
                    email: "someemail@email.com",
                    name: "Test user"
                };
                const res = await server.request("/api/register", {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: { "Content-Type": "application/json" }
                });
                expect(res.status).toBe(expectedStatusCode);
            });
        }

        test("email - invalid", async () => {
            const body = {
                username: testUsers[0].username,
                password: "asdf1234",
                email: "not an email",
                name: "Test user"
            };
            const res = await server.request("/api/register", {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" }
            });
            expect(res.status).toBe(400);
        });
    });
})
