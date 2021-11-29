import { validationTester } from "./helper.ts";
import {
  validateDate,
  validateEmail,
  validateString,
  validateTime,
  validateUUID,
  validateVarchar,
} from "../../validation/string.ts";

Deno.test("string validation", () => {
  const validString = ["test"];
  const invalidString = [1, false, {}];

  validationTester(validString, invalidString, "string", validateString);
});

// We don't need to test for other types since every function implements the "validString" function

Deno.test("date validation", () => {
  const validDates = ["2019-11-15T13:34:22.178Z"];
  const invalidDates = ["09/09/2020", "09-09/2020"];

  validationTester(validDates, invalidDates, "date", validateDate);
});

Deno.test("email validation", () => {
  const validEmails = ["email@example.com"];
  const invalidEmails = ["testing", "email.example.com"];

  validationTester(validEmails, invalidEmails, "email", validateEmail);
});

Deno.test("time validation", () => {
  const validTime = ["23:59"];
  const invalidTime = ["24:59", "23:60"];

  validationTester(validTime, invalidTime, "time", validateTime);
});

Deno.test("uuid validation", () => {
  const validUUID = ["272e1c01-237a-48e3-b88a-96a6fe9d3edb"];
  const invalidUUID = ["272e1c01-237a-48e3-b88a-96a6e9d3edb"];

  validationTester(validUUID, invalidUUID, "uuid", validateUUID);
});

Deno.test("varchar validation", () => {
  const validVarchar = [
    "Sed",
    "Lorem ipsum dolor sit amet exercitation, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, labore quis nostrud exercitation ullamco laboris sed nisi ut aliquip ex ea commodo consequat.",
  ];

  const invalidVarchar = [
    "Lo",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.",
  ];

  validationTester(validVarchar, invalidVarchar, "varchar", validateVarchar);
});
