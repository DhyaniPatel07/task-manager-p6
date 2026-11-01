const request = require("supertest");
const app = require("../server");

describe("Backend API & Integration Tests (Practical 12 CI)", () => {
  // Test P9: Cache stats endpoint works without needing a database connection
  test("GET /cache-stats returns HTTP 200 and valid cache metrics", async () => {
    const res = await request(app).get("/cache-stats");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("hits");
    expect(res.body).toHaveProperty("misses");
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("ttl_seconds", 60);
  });

  // Test P10: EventEmitter error handling does not crash the server
  test("GET /tasks/test-event-error handles error event safely", async () => {
    const res = await request(app).get("/tasks/test-event-error");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/safely handled/i);
  });

  // Test CORS and 404 handling
  test("GET /non-existent-route returns HTTP 404", async () => {
    const res = await request(app).get("/non-existent-route");

    expect(res.statusCode).toBe(404);
  });
});

