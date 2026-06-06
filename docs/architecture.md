# Habesha Market — System Architecture

## Overview
Three-layer architecture: Frontend → Backend API → Database

## Tech Stack
| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | Next.js 14, Tailwind CSS, Axios   |
| Backend    | NestJS, TypeScript                |
| Database   | PostgreSQL                        |
| ORM        | TypeORM                           |
| Auth       | JWT (JSON Web Token) + bcrypt     |
| Deployment | Vercel (frontend) + Render (backend) |

## API Modules
| Module    | Base URL     | Purpose                    |
|-----------|--------------|----------------------------|
| Auth      | /auth        | Register, Login, Logout    |
| Users     | /users       | User profile management    |
| Products  | /products    | Product CRUD               |
| Cart      | /cart        | Shopping cart              |
| Orders    | /orders      | Order placement & tracking |
| Sellers   | /sellers     | Seller dashboard           |
| Admin     | /admin       | Admin controls             |

## Data Flow
Request → NestJS → JWT Middleware → Role Guard → Controller → Service → Database → Response