# Этап 1: Сборка (Build)
FROM node:20-alpine AS build
WORKDIR /app
# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install
# Копируем весь код и собираем проект
COPY . .
RUN npm run build

# Этап 2: Раздача статики через легковесный Nginx
FROM nginx:alpine
# Копируем собранные файлы из папки dist (стандарт Vite) в папку Nginx
COPY --from=build /app/dist /usr/share/nginx/html
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]