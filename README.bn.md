# FinanceTrackerApp

<!-- README-I18N:START -->

[English](./README.md) | **বাংলা**

<!-- README-I18N:END -->

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-blue?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5.x-purple?logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/FastAPI-0.115-green?logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/SQLAlchemy-2.0-red?logo=sqlalchemy" alt="SQLAlchemy">
  <img src="https://img.shields.io/badge/SQLite-003545?logo=sqlite" alt="SQLite">
  <img src="https://img.shields.io/badge/Python-3.12-yellow?logo=python" alt="Python">
  <img src="https://img.shields.io/badge/Zustand-4.5-purple" alt="Zustand">
  <img src="https://img.shields.io/badge/TanStack-Query-5-orange" alt="TanStack Query">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
</p>

পার্সোনাল ফাইন্যান্স ট্র্যাকিং অ্যাপ্লিকেশন যেখানে রয়েছে ক্লিন ডিজাইন সিস্টেম এবং আধুনিক UI কম্পোনেন্ট।

## প্রযুক্তি স্ট্যাক

| ক্যাটাগরি | প্রযুক্তি | ভার্সন |
|----------|-----------|---------|
| **ফ্রন্টএন্ড** | React | ১৮.৩.x |
| | TypeScript | ৫.x |
| | Vite | ৫.x |
| | Zustand | ৪.৫.x |
| | TanStack Query | ৫.x |
| | React Router DOM | ৬.x |
| | React Hook Form | ৭.x |
| | Zod | ৩.x |
| | date-fns | ৩.x |
| **ব্যাকএন্ড** | FastAPI | ০.১১৫.x |
| | SQLAlchemy | ২.০.x |
| | Pydantic | ২.x |
| | Python-Jose | ৩.x |
| | Loguru | ৩.x |
| **ডেটাবেস** | SQLite | ৩.x |
| **টুলস** | Argon2 | ১.x |
| | Pytest | ৮.x |

## বৈশিষ্ট্য

- **লেনদেন ট্র্যাকিং**: আয় ও খরচ লগ এবং ক্যাটাগরাইজ করুন
- **বাজেট ম্যানেজমেন্ট**: খরচের সীমা নির্ধারণ এবং ট্র্যাক করুন
- **ভিজ্যুয়াল অ্যানালিটিক্স**: চার্ট এবং প্রগ্রেস ইন্ডিকেটর
- **ডার্ক মোড**: পূর্ণ থিম সাপোর্ট
- **রেসপন্সিভ ডিজাইন**: সব স্ক্রিন সাইজে কাজ করে
- **মডুলার ব্যাকএন্ড**: প্রতিটি ডোমেইনের জন্য আলাদা FastAPI সার্ভিস

## অগ্রগতি

### সামগ্রিক উন্নয়ন

```
███████░░░░░░░░░░░░░░░░░░░ 55% সম্পন্ন
```

| মডিউল | ব্যাকএন্ড | ফ্রন্টএন্ড | স্ট্যাটাস |
|--------|-----------|----------|--------|
| Auth | ✅ সম্পন্ন | ✅ সম্পন্ন | শিপড |
| Categories | ✅ সম্পন্ন | ✅ সম্পন্ন | শিপড |
| Transactions | ✅ সম্পন্ন | ✅ সম্পন্ন | শিপড |
| Budgets | ❌ মুলতুবি | ❌ মুলতুবি | প্ল্যানড |
| Analytics | ❌ মুলতুবি | ❌ মুলতুবি | প্ল্যানড |

### সম্পন্ন বৈশিষ্ট্য

- [x] ফ্রন্টএন্ড ডিজাইন সিস্টেম (কালার প্যালেট, কম্পোনেন্ট শোকেস)
- [x] Auth মডিউল (ইউজার রেজিস্ট্রেশন, লগিন, JWT, Argon2)
- [x] Categories মডিউল (CRUD, সাইডবার লেআউট, CORS)
- [x] Transactions মডিউল (CRUD, পেজিনেশন, ফিল্টারিং, টেস্ট স্যুট)

### আসন্ন

- [ ] Budget মডিউল
- [ ] Analytics ড্যাশবোর্ড
- [ ] Reports জেনারেশন

## শুরু করা

### প্রিরিকোয়িজিটি

- Node.js ১৮+
- Python ৩.১২+
- npm বা yarn

### ইনস্টলেশন

```bash
# Clone repository
git clone https://github.com/PritamChk/finance-tracker.git
cd finance-tracker

# Frontend setup
cd frontend
npm install
npm run dev

# Backend setup (per module)
cd backend/modules/auth
./start.ps1  # Windows
./start.sh   # Linux/Mac
```

## প্রজেক্ট স্ট্রাকচার

```
├── README.md                    # This file
├── README.bn.md                 # Bengali translation
├── agent.md                     # AI context & learnings
├── progress.md                  # Development tracker
├── frontend/                    # React + TypeScript
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── hooks/               # Custom hooks
│   │   ├── services/            # API services
│   │   ├── pages/               # Page components
│   │   ├── stores/              # Zustand stores
│   │   └── types/               # TypeScript types
│   └── package.json
├── backend/                     # FastAPI backend
│   ├── shared/                  # Shared utilities
│   ├── database/                # SQLite databases
│   └── modules/                 # Domain modules
│       ├── auth/                # Auth service (port 8001)
│       ├── categories/          # Categories service (port 8002)
│       ├── transactions/        # Transactions service (port 8003)
│       ├── budgets/             # Budgets service (port 8004)
│       ├── analytics/          # Analytics service (port 8005)
│       └── reports/             # Reports service (port 8006)
└── planning/                    # Planning docs
```

## স্ক্রিপ্ট

### ফ্রন্টএন্ড

```bash
cd frontend
npm run dev      # Start development server (port 5174)
npm run build    # Build for production
npm run lint     # Run linter
```

### ব্যাকএন্ড

```bash
# Start individual modules
cd backend/modules/auth && ./start.ps1      # Port 8001
cd backend/modules/categories && ./start.ps1 # Port 8002
cd backend/modules/transactions && ./start.ps1 # Port 8003
```

## ডিজাইন সিস্টেম

### কালার প্যালেট

| ক্যাটাগরি | মেইন কালার | ব্যবহার |
|----------|-----------|-------|
| Primary | `#3b82f6` | ব্র্যান্ড, অ্যাকশন |
| Success | `#22c55e` | আয়, পজিটিভ |
| Danger | `#ef4444` | খরচ, নেগেটিভ |
| Warning | `#f59e0b` | অ্যালার্ট, পেন্ডিং |
| Info | `#3b82f6` | ইনফরমেশন |

### কম্পোনেন্ট কনভেনশন

- **কম্পোনেন্ট**: PascalCase (`TransactionCard.tsx`)
- **হুকস**: camelCase (`useAuth.ts`)
- **স্টাইল**: kebab-case (`button.css`)
- **ক্লাস**: kebab-case (`.transaction-card`)

## ব্যাকএন্ড আর্কিটেকচার ও লার্নিংস

### মডিউল স্ট্রাকচার
```
backend/modules/<module_name>/
├── app/
│   ├── api/            # Route definitions
│   ├── core/           # Logger and config
│   ├── crud/           # Database operations
│   ├── middleware/     # Request/response middleware
│   ├── models/         # SQLAlchemy models
│   ├── schemas/        # Pydantic schemas
│   └── main.py         # FastAPI app entry point
├── tests/
│   ├── conftest.py     # Pytest fixtures and test DB
│   └── test_*.py       # Test files
├── application.properties  # Module config (Java-style)
├── pyproject.toml      # Dependencies
├── start.ps1 / start.sh    # Cross-platform start scripts
├── stop.ps1 / stop.sh      # Cross-platform stop scripts
└── README.md
```

### শেয়ার্ড মডিউল (`backend/shared/`)
সব ব্যাকএন্ড মডিউল দ্বারা ব্যবহারযোগ্য ইউটিলিটি:
- `config_loader.py` — `.properties` ফাইল পার্স করে `ConfigParser` এর মাধ্যমে। `get()`, `get_int()`, `get_bool()`, `get_list()` সাপোর্ট করে। `[default]` সেকশন হেডার অটো-প্রিপেন্ড করে। `APP_ENV` এর মাধ্যমে এনভ-অ্যাওয়্যার।
- `database.py` — কেন্দ্রীয় SQLAlchemy engine, `SessionLocal`, `Base`, `init_db()`। `TRANSACTIONS_CONFIG` এনভ ভেরিয়েবলের মাধ্যমে মডিউল-স্পেসিফিক কনফিগ থেকে DB URL পড়ে।
- `security.py` — Argon2 পাসওয়ার্ড হ্যাশিং, JWT ক্রিয়েট/ডিকোড `python-jose` দিয়ে। শেয়ার্ড কনফিগ থেকে `secret_key`, `algorithm`, `expire` পড়ে।

### লগিং টেকনিক
প্রতিটি মডিউল নিজস্ব মিডলওয়্যার (`app/middleware/logging.py`) সংজ্ঞায়িত করে যা `app/core/logger.py` র‍্যাপ করে:
```python
async def log_requests(request: Request, call_next):
    logger.info(f"REQUEST|method={request.method}|path={request.url.path}|ip={client_ip}")
    response = await call_next(request)
    logger.info(f"RESPONSE|status={response.status_code}|duration={duration:.3f}s")
    return response
```
- `loguru` স্ট্রাকচার্ড আউটপুটের জন্য টাইমস্ট্যাম্প, লেভেল এবং মডিউল ট্যাগ সহ ব্যবহার করা হয়।
- পাইপ-ডেলিমিটেড ফরম্যাট লগ পার্সিং/অ্যাগ্রিগেশন সহজ করে।

### মূল প্যাটার্ন
- **sys.path রেজোলিউশন**: `app/main.py` স্টার্টআপে প্রোগ্রাম্যাটিক্যালি `backend/` রুট `sys.path` ইনজেক্ট করে
- **লাইফস্প্যান কনটেক্সট ম্যানেজার**: টেবল ক্রিয়েট করতে `init_db()` FastAPI `lifespan` এ কল করা হয়
- **CORS কনফিগ**: `application.properties` থেকে `config.get_list("cors.allowed_origins")` দিয়ে লোড করা হয়
- **পোর্ট আইসোলেশন**: প্রতিটি মডিউল ইউনিক পোর্ট ব্যবহার করে (auth: 8001, categories: 8002, transactions: 8003)

## কন্ট্রিবিউশন

1. এই README তে সংজ্ঞায়িত নেমিং কনভেনশন অনুসরণ করুন
2. ডিজাইন সিস্টেমের কালার এবং স্পেসিং ব্যবহার করুন
3. লাইট এবং ডার্ক উভয় মোডে টেস্ট করুন
4. অ্যাক্সেসিবিলিটি স্ট্যান্ডার্ড নিশ্চিত করুন

## লাইসেন্স

MIT