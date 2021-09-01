FROM alpine:latest

RUN apk --no-cache add python3 nodejs npm

RUN npm install -g typescript sass

COPY [".", "."]

CMD ["python3", "build.py", "-b", "-c"]
