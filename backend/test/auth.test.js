import assert from "node:assert/strict";
import test from "node:test";
import { authenticate, authorizeRoles, createAuthToken } from "../middleware/auth.js";

process.env.JWT_SECRET = "test-secret-for-auth-middleware";

function createResponse() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

function createUser(role = "student") {
  return {
    _id: { toString: () => "507f1f77bcf86cd799439011" },
    name: "Test User",
    email: "test@example.com",
    role,
  };
}

test("authenticate accepts a valid signed token", () => {
  const token = createAuthToken(createUser());
  const req = { get: () => `Bearer ${token}` };
  const res = createResponse();
  let nextCalled = false;

  authenticate(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(req.user.id, "507f1f77bcf86cd799439011");
  assert.equal(req.user.role, "student");
});

test("authenticate rejects a missing token", () => {
  const req = { get: () => undefined };
  const res = createResponse();

  authenticate(req, res, () => assert.fail("next should not be called"));

  assert.equal(res.statusCode, 401);
});

test("authorizeRoles rejects users without the required role", () => {
  const req = { user: { role: "student" } };
  const res = createResponse();

  authorizeRoles("admin")(req, res, () => assert.fail("next should not be called"));

  assert.equal(res.statusCode, 403);
});
