-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  country_code TEXT NOT NULL,
  promo_code TEXT,
  transaction_id TEXT,
  order_id TEXT,
  time_of_payment TIMESTAMPTZ,
  metadata JSONB,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payment_details table
CREATE TABLE IF NOT EXISTS payment_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  time_of_payment TIMESTAMPTZ NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes on profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_payment_status ON profiles(payment_status);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

-- Create indexes on payment_details table
CREATE INDEX IF NOT EXISTS idx_payment_details_email ON payment_details(email);
CREATE INDEX IF NOT EXISTS idx_payment_details_transaction_id ON payment_details(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_details_order_id ON payment_details(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_details_created_at ON payment_details(created_at);

-- Add updated_at trigger for profiles table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- DISABLE Row Level Security (RLS) - Open access for development
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE payment_details DISABLE ROW LEVEL SECURITY;

-- Add comments for documentation
COMMENT ON TABLE profiles IS 'User profiles with payment information';
COMMENT ON TABLE payment_details IS 'Payment transaction details';
COMMENT ON COLUMN profiles.payment_status IS 'Status: pending, completed, failed';
COMMENT ON COLUMN payment_details.metadata IS 'Contains payer and payee details from PayPal';
