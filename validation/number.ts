import { InvalidProperty, MissingProperty } from "../errors.ts";

export function validateNumber(
  input: unknown,
  label: string,
  required = true,
  array = false,
): boolean {
  // If the input is an array we'll check if every child is valid recursively
  if (Array.isArray(input)) {
    return input.every((value) => validateNumber(value, label, required, true));
  }

  if (typeof input === "undefined" || input === null) {
    // If the input isn't required return true and "escape" the parent function
    if (!required) {
      return false;
    }

    // Throw an error if the input is missing
    throw new MissingProperty(label);
  }

  // Transform the input into a Number or NaN for validation
  input = Number(input);

  if (Number.isNaN(input)) {
    const datatype = array ? "comma-separated list of numbers" : "number";
    throw new InvalidProperty(label, datatype);
  }

  return true;
}

export function validateTiny(
  input: unknown,
  label: string,
  required = true,
  array = false,
): boolean {
  // If the input is an array we'll check if every child is valid recursively
  if (Array.isArray(input)) {
    return input.every((value) => validateNumber(value, label, required, true));
  }

  if (!validateNumber(input, label, required)) {
    return false;
  }

  if (input as number < -128 || input as number > 127) {
    const datatype = array ? "comma-separated list of tinyint" : "tinyint";
    throw new InvalidProperty(label, datatype);
  }

  return true;
}

export function validateSmall(
  input: unknown,
  label: string,
  required = true,
  array = false,
): boolean {
  // If the input is an array we'll check if every child is valid recursively
  if (Array.isArray(input)) {
    return input.every((value) => validateNumber(value, label, required, true));
  }

  if (!validateNumber(input, label, required)) {
    return false;
  }

  if (input as number < -32768 || input as number > 32767) {
    const datatype = array ? "comma-separated list of smallint" : "smallint";
    throw new InvalidProperty(label, datatype);
  }

  return true;
}

export function validateInt(
  input: unknown,
  label: string,
  required = true,
  array = false,
): boolean {
  // If the input is an array we'll check if every child is valid recursively
  if (Array.isArray(input)) {
    return input.every((value) => validateNumber(value, label, required, true));
  }

  if (!validateNumber(input, label, required)) {
    return false;
  }

  if (input as number < -2147483648 || input as number > 2147483647) {
    const datatype = array ? "comma-separated list of int" : "int";
    throw new InvalidProperty(label, datatype);
  }

  return true;
}

export function validateBinary(
  input: unknown,
  label: string,
  required = true,
  array = false,
): boolean {
  // If the input is an array we'll check if every child is valid recursively
  if (Array.isArray(input)) {
    return input.every((value) => validateNumber(value, label, required, true));
  }

  if (!validateNumber(input, label, required)) {
    return false;
  }

  if (input !== 0 && input !== 1) {
    const datatype = array ? "comma-separated list of binary" : "binary";
    throw new InvalidProperty(label, datatype);
  }

  return true;
}

export function validateLng(
  input: unknown,
  label: string,
  required = true,
  array = false,
): boolean {
  // If the input is an array we'll check if every child is valid recursively
  if (Array.isArray(input)) {
    return input.every((value) => validateNumber(value, label, required, true));
  }

  if (!validateNumber(input, label, required)) {
    return false;
  }

  if (input as number < -180 || input as number > 180) {
    const datatype = array ? "comma-separated list of latitudes" : "latitude";
    throw new InvalidProperty(label, datatype);
  }

  return true;
}

export function validateLat(
  input: unknown,
  label: string,
  required = true,
  array = false,
): boolean {
  // If the input is an array we'll check if every child is valid recursively
  if (Array.isArray(input)) {
    return input.every((value) => validateNumber(value, label, required, true));
  }

  if (!validateNumber(input, label, required)) {
    return false;
  }

  if (input as number < -90 || input as number > 90) {
    const datatype = array ? "comma-separated list of longitudes" : "longitude";
    throw new InvalidProperty(label, datatype);
  }

  return true;
}
