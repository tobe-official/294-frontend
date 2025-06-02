FROM golang:1.24.3

# Copy go.mod and go.sum
COPY go.mod ./

# Download dependencies
RUN go mod download

# Copy the rest of the app
COPY . .

EXPOSE 8090

CMD go run . serve --http=0.0.0.0:8090 --dir=pb_data
