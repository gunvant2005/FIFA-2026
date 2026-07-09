# AURA – Deployment Guidelines

## Local Setup
1. Clone the repository
2. Run local docker instance:
   ```bash
   cd infra/docker
   docker-compose up --build
   ```

## Production
Apply Kubernetes configurations:
```bash
kubectl apply -f infra/kubernetes/
```
