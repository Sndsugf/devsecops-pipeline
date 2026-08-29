SRCS_COMPOSE = docker compose -f ./srcs/compose.yaml
# ZAP_COMPOSE  = docker compose --project-directory . -f ./ci_cd/zaproxy/compose.yaml
ZAP_COMPOSE  = docker compose -f ./ci_cd/zaproxy/compose.yaml
SNYK_COMPOSE = docker compose --env-file .env -f ./ci_cd/snyk/compose.yaml 
# TRIVY_COMPOSE = docker compose -f ./ci_cd/trivy/compose.yaml
# MONITORING_COMPOSE = docker compose --project-directory . -f ./ci_cd/monitoring/compose.yaml

# 1. Build and launch the application stack
app-up:
	$(SRCS_COMPOSE) up -d --build

# Build host images without starting running containers
app-build:
	docker compose -f ./srcs/compose.yaml build

# 2. Local Image-Dependent Scan: Snyk Container
snyk-scan: app-build
	@echo "==> Executing Snyk SCA, Container, and IaC tests..."
	$(SNYK_COMPOSE) up --exit-code-from snyk-scanner
	$(SNYK_COMPOSE) down

# 3. Local Runtime Scan: OWASP ZAP DAST
zap-scan: app-build
	@echo "==> Running containerized OWASP ZAP DAST scan..."
	$(ZAP_COMPOSE) up --exit-code-from zap-scanner
	$(ZAP_COMPOSE) down


# Run all local security checks in sequence
sec-local: snyk-scan zap-scan

# monitoring-up:
# 	@echo "==> Starting Prometheus, cAdvisor, and Grafana..."
# 	$(MONITORING_COMPOSE) up -d

# monitoring-down:
# 	@echo "==> Stopping Monitoring Stack..."
# 	$(MONITORING_COMPOSE) down

# Start app, run security scans, and launch monitoring
pipeline-all: app-up snyk-scan zap-scan 
	@echo "==> Full DevSecOps pipeline"

.PHONY: app-up app-build snyk-scan zap-scan sec-local pipeline-all