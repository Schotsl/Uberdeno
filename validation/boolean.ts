import { InvalidProperty, MissingProperty } from "../errors.ts";

export function validateBoolean(
  input: unknown,
  label: string,
  required = true,
): boolean {
  if (typeof input === "undefined" || input === null) {
    // If the input isn't required return true and "escape" the parent function
    if (!required) {
      return true;
    }

    // Throw an error if the input is missing
    throw new MissingProperty(label);
  }

  if (typeof input !== "boolean") {
    throw new InvalidProperty(label, "boolean");
  }

  return false;
}
