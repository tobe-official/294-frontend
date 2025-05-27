🚀 Getting Started

This project includes:
	•	🔧 PocketBase for backend and authentication
	•	🌐 Angular frontend (SSR-ready)
	•	🐳 Docker-based development workflow

⸻

🗄️ Start Backend Only (PocketBase)

To run only the PocketBase backend in detached mode:

```bash
docker compose up -d pocketbase
```

PocketBase will be available at `http://localhost:8090/_`

⸻

🌐 Start the Full Application (Frontend + Backend)

To spin up both the Angular frontend and PocketBase backend:

```bash
docker compose up -d
```

1. Angular frontend: `http://localhost:4200`
2. PocketBase backend: `http://localhost:8090`

⸻

🔐 Default Backend Admin User

Use the following credentials to log into PocketBase:

Email:    test@example.com
Password: 1234567890

⚠️ These credentials are for development only. Update them before deploying to production.

⸻

📌 Notes
	•	✅ Ensure Docker is installed and running on your machine.
	•	🛠️ The first run may take longer as Docker builds images and installs dependencies.
	•	📁 Services are defined in `docker-compose.yml`￼.
	•	🧪 Angular uses SCSS and includes linting, testing, and SSR options ￼ ￼.
	•	📦 Backend data is persisted in ./backend/pb_data, mounted into the container for persistence. However, it is not persisted in the repository.
     

