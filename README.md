# 🎮 Advanced Gaming & Betting Platform

একটি সম্পূর্ণ অনলাইন গেমিং এবং বেটিং প্ল্যাটফর্ম যেখানে রিয়েল টাকার লেনদেন এবং লাইভ গেম রয়েছে।

## ✨ প্রধান বৈশিষ্ট্য:

### ✅ ব্যবহারকারী ব্যবস্থাপনা
- ইমেল এবং পাসওয়ার্ড দিয়ে নিবন্ধন
- নিরাপদ লগইন সিস্টেম
- ইউজার প্রোফাইল এবং পরিসংখ্যান
- বিকাশ নম্বর ম্যানেজমেন্ট

### ✅ এভিয়েটর গেম
- রিয়েলিস্টিক গেমপ্লে
- এডমিন সম্পূর্ণ নিয়ন্ত্রণ (ক্র্যাশ মাল্টিপ্লায়ার সেট করা)
- লাইভ মাল্টিপ্লেয়ার গেম
- রিয়েল-টাইম ক্যাশ আউট

### ✅ বেটিং সিস্টেম
- মাল্টি-গেম সাপোর্ট (Aviator, Crash, Dice, Card, Roulette)
- লাইভ বেটিং
- তাৎক্ষণিক জয়/ক্ষতি গণনা

### ✅ পেমেন্ট সিস্টেম
- বিকাশ নম্বরের মাধ্যমে জমা দেওয়া
- বিকাশে উত্তোলন অনুরোধ
- এডমিন লেনদেন অনুমোদন
- স্বয়ংক্রিয় ব্যালেন্স আপডেট

### ✅ এডমিন প্যানেল
- সমস্ত ব্যবহারকারী দেখুন এবং পরিচালনা করুন
- গেম ফলাফল নিয়ন্ত্রণ করুন
- লেনদেন অনুমোদন/প্রত্যাখ্যান করুন
- ড্যাশবোর্ড পরিসংখ্যান
- সম্পূর্ণ নিয়ন্ত্রণ ক্ষমতা

## 🛠️ প্রযুক্তি স্ট্যাক:

### Backend:
- **Node.js** - সার্ভার
- **Express.js** - ওয়েব ফ্রেমওয়ার্ক
- **MongoDB** - ডাটাবেস
- **Socket.IO** - রিয়েল-টাইম কমিউনিকেশন
- **JWT** - অথেন্টিকেশন
- **Bcryptjs** - পাসওয়ার্ড এনক্রিপশন

### Frontend (আসছে শীঘ্রই):
- React.js
- Socket.IO Client
- Axios

## 🚀 ইনস্টলেশন:

### প্রয়োজনীয়তা:
- Node.js v14+
- MongoDB (Local বা Cloud)
- npm বা yarn

### ধাপ:

```bash
# 1. প্রজেক্ট ক্লোন করুন
git clone https://github.com/rajn80588-cmyk/GT4XBEET.git
cd GT4XBEET

# 2. ডিপেন্ডেন্সি ইনস্টল করুন
npm install

# 3. .env ফাইল তৈরি করুন
cp .env.example .env

# 4. .env এ MongoDB সংযোগ স্ট্রিং যোগ করুন
# MONGODB_URI=mongodb://localhost:27017/gaming-platform

# 5. এডমিন বিকাশ নম্বর যোগ করুন
# BKASH_NUMBER=আপনার_বিকাশ_নম্বর

# 6. JWT সিক্রেট পরিবর্তন করুন
# JWT_SECRET=আপনার_নিরাপদ_সিক্রেট_কী

# 7. সার্ভার চালু করুন
npm start

# বা ডেভেলপমেন্ট মোডে (auto-reload সহ)
npm run dev
```

## 📚 API ডকুমেন্টেশন:

### Authentication Routes:
```
POST   /api/auth/register       - নতুন ব্যবহারকারী নিবন্ধন
POST   /api/auth/login          - লগইন
GET    /api/auth/me             - বর্তমান ব্যবহারকারীর তথ্য
```

### Game Routes:
```
GET    /api/games/active        - সক্রিয় গেম
GET    /api/games/history       - গেম ইতিহাস
POST   /api/games/bet           - বেট রাখুন
POST   /api/games/cashout       - ক্যাশ আউট
GET    /api/games/user-history  - ইউজার গেম ইতিহাস
```

### Payment Routes:
```
POST   /api/payment/deposit-request     - জমা দেওয়ার অনুরোধ
POST   /api/payment/withdraw-request    - উত্তোলনের অনুরোধ
GET    /api/payment/history             - লেনদেনের ইতিহাস
POST   /api/payment/confirm-deposit/:id - ডিপোজিট কনফার্ম করুন
```

### User Routes:
```
GET    /api/users/profile      - ইউজার প্রোফাইল
GET    /api/users/balance      - ব্যালেন্স চেক করুন
GET    /api/users/stats        - পরিসংখ্যান
PUT    /api/users/update-bkash - বিকাশ নম্বর আপডেট
```

### Admin Routes (Admin এক্সেস প্রয়োজন):
```
GET    /api/admin/users                 - সমস্ত ব্যবহারকারী
GET    /api/admin/users/:userId        - নির্দিষ্ট ব্যবহারকারী
POST   /api/admin/create-game           - নতুন গেম তৈরি করুন
POST   /api/admin/control-game          - গেম নিয়ন্ত্রণ করুন (ক্র্যাশ সেট)
POST   /api/admin/transaction/:id       - লেনদেন অনুমোদন/প্রত্যাখ্যান
GET    /api/admin/transactions          - সমস্ত লেনদেন
GET    /api/admin/dashboard             - ড্যাশবোর্ড পরিসংখ্যান
```

## 🔐 এডমিন অ্যাকাউন্ট সেটআপ:

1. নিয়মিত অ্যাকাউন্ট তৈরি করুন
2. MongoDB এ সরাসরি `isAdmin` ফিল্ড `true` সেট করুন:

```javascript
db.users.updateOne(
  { email: "আপনার_ইমেল" },
  { $set: { isAdmin: true } }
)
```

## 🎮 এভিয়েটর গেম নিয়ন্ত্রণ:

**এডমিন গেম ফলাফল সম্পূর্ণভাবে নিয়ন্ত্রণ করতে পারবেন:**

```bash
POST /api/admin/control-game

Body:
{
  "gameId": "game_id",
  "crashMultiplier": 2.5,
  "status": "crashed"
}
```

## 💰 বিকাশ পেমেন্ট ফ্লো:

### ডিপোজিট:
1. ইউজার ডিপোজিট রিকোয়েস্ট করে
2. সিস্টেম এডমিনের বিকাশ নম্বর দেখায়
3. ইউজার সেই নম্বরে টাকা পাঠায়
4. এডমিন লেনদেন কনফার্ম করে
5. ইউজারের ব্যালেন্স আপডেট হয়

### উইথড্রয়াল:
1. ইউজার উইথড্রয়াল রিকোয়েস্ট করে
2. তাদের বিকাশ নম্বর সাবমিট করে
3. এডমিন অনুমোদন করে
4. সিস্টেম স্বয়ংক্রিয়ভাবে অ্যাডজাস্ট করে

## 📊 রিয়েল-টাইম ফিচার:

Socket.IO ব্যবহার করে লাইভ আপডেট:
- গেম স্ট্যাটাস আপডেট
- প্লেয়ার জয়িন/লিভ
- বেট প্লেসমেন্ট
- ক্যাশ আউট ইভেন্ট
- গেম ক্র্যাশ নোটিফিকেশন

## ⚙️ পরিবেশ ভেরিয়েবল:

```
PORT=5000                          # সার্ভার পোর্ট
MONGODB_URI=mongodb://...          # MongoDB কানেকশন
JWT_SECRET=your_secret_key         # জেডটি সিক্রেট
BKASH_NUMBER=01700000000           # এডমিন বিকাশ নম্বর
NODE_ENV=development               # এনভায়রনমেন্ট
```

## 📁 ফোল্ডার স্ট্রাকচার:

```
GT4XBEET/
├── config/           # কনফিগারেশন ফাইল
├── models/           # MongoDB মডেল
├── routes/           # API রুট
├── server.js         # মেইন সার্ভার
├── package.json      # ডিপেন্ডেন্সি
├── .env.example      # এনভায়রনমেন্ট টেমপ্লেট
└── README.md         # ডকুমেন্টেশন
```

## 🔄 ভবিষ্যৎ আপডেট:

- ✅ React.js ফ্রন্টএন্ড
- ✅ React Native মোবাইল অ্যাপ
- ✅ আরও গেম টাইপ
- ✅ লাইভ ভিডিও স্ট্রীমিং
- ✅ উন্নত পরিসংখ্যান
- ✅ রেফারেল সিস্টেম
- ✅ প্রাইজ সিস্টেম

## 🆘 সমস্যা সমাধান:

### MongoDB সংযোগ ব্যর্থ:
```bash
# MongoDB চালু আছে কিনা চেক করুন
mongod --version

# MongoDB সেবা শুরু করুন
sudo systemctl start mongod
```

### পোর্ট ব্যবহৃত:
```bash
# পোর্ট পরিবর্তন করুন .env এ
PORT=3000
```

### JWT এরর:
```bash
# .env এ JWT_SECRET সেট করুন
JWT_SECRET=your_secure_random_key_here
```

## 📞 সাপোর্ট:

যোগাযোগ করুন হোয়াটসঅ্যাপ বা বিকাশের মাধ্যমে।

## ⚖️ আইনি দায়বদ্ধতা:

এই প্ল্যাটফর্মটি **শিক্ষামূলক এবং ডেমোনস্ট্রেশন উদ্দেশ্যে** তৈরি। বাস্তব মুদ্রা সহ পরিচালনা করার আগে স্থানীয় আইন এবং নিয়মাবলী মেনে চলুন।

## 📜 লাইসেন্স:

MIT License - দেখুন LICENSE ফাইল

---

**গুড লাক! হ্যাপি কোডিং!** 🚀
