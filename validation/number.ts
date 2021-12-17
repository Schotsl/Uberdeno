import { InvalidProperty, MissingProperty } from "../errors.ts";

export function validateNumber(
  input: unknown,
  label: string,
  required = true,
): boolean {
  if (typeof input === "undefined" || input === null) {
    // If the input isn't required return true and "escape" the parent function
    if (!required) {
      return false;
    }

    // Throw an error if the input is missing
    throw new MissingProperty(label);
  }

  if (typeof input !== "number") {
    throw new InvalidProperty(label, "number");
  }

  return true;
}

export function validateTiny(
  input: unknown,
  label: string,
  required = true,
): boolean {
  if (!validateNumber(input, label, required)) {
    return false;
  }

  if (input as number < -128 || input as number > 127) {
    throw new InvalidProperty(label, "tinyint");
  }

  return true;
}

export function validateSmall(
  input: unknown,
  label: string,
  required = true,
): boolean {
  if (!validateNumber(input, label, required)) {
    return false;
  }

  if (input as number < -32768 || input as number > 32767) {
    throw new InvalidProperty(label, "smallint");
  }

  return true;
}

export function validateInt(
  input: unknown,
  label: string,
  required = true,
): boolean {
  if (!validateNumber(input, label, required)) {
    return false;
  }

  if (input as number < -2147483648 || input as number > 2147483647) {
    throw new InvalidProperty(label, "int");
  }

  return true;
}

export function validateBinary(
  input: unknown,
  label: string,
  required = true,
): boolean {
  if (!validateNumber(input, label, required)) {
    return false;
  }

  if (input !== 0 && input !== 1) {
    throw new InvalidProperty(label, "binary");
  }

  return true;
}
