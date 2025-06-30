# Hilla - Personalized Nutrition for Maternal Health

A comprehensive React Native app built with Expo Router that provides personalized nutrition guidance throughout the maternal journey - from conception to postpartum.

## 🌟 Features

### Frontend
- **Onboarding Flow**: Complete 13-step personalized setup
- **Home Dashboard**: Real-time nutrition tracking with customizable metrics
- **Meal Logging**: Photo capture, barcode scanning, and voice input
- **Analytics**: Detailed nutrition trends and AI-powered insights
- **Profile Management**: Journey timeline and goal tracking
- **Settings**: Customizable nutrition tracking preferences

### Backend API
- **RESTful API**: Complete server-side functionality with Expo Router API routes
- **User Management**: Registration, authentication, and profile management
- **Meal Tracking**: Log meals with detailed nutrient information
- **Daily Logs**: Automatic calculation of daily nutrition totals
- **Analytics**: Advanced nutrition analytics with trend analysis
- **Tracking Settings**: Customizable metric preferences

## 🏗️ Architecture

### Frontend Stack
- **React Native** with Expo SDK 52
- **Expo Router** for file-based navigation
- **TypeScript** for type safety
- **AsyncStorage** for local data persistence
- **Lucide React Native** for icons
- **React Native SVG** for charts and graphics

### Backend Stack
- **Supabase** for database and authentication
- **PostgreSQL** for data storage
- **Expo Router API Routes** for additional serverless functions
- **TypeScript** for API type safety
- **RESTful API design** with proper error handling
- **Comprehensive data models** for nutrition tracking
- **Row Level Security (RLS)** for data protection

## 📁 Project Structure

```
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Tab navigation
│   │   ├── index.tsx            # Home screen
│   │   ├── log.tsx              # Meal logging
│   │   ├── trends.tsx           # Analytics
│   │   └── profile.tsx          # User profile
│   ├── api/                     # Backend API routes
│   │   ├── users+api.ts         # User management
│   │   ├── meals+api.ts         # Meal tracking
│   │   ├── daily-logs+api.ts    # Daily nutrition logs
│   │   ├── tracking-settings+api.ts # User preferences
│   │   ├── analytics+api.ts     # Nutrition analytics
│   │   └── health+api.ts        # Health check
│   ├── onboarding/              # Onboarding flow
│   ├── detailed-analytics.tsx   # Advanced analytics
│   ├── nutrition-tracking-settings.tsx # Settings
│   └── _layout.tsx              # Root layout
├── components/                   # Reusable components
│   ├── onboarding/              # Onboarding components
│   ├── NutritionRing.tsx        # Progress ring
│   ├── TrendChart.tsx           # Chart component
│   └── ...                      # Other components
├── lib/                         # Utilities and services
│   ├── database.ts              # Database operations
│   └── api-client.ts            # API client
├── types/                       # TypeScript definitions
│   └── api.ts                   # API types
└── hooks/                       # Custom hooks
    └── useOnboardingState.ts    # Onboarding state management
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- Supabase account
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hilla-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Set up Supabase**
   - Click "Connect to Supabase" in the top right of Bolt
   - Follow the setup instructions to create your database
   - The migrations will automatically create the required tables

5. **Open the app**
   - Web: Open http://localhost:8081 in your browser
   - Mobile: Use Expo Go app to scan the QR code

## 🔧 API Documentation

### Supabase Integration

The app uses Supabase for:
- **Database**: PostgreSQL with automatic migrations
- **Authentication**: Built-in user management
- **Real-time**: Live data updates
- **Security**: Row Level Security (RLS) policies

#### Environment Variables
Required in your `.env` file:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Base URL
- Development: `http://localhost:8081`
- Production: Configure in `app.json`

### Authentication
Uses Supabase Auth with email/password authentication and JWT tokens.

### Endpoints

#### Supabase Endpoints (Recommended)
- `GET /api/supabase-users?id={userId}` - Get user by ID
- `POST /api/supabase-users` - Create new user
- `PUT /api/supabase-users` - Update user
- `GET /api/supabase-meals?userId={userId}` - Get user's meals
- `POST /api/supabase-meals` - Log new meal
- `GET /api/supabase-daily-logs?userId={userId}&date={date}` - Get daily log
- `GET /api/supabase-tracking-settings?userId={userId}` - Get tracking settings
- `PUT /api/supabase-tracking-settings` - Update tracking settings

#### Users
- `GET /api/users?id={userId}` - Get user by ID
- `GET /api/users?email={email}` - Get user by email
- `POST /api/users` - Create new user
- `PUT /api/users` - Update user
- `DELETE /api/users?id={userId}` - Delete user

#### Meals
- `GET /api/meals?userId={userId}` - Get user's meals
- `GET /api/meals?userId={userId}&date={date}` - Get meals for specific date
- `POST /api/meals` - Log new meal
- `PUT /api/meals` - Update meal
- `DELETE /api/meals?id={mealId}` - Delete meal

#### Daily Logs
- `GET /api/daily-logs?userId={userId}&date={date}` - Get daily log
- `POST /api/daily-logs` - Create daily log
- `PUT /api/daily-logs` - Update daily log
- `DELETE /api/daily-logs?userId={userId}&date={date}` - Delete daily log

#### Analytics
- `GET /api/analytics?userId={userId}&period={period}&nutrient={nutrient}` - Get nutrition analytics

#### Tracking Settings
- `GET /api/tracking-settings?userId={userId}` - Get user's tracking preferences
- `PUT /api/tracking-settings` - Update tracking preferences

### Response Format
```typescript
{
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}
```

## 🎨 Design System

### Colors
- **Primary**: #8A6DFF (Lavender)
- **Secondary**: #FF9B4A (Cloudberry Orange)
- **Success**: #28C391 (Mint)
- **Background**: #FAF9F7 (Ivory)
- **Text**: #1E1E28 (Ink Slate)

### Typography
- **Headers**: Inter Bold
- **Body**: Inter Regular
- **Numbers**: Inter Medium

### Components
- Responsive design with tablet/desktop support
- Consistent spacing using 8px grid
- Smooth animations and micro-interactions
- Accessibility-compliant contrast ratios

## 📊 Data Models

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  selectedStage: 'ttc' | 't1' | 't2' | 't3' | 'postpartum';
  selectedGoal: string;
  dietaryPreferences: string[];
  // ... other fields
}
```

### Meal
```typescript
interface Meal {
  id: string;
  userId: string;
  name: string;
  nutrients: NutrientData;
  calories: number;
  loggedAt: string;
  // ... other fields
}
```

### Daily Log
```typescript
interface DailyLog {
  id: string;
  userId: string;
  date: string;
  meals: Meal[];
  totalNutrients: NutrientData;
  wellnessScore: number;
  // ... other fields
}
```

## 🔄 State Management

- **Local State**: React hooks for component state
- **Persistent State**: AsyncStorage for user preferences
- **API State**: Direct API calls with error handling
- **Onboarding State**: Custom hook with AsyncStorage persistence

## 🧪 Testing

### API Testing
Test the API endpoints using curl or Postman:

```bash
# Health check
curl http://localhost:8081/api/health

# Get sample user
curl http://localhost:8081/api/users

# Get user's meals
curl "http://localhost:8081/api/meals?userId=USER_ID"
```

### Frontend Testing
- Manual testing in browser and mobile simulators
- Component testing with React Native Testing Library (to be added)
- E2E testing with Detox (to be added)

## 🚀 Deployment

### Frontend Deployment
1. **Web**: Deploy to Netlify, Vercel, or similar
2. **Mobile**: Build with EAS Build and deploy to app stores

### Backend Deployment
1. **Serverless**: Deploy API routes with the frontend
2. **Database**: Replace in-memory database with PostgreSQL/MongoDB
3. **Environment**: Configure production environment variables

### Production Checklist
- [x] Replace in-memory database with Supabase PostgreSQL
- [x] Implement proper authentication with Supabase Auth
- [x] Add Row Level Security (RLS) policies
- [ ] Add input validation and sanitization
- [ ] Set up error monitoring (Sentry)
- [ ] Configure analytics (Mixpanel/Amplitude)
- [ ] Add rate limiting and security headers
- [ ] Set up CI/CD pipeline
- [ ] Configure environment variables

### Database Schema

The Supabase database includes:
- **users**: User profiles and preferences
- **meals**: Individual meal entries with nutrients
- **daily_logs**: Aggregated daily nutrition data
- **tracking_settings**: User's metric preferences

All tables have RLS enabled and proper foreign key relationships.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or support:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

Built with ❤️ for maternal health and nutrition.