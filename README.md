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

### Available Test Commands
```bash
# Run all tests
npm test

# Run tests without watch mode
npm test -- --watchAll=false

# Run with coverage
npm test -- --coverage

# Future commands (as tests are added):
# npm run test:unit       # Frontend unit tests
# npm run test:backend    # Backend API tests
# npm run test:e2e        # End-to-end tests
# npm run test:all        # Run all test suites
```

### Testing Strategy
- **Unit Tests**: React component testing with Jest & React Testing Library
- **Integration Tests**: Backend API endpoint testing with Supertest
- **E2E Tests**: Full user flow testing with Playwright
- **Health Checks**: Production deployment verification

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
