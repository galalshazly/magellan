
import { Controller, Get, Query, Param } from '@nestjs/common';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('categories')
  categories() { return this.menuService.categories(); }

  @Get('items')
  items(@Query('categoryId') categoryId?: string) {
    return this.menuService.itemsByCategory(categoryId);
  }

  @Get('items/:id')
  item(@Param('id') id: string) { return this.menuService.item(id); }
}
