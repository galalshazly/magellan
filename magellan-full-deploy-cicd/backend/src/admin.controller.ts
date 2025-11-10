
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtGuard } from './auth/jwt.guard';

@Controller('admin')
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(JwtGuard)
  @Post('item')
  async createItem(@Body() body: any) {
    const data:any = {
      nameAr: body.nameAr,
      nameEn: body.nameEn,
      basePrice: body.basePrice,
      categoryId: body.categoryId,
      descAr: body.descAr ?? null,
      descEn: body.descEn ?? null,
      imageUrl: body.imageUrl ?? null
    };
    return this.prisma.menuItem.create({ data });
  }
}
