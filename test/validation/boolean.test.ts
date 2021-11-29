import { validationTester } from "./helper.ts";
import { validateBoolean } from "../../validation/boolean.ts";

Deno.test("boolean validation", () => {
  const validBoolean = [true, false];
  const invalidBoolean = ["false", 1, 0, {}];

  validationTester(validBoolean, invalidBoolean, "boolean", validateBoolean);
});