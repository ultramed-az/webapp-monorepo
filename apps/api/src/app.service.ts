import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHealth() {
    return {
      status: 'ok',
      component: 'ultramed-api',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }
}
