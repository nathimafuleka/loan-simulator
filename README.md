# Loan Eligibility Simulator

A production-grade loan eligibility simulator with a modern React frontend and Express backend. This application allows customers to input their financial information and receive instant loan eligibility results with detailed affordability analysis.

## Features

- **Real-time Eligibility Check**: Instant loan eligibility calculation based on personal and financial information
- **Comprehensive Analysis**: Detailed affordability analysis including debt-to-income ratios and risk assessment
- **Responsive Design**: Modern, mobile-friendly UI built with React and TailwindCSS
- **Production-Ready**: Includes Docker support, error handling, rate limiting, and security best practices
- **Type-Safe**: Full TypeScript implementation for both frontend and backend
- **API Specification Compliant**: Implements all required endpoints according to the provided specification

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and optimized builds
- TailwindCSS for styling
- Lucide React for icons
- Axios for API communication

### Backend
- Node.js with Express
- TypeScript for type safety
- Zod for request validation
- Helmet for security headers
- CORS support
- Rate limiting

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker (optional, for containerized deployment)

## Installation

### Local Development Setup

1. **Clone the repository**
   ```bash
   cd loan-simulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   cd ..
   ```

3. **Set up environment variables**
   
   Backend (.env):
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Frontend (.env):
   ```bash
   cd frontend
   cp .env.example .env
   ```

4. **Run the application**
   
   Option 1 - Run both frontend and backend concurrently:
   ```bash
   npm run dev
   ```
   
   Option 2 - Run separately:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

## Docker Deployment

### Build and Run with Docker

1. **Build the Docker image**
   ```bash
   docker build -t loan-eligibility-simulator .
   ```

2. **Run the container**
   ```bash
   docker run -p 3001:3001 loan-eligibility-simulator
   ```

3. **Access the application**
   - Application: http://localhost:3001

### Docker Compose (Alternative)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

## API Endpoints

### 1. Check Loan Eligibility
```
POST /api/loans/eligibility
```

**Request Body:**
```json
{
  "personalInfo": {
    "age": 35,
    "employmentStatus": "employed",
    "employmentDuration": 24
  },
  "financialInfo": {
    "monthlyIncome": 25000.00,
    "monthlyExpenses": 15000.00,
    "existingDebt": 5000.00,
    "creditScore": 650
  },
  "loanDetails": {
    "requestedAmount": 150000.00,
    "loanTerm": 24,
    "loanPurpose": "home_improvement"
  }
}
```

### 2. Get Loan Products
```
GET /api/loans/products
```

### 3. Calculate Interest Rate
```
POST /api/loans/calculate-rate
```

### 4. Get Validation Rules
```
GET /api/loans/validation-rules
```

## Testing

### Run Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

### Manual Testing

1. Open the application in your browser
2. Fill in the loan eligibility form with test data:
   - Age: 35
   - Employment Status: Employed
   - Employment Duration: 24 months
   - Monthly Income: R25,000
   - Monthly Expenses: R15,000
   - Existing Debt: R5,000
   - Credit Score: 650
   - Requested Amount: R150,000
   - Loan Term: 24 months
   - Loan Purpose: Home Improvement

3. Click "Check Eligibility" to see results

## Project Structure

```
loan-simulator/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express app entry point
│   │   ├── routes/
│   │   │   └── loanRoutes.ts     # API route handlers
│   │   ├── services/
│   │   │   └── loanService.ts    # Business logic
│   │   ├── middleware/
│   │   │   └── errorHandler.ts   # Error handling
│   │   ├── validators/
│   │   │   └── loanValidators.ts # Request validation
│   │   └── types/
│   │       └── loan.types.ts     # TypeScript types
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # Main app component
│   │   ├── main.tsx              # React entry point
│   │   ├── components/
│   │   │   ├── LoanForm.tsx      # Loan application form
│   │   │   └── ResultsDisplay.tsx # Results display
│   │   ├── utils/
│   │   │   ├── api.ts            # API client
│   │   │   └── validation.ts     # Form validation
│   │   └── types/
│   │       └── loan.types.ts     # TypeScript types
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── Dockerfile
├── package.json
└── README.md
```

## Production Considerations

### Security
- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation with Zod
- Environment variable management

### Performance
- Vite for optimized frontend builds
- TypeScript compilation for backend
- Docker multi-stage builds for smaller images
- Health check endpoint for monitoring

### Monitoring
- Health check endpoint: `/health`
- Structured error handling
- Request logging (can be extended)

## Environment Variables

### Backend
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `CORS_ORIGIN`: Allowed CORS origin (default: http://localhost:5173)

### Frontend
- `VITE_API_URL`: Backend API URL (default: http://localhost:3001)

## Build for Production

### Frontend
```bash
cd frontend
npm run build
```
Output: `frontend/dist/`

### Backend
```bash
cd backend
npm run build
```
Output: `backend/dist/`

### Full Production Build
```bash
npm run build
```

## Troubleshooting

### Port Already in Use
If port 3001 or 5173 is already in use, modify the port in:
- Backend: `backend/.env` (PORT variable)
- Frontend: `frontend/vite.config.ts` (server.port)

### CORS Issues
Ensure the `CORS_ORIGIN` environment variable in backend matches your frontend URL.

### Docker Build Issues
Make sure you're running the docker build command from the project root directory.

## License

This project is created as part of a technical assessment.

## Author

Nkosinathi Bezuidenhout

## Contact

For questions or issues, please contact through the provided channels.
