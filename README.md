# BoldVision - AI Financial Customer Service Bot

BoldVision is an intelligent, AI-powered financial customer service assistant that provides human-like conversations through a beautiful web interface. Built with Claude AI, it offers secure, knowledge-based responses with real-time transcript tracking and natural text-to-speech capabilities.

## Features

- **AI-Powered Conversations**: Powered by Claude 3.5 Sonnet for intelligent, contextual responses
- **Human-Like Voice**: Natural text-to-speech with adjustable voice settings
- **Knowledge-Based Responses**: Constrained to financial services knowledge base for accurate information
- **Real-Time Transcript**: Live conversation tracking with download capability
- **Contact Management**: Automatic collection and storage of customer contact information
- **Azure SQL Integration**: Secure storage of all conversations and customer data
- **Beautiful UI**: Modern, responsive design with smooth animations using Framer Motion
- **Secure & Private**: Built with security best practices and data encryption

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Axios** - HTTP client
- **Web Speech API** - Text-to-speech

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Anthropic SDK** - Claude API integration
- **Azure SQL** - Database (mssql)
- **WebSocket** - Real-time communication
- **dotenv** - Environment configuration

## Project Structure

```
BoldVision/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Header.jsx
│   │   │   ├── WelcomeScreen.jsx
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── TypingIndicator.jsx
│   │   │   ├── TranscriptPanel.jsx
│   │   │   └── ContactModal.jsx
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                # Backend Node.js application
│   ├── database/
│   │   └── db.js          # Azure SQL database operations
│   ├── routes/
│   │   ├── chat.js        # Chat endpoints
│   │   └── transcript.js  # Transcript endpoints
│   ├── services/
│   │   └── claude.js      # Claude AI integration
│   └── index.js           # Server entry point
├── knowledge-base.json    # Financial services knowledge base
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Azure SQL Database
- Claude API key from Anthropic

### Step 1: Clone the repository

```bash
git clone https://github.com/yourusername/BoldVision.git
cd BoldVision
```

### Step 2: Install dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### Step 3: Configure environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Claude API Configuration
ANTHROPIC_API_KEY=your_claude_api_key_here

# Azure SQL Configuration
AZURE_SQL_SERVER=your-server.database.windows.net
AZURE_SQL_DATABASE=boldvision
AZURE_SQL_USER=your_username
AZURE_SQL_PASSWORD=your_password
AZURE_SQL_PORT=1433

# Server Configuration
PORT=3001
```

### Step 4: Set up Azure SQL Database

The application will automatically create the required tables on first run:
- `Contacts` - Store customer contact information
- `Conversations` - Track conversation sessions
- `Messages` - Store all chat messages

Alternatively, you can manually create the database and run the initialization.

## Running the Application

### Development Mode

Run both frontend and backend concurrently:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend dev server on `http://localhost:3000`

### Production Mode

```bash
# Build frontend
npm run build

# Start production server
npm start
```

## API Endpoints

### Chat Endpoints

- `POST /api/chat/init` - Initialize a new conversation session
- `POST /api/chat/message` - Send a message and get AI response
- `POST /api/chat/contact` - Save customer contact information
- `GET /api/chat/history/:sessionId` - Get conversation history

### Transcript Endpoints

- `GET /api/transcript/:sessionId` - Get full conversation transcript

### Health Check

- `GET /api/health` - Server health status

## Database Schema

### Contacts Table
```sql
ContactID (INT, Primary Key)
Name (NVARCHAR(255))
Email (NVARCHAR(255))
Phone (NVARCHAR(50))
CreatedAt (DATETIME)
UpdatedAt (DATETIME)
```

### Conversations Table
```sql
ConversationID (INT, Primary Key)
ContactID (INT, Foreign Key)
SessionID (NVARCHAR(100), Unique)
StartTime (DATETIME)
EndTime (DATETIME)
```

### Messages Table
```sql
MessageID (INT, Primary Key)
ConversationID (INT, Foreign Key)
Role (NVARCHAR(20))
Content (NVARCHAR(MAX))
Timestamp (DATETIME)
```

## Customization

### Knowledge Base

Edit `knowledge-base.json` to customize:
- Bot personality and introduction
- Financial services categories and responses
- Fallback responses for out-of-scope questions
- Contact collection prompts

### UI Styling

The app uses Tailwind CSS. Customize colors and themes in:
- `client/tailwind.config.js` - Theme configuration
- `client/src/index.css` - Global styles and custom animations

### Voice Settings

Modify voice characteristics in `ChatInterface.jsx`:
- `utterance.rate` - Speech rate (0.1 to 10)
- `utterance.pitch` - Voice pitch (0 to 2)
- `utterance.volume` - Volume level (0 to 1)

## Security Features

- Environment variable protection
- Azure SQL encryption in transit
- Input sanitization
- Session-based authentication
- CORS configuration
- Secure WebSocket connections

## Deployment

### Backend Deployment (Azure, AWS, or DigitalOcean)

1. Set environment variables on your hosting platform
2. Build the application: `npm run build`
3. Start the server: `npm start`

### Frontend Deployment (Vercel, Netlify, or Azure Static Web Apps)

1. Build the frontend: `cd client && npm run build`
2. Deploy the `client/dist` folder to your hosting platform
3. Configure environment variables for API endpoint

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## Troubleshooting

### Database Connection Issues

- Verify Azure SQL credentials in `.env`
- Check firewall rules allow your IP address
- Ensure database exists and user has proper permissions

### Claude API Issues

- Verify your API key is valid
- Check API rate limits
- Ensure proper API endpoint configuration

### Text-to-Speech Not Working

- Check browser compatibility (Chrome, Edge, Safari)
- Verify browser permissions for speech synthesis
- Try different voice settings

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Contact: support@boldvision.example.com

## Acknowledgments

- Powered by [Claude AI](https://www.anthropic.com/)
- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animated with [Framer Motion](https://www.framer.com/motion/)

---

**BoldVision** - Intelligent Financial Customer Service, Powered by AI
