# Campus Placement Management System

A comprehensive full-stack web application for managing campus placements with AI-powered predictions and recommendations.

## Features

### Student Portal
- Dashboard with placement status and performance metrics
- Job openings browsing and application tracking
- AI-powered company recommendations based on profile
- Performance analytics with CGPA trends and skill assessments
- Alerts for placement drives and interviews
- Messaging with mentors for guidance

### Mentor Portal
- Manage assigned students with filtering options
- Track student readiness and placement progress
- Answer student queries through messaging
- Analytics on student performance and placement trends

### Admin Portal
- User management (students, mentors, admins)
- Company management and recruitment tracking
- Comprehensive analytics and reports
- Department-wise placement statistics
- System settings and configuration

### Advanced Features
- **ML Placement Prediction**: Predicts placement probability using logistic regression
- **Recommendation Engine**: Suggests best-fit companies based on CGPA, skills, and specialization
- **Alerts System**: Automated notifications for placement drives, interviews, and performance
- **Data Visualization**: Charts for placement trends, skill distribution, and company comparison
- **Reports**: Exportable analytics and insights

## Tech Stack

- **Frontend**: React, Next.js, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes and an Express API service
- **Database**: MongoDB Atlas with Mongoose
- **Charts**: Recharts
- **UI Components**: shadcn/ui

## Getting Started

### Prerequisites
- Node.js 20.9+
- npm or yarn

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd campus-placement-system
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
npm install --prefix backend
\`\`\`

3. Configure local environment variables:
   - In the repository root `.env.local`, set `API_URL=http://localhost:5000`.
   - In `backend/.env`, set `MONGO_URI` and a private `JWT_SECRET`.
   - Do not commit either environment file.

4. Run the development server
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The Next.js frontend is deployed on Vercel. The Express API in `backend/` must run as a separate web service.

### Render API service

Create a Render Web Service from this repository with:

- Root Directory: `backend`
- Build Command: `npm ci`
- Start Command: `npm start`
- Health Check Path: `/healthz`
- Environment variables:
  - `MONGO_URI`: the Atlas connection URI, with `placeconnect` as the database name
  - `JWT_SECRET`: a randomly generated secret; keep it private

Allow the Render service's outbound IP addresses in the Atlas IP Access List. Do not use `0.0.0.0/0` for production.

### Vercel frontend

Set the server-side `API_URL` environment variable to the Render service's public base URL, then redeploy the existing Vercel project. The existing frontend domain remains unchanged.

Public registration creates student accounts only. Mentor and admin accounts must be provisioned by a trusted administrator.

## Project Structure

\`\`\`
├── app/
│   ├── api/                 # API routes
│   ├── dashboard/           # Dashboard pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Login page
│   └── globals.css         # Global styles
├── components/
│   ├── auth/               # Authentication components
│   ├── charts/             # Chart components
│   ├── layout/             # Layout components
│   ├── ml/                 # ML components
│   └── ui/                 # UI components
├── lib/
│   ├── ml-model.ts         # ML prediction model
│   ├── recommendation-engine.ts
│   └── alert-engine.ts
└── public/                 # Static assets
\`\`\`

## Database Schema

### Students Collection
\`\`\`javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  cgpa: Number,
  department: String,
  specialization: String,
  skills: [String],
  internships: Number,
  projects: Number,
  placed: Boolean,
  placedCompany: String,
  salary: Number,
  createdAt: Date
}
\`\`\`

### Mentors Collection
\`\`\`javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  department: String,
  assignedStudents: [ObjectId],
  createdAt: Date
}
\`\`\`

### Companies Collection
\`\`\`javascript
{
  _id: ObjectId,
  name: String,
  industry: String,
  location: String,
  openings: Number,
  requiredSkills: [String],
  minCGPA: Number,
  avgSalary: Number,
  createdAt: Date
}
\`\`\`

### Placements Collection
\`\`\`javascript
{
  _id: ObjectId,
  studentId: ObjectId,
  companyId: ObjectId,
  salary: Number,
  position: String,
  placedDate: Date,
  createdAt: Date
}
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/check` - Check authentication status

### Recommendations
- `POST /api/recommendations` - Get company recommendations

### Alerts
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts` - Create new alert

### ML Prediction
- `POST /api/ml/predict` - Predict placement probability

## ML Model Details

The placement prediction model uses logistic regression with the following features:
- CGPA (25% weight)
- Internships (15% weight)
- Projects (12% weight)
- Communication Skill (10% weight)
- Technical Skill (15% weight)
- Aptitude Score (15% weight)
- Previous Placement Experience (8% weight)

The model outputs:
- Placement probability (0-100%)
- Risk level (low, medium, high)
- Personalized recommendations
- Model confidence score

## Future Enhancements

- Real-time chat with WebSocket integration
- Email notifications for alerts
- Resume parsing and analysis
- Interview scheduling system
- Video interview integration
- Advanced ML models (Random Forest, Neural Networks)
- Mobile app (React Native)
- Analytics dashboard for placement officers

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@campusplacement.com or open an issue on GitHub.
