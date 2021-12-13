import { validationTester } from "./helper.ts";
import {
  validateEmail,
  validateString,
  validateTime,
  validateTimestamp,
  validateUUID,
  validateVarchar,
  validateIPv64,
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

  validationTester(validDates, invalidDates, "date", validateTimestamp);
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

Deno.test("UUID validation", () => {
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

Deno.test("IPv64 validation", () => {
  const validIPv64 = ["FE80:0000:0000:0000:0202:B3FF:FE1E:8329", "192.167.255.255"];
  const invalidIPv64 = ["1200:0000:AB00:1234:O000:2552:7777:1313", "192.167.255.288"];

  validationTester(validIPv64, invalidIPv64, "IPv64", validateIPv64);
});
