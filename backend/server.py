from flask import Flask, request, jsonify
from flask_cors import CORS
from cors import cors_policy
import pprint
import aws_initialization                          
import constants
from ai_api_calls.bedrockAgent import query_knowledge_base
from ai_api_calls.bedrockKBLangchain import query_bedrock_kb_langchain
from ai_api_calls.bedrockGeneral import invoke_bedrock

app = Flask(__name__)
CORS(app, resources=cors_policy)
pp = pprint.PrettyPrinter(indent=2)

aws_res = aws_initialization.get_aws_resources()

chat_history = []
conversation_history = [constants.system_instructions, constants.ai_default_response] # Cleard only if server is restarted. add function call to clear history 

## API call for the chat history stored in thhe variable chat_history
 # add sessio id to the function parameters to get a specific chat history 
@app.route('/chat-history', methods=['GET'])
def get_chat_history():
    print('********************************Chat History API Call********************************')
    return jsonify({'chat_history': chat_history})

## API call to use Genral Knowledge Bedrock <can ask it anything>
@app.route('/invoke-Bedrock-GenAI', methods=['POST'])
def invoke_bedrock_GenAI():
    data = request.json

    # Call the imported function
    result = invoke_bedrock(request)

    # Return the result
    return result


## API call to use BEDROCK with LANGCHAIN and a specific KNOWLEDGE BASE
@app.route('/bedrock-kb-langchain', methods=['POST'])
def query_knowledge_base_langchain():
    data = request.json

    # Call the imported function
    result = query_bedrock_kb_langchain(request)

    # Return the result
    return result



## API call use the BEDROCK AGENT
@app.route('/invoke-agent-knowledge-base', methods=['POST'])
def invok_agent():
    data = request.json

    # Call the imported function
    result = query_knowledge_base(request)

    # Return the result
    return result


    
    
if __name__ == '__main__':
    app.run(debug=True)

