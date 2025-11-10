
# Magellan — نشر كامل أونلاين

## ما الذي بداخل الحزمة؟
- `backend/` NestJS + Prisma + JWT + OTP + Tap + FCM
- `mobile/` تطبيق Flutter (نبني منه نسخة الويب)
- `web/` إعدادات Firebase Hosting (يُبنى من mobile)
- `deploy-all.sh` سكربت موحّد للنشر الأونلاين

## طريقة الاستخدام (Codespaces أو Replit)
1) ارفع هذا المجلد إلى GitHub وافتح Codespace.
2) شغّل: `bash deploy-all.sh`
3) اتبع التعليمات للطرفين:
   - **Koyeb** لنشر الـ backend (من GitHub)
   - **Firebase Hosting** لنشر نسخة الويب

## ملاحظات
- أنشئ قاعدة بيانات PostgreSQL مجانية من Neon.tech واحصل على `DATABASE_URL`.
- ضع متغيرات البيئة في Koyeb (DATABASE_URL, JWT_SECRET, TAP_SECRET, TAP_MERCHANT_ID, TAP_WEBHOOK_URL, TAP_REDIRECT_URL).
- بعد نشر الـ backend على Koyeb، حدّث `API_BASE` و `SOCKET_BASE` ثم أعد نشر الويب.


## تفعيل CI/CD على GitHub
بعد رفع المشروع على GitHub:
1) Settings → Secrets and variables → Actions → New repository secret
2) أضف:
   - `KOYEB_API_TOKEN`  ← من لوحة Koyeb → API Tokens
   - `FIREBASE_SERVICE_ACCOUNT` ← محتوى JSON لمفتاح حساب خدمة Firebase (يفضّل لمشروع magellan)

> ملاحظة: ملفات CI/CD تعمل تلقائيًا عند أي `push` على `main`.
