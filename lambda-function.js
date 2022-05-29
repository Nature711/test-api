 //Loads in the AWS SDK
 const AWS = require('aws-sdk');


 // Creates the document client specifing the region 
 // The tutorial's table is 'in us-east-1'
 const ddb = new AWS.DynamoDB.DocumentClient();
 
 
 exports.handler = async (event, context, callback) => {
     
     
     // Captures the http method 
     const httpMethod = event.requestContext.http.method;
     //const httpMethod = event.httpMethod;
     
     if (httpMethod == 'POST') { //deployer write item to database
          
     // Captures the request body
     const requestBody = JSON.parse(event.body);
         
         // Handle promise fulfilled/rejected states
         await createRecord(requestBody).then(() => {
             callback(null, {
                 statusCode: 201,
                 body: JSON.stringify({
                     Stage: requestBody.Stage,
                     Creator: requestBody.Creator,
                     LeadTime: requestBody.LeadTime,
                 }),
                 headers: {
                     'Access-Control-Allow-Origin' : '*'
                 }
             });
         }).catch((err) => {
             console.error(err);
             errorResponse(err.message, context.awsRequestId, callback);
         })
         
     } else if (httpMethod == 'GET') { // dashboard read item from database
         
         // Capture the query string parameters from the request in JSON format
         const params = event.queryStringParameters;
         
         var filterPromise = null;
         
         if (!params) {
             filterPromise = getAllRecords();
         } else {
             const eventType = params.eventType;
             if (eventType == 'filterStage') {
                 filterPromise = stageFilter(params.stage)
                 
             } else if (eventType == 'filterStageAndTime') {
                filterPromise = stageAndTimeFilter(params.stage, params.start, params.end);
            }
         }
         
         // Handle promise fulfilled/rejected states
         await filterPromise.then(data => {
             data.Items.forEach(item => console.log(item))
             callback(null, {
                 // If success return 200, and items
                 statusCode: 200,
                 body: data.Items,
                 headers: {
                     'Access-Control-Allow-Origin': '*',
                 },
             })
         }).catch((err) => {
         // If an error occurs write to the console
         console.error(err);
     })
     
     } else {
         console.error("Unsupported operation!");
     }
     
 };
 
 // Function createMessage
 // Writes message to DynamoDb table Message 
 function createRecord(requestBody) {
     const params = {
         TableName: 'my-database',
         Item: {
             'Stage': requestBody.Stage,
             'CreatedTime': new Date().toISOString(),
             'Creator': requestBody.Creator,
             'LeadTime': requestBody.LeadTime
         }
     }
     return ddb.put(params).promise();
 }
 
 
 function stageFilter(stage) {
      const params = {
         TableName: 'my-database',
         KeyConditionExpression : 'Stage = :stage',
         ExpressionAttributeValues : {
             ':stage' : stage
         }
     }
     return ddb.query(params).promise();
 }
 
 
 function stageAndTimeFilter(stage, start, end) {
     const params = {
         TableName: 'my-database',
         KeyConditionExpression : 'Stage = :stage AND CreatedTime BETWEEN :start AND :end',
         ExpressionAttributeValues : {
             ':stage': stage,
             ':start': start,
             ':end' : end
         }
     }
     return ddb.query(params).promise();
 }
 
 
 function errorResponse(errorMessage, awsRequestId, callback) {
   callback(null, {
     statusCode: 500,
     body: JSON.stringify({
       Error: errorMessage,
       Reference: awsRequestId,
     }),
     headers: {
       'Access-Control-Allow-Origin': '*',
     },
   });
 }
 
function getAllRecords() {
    const params = {
        TableName: 'my-database',
        Limit: 100
    }
    return ddb.scan(params).promise();
}
 
 
