import { Controller, Get, Query } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    @Get()
    findAll(@Query('locale') locale = 'az') {
        return this.blogService.findAll(locale);
    }
}
