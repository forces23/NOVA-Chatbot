# NOVA Chatbot - Comprehensive Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [System Components](#system-components)
5. [AWS Integration](#aws-integration)
6. [Setup and Installation](#setup-and-installation)
7. [API Endpoints](#api-endpoints)
8. [Frontend Components](#frontend-components)
9. [Data Flow](#data-flow)
10. [Configuration](#configuration)
11. [Development Notes](#development-notes)
12. [Future Enhancements](#future-enhancements)

## Project Overview

NOVA (Neurological Operative Virtual Assistant) is a sophisticated AI chatbot application that leverages Amazon Web Services (AWS) Bedrock for advanced conversational AI capabilities. The application provides multiple AI interaction modes including general knowledge queries, knowledge base searches, and agent-based responses with source citations.

### Key Features
- **Multi-Modal AI Interaction**: Three distinct AI service endpoints for different use cases
- **Real-time Chat Interface**: Modern React-based UI with typewriter animations and message history
- **Voice Input Support**: Speech-to-text functionality for hands-free interaction
- **Source Citation**: Knowledge base queries include source document references
- **Responsive Design**: Bootstrap-powered responsive interface
- **Code Syntax Highlighting**: Prism.js integration for code display with 40+ language support
- **AWS Cloud Integration**: Full AWS Bedrock integration with Claude 3 Sonnet
- **Mini Game**: Hidden asteroid game accessible via rocket icon (currently disabled)
- **Settings Panel**: Adjustable AI parameters (temperature, top-p, top-k)

## Architecture

The application follows a client-server architecture with clear separation of concerns:

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐    AWS SDK    ┌─────────────────┐
│   React Client  │ ◄──────────────► │  Flask Server   │ ◄────────────► │   AWS Bedrock   │
│   (Frontend)    │                  │   (Backend)     │                │   Services      │
└─────────────────┘                  └─────────────────┘                └─────────────────┘
```

## Technology Stack

### Backend
- **Framework**: Flask 3.0.3 (Python web framework)
- **AI Integration**: AWS Bedrock Runtime, Bedrock Agent Runtime
- **Language Processing**: LangChain 0.2.9 (AI orchestration framework)
- **AWS SDK**: Boto3 1.34.144 (AWS Python SDK)
- **Text Processing**: Markdown 3.6 (Markdown to HTML conversion)
- **CORS**: Flask-CORS 4.0.1 (Cross-origin resource sharing)

### Frontend
- **Framework**: React 18.3.1 with TypeScript 4.9.5
- **UI Library**: React Bootstrap 2.10.6 + Bootstrap 5.3.3
- **HTTP Client**: Axios 1.7.2 (API communication)
- **Routing**: React Router DOM 6.26.1
- **Speech Recognition**: React Speech Recognition 3.10.0
- **Syntax Highlighting**: Prism.js 1.29.0
- **Styling**: SCSS/Sass 1.82.0

### AWS Services
- **Bedrock Runtime**: Core AI model inference
- **Bedrock Agent Runtime**: Agent-based AI with knowledge base integration
- **Claude 3 Sonnet**: Primary AI model (anthropic.claude-3-sonnet-20240229-v1:0)
- **Knowledge Bases**: Document retrieval and citation system

## System Components

### Backend Structure

#### Core Server (`server.py`)
The main Flask application server that orchestrates all AI interactions:
- Manages CORS policies for cross-origin requests
- Maintains conversation history in memory
- Routes requests to appropriate AI service modules
- Handles error responses and logging

#### AI Service Modules

1. **General Bedrock (`bedrockGeneral.py`)**
   - Direct Claude model interaction for general knowledge queries
   - Conversation history management
   - Markdown processing with code syntax highlighting
   - Retry logic with exponential backoff for throttling

2. **Bedrock Agent (`bedrockAgent.py`)**
   - Agent-based AI with knowledge base integration
   - Source document retrieval and citation
   - Dynamic agent alias resolution
   - Structured response formatting

3. **Bedrock Knowledge Base with LangChain (`bedrockKBLangchain.py`)**
   - LangChain-powered knowledge base queries
   - Custom prompt templates for specialized responses
   - Document retrieval with relevance scoring
   - Semantic and hybrid search capabilities

#### AWS Configuration (`aws_initialization.py`)
- AWS session management with profile-based authentication
- Multi-service client initialization (Bedrock, S3, Agent Runtime)
- Regional configuration and timeout settings
- Credential management and validation

#### Constants and Configuration (`constants.py`)
- NOVA AI personality and system prompts with detailed backstory
- Programming language definitions for syntax highlighting (80+ languages)
- Default conversation initialization with system/assistant message pair
- Behavioral guidelines and response formatting rules
- Comprehensive programming language list for code block detection

### Frontend Structure

#### Main Application (`App.tsx`)
- React Router configuration for multi-page navigation
- Main layout structure with header, sidebar, chat area, and footer
- Component orchestration and routing logic
- Social media links and branding

#### Chat System Components

1. **Current Chat Session (`currentChatSession.tsx`)**
   - Real-time conversation display
   - Message history management
   - Auto-scrolling functionality
   - Source document expansion/collapse
   - Copy-to-clipboard functionality
   - Thumbs up/down feedback system

2. **Query Input (`queryInput.tsx`)**
   - Multi-line text input with auto-resize
   - Keyboard shortcuts (Enter to send, Shift+Enter for new line)
   - Voice input integration
   - Send button state management
   - Input validation and sanitization

3. **Bot Message (`botMessage.tsx`)**
   - Animated message rendering
   - HTML content display with syntax highlighting
   - Progressive text reveal animation
   - Source citation handling

#### Utility Components

1. **Shared Context (`sharedContext.tsx`)**
   - Global state management using React Context
   - Conversation history state
   - Loading states and UI controls
   - API payload management
   - Speaker turn coordination

2. **Voice to Text (`voice-to-text-1.tsx`)**
   - Browser speech recognition API integration
   - Real-time speech-to-text conversion
   - Microphone permission handling
   - Visual feedback for recording state

#### Styling and Animations
- **SCSS Modules**: Modular styling with variables and mixins
- **Loading Animations**: CSS-based loading rings and dots
- **Responsive Design**: Bootstrap grid system with custom breakpoints
- **Theme System**: Dark theme with space/cosmic aesthetic

## AWS Integration

### Authentication
The application uses AWS profile-based authentication:
```python
session = boto3.Session(profile_name='bobby-personal', region_name='us-east-1')
```

### Bedrock Models
- **Primary Model**: Claude 3 Sonnet (`anthropic.claude-3-sonnet-20240229-v1:0`)
- **Region**: US East 1 (us-east-1)
- **Configuration**: Custom timeout and retry settings

### Knowledge Base Integration
- **Retrieval Configuration**: Semantic search with 4 result limit
- **Source Attribution**: Automatic citation with S3 location tracking
- **Content Processing**: Markdown conversion and HTML sanitization
- **Agent Integration**: Dynamic agent alias resolution for Bedrock agents
- **LangChain Support**: Custom prompt templates and retrieval chains

## Setup and Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- AWS CLI configured with appropriate credentials
- AWS Bedrock access permissions

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python server.py
```

**Note**: The requirements.txt file contains all necessary dependencies including Flask, Boto3, LangChain, and supporting libraries.

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

**Note**: The frontend is configured to call a production API Gateway endpoint by default:
`https://8fdngj09ah.execute-api.us-east-1.amazonaws.com/Prod/invoke-Bedrock-GenAI`

For local development, you may need to update the API endpoint in `queryInput.tsx`

### AWS Configuration
1. Configure AWS credentials using AWS CLI or environment variables
2. Ensure Bedrock service access in your AWS account
3. Set up knowledge bases and agents if using those features
4. Update `aws_initialization.py` with your specific configuration

**Important**: The current configuration is hardcoded to use 'bobby-personal' profile. You'll need to either:
1. Create an AWS profile named 'bobby-personal', or
2. Update the profile name in `aws_initialization.py` to match your AWS profile

## API Endpoints

### 1. General AI Chat
- **Endpoint**: `POST /invoke-Bedrock-GenAI`
- **Purpose**: General knowledge queries using Claude model
- **Payload**: 
  ```json
  {
    "prompt": "string",
    "temperature": 0.7,
    "topP": 0.9,
    "topK": 50
  }
  ```

### 2. Knowledge Base Query (LangChain)
- **Endpoint**: `POST /bedrock-kb-langchain`
- **Purpose**: Specialized knowledge base queries with LangChain
- **Features**: Custom prompts, document retrieval, source citations

### 3. Agent-Based Query
- **Endpoint**: `POST /invoke-agent-knowledge-base`
- **Purpose**: Agent-powered responses with knowledge base integration
- **Features**: Dynamic agent resolution, structured citations

### 4. Chat History
- **Endpoint**: `GET /chat-history`
- **Purpose**: Retrieve conversation history
- **Response**: Array of conversation messages with metadata

## Frontend Components

### State Management
The application uses React Context for global state management:
- **Conversation State**: Message history and current chat session
- **UI State**: Loading indicators, button states, modal controls
- **API State**: Request payloads, response handling, error states

### Component Rendering Hierarchy
```
App
├── TitleBar (with hidden game launcher)
├── SidePane
│   ├── SettingsPane (AI parameters)
│   └── Chat Sessions (placeholder)
├── CurrentChatSession
│   ├── BotMessage (with typewriter effect)
│   └── WaitingForQView
└── QueryInput
    └── VoiceToText
```

### Additional Components
- **Game System**: Complete asteroid game implementation (Game_A)
- **Animations**: Gradient dots animation and loading animations
- **Prism Integration**: Comprehensive syntax highlighting setup

### Key Features
- **Real-time Updates**: Immediate UI updates on message send/receive
- **Progressive Enhancement**: Graceful degradation for unsupported features
- **Accessibility**: ARIA labels and keyboard navigation support
- **Performance**: Optimized re-renders and lazy loading

## Data Flow

### Message Flow
1. **User Input**: Text or voice input captured in QueryInput component
2. **State Update**: Shared context updated with user message
3. **API Call**: Backend endpoint called with appropriate payload
4. **Processing**: AWS Bedrock processes request and returns response
5. **Response Handling**: Backend formats response with HTML/citations
6. **UI Update**: Frontend displays formatted response with animations
7. **History Update**: Conversation history updated in shared state

### Error Handling
- **Network Errors**: Retry logic with exponential backoff
- **AWS Throttling**: Automatic retry with jitter
- **Validation Errors**: Client-side input validation
- **Fallback Responses**: Graceful degradation for service failures

## Configuration

### Environment Variables
The application supports multiple authentication methods:
- **IAM Credentials**: Access key and secret key
- **SSO Profiles**: AWS SSO profile-based authentication
- **Default Credentials**: AWS credential chain resolution

### Model Parameters
Configurable AI model parameters:
- **Temperature**: Creativity/randomness (0.0-1.0)
- **Top P**: Nucleus sampling threshold
- **Top K**: Token selection limit
- **Max Tokens**: Response length limit (4096)

### CORS Configuration
Cross-origin resource sharing configured for:
- Local development (localhost:3000)
- Production domain (https://master.d2yi7oh99miybm.amplifyapp.com)
- Multiple API endpoints with specific origin allowlists

## Development Notes

### Current Limitations
- **Session Management**: No persistent session storage (conversation history lost on server restart)
- **User Authentication**: No user account system
- **Rate Limiting**: Basic throttling handling with exponential backoff
- **Caching**: No response caching implemented
- **Knowledge Base Configuration**: Hardcoded knowledge base IDs (currently commented out)
- **Error Handling**: Limited user-facing error messages
- **HTML Rendering**: Some issues with HTML syntax highlighting in code blocks

### Code Quality
- **TypeScript**: Strong typing for frontend components
- **Error Handling**: Comprehensive try-catch blocks
- **Logging**: Basic console logging (enhancement needed)
- **Testing**: Test framework setup but limited coverage

### Performance Considerations
- **Memory Usage**: Conversation history stored in memory
- **API Calls**: No request deduplication
- **Bundle Size**: Large dependency footprint
- **Rendering**: Some optimization opportunities exist

## Future Enhancements

### Planned Features (from TODO.md)
- **Enhanced Logging**: Structured logging with timestamps
- **Session Management**: UUID-based session tracking
- **Model Selection**: Dropdown for different AI models
- **HTML Rendering**: Improved syntax highlighting for HTML
- **Loading Animations**: Enhanced AI response animations

### Potential Improvements
- **Database Integration**: Persistent conversation storage
- **User Accounts**: Authentication and personalization
- **Real-time Features**: WebSocket integration
- **Mobile App**: React Native implementation
- **Analytics**: Usage tracking and insights
- **Caching Layer**: Redis for response caching
- **Monitoring**: Application performance monitoring
- **Security**: Input sanitization and rate limiting

### System Prompt Enhancements (from Notes.md)
- **Time Services**: Current time lookup capability
- **Weather Services**: Location-based weather queries
- **Location Awareness**: User location integration
- **Name Recognition**: Case-insensitive NOVA recognition

## Conclusion

NOVA Chatbot represents a sophisticated integration of modern web technologies with cutting-edge AI services. The application demonstrates best practices in React development, Flask API design, and AWS service integration. While currently functional for its intended use cases, the modular architecture provides a solid foundation for future enhancements and scaling.

The codebase is well-structured with clear separation of concerns, making it maintainable and extensible. The comprehensive AWS integration showcases the power of cloud-based AI services while maintaining a responsive and intuitive user interface.

## Additional Information

### AWS and Development Resources

**AWS Bedrock Documentation:**
- [Amazon Bedrock API Reference](https://docs.aws.amazon.com/bedrock/latest/APIReference/welcome.html)
- [Amazon Bedrock Model IDs](https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids.html#model-ids-arns)
- [Run example Amazon Bedrock API requests through the AWS SDK for Python (Boto3)](https://docs.aws.amazon.com/bedrock/latest/userguide/getting-started-api-ex-python.html)
- [Amazon Bedrock Runtime](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_Types_Amazon_Bedrock_Runtime.html)

**Anthropic Claude Integration:**
- [Anthropic Claude Text Completions API](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-text-completion.html)
- [Anthropic Claude Messages API](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-messages.html#api-inference-examples-claude-messages-code-examples)
- [Anthropic Amazon Bedrock API](https://docs.anthropic.com/en/api/claude-on-amazon-bedrock)

**Bedrock Agents and Knowledge Bases:**
- [Agents for Amazon Bedrock InvokeAgent](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent-runtime_InvokeAgent.html)
- [RetrieveAndGenerate](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent-runtime_RetrieveAndGenerate.html#API_agent-runtime_RetrieveAndGenerate_Examples)
- [Boto3 AgentsforBedrockRuntime](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/bedrock-agent-runtime.html)
- [Boto3 Invoke_agent](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/bedrock-agent-runtime.html)

**AWS SDK and Services:**
- [How to List Contents of s3 Bucket Using Boto3 Python?](https://dev.to/aws-builders/how-to-list-contents-of-s3-bucket-using-boto3-python-47mm)
- [Amazon Cognito Identity Provider examples using SDK for Python (Boto3)]()

**Development Tools and Frameworks:**
- [Create React App](https://create-react-app.dev/docs/getting-started)
- [Bootstrap](https://getbootstrap.com/)
- [venv — Creation of virtual environments](https://docs.python.org/3/library/venv.html)

**Learning Resources:**
- [Amazon Bedrock Workshop GitHub](https://github.com/aws-samples/amazon-bedrock-workshop/tree/main)

---

*This documentation was generated through comprehensive code analysis and represents the current state of the NOVA Chatbot application as of the latest commit.*