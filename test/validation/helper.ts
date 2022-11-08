import { assertThrows } from "https://deno.land/std@0.163.0/testing/asserts.ts";

export function validationTester(
  valid: unknown[],
  invalid: unknown[],
  type: string,
  validator: (input: unknown, label: string, required?: boolean) => void,
) {
  const message = `Property 'invalid' should be a ${type}.`;

  invalid.forEach((invalid) => {
    assertThrows(() => validator(invalid, "invalid"), Error, message);
  });

  invalid.forEach((invalid) => {
    assertThrows(() => validator(invalid, "invalid", false), Error, message);
  });

  valid.forEach((valid) => {
    validator(valid, "valid");
  });
}
