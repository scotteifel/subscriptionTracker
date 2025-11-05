# Subscription Tracker

A modern web application to track and manage all your subscriptions in one place. Built with Next.js, Supabase, and Stripe.

https://subscription-tracker-iwy6.vercel.app/dashboard

## Features

- **Track Subscriptions**: Add, edit, and manage all your recurring subscriptions
- **Billing Reminders**: Get notified before your next billing date
- **Cost Visualization**: View monthly and yearly spending analytics
- **User Authentication**: Secure login with Supabase Auth
- **Premium Tier**: Unlock advanced features with Stripe-powered subscription

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Payments**: Stripe for premium subscriptions
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account ([sign up here](https://supabase.com))
- A Stripe account ([sign up here](https://stripe.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd subscriptionTracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Then edit `.env.local` with your credentials:
   - Get Supabase credentials from your [Supabase project settings](https://app.supabase.com)
   - Get Stripe keys from your [Stripe dashboard](https://dashboard.stripe.com/apikeys)

4. **Set up Supabase database**

   Run these SQL commands in your Supabase SQL editor:

   ```sql
   -- Create profiles table
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users PRIMARY KEY,
     email TEXT NOT NULL,
     full_name TEXT,
     avatar_url TEXT,
     subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
     stripe_customer_id TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
   );

   -- Create subscriptions table
   CREATE TABLE subscriptions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users NOT NULL,
     name TEXT NOT NULL,
     description TEXT,
     amount DECIMAL(10, 2) NOT NULL,
     currency TEXT DEFAULT 'USD',
     billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('weekly', 'monthly', 'quarterly', 'yearly')),
     next_billing_date DATE NOT NULL,
     category TEXT,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
   );

   -- Enable Row Level Security
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

   -- Profiles policies
   CREATE POLICY "Users can view their own profile"
     ON profiles FOR SELECT
     USING (auth.uid() = id);

   CREATE POLICY "Users can update their own profile"
     ON profiles FOR UPDATE
     USING (auth.uid() = id);

   -- Subscriptions policies
   CREATE POLICY "Users can view their own subscriptions"
     ON subscriptions FOR SELECT
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can create their own subscriptions"
     ON subscriptions FOR INSERT
     WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update their own subscriptions"
     ON subscriptions FOR UPDATE
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete their own subscriptions"
     ON subscriptions FOR DELETE
     USING (auth.uid() = user_id);

   -- Create updated_at trigger function
   CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.updated_at = TIMEZONE('utc', NOW());
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   -- Add triggers
   CREATE TRIGGER update_profiles_updated_at
     BEFORE UPDATE ON profiles
     FOR EACH ROW
     EXECUTE FUNCTION update_updated_at_column();

   CREATE TRIGGER update_subscriptions_updated_at
     BEFORE UPDATE ON subscriptions
     FOR EACH ROW
     EXECUTE FUNCTION update_updated_at_column();
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see your app.

## Project Structure

```
subscriptionTracker/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utility libraries (Supabase, Stripe)
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Helper functions
├── public/               # Static assets
└── ...config files
```

## Roadmap

- [ ] User authentication (signup/login)
- [ ] Dashboard with subscription overview
- [ ] Add/edit/delete subscriptions
- [ ] Spending analytics and charts
- [ ] Email notifications for upcoming renewals
- [ ] Stripe integration for Pro tier
- [ ] Dark mode support
- [ ] Export data to CSV
- [ ] Mobile responsive design
- [ ] PWA support

## License

MIT

## Contributing

Pull requests are welcome! Feel free to open issues for bugs or feature requests.
