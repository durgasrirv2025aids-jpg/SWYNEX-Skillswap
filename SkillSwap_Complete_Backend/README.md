# SkillSwap – Student Skill Exchange Platform (Backend REST API)

SkillSwap is a backend REST API built with **Java 21**, **Spring Boot 3**, **Spring Security + JWT**, **Spring Data JPA**, and **MySQL** that enables students to register, manage profiles, add `TEACH` and `LEARN` skills, discover mutual learning partners, send/manage exchange requests, track connections, and receive notifications.

## Features
- **Authentication & Security:** Student registration, BCrypt password hashing, JWT authentication, stateless session management, role-based authorization (`ROLE_STUDENT`, `ROLE_ADMIN`), and logout endpoint.
- **Student Profiles:** View/update own profile, view student profiles by ID, search/filter students with pagination, view skills and connections.
- **Skill Management:** Catalog management (`Skill`) and student skill assignments (`TEACH` / `LEARN`) with duplicate prevention and ownership checks.
- **Mutual Skill Matching:** Matches students where Student A teaches what Student B wants to learn AND Student A wants to learn what Student B teaches, excluding self, disabled accounts, and already-connected students, with skill/college/department filters.
- **Exchange Requests:** Send, view sent/received, accept, reject, or cancel pending requests; reciprocal skill verification; automatic connection creation upon acceptance.
- **Connections & Notifications:** Track mutual connections, view exchanged skills summary, remove connections, and read/mark notifications in MySQL.
- **Admin Module (`ROLE_ADMIN`):** View dashboard statistics, list students, enable/disable student accounts, and view all skills, requests, and connections.

## Technology Stack
- **Java 21**
- **Spring Boot 3.4.3** (Web, Data JPA, Security, Validation)
- **MySQL 8+** & **Hibernate**
- **JWT (`io.jsonwebtoken` 0.12.6)** & **BCrypt**
- **Maven**
- **JUnit 5 & Mockito**

## Complete Folder Structure
```text
SkillSwap_Complete_Backend/
├── pom.xml
├── README.md
├── api-tests.http
├── .gitignore
└── src/
    ├── main/
    │   ├── java/com/skillswap/
    │   │   ├── SkillSwapApplication.java
    │   │   ├── config/
    │   │   ├── controller/
    │   │   ├── dto/
    │   │   ├── entity/
    │   │   ├── enums/
    │   │   ├── exception/
    │   │   ├── repository/
    │   │   ├── security/
    │   │   ├── service/
    │   │   └── util/
    │   └── resources/
    │       └── application.properties
    └── test/
        └── java/com/skillswap/
            ├── SkillSwapApplicationTests.java
            └── service/SkillSwapServiceTests.java
```

## Database Setup & MySQL Configuration
1. Ensure MySQL server is running on `localhost:3306`.
2. Database name: `skillswap_db` (auto-created if `createDatabaseIfNotExist=true` is enabled).
3. Configure environment variables or update `src/main/resources/application.properties`:
   - `DB_HOST` (default: `localhost`)
   - `DB_PORT` (default: `3306`)
   - `DB_NAME` (default: `skillswap_db`)
   - `DB_USERNAME` (default: `root`)
   - `DB_PASSWORD` (default: `root`)
   - `JWT_SECRET`
   - `JWT_EXPIRATION_MS` (default: `86400000`)

Tables managed by JPA (`spring.jpa.hibernate.ddl-auto=update`):
1. `students`
2. `skills`
3. `student_skills`
4. `exchange_requests`
5. `connections`
6. `notifications`

## Maven Setup & How to Run
In **IntelliJ IDEA**:
1. Open `SkillSwap_Complete_Backend` as a Maven project (`File -> Open -> select pom.xml`).
2. Set Project SDK to **Java 21**.
3. Run `SkillSwapApplication.main()` or use terminal:
   ```bash
   mvn clean test
   mvn clean package
   mvn spring-boot:run
   ```

## Authentication Instructions
1. Register a student via `POST /api/auth/register`.
2. Log in via `POST /api/auth/login` to receive a JWT `token`.
3. Include the header `Authorization: Bearer <token>` on all protected endpoints.

## Sample Request & Response
### Register (`POST /api/auth/register`)
Request:
```json
{
  "fullName": "Karthik Kumar",
  "email": "karthik@skillswap.edu",
  "password": "Password123",
  "collegeName": "PSG Tech",
  "department": "CSE",
  "yearOfStudy": 3,
  "bio": "Java and Spring Boot developer"
}
```
Response (`201 Created`):
```json
{
  "success": true,
  "message": "Student registered successfully",
  "data": {
    "studentId": 1,
    "fullName": "Karthik Kumar",
    "email": "karthik@skillswap.edu",
    "collegeName": "PSG Tech",
    "department": "CSE",
    "yearOfStudy": 3,
    "accountStatus": "ACTIVE",
    "role": "STUDENT",
    "createdAt": "2026-11-25T19:00:00"
  },
  "timestamp": "2026-11-25T19:00:00"
}
```

## Testing Instructions
Run JUnit 5 & Mockito tests using:
```bash
mvn test
```
Use `api-tests.http` directly in IntelliJ IDEA HTTP Client or import endpoints into Postman.
