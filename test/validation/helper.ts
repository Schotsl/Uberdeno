import { assertThrows } from "https://deno.land/std@0.116.0/testing/asserts.ts";

export function validationTester(
  valid: unknown[],
  invalid: unknown[],
  type: string,
  validator: (input: unknown, label: string, optional?: boolean) => void,
) {
  const message = `Property 'invalid' should be a ${type}.`;

  // Make sure invalid values throw an error
  invalid.forEach((invalid) => {
    assertThrows(() => validator(invalid, "invalid"), Error, message);
  });

  // Make sure invalid values don't throw an error if they're optional
  invalid.forEach((invalid) => {
    assertThrows(() => validator(invalid, "invalid", true), Error, message);
  });

  // Make sure valid values don't throw an error
  valid.forEach((valid) => {
    validator(valid, "valid");
  });
}
