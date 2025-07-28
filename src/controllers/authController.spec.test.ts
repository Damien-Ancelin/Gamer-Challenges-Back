import { describe, it, expect, vi } from "vitest";
import { Request, Response } from "express";

import { authController } from "./authController";
import { loginSchema, registerSchema } from "validations/userValidations";

// ? Register test cases
const registerValidTestCases = [
  {
    firstname: "Jason",
    lastname: "Toison",
    email: "testdeur@mail.io",
    username: "Jasd_Toi",
    password: "Test_1234",
  },
  {
    lastname: "Dupont",
    firstname: "Jean",
    email: "testdeurune@mail.io",
    username: "testuser2",
    password: "Test_1234",
  },
];

const registerInvalidTestCases = [
  {
    lastname: "Dupont",
    firstname: "Jean",
    email: "invalid-email",
    username: "testuser2",
    password: "short",
  },
  {
    lastname: "Dupont",
    firstname: "Jean",
    email: "",
    username: "testuser2",
    password: "validPassword123",
  },
];

// ? Register valid test cases
describe("Register Tests", () => {
  for (const testCase of registerValidTestCases) {
    it(`should register a user with valid data: ${testCase.email}`, async () => {
      // Mock request for Express
      // This is a mock request object that simulates an Express request
      const req = {
        body: {
          lastname: testCase.lastname,
          firstname: testCase.firstname,
          email: testCase.email,
          username: testCase.username,
          password: testCase.password,
        },
      } as Request;

      // Mock response for Express
      // This is a mock response object that simulates an Express response
      // status own also mockReturnThis for chaining and return res object
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        cookie: vi.fn(),
      } as unknown as Response;

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Utilisateur créé avec succès",
      });
    });
  }

  // ? Register invalid test cases
  for (const testCase of registerInvalidTestCases) {
    it(`should not register a user with invalid data: ${testCase.email}`, async () => {
      const req = {
        body: {
          lastname: testCase.lastname,
          firstname: testCase.firstname,
          email: testCase.email,
          username: testCase.username,
          password: testCase.password,
        },
      } as Request;

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        cookie: vi.fn(),
      } as unknown as Response;

      const { error } = registerSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      const validationErrors = error?.details.map((ErrorDetail) => ({
        errorMessage: ErrorDetail.message,
      }));

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Une erreur est survenue lors de l'inscription",
        validationErrors: validationErrors,
      });
    });
  }
});

// ? Test login cases
const loginValidTestCases = [
  {
    email: "testdeur@mail.io",
    password: "Test_1234",
    expectedStatus: 200,
    expectedMessage: "Utilisateur connecté avec succès",
  },
  {
    email: "testdeurune@mail.io",
    password: "Test_1234",
    expectedStatus: 200,
    expectedMessage: "Utilisateur connecté avec succès",
  },
];

const loginInvalidTestCases = [
  {
    email: "invalid-email",
    password: "short",
  },
  {
    email: "",
    password: "validPassword123",
  },
  {
    email: "pif@mail.io",
    password: "validPassword123",
  },
];

describe("Auth Controller Tests", () => {
  for (const testCase of loginValidTestCases) {
    it(`should login a user with valid data: ${testCase.email}`, async () => {
      const req = {
        body: {
          email: testCase.email,
          password: testCase.password,
        },
      } as Request;

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        cookie: vi.fn(),
      } as unknown as Response;

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(testCase.expectedStatus);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: testCase.expectedMessage,
      });
    });
  }

  for (const testCase of loginInvalidTestCases) {
    it(`should not login a user with invalid data: ${testCase.email}`, async () => {
      const req = {
        body: {
          email: testCase.email,
          password: testCase.password,
        },
      } as Request;

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        cookie: vi.fn(),
      } as unknown as Response;

      const { error } = loginSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      const validationErrors = error?.details.map((ErrorDetail) => ({
        errorMessage: ErrorDetail.message,
      }));

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Couple email/mot de passe incorrect",
        validationErrors: validationErrors,
      });
    });
  }
});
