<div align="center">

# 🤖 NeuralChat AI

### _An Intelligent, Context-Aware Chatbot powered by LangChain · RAG · Vector Embeddings_

<br/>

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![LangChain](https://img.shields.io/badge/🦜_LangChain-1C3C3C?style=for-the-badge)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)

<br/>

> **NeuralChat AI** is a full-stack, production-ready AI chatbot that understands your documents.  
> Upload PDFs, paste URLs, or drop text — the bot answers questions using **Retrieval-Augmented Generation (RAG)**,  
> meaning every answer is grounded in _your_ data, not hallucination.

<br/>

```
╔══════════════════════════════════════════════════════╗
║   User Query  ──▶  Embedding  ──▶  Vector Search    ║
║                                         │            ║
║   LLM Response  ◀──  RAG Chain  ◀──  Context        ║
╚══════════════════════════════════════════════════════╝
```

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🧠 AI Pipeline (RAG)](#-ai-pipeline-rag)
- [🗂️ Project Structure](#️-project-structure)
- [⚙️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🔐 Environment Variables](#-environment-variables)
- [📡 API Reference](#-api-reference)
- [🔌 WebSocket Events](#-websocket-events)
- [🛣️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **RAG Pipeline** | Retrieval-Augmented Generation — answers grounded in your documents |
| 📄 **Document Ingestion** | Upload PDFs, Word docs, plain text, or URLs |
| 🔍 **Semantic Search** | Vector similarity search across your knowledge base |
| 💬 **Real-time Chat** | Streaming responses via Socket.io |
| 🔐 **Auth System** | JWT-based authentication with bcrypt password hashing |
| 👑 **Admin Dashboard** | User management, chat monitoring, analytics & billing |
| 🗣️ **Chat History** | Persistent, searchable conversation memory |
| 🌐 **Multi-session** | Each user has isolated, independent chat contexts |
| 📊 **Embeddings Viewer** | Visualize document chunk embeddings |
| 🔄 **Streaming LLM** | Token-by-token streaming for a live typing effect |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT  (React + Vite)                     │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │  Chat UI │  │  Upload  │  │  Admin   │  │   Auth Pages       │ │
│  │          │  │  Panel   │  │Dashboard │  │  Login / Register  │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────┬───────────┘ │
│       │              │              │                  │             │
└───────┼──────────────┼──────────────┼──────────────────┼────────────┘
        │  REST API    │              │                  │
        │  +Socket.io  │              │                  │
┌───────▼──────────────▼──────────────▼──────────────────▼────────────┐
│                          SERVER  (Express + TypeScript)              │
│                                                                      │
│  ┌────────────┐  ┌─────────────┐  ┌───────────────┐  ┌──────────┐  │
│  │   Routes   │  │  Middleware │  │   Socket.io   │  │  Utils   │  │
│  │ /auth      │  │ Auth Guard  │  │   Gateway     │  │  Crypto  │  │
│  │ /chat      │  │ Rate Limit  │  │  Real-time    │  │  JWT     │  │
│  │ /docs      │  │ CORS        │  │  Streaming    │  │          │  │
│  │ /admin     │  │ Validator   │  │               │  │          │  │
│  └─────┬──────┘  └─────────────┘  └───────┬───────┘  └──────────┘  │
│        │                                   │                        │
│        ▼                                   ▼                        │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    AI  SERVICES  LAYER                      │    │
│  │                                                             │    │
│  │  ┌──────────────┐  ┌────────────────┐  ┌───────────────┐  │    │
│  │  │  LangChain   │  │  Embedding     │  │  RAG Chain    │  │    │
│  │  │  Orchestrate │  │  Service       │  │  Retriever    │  │    │
│  │  │              │  │  (OpenAI /     │  │  + Prompt     │  │    │
│  │  │              │  │   HuggingFace) │  │  Template     │  │    │
│  │  └──────┬───────┘  └───────┬────────┘  └───────┬───────┘  │    │
│  │         │                  │                    │           │    │
│  └─────────┼──────────────────┼────────────────────┼───────────┘    │
│            │                  │                    │                │
└────────────┼──────────────────┼────────────────────┼────────────────┘
             │                  │                    │
      ┌──────▼──────┐   ┌───────▼───────┐   ┌───────▼──────────┐
      │   MongoDB   │   │  Vector Store │   │   LLM Provider   │
      │  (Mongoose) │   │  (Pinecone /  │   │  (OpenAI GPT-4 / │
      │  Users      │   │   Chroma /    │   │   Anthropic /    │
      │  Chats      │   │   pgvector)   │   │   Gemini)        │
      │  Docs Meta  │   │               │   │                  │
      └─────────────┘   └───────────────┘   └──────────────────┘
```

---

## 🧠 AI Pipeline (RAG)

The core intelligence of NeuralChat is its **Retrieval-Augmented Generation** pipeline:

```
                         ┌──────────────────────────────────────────┐
   INGESTION PHASE       │                                          │
   ─────────────────     │   1. Document Loader                     │
   (One-time setup)      │      PDF / URL / Text / Markdown         │
                         │              │                           │
                         │              ▼                           │
                         │   2. Text Splitter                       │
                         │      Chunk into ~512 token segments      │
                         │              │                           │
                         │              ▼                           │
                         │   3. Embedding Model                     │
                         │      text-embedding-ada-002              │
                         │      Converts text → float vectors       │
                         │              │                           │
                         │              ▼                           │
                         │   4. Vector Store (Pinecone / Chroma)   │
                         │      Store vectors with metadata         │
                         │                                          │
                         └──────────────────────────────────────────┘


                         ┌──────────────────────────────────────────┐
   QUERY PHASE           │                                          │
   ──────────────        │   1. User sends a question               │
   (Every chat msg)      │              │                           │
                         │              ▼                           │
                         │   2. Embed the query                     │
                         │      Same embedding model                │
                         │              │                           │
                         │              ▼                           │
                         │   3. Similarity Search (Top-K)          │
                         │      Cosine similarity in vector space   │
                         │              │                           │
                         │              ▼                           │
                         │   4. Retrieved Context chunks            │
                         │      Most relevant document passages     │
                         │              │                           │
                         │              ▼                           │
                         │   5. LangChain RAG Prompt                │
                         │      "Answer based on context: {ctx}"   │
                         │              │                           │
                         │              ▼                           │
                         │   6. LLM (GPT-4 / Claude / Gemini)      │
                         │      Generates grounded answer           │
                         │              │                           │
                         │              ▼                           │
                         │   7. Streamed Response to User           │
                         │                                          │
                         └──────────────────────────────────────────┘
```

---

## 🗂️ Project Structure

```
ai-chatbot/
│
├── 📁 client/                          # Frontend (React + Vite + TypeScript)
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── ChatWindow.tsx          # Main chat interface
│   │   │   ├── MessageBubble.tsx       # Individual message component
│   │   │   ├── DocumentUploader.tsx    # Drag-drop document upload
│   │   │   ├── TypingIndicator.tsx     # Animated streaming indicator
│   │   │   └── Sidebar.tsx            # Conversation list
│   │   ├── 📁 pages/
│   │   │   ├── Chat.tsx               # Main chat page
│   │   │   ├── Login.tsx              # Auth pages
│   │   │   ├── Register.tsx
│   │   │   └── 📁 admin/
│   │   │       ├── AdminDashboard.tsx  # Overview & stats
│   │   │       ├── AdminChats.tsx      # Monitor all chats
│   │   │       ├── Users.tsx          # User management
│   │   │       ├── Analytics.tsx       # Usage analytics
│   │   │       ├── Billing.tsx         # Billing & token usage
│   │   │       └── AdminSettings.tsx   # System configuration
│   │   ├── 📁 hooks/
│   │   │   ├── useChat.ts             # Chat state & socket logic
│   │   │   └── useAuth.ts             # Auth context hook
│   │   ├── 📁 services/
│   │   │   └── api.ts                 # Axios API client
│   │   └── 📁 store/                  # Zustand / Redux state
│   └── package.json
│
├── 📁 server/                          # Backend (Node.js + Express + TypeScript)
│   └── 📁 src/
│       ├── 📁 config/
│       │   ├── db.ts                  # MongoDB connection (Mongoose)
│       │   └── env.ts                 # Environment config
│       ├── 📁 models/
│       │   ├── User.ts                # User schema
│       │   ├── Chat.ts                # Chat/session schema
│       │   ├── Message.ts             # Message schema
│       │   └── Document.ts            # Ingested document metadata
│       ├── 📁 routes/
│       │   ├── auth.ts                # POST /login, /register, /refresh
│       │   ├── chat.ts                # GET/POST /chats, /chats/:id
│       │   ├── documents.ts           # POST /upload, GET /documents
│       │   └── admin.ts              # Admin-only protected routes
│       ├── 📁 middleware/
│       │   ├── authGuard.ts           # JWT verification middleware
│       │   ├── adminGuard.ts          # Admin role enforcement
│       │   └── rateLimiter.ts        # API rate limiting
│       ├── 📁 services/
│       │   ├── langchain.service.ts   # LangChain chain setup
│       │   ├── embedding.service.ts   # Embedding generation
│       │   ├── vectorStore.service.ts # Pinecone / Chroma client
│       │   ├── rag.service.ts         # Full RAG pipeline orchestration
│       │   └── document.service.ts    # Document parsing & chunking
│       ├── 📁 socket/
│       │   └── chatSocket.ts          # Socket.io event handlers
│       ├── 📁 lib/
│       │   └── langchainClient.ts     # LangChain + LLM initialization
│       ├── 📁 types/
│       │   └── index.ts               # Shared TypeScript types/interfaces
│       ├── 📁 utils/
│       │   ├── jwt.ts                 # Token helpers
│       │   └── crypto.ts              # Encryption utilities
│       └── server.ts                  # Entry point
│
├── .env.example                        # Environment variable template
├── docker-compose.yml                  # Docker setup (optional)
└── README.md
```

---

## ⚙️ Tech Stack

### 🖥️ Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI Framework |
| **TypeScript** | Type safety |
| **Vite** | Lightning-fast build tool |
| **Socket.io Client** | Real-time communication |
| **Axios** | HTTP requests |
| **Zustand** | Lightweight state management |
| **React Router v6** | Client-side routing |
| **TailwindCSS** | Utility-first styling |

### 🔧 Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime |
| **Express v5** | HTTP framework |
| **TypeScript** | Type safety |
| **Socket.io** | Real-time WebSocket layer |
| **Mongoose** | MongoDB ODM |
| **JWT + bcryptjs** | Authentication & security |
| **crypto-js** | Data encryption |
| **dotenv** | Environment management |
| **nodemon + ts-node** | Dev hot reload |

### 🧠 AI / ML Stack
| Technology | Purpose |
|---|---|
| **🦜 LangChain** | AI orchestration framework |
| **OpenAI / Gemini** | LLM provider for response generation |
| **text-embedding-ada-002** | Document & query embedding model |
| **Pinecone / ChromaDB** | Vector database for similarity search |
| **RecursiveTextSplitter** | Intelligent document chunking |
| **ConversationalRetrievalChain** | LangChain RAG chain with memory |
| **BufferMemory** | In-session conversation memory |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

```bash
node  >= 18.0.0
npm   >= 9.0.0
# OR
yarn  >= 1.22.0
```

You'll also need accounts for:
- [OpenAI](https://platform.openai.com/) or [Google AI Studio](https://aistudio.google.com/) (LLM provider)
- [Pinecone](https://www.pinecone.io/) (Vector DB) _or_ run ChromaDB locally
- [MongoDB Atlas](https://www.mongodb.com/atlas) or a local MongoDB instance

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/ai-chatbot.git
cd ai-chatbot
```

---

### 2️⃣ Setup the Backend

```bash
cd server
npm install
```

Copy and fill in your environment variables:

```bash
cp .env.example .env
# Then edit .env with your keys
```

Start the development server:

```bash
npm run dev
```

> Server runs on **http://localhost:5000**

---

### 3️⃣ Setup the Frontend

```bash
cd ../client
npm install
npm run dev
```

> Client runs on **http://localhost:5173**

---

### 4️⃣ (Optional) Run with Docker

```bash
docker-compose up --build
```

---

## 🔐 Environment Variables

Create a `.env` file in the `/server` directory:

```env
# ── Server ────────────────────────────────────
PORT=5000
NODE_ENV=development

# ── MongoDB ───────────────────────────────────
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/neuralchat

# ── Authentication ────────────────────────────
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12

# ── LLM Provider ─────────────────────────────
# Choose one:
OPENAI_API_KEY=sk-...
# GOOGLE_GEMINI_API_KEY=AI...
# ANTHROPIC_API_KEY=sk-ant-...

LLM_MODEL=gpt-4-turbo-preview
LLM_TEMPERATURE=0.3
LLM_MAX_TOKENS=2048

# ── Embeddings ────────────────────────────────
EMBEDDING_MODEL=text-embedding-ada-002

# ── Vector Store ──────────────────────────────
# Pinecone
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=neuralchat-index
PINECONE_ENVIRONMENT=us-east-1-aws

# OR ChromaDB (local)
# CHROMA_URL=http://localhost:8000

# ── RAG Settings ──────────────────────────────
CHUNK_SIZE=512
CHUNK_OVERLAP=64
RETRIEVER_TOP_K=5

# ── CORS ──────────────────────────────────────
CLIENT_ORIGIN=http://localhost:5173
```

---

## 📡 API Reference

### 🔑 Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login & receive JWT | ❌ |
| `POST` | `/api/auth/refresh` | Refresh access token | ✅ |
| `POST` | `/api/auth/logout` | Invalidate session | ✅ |

### 💬 Chat

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/chats` | Get all user chats | ✅ |
| `POST` | `/api/chats` | Create new chat session | ✅ |
| `GET` | `/api/chats/:id` | Get chat history | ✅ |
| `DELETE` | `/api/chats/:id` | Delete a chat | ✅ |
| `POST` | `/api/chats/:id/message` | Send a message (REST fallback) | ✅ |

### 📄 Documents

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/documents/upload` | Upload & ingest document | ✅ |
| `GET` | `/api/documents` | List all ingested docs | ✅ |
| `DELETE` | `/api/documents/:id` | Remove document & its vectors | ✅ |
| `POST` | `/api/documents/url` | Ingest from a URL | ✅ |

### 👑 Admin

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/admin/users` | List all users | 🔒 Admin |
| `PATCH` | `/api/admin/users/:id` | Update user role/status | 🔒 Admin |
| `GET` | `/api/admin/analytics` | Usage statistics | 🔒 Admin |
| `GET` | `/api/admin/chats` | View all chats | 🔒 Admin |

---

## 🔌 WebSocket Events

Real-time communication is handled via **Socket.io**:

### Client → Server (Emit)

| Event | Payload | Description |
|-------|---------|-------------|
| `chat:message` | `{ chatId, content }` | Send a message |
| `chat:join` | `{ chatId }` | Join a chat room |
| `chat:leave` | `{ chatId }` | Leave a chat room |
| `doc:ingest` | `{ fileData, chatId }` | Ingest document for session |

### Server → Client (Listen)

| Event | Payload | Description |
|-------|---------|-------------|
| `chat:token` | `{ token: string }` | Streamed LLM token |
| `chat:done` | `{ message }` | Full message complete |
| `chat:error` | `{ error }` | Error during generation |
| `chat:thinking` | `{}` | RAG retrieval in progress |
| `doc:ready` | `{ docId, chunks }` | Document ingested & indexed |

---

## 🛣️ Roadmap

- [x] JWT Authentication & User Management
- [x] Real-time WebSocket chat (Socket.io)
- [x] Admin Dashboard (Users, Analytics, Billing)
- [ ] 🧠 LangChain RAG pipeline integration
- [ ] 📄 PDF / URL document ingestion
- [ ] 🔍 Vector store integration (Pinecone / Chroma)
- [ ] 📡 Streaming LLM responses (token-by-token)
- [ ] 🗣️ Conversation memory (LangChain BufferMemory)
- [ ] 🌐 Multi-language support
- [ ] 🎙️ Voice input / output (Whisper + TTS)
- [ ] 📊 Embedding visualization dashboard
- [ ] 🐳 Docker Compose full-stack setup
- [ ] ☁️ One-click cloud deployment (Railway / Render)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ and a lot of ☕

**[⬆ Back to Top](#-neuralchat-ai)**

</div>
<<<<<<< HEAD
=======
# Ai-chatBot-
>>>>>>> 33049b8 (first commit)
