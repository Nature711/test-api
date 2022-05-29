## Introduction
# Motivation
For cost and performance concern, a private API Gateway has been built to facillitate the internal service-to-service communication. However, as part of the CI/CD workflow,
the deployment is done in several stages and by a number of different programmers. It's getting increasingly challenge to keep track of all the information and data. 


This API provides access to the deployment info via a call to AWS Lambda function, which itself acts as an API that provides READ/WRITE functionality.
As a new version of deployment is submitted, the related deployment information will automatically be pushed to the WRITE API, which is then stored in a DynamoDB database. 
The deployment information can be visualized from a [Grafana dashboard](http://localhost:3000/d/vTsIsv97k/deployment-dashboard-v0?orgId=1&from=1653823211819&to=1653826811819),
which fetches data via calls to the READ API. Queries and filters are also supported for more efficient lookup of relevant information. 

## Getting Started

As the API is still in development, no authentication is required yet. Any user with the URL can make HTTP request to invoke the API.

## Read API

The READ API allows user to read

# Using GET request

GET request can be directly performed by invoking URL. The default URL below returns all the deployment entries in the DynamoDB.

```https://2wyvskffzqvuh7woat5mt66yt40rtjbj.lambda-url.us-west-2.on.aws/```

# GET request with query parameters

```https://2wyvskffzqvuh7woat5mt66yt40rtjbj.lambda-url.us-west-2.on.aws/?eventType=filterStage&stage=Dev```

## Write API
