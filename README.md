# DevSecOps Pipeline — Architecture & Quick Start

This repository contains an automated DevSecOps pipeline for a containerized 3-tier web application (Nginx frontend, Node.js API, PostgreSQL). It integrates static analysis, SCA, container checks, DAST, and local orchestration to help you test and harden the stack locally.

---

## Architecture Overview

```text
               +-------------------------------------------------+
               |                Local Developer                  |
               +-------------------------------------------------+
                                        |
                                        v
                 [ Pre-Commit Hooks / Secrets Scanning ]
                                        |
                                        v
                            [ Root Makefile Automation ]
                                        |
       +--------------------------------+--------------------------------+
       |                                |                                |
       v                                v                                v
 [1] Build & App Stack       [2] Pre-Deployment Scan         [3] Runtime DAST Scan
 - Nginx (Frontend)         - Snyk SCA (Dependencies)       - OWASP ZAP (Baseline)
 - Node.js (API)            - Snyk Container (Images)       - Targets running app
 - PostgreSQL (DB)          - Snyk IaC (Manifests)          - Runs over devsec-net
```

## Prerequisites

- Operating System: Linux (or WSL2 with a Linux filesystem)
- Docker Engine 24+ and Docker Compose v2
- Make (used by the repository Makefile)

### API keys / Environment
Create a `.env` file at the repository root with at least the following values:

```env
SNYK_TOKEN=your_snyk_api_token_here
POSTGRES_PASSWORD=devSecOps2026
```

## Quickstart

1. Build local images (no containers):

```bash
make app-build
```

2. Start the full 3-tier stack in detached mode:

```bash
make app-up
```

3. Run security scans (examples):

```bash
make snyk-scan      # runs Snyk SCA, container, and IaC scans using ./ci_cd/snyk/compose.yaml
make zap-scan       # runs OWASP ZAP DAST against the running web app using ./ci_cd/zaproxy/compose.yaml
make sec-local      # runs local static, image and configuration scans sequentially on a running app
make pipeline-all   # end-to-end: app-up -> sec-local (pre-deploy scans) -> zap-scan
```

## Toolchain 

- **Snyk**: SCA for packages, container image scanning, and IaC checks.
- **OWASP ZAP**: DAST baseline and active scans against the running application.
- **Container Hardening**: Minimal/distroless base images, non-root users, multi-stage builds, and isolated Docker networks.



## Secrets & Code Scanning (Betterleaks + CodeQL)

This project uses `betterleaks` for secret detection and `pre-commit` for local checks. Verify that `.pre-commit-config.yaml` exists at the repository root. To run checks locally:

```bash
# install pre-commit if needed
pip install pre-commit
# run all hooks on files
pre-commit run --all-files
```

The `betterleaks` hook detects secrets and prevents them from being committed. Adjust the hook configuration in `.pre-commit-config.yaml` as needed.

For CI code scanning, this project uses CodeQL via GitHub Actions. The workflow file lives at `.github/workflows/ci.yml`. CodeQL runs static analysis on pull requests and surfaces findings in GitHub's Security tab.


# Useful resources

Recommended links for tooling, benchmarks, and guidance used in this repository:

- OWASP Top Ten — https://owasp.org/www-project-top-ten/
- CIS Docker Benchmark — https://www.cisecurity.org/benchmark/docker/
- Snyk Documentation — https://docs.snyk.io/
      - Snyk CLI — https://docs.snyk.io/cli/snyk
      - Scan container images with Snyk — https://docs.snyk.io/products/snyk-container/using-snyk-container/scan-your-container-image
- OWASP ZAP Documentation — https://www.zaproxy.org/docs/
      - ZAP Docker & CI/CD info — https://www.zaproxy.org/docs/docker/
- Docker Engine security & hardening — https://docs.docker.com/engine/security/
- Chainguard images & minimal base information — https://www.chainguard.dev/
- Docker Compose spec (restart behavior) — https://github.com/compose-spec/compose-spec/blob/main/spec.md#restart
- Pre-commit — https://pre-commit.com/
- CodeQL / GitHub Code Scanning — https://docs.github.com/en/code-security/code-scanning
- BetterLeaks -- https://github.com/betterleaks/betterleaks

# Licensing & Third-Party Components

This project utilizes hardened, minimal, and distroless container images from multiple trusted providers to eliminate unnecessary dependencies and reduce CVE exposure.

### Base Container Images

* **Docker Hardened Images (`dhi.io`):** Licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
* **Chainguard Images (`chainguard/*`):** Base configurations distributed under open-source licenses ([Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) / [MIT](https://opensource.org/licenses/MIT)).
* **Minimus Base Images (`reg.mini.dev`):** Distributed under open-source permissive terms.

### Software Bill of Materials (SBOM) & Upstream Components

All third-party binaries and packages contained within these images (e.g., Nginx, PostgreSQL, Node.js) remain subject to their respective original open-source software licenses (such as BSD-2-Clause, PostgreSQL License, and MIT).

* For detailed component breakdowns and vulnerability attestation for Docker Hardened Images, refer to the official SBOM at [https://dhi.io](https://dhi.io).
* For Chainguard image attestations and SBOM information, visit the [Chainguard Developer Portal](https://images.chainguard.dev/).