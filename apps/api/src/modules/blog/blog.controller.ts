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
import { BlogService } from './blog.service';
import { parseCreateBlogPostDto, parseUpdateBlogPostDto } from './dto/blog.dto';

@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    @UseGuards(AdminAuthGuard)
    @Get('admin/all')
    findAllAdmin() {
        return this.blogService.findAllAdmin();
    }

    @UseGuards(AdminAuthGuard)
    @Get('admin/:id')
    findOneAdmin(@Param('id') id: string) {
        return this.blogService.findOneAdmin(id);
    }

    @Get()
    findAll(@Query('locale') locale = 'az') {
        return this.blogService.findAll(locale);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Query('locale') locale = 'az') {
        return this.blogService.findOne(id, locale);
    }

    @UseGuards(AdminAuthGuard)
    @Post()
    create(@Body() body: unknown) {
        const data = parseCreateBlogPostDto(body);
        return this.blogService.create(data);
    }

    @UseGuards(AdminAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() body: unknown) {
        const data = parseUpdateBlogPostDto(body);
        return this.blogService.update(id, data);
    }

    @UseGuards(AdminAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.blogService.remove(id);
    }
}
