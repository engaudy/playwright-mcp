import { test, expect } from "@playwright/test";
import { PostsClient } from "../src/clients/posts.client";
import { expectOk, expectStatus, parseJson } from "../src/helpers/assert.helper";
import type { Post } from "../src/types/api.types";

test.describe("Posts API", () => {
  let posts: PostsClient;

  test.beforeEach(({ request }) => {
    posts = new PostsClient(request);
  });

  test("GET /posts returns 100 posts", async () => {
    const response = await posts.getAll();
    await expectOk(response);

    const body = await parseJson<Post[]>(response);
    expect(body).toHaveLength(100);
    expect(body[0]).toMatchObject({
      userId: expect.any(Number),
      id: expect.any(Number),
      title: expect.any(String),
      body: expect.any(String),
    });
  });

  test("GET /posts/:id returns a single post", async () => {
    const response = await posts.getById(1);
    await expectOk(response);

    const body = await parseJson<Post>(response);
    expect(body.id).toBe(1);
    expect(body.userId).toBeDefined();
    expect(body.title).toBeDefined();
  });

  test("GET /posts/:id/comments returns comments for a post", async () => {
    const response = await posts.getComments(1);
    await expectOk(response);

    const body = await parseJson<{ postId: number }[]>(response);
    expect(body.length).toBeGreaterThan(0);
    expect(body.every((c) => c.postId === 1)).toBeTruthy();
  });

  test("POST /posts creates a new post", async () => {
    const payload = { userId: 1, title: "Test Post", body: "Test body content" };

    const response = await posts.create(payload);
    await expectStatus(response, 201);

    const body = await parseJson<Post>(response);
    expect(body.id).toBeDefined();
    expect(body.title).toBe(payload.title);
    expect(body.body).toBe(payload.body);
    expect(body.userId).toBe(payload.userId);
  });

  test("PATCH /posts/:id updates post fields", async () => {
    const response = await posts.update(1, { title: "Updated Title" });
    await expectOk(response);

    const body = await parseJson<Post>(response);
    expect(body.title).toBe("Updated Title");
    expect(body.id).toBe(1);
  });

  test("PUT /posts/:id replaces a post", async () => {
    const payload = { userId: 1, title: "Replaced Title", body: "Replaced body" };

    const response = await posts.replace(1, payload);
    await expectOk(response);

    const body = await parseJson<Post>(response);
    expect(body.title).toBe(payload.title);
    expect(body.body).toBe(payload.body);
  });

  test("DELETE /posts/:id returns 200", async () => {
    const response = await posts.delete(1);
    await expectOk(response);

    const body = await parseJson<Record<string, never>>(response);
    expect(body).toEqual({});
  });

  test("GET /posts/:id with invalid id returns 404", async () => {
    const response = await posts.getById(99999);
    await expectStatus(response, 404);
  });
});
