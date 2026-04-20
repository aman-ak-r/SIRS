import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    const dbUrl = process.env.DATABASE_URL || 'NOT_FOUND';
    // Mask the password for security in logs
    const maskedUrl = dbUrl.replace(/:.*@/, ':****@');
    console.log(`[PRISMA DEBUG] Attempting to connect to: ${maskedUrl}`);
    
    try {
      await this.$connect();
      console.log('[PRISMA DEBUG] Connection successful!');
    } catch (error) {
      console.error('[PRISMA DEBUG] Connection failed!');
      throw error;
    }
  }
}
