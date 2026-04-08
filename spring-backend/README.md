# Spring Boot Backend for CampusHire

This Spring Boot backend is configured to connect to a MySQL database and expose REST endpoints under `/api`.

## Prerequisites
- Java 17 installed
- Maven installed
- MySQL running locally on `localhost:3306`
- A database named `campus_hire`

## Configure MySQL
1. Open MySQL Workbench and connect to your local MySQL server.
2. Run:
```sql
CREATE DATABASE IF NOT EXISTS campus_hire;
```
3. If you use a different username or password, set environment variables or update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/campus_hire?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASSWORD
```
You can also set these values using environment variables:
```powershell
$env:MYSQL_USER = 'root'
$env:MYSQL_PASSWORD = 'password'
$env:MYSQL_URL = 'jdbc:mysql://localhost:3306/campus_hire?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true'
```

## Run the backend
From the project root:
```bash
cd spring-backend
mvn spring-boot:run
```

The backend will start on `http://localhost:8081`.

## Available endpoints
- `GET /api/users`
- `GET /api/students`
- `POST /api/students`
- `GET /api/jobs`
- `POST /api/jobs`
- `DELETE /api/jobs/{id}`
- `GET /api/applications`
- `POST /api/applications`
- `GET /api/placements`
- `POST /api/upload`

## Frontend integration
The React app is configured to proxy `/api` to `http://localhost:8081` in `vite.config.js`.
If you run the frontend with `npm run dev`, backend calls are forwarded automatically.
