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

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_details ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid()::text = id::text OR auth.jwt()->>'email' = email);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid()::text = id::text OR auth.jwt()->>'email' = email);

-- Service role can do everything (for edge functions)
CREATE POLICY "Service role has full access to profiles"
  ON profiles
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- RLS Policies for payment_details table
-- Users can view their own payment details
CREATE POLICY "Users can view own payment details"
  ON payment_details
  FOR SELECT
  USING (auth.jwt()->>'email' = email);

-- Service role can do everything (for edge functions)
CREATE POLICY "Service role has full access to payment_details"
  ON payment_details
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Add comments for documentation
COMMENT ON TABLE profiles IS 'User profiles with payment information';
COMMENT ON TABLE payment_details IS 'Payment transaction details';
COMMENT ON COLUMN profiles.payment_status IS 'Status: pending, completed, failed';
COMMENT ON COLUMN payment_details.metadata IS 'Contains payer and payee details from PayPal';
