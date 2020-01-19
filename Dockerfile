FROM nginx:alpine
WORKDIR frontend
COPY ./utils utils/
COPY ./dist /usr/share/nginx/html
