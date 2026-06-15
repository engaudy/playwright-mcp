import { APIRequestContext } from "@playwright/test";
import type { Post, CreatePostPayload, UpdatePostPayload } from "../types/api.types";

export class PostsClient {
  constructor(private readonly request: APIRequestContext) {}

  async getAll() {
    return this.request.get("/posts");
  }

  async getById(id: number) {
    return this.request.get(`/posts/${id}`);
  }

  async getComments(postId: number) {
    return this.request.get(`/posts/${postId}/comments`);
  }

  async create(payload: CreatePostPayload) {
    return this.request.post("/posts", { data: payload });
  }

  async update(id: number, payload: UpdatePostPayload) {
    return this.request.patch(`/posts/${id}`, { data: payload });
  }

  async replace(id: number, payload: CreatePostPayload) {
    return this.request.put(`/posts/${id}`, { data: payload });
  }

  async delete(id: number) {
    return this.request.delete(`/posts/${id}`);
  }
}
