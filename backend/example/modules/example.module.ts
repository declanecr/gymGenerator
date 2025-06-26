import { Module } from '@nestjs/common';
import { ExampleController } from '../controllers/example.controller';
import { ExampleService } from '../services/example.service';

@Module({
  controllers: [ExampleController],
  providers: [ExampleService],
})
export class ExampleModule {}
