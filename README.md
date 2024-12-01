# Plan-It-Easy Backend

A serverless backend API for event planning and management built with AWS Lambda, DynamoDB, and TypeScript.

## Overview

Plan-It-Easy is a robust event management system that allows users to create, update, retrieve, and delete event plans. The system is built using a serverless architecture on AWS, providing scalability and cost-effectiveness.

## Technology Stack

- **Runtime**: Node.js 20.x
- **Language**: TypeScript
- **Framework**: Serverless Framework
- **Database**: Amazon DynamoDB
- **Cloud Provider**: AWS
- **API**: AWS API Gateway (HTTP API)
- **Build Tool**: esbuild

## Features

- Create and manage events
- User management system
- Multi-environment support (dev, stage, prod)
- Automated deployments via GitHub Actions
- DynamoDB for persistent storage
- RESTful API endpoints

## Prerequisites

- Node.js 20.x or later
- AWS Account
- Serverless Framework CLI configured
- AWS CLI configured
- GitHub account (for deployments)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/plan-it-easy.git
cd plan-it-easy
```

2. Install dependencies:
```bash
npm install
```

3. Install Serverless Framework globally:
```bash
npm install -g serverless
```

4. Create a `.env` file:
```
DYNAMODB_TABLE=EventPlansTable
```

## Local Development

1. Build the TypeScript code:
```bash
npm run build
```

2. Deploy to dev environment:
```bash
serverless deploy --stage dev
```

## Project Structure

```
├── src/
│   ├── handlers/       # Lambda function handlers
│   ├── models/         # Data models and interfaces
│   └── utils/          # Utility functions
├── layer/              # Lambda layer dependencies
├── dist/               # Compiled TypeScript output
├── .github/            # GitHub Actions workflows
├── serverless.yml      # Serverless Framework configuration
├── package.json
└── build.sh            # Shell script for packaging and building
```

## API Endpoints

### Events
- `POST /addEvent` - Create a new event
- `GET /getEvent` - Retrieve events (with pagination)
- `PUT /updateEvent` - Update an existing event
- `DELETE /eventplan/{id}` - Delete an event

### Users
- `POST /createUser` - Create a new user

For detailed API documentation, please refer to the [API Documentation](docs/API.md).

## Deployment

The project uses GitHub Actions for automated deployments to different environments:

- Push to `develop` branch deploys to dev environment
- Push to `staging` branch deploys to stage environment
- Push to `main` branch deploys to production environment

### Manual Deployment

To deploy manually to a specific environment:

```bash
# Deploy to dev
serverless deploy --stage dev

# Deploy to staging
serverless deploy --stage stage

# Deploy to production
serverless deploy --stage prod
```

## Environment Setup

### AWS Credentials

Set up AWS credentials with appropriate permissions:

1. Create an IAM user with programmatic access
2. Attach necessary policies for Lambda, DynamoDB, and API Gateway
3. Configure AWS credentials locally:
```bash
aws configure
```

### GitHub Secrets

Add the following secrets to your GitHub repository:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `SERVERLESS_ACCESS_KEY`

## DynamoDB Tables

### EventPlansTable
- Primary Key: `id` (String)
- Attributes:
  - name
  - description
  - date
  - location
  - createdBy
  - participants
  - createdAt
  - updatedAt

### UserTable
- Primary Key: `userId` (String)
- GSI: EmailIndex (email)
- Attributes:
  - email
  - name
