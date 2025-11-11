# CYO Rugs 🧶 | Create Your Own Rugs

[![CI/CD Pipeline](https://github.com/gsnilloC/cyo-rugs/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/gsnilloC/cyo-rugs/actions/workflows/ci-cd.yml)

https://www.cyorugs.com

### 💻 Created with
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![AWS](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### Customer Purchase Flow
```mermaid
sequenceDiagram
    participant Customer
    participant Shop Page
    participant Backend
    participant Square
    participant Database
    participant SendGrid

    Customer->>Shop Page: 1. Select rug from inventory
    Shop Page->>Square: 2. Initiate checkout
    Note over Square: Create payment checkout session

    Square-->>Customer: 3. Display checkout form
    Customer->>Square: 4. Complete payment

    Square-->>Backend: 5. Payment webhook
    Note over Backend: Verify payment status

    Backend->>Database: 6. Update inventory
    Note over Database: - Decrease stock count<br>- Record sale

    Backend->>SendGrid: 7. Send order confirmation
    SendGrid-->>Customer: Receive confirmation email
    Note over Customer: Order details & tracking info
```

---

## 🚀 CI/CD & Deployment

This project uses **GitHub Actions** for continuous integration and deployment to **Heroku**.

### Pipeline Overview
- ✅ **Automated Testing**: Runs on every push and PR
- ✅ **Build Verification**: Ensures code compiles successfully
- ✅ **Manual Deployment**: Production deploys require approval
- ✅ **Health Checks**: Verifies app health after deployment

### Quick Setup
See [CICD_QUICKSTART.md](CICD_QUICKSTART.md) for setup instructions.

### Full Documentation
See [.github/CICD_SETUP.md](.github/CICD_SETUP.md) for complete CI/CD documentation.

---

## 🧪 Testing

![Tests](https://img.shields.io/badge/tests-177%20passing-brightgreen?style=for-the-badge&logo=jest)
![Frontend](https://img.shields.io/badge/frontend-100%20tests-blue?style=for-the-badge)
![Backend](https://img.shields.io/badge/backend-77%20tests-blue?style=for-the-badge)
![Coverage](https://img.shields.io/badge/coverage-critical%20paths-green?style=for-the-badge)

### 📊 Test Coverage Summary

```
┌─────────────────────────────────────────────────────────┐
│  Component/API          │  Tests  │  Status             │
├─────────────────────────────────────────────────────────┤
│  🎨 Frontend Tests                                      │
│  ├─ App Component        │   25    │  ✅ Complete       │
│  ├─ Cart Component       │   27    │  ✅ Complete       │
│  └─ Product Component    │   48    │  ✅ Complete       │
│                                                          │
│  🔧 Backend API Tests                                   │
│  ├─ Items API            │   41    │  ✅ Complete       │
│  └─ Orders API           │   36    │  ✅ Complete       │
│                                                          │
│  📊 TOTAL                │  177    │  ✅ All Passing    │
└─────────────────────────────────────────────────────────┘
```

### 🎯 What's Tested

**Frontend Components:**
- ✅ App routing, theme, audio controls (25 tests)
- ✅ Shopping cart, discounts, checkout (27 tests)
- ✅ Product display, variations, add to cart (48 tests)

**Backend APIs:**
- ✅ Product catalog endpoints (41 tests)
- ✅ Custom orders CRUD operations (36 tests)

### 🚀 Quick Test Commands

```bash
# Run all 177 tests
npm test -- --watchAll=false

# Run frontend tests only
npm test -- App Cart Product

# Run backend tests only
npm test -- backend/

# Run with coverage report
npm test -- --coverage --watchAll=false

# Test specific component
npm test -- Cart.test.js
```

### 📁 Test Files

- [`src/spec/App.test.js`](src/spec/App.test.js) - Main app component tests
- [`src/spec/Cart.test.js`](src/spec/Cart.test.js) - Shopping cart tests
- [`src/spec/Product.test.js`](src/spec/Product.test.js) - Product page tests
- [`src/spec/backend/items.test.js`](src/spec/backend/items.test.js) - Items API tests
- [`src/spec/backend/orders.test.js`](src/spec/backend/orders.test.js) - Orders API tests

### 📈 Testing Tools

- **Jest** - Test runner and assertions
- **React Testing Library** - Component testing
- **Supertest** - API endpoint testing
- **GitHub Actions** - Automated CI/CD testing

---

## 📦 Development

### Setup
```bash
# Install dependencies
npm install

# Start development server (frontend + backend)
npm run dev

# Start frontend only
npm start

# Start backend only
npm run server
```

### Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
DATABASE_URL=your_postgres_url
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
SENDGRID_API_KEY=your_sendgrid_key
SQUARE_ACCESS_TOKEN=your_square_token
SQUARE_LOCATION_ID=your_square_location
RECAPTCHA_SECRET_KEY=your_recaptcha_secret
