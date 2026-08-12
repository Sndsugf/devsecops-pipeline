FROM ghcr.io/betterleaks/betterleaks@sha256:16f903f0100ce7358ef1f870858777e55bec94cf04c6b65c45d013274ea3311c

# Set the working directory where pre-commit will mount the repo (it's /src by default)
WORKDIR /src