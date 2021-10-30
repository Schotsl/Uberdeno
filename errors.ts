export class UberdenoError extends Error {
  public statusError = 500;
}

export class MissingResource extends UberdenoError {
  public statusError = 404;

  constructor(resource: string) {
    super(`This '${resource}' was not found.`);
  }
}

export class DuplicateResource extends UberdenoError {
  public statusError = 409;

  constructor(resource: string) {
    super(`This ${resource} already exists.`);
  }
}

export class InvalidProperty extends UberdenoError {
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

export class MissingProperty extends UberdenoError {
  public statusError = 400;

  constructor(
    property: string,
  ) {
    super(`Property '${property}' is missing.`);
  }
}

export class MissingBody extends UberdenoError {
  public statusError = 400;

  constructor() {
    super("Request is missing a valid JSON body.");
  }
}

export class InvalidBody extends UberdenoError {
  public statusError = 400;

  constructor() {
    super("Request has a invalid JSON body.");
  }
}

export class InvalidHeader extends UberdenoError {
  public statusError = 415;

  constructor() {
    super("Request isn't using the 'Content-Type: application/json' header.");
  }
}
