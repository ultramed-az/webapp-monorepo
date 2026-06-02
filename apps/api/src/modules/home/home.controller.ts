import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthGuard } from '../admin/admin-auth.guard';
import { HomeService } from './home.service';
import {
    parseCreateAnnouncementDto,
    parseCreateCheckupPackageDto,
    parseCreateHomeStatDto,
    parseUpdateAnnouncementDto,
    parseUpdateCheckupPackageDto,
    parseUpdateHomeStatDto,
} from './dto/home.dto';

@Controller('home')
export class HomeController {
    constructor(private readonly homeService: HomeService) { }

    @Get('stats')
    getStats() {
        return this.homeService.getStats();
    }

    @Get('announcements')
    getAnnouncements(@Query('locale') locale = 'az') {
        return this.homeService.getAnnouncements(locale);
    }

    @UseGuards(AdminAuthGuard)
    @Get('announcements/admin/all')
    findAllAnnouncementsAdmin() {
        return this.homeService.findAllAnnouncementsAdmin();
    }

    @UseGuards(AdminAuthGuard)
    @Post('announcements')
    createAnnouncement(@Body() body: unknown) {
        const data = parseCreateAnnouncementDto(body);
        return this.homeService.createAnnouncement(data);
    }

    @UseGuards(AdminAuthGuard)
    @Put('announcements/:id')
    updateAnnouncement(@Param('id') id: string, @Body() body: unknown) {
        const data = parseUpdateAnnouncementDto(body);
        return this.homeService.updateAnnouncement(id, data);
    }

    @UseGuards(AdminAuthGuard)
    @Delete('announcements/:id')
    removeAnnouncement(@Param('id') id: string) {
        return this.homeService.removeAnnouncement(id);
    }

    @Get('checkup-packages')
    getCheckupPackages(@Query('locale') locale = 'az') {
        return this.homeService.getCheckupPackages(locale);
    }

    @UseGuards(AdminAuthGuard)
    @Get('checkup-packages/admin/all')
    findAllCheckupPackagesAdmin() {
        return this.homeService.findAllCheckupPackagesAdmin();
    }

    @UseGuards(AdminAuthGuard)
    @Post('checkup-packages')
    createCheckupPackage(@Body() body: unknown) {
        const data = parseCreateCheckupPackageDto(body);
        return this.homeService.createCheckupPackage(data);
    }

    @UseGuards(AdminAuthGuard)
    @Put('checkup-packages/:id')
    updateCheckupPackage(@Param('id') id: string, @Body() body: unknown) {
        const data = parseUpdateCheckupPackageDto(body);
        return this.homeService.updateCheckupPackage(id, data);
    }

    @UseGuards(AdminAuthGuard)
    @Delete('checkup-packages/:id')
    removeCheckupPackage(@Param('id') id: string) {
        return this.homeService.removeCheckupPackage(id);
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
