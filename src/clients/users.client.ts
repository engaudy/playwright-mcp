import { APIRequestContext } from "@playwright/test";

export class UsersClient {
  constructor(private readonly request: APIRequestContext) {}

  async getAll() {
    return this.request.get("/users");
  }

  async getById(id: number) {
    return this.request.get(`/users/${id}`);
  }

  async getPosts(userId: number) {
    return this.request.get(`/users/${userId}/posts`);
  }
}
