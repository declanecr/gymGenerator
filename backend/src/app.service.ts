import { Injectable } from '@nestjs/common';

//basically saying to NestJS, this class is something that can be injected into other
// classes using Nest's 'Dependency Injection system'
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
