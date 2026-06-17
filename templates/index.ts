import type { Template } from "@/types";

const dockerCheatSheet: Template = {
  id: "docker",
  name: "Docker Cheat Sheet",
  description: "Essential Docker & Docker Compose commands",
  markdown: `# Docker Cheat Sheet

## Start / Stop
\`\`\`
docker compose up -d
\`\`\`
Start all containers in detached mode

\`\`\`
docker compose down
\`\`\`
Stop and remove containers

\`\`\`
docker compose restart
\`\`\`
Restart all services

## Logs & Monitoring
\`\`\`
docker logs -f container
\`\`\`
Stream container logs

\`\`\`
docker stats
\`\`\`
Live CPU / memory usage

\`\`\`
docker inspect container
\`\`\`
Full container metadata

## Images
\`\`\`
docker build -t name:tag .
\`\`\`
Build image from Dockerfile

\`\`\`
docker pull image:tag
\`\`\`
Pull image from registry

\`\`\`
docker image prune -a
\`\`\`
Remove all unused images

## Containers
\`\`\`
docker exec -it container bash
\`\`\`
Open interactive shell

\`\`\`
docker cp file.txt container:/path
\`\`\`
Copy file into container

\`\`\`
docker rm -f container
\`\`\`
Force remove running container

## Volumes & Network
\`\`\`
docker volume ls
\`\`\`
List all volumes

\`\`\`
docker network inspect bridge
\`\`\`
Inspect network details

\`\`\`
docker system prune --volumes
\`\`\`
Clean up everything unused
`,
};

const laravelSecurityChecklist: Template = {
  id: "laravel-security",
  name: "Laravel Security Checklist",
  description: "Production security hardening for Laravel apps",
  markdown: `# Laravel Security Checklist

## Environment & Config
- Never commit .env to version control
- Set APP_ENV=production and APP_DEBUG=false
- Rotate APP_KEY before every deployment
- Use strong, random database passwords

## Authentication
- Enable email verification on registration
- Enforce password minimum length of 12+ chars
- Add rate limiting to login routes
- Use Laravel Sanctum or Passport for APIs
- Implement 2FA for admin accounts

## SQL & Data
- Always use Eloquent ORM or query builder
- Never interpolate user input into raw queries
- Validate all input with Form Requests
- Use $fillable instead of $guarded = []
- Sanitize output with Blade {{ }} escaping

## Routes & Middleware
- Apply auth middleware to all protected routes
- Use route model binding to prevent IDOR
- Add CSRF protection to all state-changing forms
- Restrict admin routes with role middleware

## File Uploads
- Validate MIME type server-side, not just extension
- Store uploads outside public directory
- Generate random filenames on upload
- Set max file size limits in nginx/php.ini

## Headers & HTTPS
- Force HTTPS with HSTS header
- Set Content-Security-Policy header
- Add X-Frame-Options: DENY
- Disable X-Powered-By header in php.ini
`,
};

const devOpsMistakes: Template = {
  id: "devops-mistakes",
  name: "Common DevOps Mistakes",
  description: "Top mistakes to avoid in DevOps & infrastructure",
  markdown: `# Common DevOps Mistakes

## CI/CD Pipeline
- Skipping tests to speed up deployment
- Not pinning dependency versions in pipelines
- Running CI as root user inside containers
- No rollback strategy defined before going live
- Ignoring flaky tests instead of fixing them

## Infrastructure
- Hardcoding credentials in Terraform or Helm charts
- No resource limits on Kubernetes pods
- Using latest tag for Docker images in production
- Not tagging cloud resources (cost tracking nightmare)
- Single-AZ deployments for critical services

## Monitoring & Alerts
- Only monitoring uptime, not business metrics
- Alert fatigue from too many low-priority alerts
- No on-call rotation — always the same person
- Missing slow query monitoring for databases
- Not setting SLO/SLA thresholds before launch

## Security
- Opening port 22 to 0.0.0.0/0 in security groups
- Not rotating secrets after team member offboarding
- Skipping security scans in the CI pipeline
- Storing secrets in plain environment variables
- No audit logging for production access

## Deployments
- Deploying on Friday afternoons
- No feature flags — big bang releases only
- Skipping staging environment for hotfixes
- No database migration rollback scripts
- Manual deployments with undocumented steps
`,
};

export const templates: Template[] = [
  dockerCheatSheet,
  laravelSecurityChecklist,
  devOpsMistakes,
];

export function getTemplate(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}
