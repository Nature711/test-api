## Introduction
### Motivation
For cost and performance concern, a private API Gateway has been built to facillitate the internal service-to-service communication. However, as part of the CI/CD workflow, the deployment of such gateway needs to be done in several stages and by a number of different programmers. To better monitor the deployment process and gain insights into the related data, it's necessary to store the deployment information into a database and then visualize on a dashboard. 

This API provides access to the deployment info via a call to AWS Lambda function, which itself acts as an API that provides READ/WRITE functionality.
As a new version of deployment is submitted, the related deployment information will automatically be pushed to the WRITE API, which is then stored in a DynamoDB database. 

The deployment information can be visualized from a [Grafana dashboard](http://localhost:3000/d/vTsIsv97k/deployment-dashboard-v0?orgId=1&from=1653823211819&to=1653826811819), which fetches data via calls to the READ API. Queries and filters are also supported for more efficient lookup of relevant information. 

## Getting Started

As the API is still in development, no authentication is required yet. Any user with the URL can make HTTP request to invoke the API.

## Read API

The READ API allows user to read the deployment entries stored in the DynamoDB database. After making a GET request, user will get the correspondning response in JSON format.

### Using GET request

GET request can be directly performed by invoking URL. The default URL below returns all the deployment entries in the DynamoDB:

```https://2wyvskffzqvuh7woat5mt66yt40rtjbj.lambda-url.us-west-2.on.aws/```

### GET request with query parameters

In addition to getting all entries from the DynanoDB, several queries are supported to narrow down the search range. The table below gives a summary of the supported parameters and their effects. 

Paramter | Required?| Description
-------- | -------- | --------
```eventType``` | Yes | The type of the query, which then determines the required parameters. Supported types: ```filterStage``` -- query based on deployment stage; ```filterStageAndTime``` -- query based on deployment stage and time range
```stage```  | Yes  | The stage of the queried deployment. Support values: ```Dev``` / ```Staging``` / ```Deployment```
```start``` | Yes if ```eventType``` is ```filterStageAndTime``` | The starting time of the queried time range
```start``` | Yes if ```eventType``` is ```filterStageAndTime``` | The ending time of the queried time range

For example, the URL below queries the deployment entries that are in ```Dev``` stage: 

```https://2wyvskffzqvuh7woat5mt66yt40rtjbj.lambda-url.us-west-2.on.aws/?eventType=filterStage&stage=Dev```

### Use case by Grafana
Grafana dashboard gives interactive visualization of the deployment information stored in the DynamoDB, which is achieved by invoking the READ API. 
It supports different formats of visualizations, such as Time series and Table views, and different types of filters and queries. 

![image](https://user-images.githubusercontent.com/77217430/170905857-0ccbe3fc-c4bd-40b1-a9b4-a9dfda4b7ee1.png)

To access the READ API, simply provide the default URL of the API in the ```URL``` section of the dashboard. 

![image](https://user-images.githubusercontent.com/77217430/170906142-c62deefc-e83d-4a13-831f-0bf42864a70c.png)


## Write API
The WRITE API allows deployers to push their deployment-related data to be stored in the DynamoDB database, which can be retrieved and displayed for further use. 
This is done by making a POST request to the default API URL with relevant data specified in the request body.

### Using Postman
The POST request can be made via Postman with the steps below:

1. Choose the Method Type as ```POST```.
2. Provide the default API URL.
3. In the body part, specify the ```Stage```,```Creator```, ```LeadTime``` attributes in ONE single object in JSON format. 
4. Leave all other fields as default and click on ```Send```.
5. 
![image](https://user-images.githubusercontent.com/77217430/170907481-fcc6c2a2-dccc-489f-8ca3-720ef173bbae.png)

5. If the data is successfully added to the DynamoDB, you will receive a response message that echoes the entry been written. 
![image](https://user-images.githubusercontent.com/77217430/170907495-843db3fc-c504-4ab3-b514-4493b0883912.png)

### Using ```curl``` command
Alternatively, you can achieve the same goal with ```curl``` command. 

For example, the same entry in the example above can also be added to the DynamoDB using the following ```curl``` command:
```
curl --location --request POST 'https://2wyvskffzqvuh7woat5mt66yt40rtjbj.lambda-url.us-west-2.on.aws/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "Stage": "Dev",
    "Creator": "tester6",
    "LeadTime": 10
}'
```

