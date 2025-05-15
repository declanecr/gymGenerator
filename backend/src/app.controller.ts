import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {} //tells Nest to inject an instance of AppService into the controller

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
