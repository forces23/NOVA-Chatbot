cors_policy = {
    '/get-bucket-data': {
        'origins': [
            'http://localhost:3000',
            'https://master.d2yi7oh99miybm.amplifyapp.com'
        ]
    },
        
    '/list-FMs': {
        'origins': [
            'http://localhost:3000',
            'https://master.d2yi7oh99miybm.amplifyapp.com'
        ]
    },
    
    '/invoke-Bedrock-GenAI': {
        'origins': [
            'http://localhost:3000',
            'https://master.d2yi7oh99miybm.amplifyapp.com'
        ]
    },
    
    '/chat-history': {
        'origins': [
            'http://localhost:3000',
            'https://master.d2yi7oh99miybm.amplifyapp.com'
        ]
    },
    
    '/invoke-agent-knowledge-base': {
        'origins': [
            'http://localhost:3000',
            'https://master.d2yi7oh99miybm.amplifyapp.com'
        ]
    },
    
    '/bedrock-kb-langchain': {
        'origins': [
            'http://localhost:3000',
            'https://master.d2yi7oh99miybm.amplifyapp.com'
        ]
    }
}