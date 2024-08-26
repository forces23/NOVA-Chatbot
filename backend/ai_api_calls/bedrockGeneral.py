from botocore.exceptions import ClientError
import aws_initialization                          
import markdown    
import pprint
import json
import constants
import re

pp = pprint.PrettyPrinter(indent=2)

aws_res = aws_initialization.get_aws_resources()

# conversation_history = [constants.system_instructions, constants.ai_default_response] # Cleard only if server is restarted. add function call to clear history 
conversation_history = []


def replace_code_blocks(match):
    code = match.group(1)
    code_lines = code.split('\n')
    # print('********************************')
    # print(code)
    # print('********************************')
    code_lang = 'default'
    if code_lines and code_lines[0].strip():
        code_lang = code_lines[0].split()[0].lower() if code_lines else 'default'
        if code_lang in constants.prog_langs:
                
                
            code = '\n'.join(code_lines[1:]) # Remove the language line
        else:
              code_lang = 'default' 
        
        
    # fix html format to display correctly on frontend
    if code_lang == 'html':
        code_lang = 'markup'
    
    # Replace <!DOCTYPE html>
    code = code.replace('<!DOCTYPE html>', '&lt;!DOCTYPE html>')
    
    # Replace opening brackets of HTML tags
    code = re.sub(r'<(\w+)', r'&lt;\1', code)

    # Replace closing brackets of HTML tags
    code = re.sub(r'</(\w+)', r'&lt;/\1', code)
            
    return  f"<pre><code class='language-{code_lang}'>{code}</code></pre>"

def invoke_bedrock(request):
    print('********************************Bedrock(General) API Call********************************')
    bedrock_runtime = aws_res['bedrock_rt_client']
    model_id = aws_res['model_id'] # ai model id
    prompt = request.json.get('prompt') # user question from frontend
    temperature = request.json.get('temperature')
    top_p = request.json.get('topP')
    top_k = request.json.get('topK')
    
    print(request.json)
    
    # Adds the user message to the conversation history 
    conversation_history.append(
        {
            'role': 'user',
            'content': [{'text': prompt, 'type': 'text'}],
        }
    )
    
    native_request = {
        'anthropic_version': 'bedrock-2023-05-31',
        'max_tokens': 4096,
        'temperature': temperature,
        'top_p': top_p,
        'top_k': top_k,
        'messages': conversation_history
    }
    
    # Convert native request to json
    json_request = json.dumps(native_request)
    
    try:
        response = bedrock_runtime.invoke_model(modelId=model_id, body=json_request)
    except (ClientError, Exception) as e:
        print(f'Error: Can not invoke "{model_id}". Reason: {e}')
        exit(1)
        
    # Decode the response body thats returned 
    ai_response = json.loads(response['body'].read())
    
    ai_response['query_result'] = ai_response['content'][0]['text']
    
    result_formatted = re.sub(r"```\n?([\s\S]*?)```", replace_code_blocks, ai_response['query_result'])
    
    ai_response['source_documents'] = None
    ai_response['html_result'] = markdown.markdown(result_formatted)
        
    # Adds the AI text only response to the convesation history
    conversation_history.append(
        {
            'role': 'assistant',
            'content': [{'text': ai_response['query_result'], 'type': 'text'}],
        }
    )
        
    return ai_response