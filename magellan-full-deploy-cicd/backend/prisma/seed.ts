
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Admin
  const admin = await prisma.user.upsert({
    where: { phone: '0000000000' },
    update: {},
    create: {
      phone: '0000000000', name: 'Admin', role: 'ADMIN', passwordHash: 'dev-admin',
      email: 'admin@magellan.local',
    },
  });

  // Categories
  const cats = await prisma.$transaction([
    prisma.category.create({ data: { nameAr: 'سوشي', nameEn: 'Sushi', index: 1 }}),
    prisma.category.create({ data: { nameAr: 'نودلز', nameEn: 'Noodles', index: 2 }}),
    prisma.category.create({ data: { nameAr: 'أطباق خاصة', nameEn: 'Specials', index: 3 }}),
  ]);

  // Items
  const [sushi, noodles, specials] = cats;

  const dragonRoll = await prisma.menuItem.create({
    data: {
      nameAr: 'دراغون رول', nameEn: 'Dragon Roll',
      descAr: 'لفائف أفوكادو وآناغو بصلصة خاصة', descEn: 'Avocado & eel with special sauce',
      imageUrl: 'https://picsum.photos/seed/dragon/800/600',
      basePrice: 4800, categoryId: sushi.id,
      optionGroups: {
        create: [
          {
            titleAr: 'اختيار الحجم', titleEn: 'Size',
            isRequired: true, minSelect: 1, maxSelect: 1,
            options: { create: [
              { nameAr: '8 قطع', nameEn: '8 pcs', priceDelta: 0 },
              { nameAr: '12 قطعة', nameEn: '12 pcs', priceDelta: 2000 },
            ]}
          },
          {
            titleAr: 'إضافات', titleEn: 'Extras',
            isRequired: false, minSelect: 0, maxSelect: 3,
            options: { create: [
              { nameAr: 'واسايبي', nameEn: 'Wasabi', priceDelta: 200 },
              { nameAr: 'زنجبيل', nameEn: 'Ginger', priceDelta: 150 },
              { nameAr: 'صلصة سبايسي', nameEn: 'Spicy sauce', priceDelta: 300 },
            ]}
          }
        ]
      }
    }
  });

  const beefNoodles = await prisma.menuItem.create({
    data: {
      nameAr: 'نودلز باللحم', nameEn: 'Beef Noodles',
      descAr: 'نودلز صيني مع شرائح لحم وخضار', descEn: 'Chinese noodles with beef & veggies',
      imageUrl: 'https://picsum.photos/seed/noodles/800/600',
      basePrice: 3600, categoryId: noodles.id,
      optionGroups: {
        create: [{
          titleAr: 'درجة الحارة', titleEn: 'Spice level', isRequired: true, minSelect: 1, maxSelect: 1,
          options: { create: [
            { nameAr: 'عادي', nameEn: 'Mild', priceDelta: 0 },
            { nameAr: 'حار', nameEn: 'Spicy', priceDelta: 0 },
            { nameAr: 'حار جدًا', nameEn: 'Extra Spicy', priceDelta: 0 },
          ]}
        }]
      }
    }
  });

  await prisma.menuItem.create({
    data: {
      nameAr: 'كراب مميز', nameEn: 'Signature Crab',
      descAr: 'طبق السلطعون الخاص بمطعم ماجلان', descEn: 'Magellan signature crab dish',
      imageUrl: 'https://picsum.photos/seed/crab/800/600',
      basePrice: 7400, categoryId: specials.id,
    }
  });

  // Coupons
  await prisma.coupon.create({ data: { code: 'WELCOME10', percentage: 10, isActive: true }});
  await prisma.coupon.create({ data: { code: 'FIX20', fixedAmount: 2000, minSubtotal: 8000, isActive: true }});

  console.log('Seed completed.');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
