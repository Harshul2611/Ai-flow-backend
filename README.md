# Ai-flow-backend

Node.js/Express API serving AI streaming responses (OpenRouter) and Prisma/MongoDB persistence.

## ✨ Features

- 🔗 AI streaming via OpenRouter API
- 💾 Prisma ORM + MongoDB
- 🛡️ Zod validation
- 📡 CORS enabled
- ⚙️ TypeScript + ESM

## 🛠️ Tech Stack

- **Runtime**: Node.js 22+, Express 5
- **DB**: MongoDB + Prisma 6
- **Validation**: Zod 4
- **AI**: OpenRouter (Nemotron Nano)

## 🚀 Local Development

```bash
# Install
npm install

# Generate Prisma client
npx prisma generate

# Dev (auto-rebuild)
npm run dev
```

## 🌐 API Endpoints

| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| `POST` | `/api/ask-ai-stream` | Stream AI response  |
| `POST` | `/api/save`          | Save prompt/response|
| `GET`  | `/api/history`       | Fetch chat history  |

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/aiflow"

# AI Provider
OPENROUTER_API_KEY="your_openrouter_key"

# Server
PORT=5003

## 🧪 Prisma Setup

```bash
# Generate client
npx prisma generate

# Studio (DB explorer)
npx prisma studio

# Push schema to DB
npx prisma db push
```

## 🔒 Production Deployment

1. **EC2 Instance** (t3.micro, Ubuntu 22.04)
2. **PM2** for process management
3. **Nginx** reverse proxy + SSL
4. **GitHub Actions** CI/CD
