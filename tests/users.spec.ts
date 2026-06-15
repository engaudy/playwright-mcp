import { test, expect } from "@playwright/test";
import { UsersClient } from "../src/clients/users.client";
import { expectOk, parseJson } from "../src/helpers/assert.helper";
import type { User, Post } from "../src/types/api.types";

test.describe("Users API", () => {
  let users: UsersClient;

  test.beforeEach(({ request }) => {
    users = new UsersClient(request);
  });

  test("GET /users returns 10 users", async () => {
    const response = await users.getAll();
    await expectOk(response);

    const body = await parseJson<User[]>(response);
    expect(body).toHaveLength(10);
    expect(body[0]).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      email: expect.any(String),
    });
  });

  test("GET /users/:id returns a single user with full shape", async () => {
    const response = await users.getById(1);
    await expectOk(response);

    const body = await parseJson<User>(response);
    expect(body).toMatchObject({
      id: 1,
      name: expect.any(String),
      username: expect.any(String),
      email: expect.stringContaining("@"),
      address: {
        street: expect.any(String),
        city: expect.any(String),
        zipcode: expect.any(String),
      },
    });
  });

  test("GET /users/:id/posts returns posts belonging to user", async () => {
    const userId = 1;
    const response = await users.getPosts(userId);
    await expectOk(response);

    const body = await parseJson<Post[]>(response);
    expect(body.length).toBeGreaterThan(0);
    expect(body.every((p) => p.userId === userId)).toBeTruthy();
  });
});
