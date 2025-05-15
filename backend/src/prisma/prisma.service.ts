import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common'; //OnModuleInit lets you run logic (like connecting to a DB) when the app starts
import { PrismaClient } from '@prisma/client'; //the generated client from Prisma that gives you access to your models

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await this.$connect();
  }
  //imported 'INestApplication', which is the official type definition for the object returned by NestFactory.create()
  // i.e. the main app bootstrapped in main.ts
  enableShutdownHooks(app: INestApplication) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
