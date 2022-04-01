# Bonsai: Auth Management Service

## Description

This service is responsible to authenticate user via API

## Service Dependencies

- User Management Service

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Build Docker Image

```bash
make build-image
```

## Run Auth Management Image

Make sure docker network with name bonsai-network already exist

```bash
docker run -it --rm --network bonsai-network --name auth-service -d \
-e 'JWT_SECRET_KEY=Yx$83(js)a#UgH' \
-e 'JWT_EXPIRATION=31d' \
-e 'SERVICE_USER_NAME=USER_CLIENT' \
-e 'SERVICE_USER_HOST=user-service-host' \
-e 'SERVICE_USER_PORT=4010' \
-p 3000:3000 kadekpradnyana/bonsai-auth-mgmt
```

## Run Kubernetes Deployment

Make sure minikube is installed on your machine since we're going to use it for easy development

First, refresh your minikube environment by typing this command. These example will run two nodes. You can modify it as you want.

```bash
minikube delete
minikube start --nodes=2
```

Second, apply the deployment file.

```bash
kubectl apply -f deployment.yaml
```

Third, start minikube service from the service name.

```bash
kubectl get svc
minikube service auth-service
```