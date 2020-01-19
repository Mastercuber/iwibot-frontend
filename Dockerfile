FROM nginx:alpine
WORKDIR frontend
COPY ./utils /frontend/utils
COPY ./dist /usr/share/nginx/html
