# Nectar — Online Groceries App

Built on the exact stack from the provided stack doc:

- **Frontend:** Expo (React Native + React Native Web) + NativeWind + Zustand + Expo Router
- **Backend:** Node.js + Express (REST API)
- **Database:** Supabase (PostgreSQL) + Prisma ORM
- **Auth:** Supabase Auth
- **AI Agents:** Gemini API (Smart Reorder Agent, Shopping Assistant Agent) with tool calling
- **Payments:** Stripe + JazzCash/EasyPaisa + Cash on Delivery/Pickup

## Screens included (all 21, matching your screenshots)
Splash, Onboarding, Login, Sign Up, Country Select, Phone Number, OTP Verification,
Home (Shop tab), Explore, Search, Filter, Product Details, Category listing (Beverages etc.),
Cart, Favourite, Checkout, Order Accepted, Account, Account Details, Location, Error/404.

## Project layout
```
grocery-app/
  app/                  # Expo Router screens (file-based routing)
    (auth)/             # login, signup, country-select, phone-number, verification
    (tabs)/             # Shop, Explore, Cart, Favourite, Account — bottom tab bar
    product/[id].tsx
    category/[id].tsx
    checkout.tsx, order-accepted.tsx, filter.tsx, search.tsx,
    account-details.tsx, location.tsx, +not-found.tsx
  components/           # Button, ProductCard, CategoryCard, CartItem, QuantitySelector, Header
  store/                # Zustand stores: cart, favourites, auth
  data/                 # mock products & categories (swap for API calls once backend is live)
  constants/colors.ts    # design tokens (primary green #53B175, etc.)
  backend/
    src/
      routes/           # products, orders, auth, agent (Gemini AI)
      lib/               # prisma.ts, supabase.ts, claude.ts (AI agent + tools)
    prisma/schema.prisma # products, orders, order_items, store_info,
                          # user_interactions, style_profiles, chat_conversations, profiles
```

## Running the app (frontend)
```bash
cd grocery-app
npm install
npx expo start          # scan the QR code with Expo Go, or press w for web
```

## Running the backend
```bash
cd grocery-app/backend
npm install
cp .env.example .env    # fill in DATABASE_URL, SUPABASE_*, GEMINI_API_KEY, STRIPE_SECRET_KEY
npx prisma migrate dev  # creates tables in Supabase Postgres
npm run dev             # starts Express on http://localhost:4000
```

Then in the frontend `.env`, point `EXPO_PUBLIC_API_URL` at your backend URL and replace the
mock arrays in `data/products.ts` / `data/categories.ts` with real fetch calls to `/products`.

## What's wired up vs. what needs your keys
- ✅ All 21 screens, navigation, cart/favourite/auth state (Zustand), UI matching the design.
- ✅ Backend REST API structure, Prisma schema (matches your "Core Tables" list exactly),
  Gemini agent with the 4 tools from your doc (`get_style_profile`, `search_products`,
  `add_to_cart`, `get_product_details`), Stripe PaymentIntent creation.
- ⚠️ Needs your keys to actually run: Supabase project (DB + Auth), Gemini API key,
  Stripe secret key. Until then the app runs fully on mock data — every screen works,
  cart/checkout flow works end-to-end locally.

## Deployment (per your doc)
- Backend → Railway (or Render), one deployment serving both mobile + web.
- Web build → `npx expo export --platform web` → deploy static output to Vercel.
- Mobile builds (no store submission yet) → Expo EAS:
  - `eas build --platform android --profile preview` → installable `.apk`
  - `eas build --platform ios --profile preview` → `.ipa` for simulator/TestFlight

## Notes
- Product/category images currently use Unsplash placeholder URLs — swap in your real
  product photography or Supabase Storage URLs before shipping.
- The design system (colors, spacing, typography in `tailwind.config.js` and
  `constants/colors.ts`) matches the Figma file's green/white "Nectar" look — adjust there
  if you want to fine-tune anything after comparing side-by-side with the screenshots.
