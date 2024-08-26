import aws_initialization
from flask import Flask, request, jsonify
from botocore.exceptions import ClientError


aws_res = aws_initialization.get_aws_resources()

# Lists all objects within a specific bucket
# @app.route('/get-bucket-data', methods=['GET'])
def get_s3_bucket_data():
    s3_client = aws_res['s3_client']
    bucket_name = 'amplify-project-resources'
    objects = s3_client.list_objects_v2(Bucket=bucket_name)['Contents']
    
    return jsonify({'data': objects})

# List out all the foundation models 
# @app.route('/list-FMs', methods=['GET'])
def get_foundation_models():
    bedrock = aws_res['bedrock_client']
    FMs = bedrock.list_foundation_models()   
    
    return FMs

# @app.route('/invoke-agent-knowledge-base', methods=['POST'])
def query_knowledge_base():
    bedrock_agent = aws_res['bedrock_agent_client']
    
    prompt = request.json.get('prompt')
    
    try:
        response = bedrock_agent.invoke_agent(agentAliasId='LJW569JQUR', agentId='FZMG5RQBRF', inputText=prompt, sessionId='123456')
        
    except (ClientError, Exception) as e:
        print(f'Error: Can not invoke. Reason: {e}')
        exit(1)
    
    agent_response = "something went wrong. try again"
    
    # Extract the text from the response
    try:
        # for item in response.items():
        #     print(item)
        
        event_stream = response['completion']
        # pp.pprint(f'agent event_stream: {event_stream}')
        for event in event_stream:
            print(event)
            if 'chunk' in event:
                print(event['chunk']['bytes'].decode('utf-8'))
                agent_response = event['chunk']['bytes'].decode('utf-8')
                
            
    except Exception as e:
        print('Error extracting text: {e}.')
        return "something went wrong. try again - e"
        # exit(1)
        
    # print(json.loads(response))
    
    # Create the Chat History object
    # chat_history.append({'role': 'user' , 'content': [{'text': prompt, 'type': 'text'}]})
    # chat_history.append({'role': 'bot' , 'content': [{'text': agent_response, 'type': 'text'}]})
    # print(chat_history)
    
    # return response['completion']['chunk']['attributeion']['citations'][0]['generatedResponsePart']['textResponsePart']['text'].read().decode('utf-8')
    return agent_response