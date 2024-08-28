import boto3
from botocore.client import Config


import os 
from dotenv import load_dotenv
load_dotenv()

# AWS Credentials
AWS_ACCESS_KEY = os.environ.get('AWS_ACCESS_KEY')
AWS_SECRET_KEY = os.environ.get('AWS_SECRET_KEY')
AWS_REGION_NAME = os.environ.get('AWS_REGION_NAME')
AWS_SESSION_TOKEN = os.environ.get('AWS_SESSION_TOKEN')
ACCOUNT_1 = os.environ.get('ACCOUNT_1')
AUTHENTICATION_TYPE = os.environ.get('AUTHENTICATION_TYPE')

print(f'Authentication type: {AUTHENTICATION_TYPE}')

# Initialize AWS S3 client
if (AUTHENTICATION_TYPE == 'IAM') :
    print(f'AWS_ACCESS_KEY: {AWS_ACCESS_KEY}')
    print(f'AWS_SECRET_KEY: {AWS_SECRET_KEY}')
    print(f'AWS_SESSION_TOKEN: {AWS_SESSION_TOKEN}')
    print(f'AWS_REGION_NAME: {AWS_REGION_NAME}')
    
    session = boto3.Session(
        aws_access_key_id=AWS_ACCESS_KEY,
        aws_secret_access_key=AWS_SECRET_KEY,
        region_name=AWS_REGION_NAME,
        # aws_session_token=AWS_SESSION_TOKEN
    )
    
elif (AUTHENTICATION_TYPE == 'SSO') :
    print(f'ACCOUNT_1: {ACCOUNT_1}')
    
    session = boto3.Session(profile_name=ACCOUNT_1)

else :
    print(f'Unknown Authentication Type: {AUTHENTICATION_TYPE}')
    session = boto3.Session()

bedrock_region = 'us-east-1'
model_id = 'anthropic.claude-3-sonnet-20240229-v1:0'
kb_id_1 = os.environ.get('KB_ID_1')
kb_id_2 = os.environ.get('KB_ID_2')
agentAliasId_1 = os.environ.get('AGENT_ALIAS_ID_1')
agentId_1 = os.environ.get('AGENT_ID_1')


bedrock_config = Config(connect_timeout=120, read_timeout=120, retries={'max_attempts':0})

# AWS Clients Configured
bedrock_client = session.client(service_name='bedrock', region_name='us-east-1')
bedrock_rt_client = session.client(service_name='bedrock-runtime', region_name=bedrock_region)
bedrock_agent_client = session.client(service_name='bedrock-agent-runtime', config=bedrock_config, region_name=bedrock_region)
bedrock_agent = session.client(service_name='bedrock-agent', region_name=bedrock_region)
s3_client = session.client('s3')

def get_aws_resources():
    aws_res = {
        'aws_session': session,
        'session_region': AWS_REGION_NAME,
        'bedrock_client': bedrock_client,
        'bedrock_rt_client': bedrock_rt_client,
        'bedrock_agent_client': bedrock_agent_client,
        'model_id': model_id,
        'knowledge_base_id_1': kb_id_1,
        'bedrock_region': bedrock_region,
        'bedrock_agent': bedrock_agent,
        's3_client': s3_client,
    }
    return aws_res
 
