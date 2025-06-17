
# 🎉 Event Management API

A Node.js REST API built with Express, TypeScript, Knex, and PostgreSQL.

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js >= 18.x
- PostgreSQL
- `pnpm`, `npm`, or `yarn`

---

### 📦 Installation

1. **Clone the repository:**

```bash
git clone https://github.com/AsrarMemon/event-management-backend
cd event-management-backend
````

2. **Install dependencies:**

```bash
npm install
# or
yarn
# or
pnpm install
```

3. **Set up environment variables:**

Create a `.env` file in the root directory and add:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=event_management
DB_USER=postgres
DB_PASSWORD=root

# Server Configuration
PORT=3001
NODE_ENV=development
```

---

## ⚙️ Project Scripts

| Script             | Description                                     |
| ------------------ | ----------------------------------------------- |
| `dev`              | Start the dev server with live reload using tsx |
| `build`            | Compile TypeScript to JavaScript in `dist/`     |
| `start`            | Start the compiled app from `dist/`             |
| `migrate`          | Run the latest database migrations              |
| `migrate:rollback` | Rollback the last database migration            |
| `seed`             | Run database seeders                            |

### 📌 Run example:

```bash
npm run dev               # for development
npm run migrate           # to run migrations
npm run seed              # to seed data
npm run build && npm start # to run production build
```
---

## 🛠 Tech Stack

* **TypeScript**
* **Express**
* **Knex**
* **PostgreSQL**
* **dotenv** (for `.env` support)
