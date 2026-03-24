# Website Architecture and Runtime Overview

This document explains how the Cameron Hammond Digital Portfolio website is built and runs in production.

## Current Live Website

Live AWS architecture reference:
- https://www.cameronhammonddigitalportfolio.com/aws-main.html

The live site currently includes the AWS infrastructure stack below. The AI-agent stack is documented here as part of the full architecture, but is not yet represented in the live AWS-only page.

## Core AWS Services

### AWS Amplify (Hosting)
- Hosts and serves the website frontend.
- Handles deployment workflow for publishing site updates.
- Provides a managed hosting layer so the site is easy to maintain and update.

### Amazon Route 53 (DNS)
- Manages DNS records for the domain.
- Routes traffic to the hosted application endpoint.
- Supports reliable domain resolution for the public site.

### Amazon S3 (Image Storage)
- Stores website images and other static media assets.
- Keeps asset delivery separate from application logic.
- Supports scalable and durable object storage for portfolio media.

### AWS Lambda + API Gateway (Backend API Layer)
- API Gateway exposes HTTPS endpoints for backend features.
- Lambda runs serverless backend logic on demand.
- Together they provide a lightweight, scalable API layer without managing servers.

### Amazon DynamoDB (Data Layer)
- Stores structured application data in a managed NoSQL database.
- Supports low-latency reads/writes for dynamic site interactions.
- Integrates with Lambda for serverless data access patterns.

## AI Agent Service Integrations (Additional Stack)

These services are part of the AI-agent capabilities used by the project:

### Gemini API
- Provides large language model capabilities for the AI agent.
- Supports reasoning, response generation, and assistant-like interactions.

### Tavily API
- Adds external search/retrieval capability for the AI agent.
- Helps the agent gather relevant web information when needed.

### Calculator Tool
- Gives the AI agent deterministic arithmetic support.
- Used for accurate math operations where model-only reasoning may be less reliable.

## End-to-End Runtime Flow (High Level)

1. User visits the domain managed by Route 53.
2. Route 53 directs traffic to the Amplify-hosted frontend.
3. Frontend loads static assets such as images from S3.
4. For dynamic operations, frontend calls API Gateway endpoints.
5. API Gateway invokes Lambda functions.
6. Lambda reads/writes relevant data in DynamoDB.
7. For AI-enabled flows, the agent layer can call Gemini API, Tavily API, and Calculator tooling.

## Notes

- The public AWS architecture page currently reflects the cloud infrastructure components.
- AI-agent services (Gemini, Tavily, Calculator tool) are additional application capabilities beyond the AWS-only architecture view.
