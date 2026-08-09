## 📌 Description
<!-- Provide a concise summary of the changes introduced in this PR -->

## 🏗️ Type of Change
- [ ] 🐛 Bug fix (non-breaking change fixing an issue)
- [ ] ✨ New feature (adds new functionality)
- [ ] 🛡️ Security hardening / Vulnerability patch
- [ ] ⚙️ Infrastructure / Docker / CI/CD configuration change

## 🧪 Testing & Verification
<!-- Describe how you tested these changes locally (e.g., `make re`, `docker compose up`) -->
- [ ] Executed `docker compose up --build` and verified container startup.
- [ ] Tested inter-container communication (Nginx -> Node -> PostgreSQL).
- [ ] Ran local Trivy security scan on modified container images.

## 🛡️ DevSecOps Checklist
- [ ] No hardcoded passwords, private keys, or API tokens introduced.
- [ ] Updated Dockerfile/Compose settings follow non-root privilege principles.
- [ ] All new dependencies scanned for known vulnerabilities.
- [ ] GitHub Actions CI pipeline passes all status checks.

## 🔗 Related Issues / Tickets
<!-- Link related issues, e.g., Closes #12 -->