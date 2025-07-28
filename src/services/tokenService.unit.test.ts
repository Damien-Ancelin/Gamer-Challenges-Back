import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { describe, it, expect } from "vitest";
import { v4 as uuidv4 } from 'uuid';
import debug from "debug";

import { tokenService } from "services/tokenService";
import type { AccessTokenPayload } from "../@types/index.d.ts";

const tokenServiceTestDebug = debug("test:tokenServiceTest");

const validTestCases: AccessTokenPayload[] = [
  {
    id: 1,
    role: "user",
    username: "testuser",
    jti: uuidv4(),
  },
  {
    id: 2,
    role: "admin",
    username: "adminuser",
    jti: uuidv4(),
  },
]

const invalidTestCases: AccessTokenPayload[] = [
  {
    id: 1,
    role: "user",
    username: "testuser",
    jti: "invalid-jti",
  },
  {
    id: 2,
    role: "admin",
    username: "adminuser",
    jti: "invalid-jti",
  },
  {
    id: 3,
    role: "user",
    username: "guestuser",
    jti: "", // Empty JTI
  },
  {
    id: 4,
    role: "admin",
    username: "moduser",
    // @ts-expect-error : volontary test of a non-string JTI
    jti: 123, // Non-string JTI
  },
]

tokenServiceTestDebug("1. Starting generateAccessToken tests");

describe("Token Service generateAccessToken", () => {
  for (const testCase of validTestCases){
    tokenServiceTestDebug(`⚙ Testing valid payload: ${JSON.stringify(testCase)}`);
    it('should generate a valid access token for a valid payload', () => {
      tokenServiceTestDebug(`Testing valid payload: ${JSON.stringify(testCase)}`);
      const token = tokenService.generateAccessToken(testCase);
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    })
  }

  for (const testCase of invalidTestCases){
    tokenServiceTestDebug(`⚙ Testing invalid payload: ${JSON.stringify(testCase)}`);
    it('should throw an error for an invalid payload', () => {
      tokenServiceTestDebug(`Testing invalid payload: ${JSON.stringify(testCase)}`);
      expect(() => tokenService.generateAccessToken(testCase)).toThrow("Token generation failed");
    })
  }
});

tokenServiceTestDebug("2. Starting verifyAccessToken tests");

describe("Token Service verifyAccessToken", () => {
  for (const testCase of validTestCases){
    tokenServiceTestDebug(`⚙ Testing valid token: ${JSON.stringify(testCase)}`);
    it('should verify a valid access token', () => {
      const token = tokenService.generateAccessToken(testCase);
      const decoded = tokenService.verifyAccessToken(token);
      expect(decoded).toBeDefined();
      expect(decoded).toHaveProperty("id", testCase.id);
      expect(decoded).toHaveProperty("role", testCase.role);
      expect(decoded).toHaveProperty("username", testCase.username);
      expect(decoded).toHaveProperty("jti", testCase.jti);
    })
  }

  for (const testCase of invalidTestCases){
    tokenServiceTestDebug(`⚙ Testing invalid token: ${JSON.stringify(testCase)}`);
    it('should return null for an invalid access token', () => {
      const token = "invalid-token";
      const decoded = tokenService.verifyAccessToken(token);
      expect(decoded).toBeNull();
    })
  }
});
