import { InvalidProperty, MissingProperty } from "../errors.ts";

export function validateNumber(
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

  if (typeof input !== "number") {
    throw new InvalidProperty(label, "number");
  }

  return false;
}

export function validateTiny(
  input: unknown,
  label: string,
  optional = false,
): void {
  if (validateNumber(input, label, optional)) {
    return;
  }

  if (input as number < -128 || input as number > 127) {
    throw new InvalidProperty(label, "tinyint");
  }
}

export function validateSmall(
  input: unknown,
  label: string,
  optional = false,
): void {
  if (validateNumber(input, label, optional)) {
    return;
  }

  if (input as number < -32768 || input as number > 32767) {
    throw new InvalidProperty(label, "smallint");
  }
}

export function validateInt(
  input: unknown,
  label: string,
  optional = false,
): void {
  if (validateNumber(input, label, optional)) {
    return;
  }

  if (input as number < -2147483648 || input as number > 2147483647) {
    throw new InvalidProperty(label, "int");
  }
}
