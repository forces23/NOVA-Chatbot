from flask import Flask, request, jsonify
from botocore.exceptions import ClientError
import aws_initialization                          
import markdown    
import pprint
import json


pp = pprint.PrettyPrinter(indent=2)

aws_res = aws_initialization.get_aws_resources()

chat_history = []

def get_latest_alias(agent_id):
    try:
        bedrock_agent = aws_res['bedrock_agent']
        response = bedrock_agent.list_agent_aliases(
            agentId=agent_id,
            maxResults=1,  # We only need the latest one
        )
        print(response)
        
        if response['agentAliasSummaries']:
            return response['agentAliasSummaries'][0]['agentAliasId']
        else:
            raise Exception("No aliases found for the agent")
    except ClientError as e:
        print(f"Error getting latest alias: {e}")
        raise
    
## API call use the BEDROCK AGENT
# @app.route('/invoke-agent-knowledge-base', methods=['POST'])
def query_knowledge_base(request):
    bedrock_agent = aws_res['bedrock_agent_client']
    agent_id = 'FZMG5RQBRF'
    prompt = request.json.get('prompt')
    latest_alias = get_latest_alias(agent_id)
    
    try:
        response = bedrock_agent.invoke_agent(agentAliasId=latest_alias, agentId=agent_id, enableTrace=False, inputText=prompt, sessionId='123456')
        print('----------- response -----------')
        pp.pprint(response)
        
    except (ClientError, Exception) as e:
        print(f'Error: Can not invoke. Reason: {e}')
        exit(1)
    
    agent_response = "something went wrong. try again"
    
    # Extract the text from the response
    try:
        # This is the event stream in the response
        event_stream = response['completion']
        source_docs = []
        # Source docs layout
        # [
        #   { 
        #       content: text,
        #       s3Location: uri
        #   },
        #   { 
        #       content: text,
        #       s3Location: uri
        #   },
        # ]
        
        for event in event_stream:
            # The AI answer is in bytes, so we need to decode it and add it back in 
            event['chunk']['bytes'] = event['chunk']['bytes'].decode('utf-8')
            
            citations = event['chunk']['attribution']['citations']
            
            for citation in citations:
                retrieveRefs = citation['retrievedReferences']
                for ref in retrieveRefs:
                    s3Location = ref['location']['s3Location']['uri']
                    source_content = ref['content']['text']
                    # source_docs.append({'content':source_content, 'uri': s3Location})
                    source_docs.append([{'content':source_content, 'uri': s3Location}])
            
            agent_response = event
        
          
        agent_response['html_result'] = markdown.markdown(agent_response['chunk']['bytes']) # Converts the MD response to html to be easily displayed on the frontend  
        agent_response['source_documents'] = source_docs # Adds the source documents to the agent_response 
        agent_response['query_result'] = agent_response['chunk']['bytes']
            
        # stores chat in a dictionary on the back end for later use maybe
        # chat_history.append({'role': 'user' , 'content': [{'text': prompt, 'type': 'text'}]})
        # chat_history.append({'role': 'bot' , 'content': [agent_response]})
            
    except Exception as e:
        raise Exception("unexpected event.",e)
            
    return agent_response