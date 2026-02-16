import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiSuccessResponse, User, createApiResponse } from '@rs-tandem/shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  getUsers(): ApiSuccessResponse<User[]> {
    return createApiResponse(this.appService.getUsers());
  }
}
