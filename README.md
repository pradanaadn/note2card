# note2card

A TypeScript project using Mastra for building AI agents and workflows, including weather forecasting and flashcard generation.

## Features

- **Weather Agent**: Provides current weather information and activity suggestions based on forecasts.
- **Flashcard Agent**: Generates flashcards from user-provided text.
- **Vector Store**: Integrates with Qdrant for vector-based document storage and querying.
- **Workflows**: Automated processes for weather planning and flashcard creation.

## Setup

1. **Clone the repository**:

   ```sh
   git clone <repository-url>
   cd note2card
   ```

2. **Install dependencies**:

   ```sh
   pnpm install
   ```

3. **Set up environment variables**:

   - Copy .env.sample to .env.
   - Fill in required values (e.g., API keys for Qdrant, Google AI).

4. **Start Qdrant vector database** (if using local instance):

   ```sh
   docker-compose up -d
   ```

5. **Build the project**:

   ```sh
   pnpm run build
   ```

## Running

1. **Start the server**:

   ```sh
   pnpm start
   ```

   The server runs on `http://localhost:3456`.

1. **Using Workflows**:
   - Weather workflow: Fetches forecast and suggests activities.
   - Flashcard workflow: Creates flashcards from text.

## Development

- Use `pnpm run dev` for development mode.
- Agents and workflows are defined in agents and workflows.
- Tools and database utilities in tools and db.
