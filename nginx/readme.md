# Paylift Backend – Nginx Reverse Proxy Setup

## 📌 Overview

This project uses Nginx as a reverse proxy in front of the Paylift backend service.

Nginx is responsible for:

- Listening on HTTP traffic
- Forwarding incoming requests to the backend service
- Handling file uploads
- Passing client IP and protocol headers
- Supporting WebSocket connections

---

# 🏗 System Architecture

Client (Browser / Mobile App)
│
▼
Nginx (Reverse Proxy)
│
▼
Backend Application

All incoming HTTP traffic is securely forwarded to the backend service internally.

---

# 📂 Project Structure

project-root/
│
├── nginx/
│ └── nginx.conf
│
├── docker-compose.yml
└── README.md

---

# ⚙️ Nginx Configuration

## nginx/nginx.conf

```nginx
events {}

http {
    server {
        listen 80;

        location / {
            proxy_pass http://backend-service;
            proxy_http_version 1.1;

            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;

            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        client_max_body_size 50M;
    }
}
```

---

# 🔎 Configuration Explanation

- Nginx listens for HTTP traffic.
- Requests are internally forwarded to the backend service.
- Proxy headers ensure correct client identification.
- File upload limit is configured for application requirements.

Sensitive infrastructure details (internal container names, ports, networks) are intentionally omitted for security reasons.

---

# 🐳 Docker Setup (Sanitized)

```yaml
nginx:
  image: nginx:latest
  ports:
    - "80:80"
  volumes:
    - ./nginx/nginx.conf:/etc/nginx/nginx.conf
  depends_on:
    - backend
  restart: unless-stopped
```

---

# 🚀 How to Run

Start services:

docker-compose up -d

Check running containers:

docker ps

Restart reverse proxy:

docker restart <nginx-container>

Stop services:

docker-compose down

---

# 🧪 Testing

Access the application using your server domain or public IP address.

---

# 🔐 Security Notes

- Internal service names and ports are not exposed publicly.
- Only port 80 is exposed externally.
- Backend service remains inside private Docker network.
- Proxy headers are configured to preserve client information.
- File upload limits are enforced.

For production environments:

- Enable HTTPS (SSL/TLS)
- Implement rate limiting
- Enable logging and monitoring
- Use firewall rules to restrict server access
- Regularly update Nginx and Docker images

---

# ✅ Summary

Nginx is configured as a secure reverse proxy for the Paylift backend.  
Internal infrastructure details are abstracted to reduce exposure risk while maintaining proper documentation.
