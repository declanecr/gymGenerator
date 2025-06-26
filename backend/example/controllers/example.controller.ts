import { Controller, Get, Post } from '@nestjs/common';
import { ExampleService } from '../services/example.service';

@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get()
  getAll() {
    // TODO: implement route logic
    return this.exampleService.findAll();
  }

  @Post()
  create() {
    // TODO: implement route logic
    return this.exampleService.create();
  }
}
