# FROM chainguard/nginx@sha256:e4ff957080737c90a9ecfeaa40e3d19ea9d687e9cacda2f2a031c75ffcdd72b7

# COPY nginx.conf /etc/nginx/conf.d/default.conf

# COPY ./html /usr/share/nginx/html

# EXPOSE 8080/tcp


	# vulnerable version
	# 1. Use the specific Nginx Alpine-Perl base image
	FROM nginx:stable-alpine3.24-perl

	COPY nginx.conf /etc/nginx/conf.d/default.conf

	# 2. Set the working directory to Nginx's default web root
	WORKDIR /usr/share/nginx/html

	# 3. Clean out the existing default Nginx welcome page (index.html, 50x.html)
	RUN rm -rf ./*

	# 4. Copy the CONTENTS of your local html folder into the current web root
	# Note the trailing slash on the source directory!
	COPY ./html/ ./

	# 5. (Optional) Fix file permissions so Nginx can read the assets
	RUN chmod -R 755 /usr/share/nginx/html

	# 6. Expose default Nginx port
	EXPOSE 80

	# 7. Start Nginx in the foreground (required for Docker containers)
	CMD ["nginx", "-g", "daemon off;"]