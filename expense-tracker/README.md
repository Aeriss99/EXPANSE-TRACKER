# Personal Expense Tracker

Aplikasi web untuk mengelola pengeluaran pribadi yang dibangun dengan Next.js, TypeScript, Tailwind CSS, dan Prisma ORM.

## 🚀 Fitur Utama

- **OAuth Authentication**: Login dengan Google & Facebook yang aman
- **Manajemen Pengeluaran**: Tambah, edit, hapus pengeluaran dengan validasi
- **Dashboard Analytics**: Ringkasan pengeluaran bulanan dengan insights
- **Filter & Pencarian**: Filter berdasarkan bulan, tahun, kategori, dan pencarian teks
- **Responsive Design**: Interface yang optimal di semua device
- **Database Security**: Data user terisolasi dengan Prisma ORM
- **Real-time Updates**: UI yang responsif dengan loading states

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL / MySQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Deployment**: Vercel-ready

## 📁 Struktur Project

```
expense-tracker/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── auth/      # NextAuth configuration
│   │   │   └── expenses/  # CRUD operations
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Main dashboard
│   │   ├── expenses/      # Expense management pages
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Landing page
│   ├── components/
│   │   ├── ui/            # Reusable UI components
│   │   ├── layout/        # Layout components
│   │   └── Providers.tsx  # Context providers
│   ├── lib/
│   │   ├── auth.ts        # NextAuth config
│   │   ├── prisma.ts      # Prisma client
│   │   └── utils.ts       # Utility functions
│   ├── types/
│   │   └── index.ts       # TypeScript types
│   └── middleware.ts      # Route protection
├── prisma/
│   └── schema.prisma      # Database schema
├── public/                # Static assets
└── package.json
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL atau MySQL database
- Google & Facebook OAuth apps

### Installation

1. **Clone dan install dependencies:**
```bash
cd expense-tracker
npm install
```

2. **Setup environment variables:**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` dengan konfigurasi Anda:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/expense_tracker"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Facebook OAuth
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"
```

3. **Setup database:**
```bash
npx prisma generate
npx prisma db push
```

4. **Run development server:**
```bash
npm run dev
```

Aplikasi akan tersedia di `http://localhost:3000`

## 🔧 Configuration

### OAuth Setup

#### Google OAuth:
1. Buka [Google Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih existing
3. Enable Google+ API
4. Create credentials (OAuth 2.0)
5. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

#### Facebook OAuth:
1. Buka [Facebook Developers](https://developers.facebook.com/)
2. Buat app baru
3. Add Facebook Login product
4. Configure OAuth redirect URIs: `http://localhost:3000/api/auth/callback/facebook`

### Database Schema

**Users Table**: 
- id, name, email, image, createdAt, updatedAt

**Expenses Table**:
- id, title, amount, date, category, description, userId, createdAt, updatedAt

**Categories**:
- FOOD, TRANSPORTATION, ENTERTAINMENT, BILLS, OTHERS

## 📊 API Endpoints

### Expenses API
- `GET /api/expenses` - Ambil semua expenses (dengan filter)
- `POST /api/expenses` - Tambah expense baru
- `GET /api/expenses/[id]` - Ambil expense spesifik
- `PUT /api/expenses/[id]` - Update expense
- `DELETE /api/expenses/[id]` - Hapus expense

### Authentication
- `POST /api/auth/signin` - Login user
- `POST /api/auth/signout` - Logout user

## 🎨 UI Components

- **Button**: Primary, secondary, danger, ghost variants
- **Input**: Form inputs dengan validation
- **Select**: Dropdown dengan options
- **Navbar**: Navigation dengan user info
- **Providers**: Session context provider

## 🔒 Security Features

- **Route Protection**: Middleware untuk melindungi authenticated routes
- **User Data Isolation**: Setiap user hanya bisa akses data sendiri
- **Input Validation**: Client & server side validation
- **SQL Injection Protection**: Prisma ORM parameterized queries
- **Session Management**: JWT-based dengan NextAuth

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository** ke Vercel
2. **Setup environment variables** di Vercel dashboard
3. **Deploy** - Vercel akan auto-detect Next.js configuration

### Manual Deployment

1. **Build aplikasi:**
```bash
npm run build
```

2. **Start production server:**
```bash
npm start
```

## 📱 Responsive Design

- **Mobile-first** approach dengan Tailwind CSS
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly** interface untuk mobile devices
- **Optimized** untuk semua screen sizes

## 🔄 Development Workflow

1. **Setup** development environment
2. **Create** feature branch
3. **Implement** functionality dengan testing
4. **Validate** dengan TypeScript dan ESLint
5. **Deploy** ke staging/production

## 📝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error:**
- Pastikan DATABASE_URL benar
- Database server sedang running
- Credentials valid

**OAuth Login Error:**
- Validasi client ID dan secret
- Redirect URIs sudah sesuai
- Apps sudah diapprove di Google/Facebook

**Build Error:**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

## 🎯 Future Enhancements

- [ ] Export data ke CSV/PDF
- [ ] Charts dan visualizations
- [ ] Budget planning features
- [ ] Mobile app dengan React Native
- [ ] Recurring expenses
- [ ] Categories management
- [ ] Dark mode support
- [ ] Multi-language support

---

**Built with ❤️ using Next.js, TypeScript, dan Tailwind CSS**
