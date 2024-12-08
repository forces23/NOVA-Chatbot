from flask import Flask, request, jsonify
from botocore.exceptions import ClientError
import aws_initialization                          
import markdown    
import pprint
import json
from langchain_aws import ChatBedrock
from langchain.retrievers.bedrock import AmazonKnowledgeBasesRetriever
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA, create_retrieval_chain

pp = pprint.PrettyPrinter(indent=2)

aws_res = aws_initialization.get_aws_resources()

chat_history = []

def query_bedrock_kb_langchain(request):
    print('********************************Bedrock(langchain) API Call********************************')
    llm = ChatBedrock(model_id=aws_res['model_id'], client=aws_res['bedrock_rt_client'])
    query = request.json.get('prompt')
    
    # Create retriever object from langchain, which calls the Retriever API, that converts user queries into embedding searches the knowledge base, and returns the relevant results. 
    # output of the Retriever API includes text chunks, location type and URI of data sources used and also releveance scores
    retriever = AmazonKnowledgeBasesRetriever(
        knowledge_base_id=aws_res['knowledge_base_id_1'],
        retrieval_config={
            'vectorSearchConfiguration': {
                'numberOfResults': 4,
                'overrideSearchType': 'SEMANTIC' # Optional -- HYBRID | SEMANTIC | HYBRID/SEMANTIC
            }
        },
        client=aws_res['bedrock_agent_client']
    )
    
    # gather the supporting docs 
    docs = retriever.invoke(
        input=query
    )
    
    contexts = []
    for doc in docs:
        if 'page_content' in doc:
            contexts.append(doc['page_content'])
    
    # Give specific Prompt here to give etra details on how the ai should act
    PROMPT_TEMPLATE = '''
    Human: You are a well performed, very intelligent, kind call center AI System. You Provide answers to questions by using fact based information when possible.
    Use the following pieces of information enclosed in the <context> tags to provide a concise answer to the question enclosed in the <question> tags.
    If you dont know the answer, just say you don't know , don't try to make up an answer.
    
    <context>
    {context}
    </context>
    
    <question>
    {question}
    </question>
    
    The response should be specific and detailed.
    
    Assistant:'''
    
    claude_prompt = PromptTemplate(template=PROMPT_TEMPLATE, input_variable=['context', 'question'])
    
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type='stuff',
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs={'prompt': claude_prompt}
    )
    
    answer = qa_chain({'query':query})
    
    source_docs = []
    
    for doc in answer['source_documents']:
        temp = []
        temp.append(doc.metadata) 
        temp[0]['page_content']=doc.page_content
        source_docs.append(temp)
        
    answer['source_documents'] = source_docs
    answer['html_result'] = markdown.markdown(answer['result'])
    answer['query_result'] = answer['result']
    
    
    
    # stores chat in a dictionary on the back end for later use maybe
    # chat_history.append({'role': 'user' , 'content': [{'text': query, 'type': 'text'}]})
    # chat_history.append({'role': 'bot' , 'content': [answer]})
    
    return answer