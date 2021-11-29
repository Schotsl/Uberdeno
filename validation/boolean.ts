import { InvalidProperty, MissingProperty } from "../errors.ts";

export function validateBoolean(
  input: unknown,
  label: string,
  optional = false,
): boolean {
  if (typeof input === "undefined" || input === null) {
    // If the input isn't required return true and "escape" the parent function
    if (optional) {
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
