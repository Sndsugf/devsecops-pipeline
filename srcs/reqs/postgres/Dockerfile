FROM cgr.dev/chainguard/postgres@sha256:8fd8b4099889e826cd3287e19cf95ba9284a7e0b7dee19b768341348974e1031

COPY ./init.sql /var/lib/postgres/initdb/init.sql

# COPY entrypoint-wrapper.sh /usr/local/bin/entrypoint-wrapper.sh

# USER root
# RUN chmod +x /usr/local/bin/entrypoint-wrapper.sh
# USER postgres

# ENTRYPOINT ["/usr/local/bin/entrypoint-wrapper.sh"]

# CMD ["postgres"]
