import { validationTester } from "./helper.ts";
import {
  validateInt,
  validateNumber,
  validateSmall,
  validateTiny,
} from "../../validation/number.ts";

Deno.test("number validation", () => {
  const validNumber = [1];
  const invalidNumber = ["test", false, {}];

  validationTester(validNumber, invalidNumber, "number", validateNumber);
});

// We don't need to test for other types since every function implements the "validString" function

Deno.test("tinyint validation", () => {
  const validTiny = [-128, 127];
  const invalidTiny = [-129, 128];

  validationTester(validTiny, invalidTiny, "tinyint", validateTiny);
});

Deno.test("smallint validation", () => {
  const validSmall = [-32768, 32767];
  const invalidSmall = [-32769, 32768];

  validationTester(validSmall, invalidSmall, "smallint", validateSmall);
});

Deno.test("int validation", () => {
  const validInt = [-2147483648, 2147483647];
  const invalidInt = [-2147483649, 2147483648];

  validationTester(validInt, invalidInt, "int", validateInt);
});
