import json
     
     
def lambda_handler(event, context):
    print(event)
    # Extract the HTTP method and path from the event
    http_method = event['httpMethod']
    path = event['path']
    
    print(f'HTTP Method: {http_method}')
    print(f'Path: {path}')
    
    # Extract the request body (payload)
    request_body = json.loads(event['body'])
    print(f'Request Body: {request_body}')

    # Handle different HTTP methods and paths
    if http_method == 'GET' and path == '/chat-history':
        # Handle GET request for /chat-history
        response = {
            'statusCode': 200,
            'body': json.dumps('Hello from Lambda!')
        }
    
    # INVOKE GENERAL BEDROCK
    elif http_method == 'POST' and path == '/invoke-Bedrock-GenAI':
        # Handle POST request for /invoke-Bedrock-GenAI
        print(f'Request Body: {request_body}')

        # Process the request body and generate a response
        response = {
            'statusCode': 200,
            'body': json.dumps(request_body)
        }
        
    # elif http_method == 'POST' and path == '/bedrock-kb-langchain':
    #     request_body = json.loads(event['body'])
    #     # Process the request body and generate a response
    #     response = {
    #         'statusCode': 200,
    #         'body': json.dumps('Data received: ' + str(request_body))
    #     }
    
    # elif http_method == 'POST' and path == '/invoke-agent-knowledge-base':
    #     request_body = json.loads(event['body'])
    #     # Process the request body and generate a response
    #     response = {
    #         'statusCode': 200,
    #         'body': json.dumps('Data received: ' + str(request_body))
    #     }
        
        
    
    else:
        response = {
            'statusCode': 404,
            'body': json.dumps('Not found')
        }

    # Add CORS headers to the response
    response['headers'] = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,GET,POST'
    }
    
    print(f'response: {response}')

    return response