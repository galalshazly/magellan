
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  categories() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { index: 'asc' }
    });
  }

  itemsByCategory(categoryId?: string) {
    return this.prisma.menuItem.findMany({
      where: { isActive: true, ...(categoryId ? { categoryId } : {}) },
      include: { optionGroups: { include: { options: true } }, category: true },
      orderBy: { nameEn: 'asc' }
    });
  }

  item(id: string) {
    return this.prisma.menuItem.findUnique({
      where: { id },
      include: { optionGroups: { include: { options: true } }, category: true }
    });
  }
}
