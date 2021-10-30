import { Client } from "https://deno.land/x/mysql@v2.10.1/mod.ts";
import { Request, Response } from "https://deno.land/x/oak@v9.0.1/mod.ts";

import { InvalidProperty } from "../errors.ts";
import { validateNumber, validateVarchar, validateEmail } from "../validation.ts";

import UserEntity from "../entity/UserEntity.ts";
import UserRepository from "../repository/UserRepository.ts";
import InterfaceController from "./InterfaceController.ts";

export default class UserController implements InterfaceController {
  private userRepository: UserRepository;

  constructor(mysqlClient: Client) {
    this.userRepository = new UserRepository(mysqlClient);
  }

  async getCollection(
    { request, response }: { request: Request; response: Response },
  ) {
    let limit = request.url.searchParams.get(`limit`)
      ? request.url.searchParams.get(`limit`)
      : 5;

    let offset = request.url.searchParams.get(`offset`)
      ? request.url.searchParams.get(`offset`)
      : 0;

    if (isNaN(+limit!)) throw new InvalidProperty("limit", "number");
    if (isNaN(+offset!)) throw new InvalidProperty("offset", "number");

    limit = Number(limit);
    offset = Number(offset);

    response.status = 200;
    response.body = await this.userRepository.getCollection(
      offset,
      limit,
    );
  }

  async removeObject(
    { params, response }: {
      request: Request;
      params: { uuid: string };
      response: Response;
    },
  ) {
    await this.userRepository.removeObject(params.uuid);

    response.status = 204;
  }

  async updateObject(
    { request, params, response }: {
      request: Request;
      params: { uuid: string };
      response: Response;
    },
  ) {
    const body = await request.body();
    const value = await body.value;

    validateEmail(value.email, "email", true);
    validateNumber(value.discord, "discord", true);
    validateVarchar(value.lastname, "lastname", true);
    validateVarchar(value.firstname, "firstname", true);

    const user = new UserEntity(params.uuid);
    Object.assign(user, value);

    response.body = await this.userRepository.updateObject(user);
    response.status = 200;
  }

  async addObject(
    { request, response }: { request: Request; response: Response },
  ) {
    const body = await request.body();
    const value = await body.value;

    delete value.uuid;

    validateEmail(value.email, "email");
    validateNumber(value.discord, "discord", true);
    validateVarchar(value.lastname, "lastname");
    validateVarchar(value.firstname, "firstname");

    const user = new UserEntity();
    Object.assign(user, value);

    response.body = await this.userRepository.addObject(user);
    response.status = 200;
  }
}
