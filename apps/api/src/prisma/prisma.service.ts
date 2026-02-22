import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@ultramed/database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger(PrismaService.name);
    private static readonly MAX_CONNECT_RETRIES = 30;
    private static readonly RETRY_DELAY_MS = 2000;

    async onModuleInit() {
        for (let attempt = 1; attempt <= PrismaService.MAX_CONNECT_RETRIES; attempt++) {
            try {
                await this.$connect();

                if (attempt > 1) {
                    this.logger.log(`Database connection established on attempt ${attempt}.`);
                }

                return;
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);

                if (attempt === PrismaService.MAX_CONNECT_RETRIES) {
                    this.logger.error(
                        `Database connection failed after ${PrismaService.MAX_CONNECT_RETRIES} attempts.`,
                    );
                    throw error;
                }

                this.logger.warn(
                    `Database connection attempt ${attempt}/${PrismaService.MAX_CONNECT_RETRIES} failed: ${message}. Retrying in ${PrismaService.RETRY_DELAY_MS}ms...`,
                );
                await new Promise((resolve) => setTimeout(resolve, PrismaService.RETRY_DELAY_MS));
            }
        }
    }
}
