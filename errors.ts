export class MissingResource extends Error {
  public statusError = 404;

  constructor(resource: string) {
    super(`This '${resource}' was not found.`);
  }
}

export class DuplicateResource extends Error {
  public statusError = 409;

  constructor(resource: string) {
    super(`This ${resource} already exists.`);
  }
}

export class InvalidProperty extends Error {
  public statusError = 400;

  constructor(
    property: string,
    datatype:
      | "date"
      | "time"
      | "uuidv4"
      | "email"
      | "length"
      | "number"
      | "string"
      | "boolean"
      | "missing"
      | "password"
      | "extension",
  ) {
    super(`Property '${property}' should be a ${datatype}.`);
  }
}

export class MissingProperty extends Error {
  public statusError = 400;

  constructor(
    property: string,
  ) {
    super(`Property '${property}' is missing.`);
  }
}

export class MissingBody extends Error {
  public statusError = 400;

  constructor() {
    super("Request is missing a valid JSON body.");
  }
}

export class InvalidBody extends Error {
  public statusError = 400;

  constructor() {
    super("Request has a invalid JSON body.");
  }
}

export class InvalidHeader extends Error {
  public statusError = 415;

  constructor() {
    super("Request isn't using the 'Content-Type: application/json' header.");
  }
}
