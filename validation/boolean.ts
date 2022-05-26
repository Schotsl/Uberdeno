import { InvalidProperty, MissingProperty } from "../errors.ts";

export function validateBoolean(
  input: unknown,
  label: string,
  required = true,
  array = false,
): boolean {
  // If the input is an array we'll check if every child is valid recursively
  if (Array.isArray(input)) {
    return input.every((value) =>
      validateBoolean(value, label, required, true)
    );
  }

  if (typeof input === "undefined" || input === null) {
    // If the input isn't required return true and "escape" the parent function
    if (!required) {
      return false;
    }

    // Throw an error if the input is missing
    throw new MissingProperty(label);
  }

  if (typeof input !== "boolean") {
    const datatype = array ? "comma-separated list of booleans" : "boolean";
    throw new InvalidProperty(label, datatype);
  }

  return true;
}
