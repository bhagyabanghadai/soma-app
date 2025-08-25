# SOMA - AI-Powered Sustainability Assistant

SOMA is a comprehensive sustainability dashboard designed for farmers and agricultural experts, providing real-time environmental monitoring, AI-powered insights, and regenerative farming guidance.

## 🌱 Features

### Core Dashboard
- **Environmental Monitoring**: Real-time NDVI, soil temperature, evapotranspiration, and drought risk assessment
- **Air Quality Tracking**: AQI monitoring with health recommendations
- **Weather Integration**: 3-day forecast with agricultural insights
- **AI Assistant**: Intelligent farming recommendations powered by GLM 4.5
- **Sustainability Metrics**: Carbon usage, water consumption, and environmental impact tracking

### Advanced Features
- **Regenerative Practices**: Comprehensive library of sustainable farming techniques
- **Farm Profile Management**: Crop tracking, equipment inventory, and certification management
- **Historical Analytics**: 12-month trend analysis with interactive charts
- **Environmental Alerts**: Real-time notifications for critical conditions
- **Export Functionality**: Downloadable reports with AI-powered recommendations

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** and **shadcn/ui** for components
- **TanStack React Query** for state management
- **Recharts** for data visualization
- **Vite** for build tooling

### Backend
- **Spring Boot 3.2** with Java 17
- **Spring Data JPA** with PostgreSQL/H2
- **Spring Security** with JWT authentication
- **Swagger/OpenAPI** for API documentation
- **Maven** for dependency management

### External APIs
- **NASA EarthData** for satellite agricultural data
- **National Weather Service** for weather forecasts
- **AQICN** for air quality monitoring
- **ZhipuAI GLM 4.5** for AI assistance

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Java 17+
- Maven 3.6+
- PostgreSQL (optional, H2 used for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bhagyabanghadai/soma-app.git
   cd soma-app
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Start the backend (optional)**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=your_postgresql_url
PGUSER=your_db_user
PGPASSWORD=your_db_password

# JWT
JWT_SECRET=your_jwt_secret_key

# API Keys (optional)
OPENWEATHER_API_KEY=your_openweather_key
NASA_API_KEY=your_nasa_key
ZHIPU_API_KEY=your_zhipu_key
```

## 📁 Project Structure

```
soma-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── contexts/      # React contexts
│   └── index.html
├── backend/               # Spring Boot backend
│   ├── src/main/java/com/soma/
│   │   ├── controller/    # REST controllers
│   │   ├── service/       # Business logic
│   │   ├── repository/    # Data access layer
│   │   ├── model/         # JPA entities
│   │   ├── dto/           # Data transfer objects
│   │   ├── config/        # Configuration classes
│   │   └── security/      # Security configuration
│   └── pom.xml
├── server/                # Express.js middleware
├── shared/                # Shared TypeScript schemas
└── package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Environmental Data
- `GET /api/weather?lat={lat}&lon={lon}` - Weather forecast
- `GET /api/nasa/earthdata?lat={lat}&lon={lon}` - Satellite data
- `GET /api/air-quality?lat={lat}&lon={lon}` - Air quality index

### Sustainability
- `POST /api/metrics/submit` - Submit sustainability metrics
- `GET /api/metrics/user/{id}` - Get user metrics
- `GET /api/metrics/summary` - Get metrics summary

### AI Assistant
- `POST /api/ai/chat` - Chat with AI assistant
- `GET /api/ai/recommendations?userId=` - Get AI recommendations

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/metrics` - Get all metrics
- `DELETE /api/admin/user/{id}` - Delete user

## 🧪 Testing

Run frontend tests:
```bash
npm test
```

Run backend tests:
```bash
cd backend
mvn test
```

## 📱 Mobile Support

SOMA is fully responsive and optimized for mobile devices with:
- Touch-friendly interface
- Offline data caching
- Progressive Web App (PWA) capabilities
- Optimized for rural connectivity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- NASA for providing satellite agricultural data
- National Weather Service for weather data
- AQICN for air quality monitoring
- ZhipuAI for AI assistance capabilities
- The open-source community for the amazing tools and libraries

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for sustainable agriculture**