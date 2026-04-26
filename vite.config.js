# FA Coffee POS — دليل النشر الكامل

## الملفات المطلوبة
```
fa-coffee-pos/
├── src/
│   ├── components/
│   │   ├── Login.jsx
│   │   └── POS.jsx
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── supabaseClient.js
├── index.html
├── package.json
├── vite.config.js
├── .env.example
├── .gitignore
└── supabase-schema.sql
```

---

## الخطوة 1 — GitHub

1. اذهب إلى https://github.com وسجّل دخول
2. اضغط **New repository**
3. اسم المستودع: `fa-coffee-pos`
4. اتركه **Private** ← مهم
5. اضغط **Create repository**
6. على جهازك، افتح Terminal وشغّل:

```bash
# إذا ما عندك git، ثبّته أولاً
# ثم نفّذ:
cd fa-coffee-pos
git init
git add .
git commit -m "FA Coffee POS - initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/fa-coffee-pos.git
git push -u origin main
```

> **بديل أسهل:** استخدم GitHub Desktop أو ارفع الملفات مباشرة من الموقع بـ "Upload files"

---

## الخطوة 2 — Supabase (قاعدة البيانات)

### 2.1 إنشاء المشروع
1. اذهب إلى https://supabase.com
2. اضغط **Start your project** ← سجّل بـ GitHub
3. اضغط **New project**
4. اسم المشروع: `fa-coffee-pos`
5. **اختر كلمة مرور قاعدة البيانات** واحفظها
6. Region: **Middle East (Bahrain)** — الأقرب لكم
7. اضغط **Create new project** وانتظر دقيقتين

### 2.2 إنشاء جدول الطلبات
1. من الشريط الجانبي اضغط **SQL Editor**
2. اضغط **New query**
3. انسخ كامل محتوى ملف `supabase-schema.sql` والصقه
4. اضغط **Run** ← لازم تشوف "Success"

### 2.3 إنشاء حسابات الكاشيرين
1. من الشريط الجانبي اضغط **Authentication**
2. اضغط **Users** ثم **Add user**
3. أضف كل كاشير:
   - Email: `cashier1@facoffee.com`
   - Password: كلمة مرور قوية
4. كرّر لكل فرد في الفريق

### 2.4 الحصول على مفاتيح API
1. من الشريط الجانبي اضغط **Project Settings**
2. اضغط **API**
3. انسخ:
   - **Project URL** ← `VITE_SUPABASE_URL`
   - **anon public** ← `VITE_SUPABASE_ANON_KEY`

---

## الخطوة 3 — Vercel (النشر)

### 3.1 ربط المشروع
1. اذهب إلى https://vercel.com
2. سجّل دخول بـ GitHub
3. اضغط **Add New Project**
4. اختر مستودع `fa-coffee-pos`
5. اضغط **Import**

### 3.2 إضافة متغيرات البيئة (مهم جداً)
قبل الضغط على Deploy، اضغط على **Environment Variables** وأضف:

| اسم المتغير | القيمة |
|---|---|
| `VITE_SUPABASE_URL` | الرابط من Supabase |
| `VITE_SUPABASE_ANON_KEY` | المفتاح من Supabase |

### 3.3 النشر
1. اضغط **Deploy**
2. انتظر دقيقة واحدة
3. ستحصل على رابط مثل: `fa-coffee-pos.vercel.app`

---

## النتيجة
- الرابط يفتح صفحة تسجيل الدخول
- كل كاشير يدخل بإيميل وكلمة مرور
- الطلبات تُحفظ في Supabase وتظهر لكل الأجهزة فوراً (Real-time)
- كل تعديل على الكود → push لـ GitHub → Vercel يحدّث الرابط تلقائياً

---

## استكشاف الأخطاء

| المشكلة | الحل |
|---|---|
| "Invalid API key" | تحقق من VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في Vercel |
| الطلبات ما تحفظ | تحقق من تشغيل SQL Schema وتفعيل RLS |
| صفحة بيضاء | افتح Developer Tools وشوف Console |
