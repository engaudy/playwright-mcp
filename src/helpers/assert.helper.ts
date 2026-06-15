import { APIResponse, expect } from "@playwright/test";

export async function expectOk(response: APIResponse) {
  expect(response.ok()).toBeTruthy();
  return response;
}

export async function expectStatus(response: APIResponse, status: number) {
  expect(response.status()).toBe(status);
  return response;
}

export async function parseJson<T>(response: APIResponse): Promise<T> {
  return response.json() as Promise<T>;
}
