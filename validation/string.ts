import { InvalidProperty, MissingProperty } from "../errors.ts";

export function validateString(
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

  if (typeof input !== "string") {
    throw new InvalidProperty(label, "string");
  }

  return false;
}

export function validateTimestamp(
  input: unknown,
  label: string,
  optional = false,
): void {
  if (validateString(input, label, optional)) {
    return;
  }

  // Copied and modified RegExp from https://stackoverflow.com/a/58878432/9615506
  const regex = new RegExp(
    /^[0-9]{4}-((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(02)-(0[1-9]|[12][0-9]))T(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9])\.[0-9]{3}Z$/,
  );

  if (!regex.test(input as string)) {
    throw new InvalidProperty(label, "date");
  }
}

export function validateUUID(
  input: unknown,
  label: string,
  optional = false,
): void {
  if (validateString(input, label, optional)) {
    return;
  }

  // Copied RegExp from https://melvingeorge.me/blog/check-if-string-valid-uuid-regex-javascript
  const regex = new RegExp(
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,
  );

  if (!regex.test(input as string)) {
    throw new InvalidProperty(label, "uuid");
  }
}

// Check length

export function validateEmail(
  input: unknown,
  label: string,
  optional = false,
): void {
  if (validateString(input, label, optional)) {
    return;
  }

  // Copied RegExp from https://deno.land/x/validasaur@v0.15.0/src/rules/is_email.ts
  const regex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
  );

  if (!regex.test(input as string)) {
    throw new InvalidProperty(label, "email");
  }
}

export function validateTime(
  input: unknown,
  label: string,
  optional = false,
): void {
  if (validateString(input, label, optional)) {
    return;
  }

  // Copied RegExp from https://stackoverflow.com/a/5563222/9615506
  const regex = new RegExp(
    /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/,
  );

  if (!regex.test(input as string)) {
    throw new InvalidProperty(label, "time");
  }
}

export function validateVarchar(
  input: unknown,
  label: string,
  optional = false,
): void {
  if (validateString(input, label, optional)) {
    return;
  }

  const string = input as string;
  const length = string.length;

  if (length < 3 || length > 255) {
    throw new InvalidProperty(label, "varchar");
  }
}

export function validateIPv64(
  input: unknown,
  label: string,
  optional = false,
): void {
  if (validateString(input, label, optional)) {
    return;
  }

  // Copied RegExp from https://www.regextester.com/104038
  const regex = new RegExp(
    /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/,
  );

  if (!regex.test(input as string)) {
    throw new InvalidProperty(label, "IPv64");
  }
}
