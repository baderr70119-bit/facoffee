-- ════════════════════════════════════════════════════════════
-- FA COFFEE POS — Supabase Database Setup
-- شغّل هذا الكود كاملاً في Supabase → SQL Editor
-- ════════════════════════════════════════════════════════════

-- 1. جدول الطلبات
CREATE TABLE IF NOT EXISTS orders (
  id            BIGSERIAL PRIMARY KEY,
  external_id   BIGINT UNIQUE,          -- الرقم المُولَّد من الـ POS
  num           INT,                     -- رقم الطلب التسلسلي
  status        TEXT NOT NULL,           -- تم / نشط / ملغى / معلق / مرتجع
  amount        NUMERIC(10,2) DEFAULT 0,
  discount      NUMERIC(10,2) DEFAULT 0,
  tax           NUMERIC(10,2) DEFAULT 0,
  pay_method    TEXT,
  order_type    TEXT DEFAULT 'محلي',
  items         JSONB DEFAULT '[]',      -- [{name, qty, price}]
  customer      TEXT,
  notes         TEXT,
  cancel_reason TEXT,
  return_reason TEXT,
  original_id   BIGINT,                 -- للمرتجعات: id الطلب الأصلي
  cashier_id    UUID REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Index للبحث السريع
CREATE INDEX IF NOT EXISTS idx_orders_status     ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_cashier    ON orders(cashier_id);
CREATE INDEX IF NOT EXISTS idx_orders_created    ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_external   ON orders(external_id);

-- 3. Row Level Security — كل المستخدمين المسجلين يشوفون جميع الطلبات
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- قراءة: أي مستخدم مسجّل يشوف كل الطلبات
CREATE POLICY "authenticated can read orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

-- كتابة: أي مستخدم مسجّل يضيف طلب
CREATE POLICY "authenticated can insert orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- تعديل: أي مستخدم مسجّل يعدّل الطلبات (تعميد، إغلاق)
CREATE POLICY "authenticated can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true);

-- 4. دالة تحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 5. Enable Realtime (شغّل هذا بعد إنشاء الجدول)
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- ════════════════════════════════════════════════════════════
-- تحقق من إنشاء الجدول بشكل صحيح:
-- SELECT * FROM orders LIMIT 5;
-- ════════════════════════════════════════════════════════════
