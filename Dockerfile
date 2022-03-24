FROM golang:1.14.9-alpine
RUN mkdir /build
ADD . /build/
WORKDIR /build
RUN go build
ENV PORT=3000
EXPOSE 3000
CMD ["./social-activities"]
