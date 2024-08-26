cors_policy = {
    '/get-bucket-data': {
        'origins': [
            'http://localhost:3000'
        ]
    },
        
    '/list-FMs': {
        'origins': [
            'http://localhost:3000'
        ]
    },
    
    '/invoke-Bedrock-GenAI': {
        'origins': [
            'http://localhost:3000'
        ]
    },
    
    '/chat-history': {
        'origins': [
            'http://localhost:3000'
        ]
    },
    
    '/invoke-agent-knowledge-base': {
        'origins': [
            'http://localhost:3000'
        ]
    },
    
    '/bedrock-kb-langchain': {
        'origins': [
            'http://localhost:3000'
        ]
    }
}