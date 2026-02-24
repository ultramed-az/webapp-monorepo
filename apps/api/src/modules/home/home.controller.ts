import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthGuard } from '../admin/admin-auth.guard';
import { HomeService } from './home.service';
import { parseCreateHomeStatDto, parseUpdateHomeStatDto } from './dto/home.dto';

@Controller('home')
export class HomeController {
    constructor(private readonly homeService: HomeService) { }

    @Get('stats')
    getStats() {
        return this.homeService.getStats();
    }

    @UseGuards(AdminAuthGuard)
    @Post('stats')
    createStat(@Body() body: unknown) {
        const data = parseCreateHomeStatDto(body);
        return this.homeService.createStat(data);
    }

    @UseGuards(AdminAuthGuard)
    @Put('stats/:id')
    updateStat(@Param('id') id: string, @Body() body: unknown) {
        const data = parseUpdateHomeStatDto(body);
        return this.homeService.updateStat(id, data);
    }

    @UseGuards(AdminAuthGuard)
    @Delete('stats/:id')
    removeStat(@Param('id') id: string) {
        return this.homeService.removeStat(id);
    }
}
