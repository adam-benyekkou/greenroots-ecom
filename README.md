# GreenRoots

GreenRoots is a premium, high-fidelity e-commerce platform dedicated to global reforestation. Our mission is to connect individuals and organizations with impactful tree-planting projects worldwide, making it easy to foster biodiversity and fight climate change—one tree at a time.

## 🌿 About the Project

Designed with sustainable web design in mind, GreenRoots offers a unique, tactile user experience. We emphasize clarity, transparency, and the beauty of nature through curated visual effects like analog dithering and continent-specific color theming.

### Key Features

* **Global Catalog**: Browse reforestation projects across five continents.
* **Continent-Specific Theming**: Dynamic UI colors and image filters that adapt based on the project location.
* **Artisanal Aesthetic**: High-fidelity retro design featuring dithered images and a warm, organic color palette.
* **Seamless Checkout**: Integrated with Stripe for secure, fast tree sponsorships.
* **Dashboard Tracking**: Manage your trees and track the progress of the reforestation projects you support.

## 🛠 Technical Stack

* **Frontend**: React Router (v7), Vite, Vanilla CSS.
* **Backend**: Node.js, Express.
* **Database**: PostgreSQL.
* **Integrations**: Stripe (Payments), SMTP (Emails).
* **Infrastructure**: Docker, Nginx, Traefik, GitHub Actions (CI/CD).

## Architecture

```mermaid
graph TD
    User[User] -->|HTTPS| Traefik[Traefik Edge Router]
    Traefik -->|Routing| Front["Frontend @front (React Router/Vite)"]
    Traefik -->|Routing| Back["Backend @back (Express)"]
    Front -->|API Calls| Traefik
    Back -->|Queries| DB[(PostgreSQL)]
    Back -->|Payments| Stripe[Stripe API]
    Back -->|Emails| SMTP[SMTP Server]
```

## CI/CD & Testing

### Workflows

* **PR Checks**: Runs linting, type-checking, and unit tests on every Pull Request.
* **E2E Tests**: Runs Playwright end-to-end tests nightly and on `master` pushes.
* **Release**: Automates versioning and release notes creation on `master` pushes.
* **Deploy**: Deploys to the production VPS on `master` pushes.

## Running Tests Locally

### Backend Tests

```bash
cd @back
npm test                # Run unit/integration tests
```

### Frontend Tests

```bash
cd @front
npm run test:unit       # Run unit tests (Windows)
npm run test:e2e        # Run e2e tests
```

## Docker Commands

This project uses Docker Compose with different configurations for development and production environments.

## Development Environment

### Main Commands

```bash
npm run dev                    # Start application in development mode
npm run dev:build             # Start application and rebuild images
npm run dev:build:fresh       # Rebuild completely (no cache) and start
npm run dev:down              # Stop all development services
npm run dev:logs              # Show real-time logs
```

## Production Environment

### Main Commands

```bash
npm run prod                  # Start application in production mode
npm run prod:build           # Start application and rebuild images
npm run prod:build:fresh     # Rebuild completely (no cache) and start
npm run prod:down            # Stop all production services
```

## Docker Management

### Cleanup and Maintenance

```bash
npm run docker:clean         # Stop and remove containers, volumes, and networks
npm run docker:reset         # Complete cleanup + remove unused images
npm run docker:rebuild       # Stop and rebuild all images without cache
```

## Individual Services

### Backend Service

```bash
npm run backend              # Start only backend and database
npm run backend:fresh        # Rebuild and start backend with database
```

### Frontend Service

```bash
npm run frontend             # Start only frontend
npm run frontend:fresh       # Rebuild and start frontend
```

### Database

```bash
npm run database             # Start only database
```

## Service Logs

### Viewing Logs

```bash
npm run logs:backend         # Show real-time backend logs
npm run logs:frontend        # Show real-time frontend logs
npm run logs:database        # Show real-time database logs
```

## Container Access

### Interactive Shell

```bash
npm run shell:backend        # Open shell in backend container
npm run shell:frontend       # Open shell in frontend container
npm run shell:database       # Open shell in database container
```

## Docker Compose File Structure

The project uses a multi-file approach:

* `docker-compose.yml`: Shared base configuration
* `docker-compose.dev.yml`: Overrides for development
* `docker-compose.prod.yml`: Overrides for production

Commands automatically combine these files based on the targeted environment.
