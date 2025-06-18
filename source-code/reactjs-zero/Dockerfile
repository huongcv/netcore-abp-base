# Sử dụng Node.js 18 làm base image
FROM harbor.orenda.vn/node/node:18.16.1-alpine AS builder

# Thiết lập thư mục làm việc bên trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install --force
ARG ENV
# Sao chép toàn bộ mã nguồn vào thư mục làm việc
COPY . .
COPY .env.${ENV}.production .env
COPY .env.${ENV}.production .env.production

# Tạo file meta.json từ package.json
RUN echo "{\"version\": \"$(date +'%Y%m%d-%H%M')\"}" > public/meta.json

# Chạy script custom để generate API và build ứng dụng React
#RUN npm run gen-api

# Xây dựng ứng dụng React để tạo ra các file tĩnh
RUN npm run build

# Sử dụng nginx để serve các file tĩnh
FROM harbor.orenda.vn/nginx/nginx:1.27 AS production

# FROM nginx
WORKDIR /app
# Copy các file tĩnh từ build stage sang nginx
COPY --from=builder --chown=nginx:nginx /app/build /app
#RUN ls -la /usr/share/nginx/html
COPY --chown=nginx:nginx nginx.conf /etc/nginx/
# Expose port 80 để nginx có thể chạy



