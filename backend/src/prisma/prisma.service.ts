import { Injectable, OnModuleInit } from '@nestjs/common'; //OnModuleInit lets you run logic (like connecting to a DB) when the app starts
import { PrismaClient } from 'generated/prisma'; //the generated client from Prisma that gives you access to your models
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
