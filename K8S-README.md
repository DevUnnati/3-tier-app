# Kubernetes Deployment (Kustomize)

This repo includes Kustomize bases and overlays for deploying the app (frontend + backend + postgres) to Kubernetes.

## Structure
- Base: `k8s/base` — Deployments/Services for backend, frontend, and PostgreSQL, plus DB secret.
- Overlays:
  - `k8s/overlays/dev` — Adds Ingress routing `/api` -> backend and `/` -> frontend, namespace `app-dev`.
  - `k8s/overlays/prod` — Sets backend replicas to 2, namespace `app-prod`.

## Prerequisites
- Kubernetes cluster
- `kubectl` and `kustomize` (kubectl has built-in `-k` support)
- Container registry accessible by the cluster
- Ingress controller (e.g., NGINX Ingress) for the dev overlay

## Build and Push Images
Update the images referenced by Kustomize (currently `backend:latest` and `frontend:latest`) to point to your registry (e.g., Docker Hub or ACR).

Example (Docker Hub):

```powershell
# Build images
docker build -t <dockerhub-username>/backend:latest backend
docker build -t <dockerhub-username>/frontend:latest frontend

# Push images
docker push <dockerhub-username>/backend:latest
docker push <dockerhub-username>/frontend:latest
```

Then, in overlays, set new names:
- Edit `k8s/overlays/dev/kustomization.yaml` and `k8s/overlays/prod/kustomization.yaml`:
```yaml
images:
  - name: backend
    newName: <dockerhub-username>/backend
    newTag: latest
  - name: frontend
    newName: <dockerhub-username>/frontend
    newTag: latest
```

## Apply (Dev Overlay)
```powershell
kubectl apply -k k8s/overlays/dev
kubectl get pods -n app-dev
kubectl get svc -n app-dev
kubectl get ingress -n app-dev
```

- With NGINX Ingress, access via the ingress controller’s address.
- Frontend fetches `/api/...` on the same host; the Ingress routes to backend.

## Apply (Prod Overlay)
```powershell
kubectl apply -k k8s/overlays/prod
kubectl get deploy -n app-prod
```

## Notes
- DB credentials are in `k8s/base/secret-db.yaml` (base64 for demo). Replace with your own Secret management.
- Postgres uses a `StatefulSet` with a `PersistentVolumeClaim` (1Gi); ensure a default StorageClass exists.
- If using AKS, prefer Azure Database for PostgreSQL (managed). I can generate IaC for that if needed.
- For Minikube, you can use `minikube service` to expose services or enable its Ingress addon.
