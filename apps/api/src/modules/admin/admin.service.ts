import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async login(email: string, pass: string) {
        const admin = await this.prisma.admin.findUnique({ where: { email } });
        if (admin && admin.password === pass) { // Simple check for now
            return { success: true, message: 'Logged in' };
        }
        return { success: false, message: 'Invalid credentials' };
    }
}
