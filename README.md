# MistressWorld - Unified Web Platform

This is a unified, modular, and agile web platform for MistressWorld with integrated AI content generation capabilities.

## Project Structure

The project follows a modular architecture with clear separation of concerns:

```
/
├── src/                      # Main source code
│   ├── pages/                # Next.js pages and API routes
│   │   ├── api/              # API endpoints
│   │   │   ├── models/       # Model data API
│   │   │   ├── categories/   # Category data API
│   │   │   └── content/      # Content API (blog, pages)
│   │   ├── [category]/       # Dynamic category routes
│   │   │   └── [subcategory] # Dynamic subcategory routes
│   │   ├── home.js           # Home page
│   │   └── ...               # Other pages
│   ├── components/           # UI components
│   ├── data/                 # Centralized data storage
│   │   ├── models/           # Model data (organized by category)
│   │   │   ├── asian/        # Asian models
│   │   │   ├── ebony/        # Ebony models
│   │   │   ├── latina/       # Latina models
│   │   │   ├── white/        # White models
│   │   │   └── transgender/  # Transgender models
│   │   ├── categories/       # Category data
│   │   ├── blog/             # Blog content
│   │   └── pages/            # Page content
│   ├── hooks/                # Custom React hooks
│   ├── context/              # React context providers
│   ├── services/             # Service modules
│   │   ├── ai-writers/       # AI content generation modules
│   │   │   ├── utils/        # Utility functions for AI writers
│   │   │   │   ├── ai.js             # OpenAI integration
│   │   │   │   └── context-extractor.mjs # Content context extraction
│   │   │   ├── modelWriter.js       # Model content generator
│   │   │   ├── categoryWriter.js    # Category content generator
│   │   │   ├── blogWriter.js        # Blog post generator
│   │   │   ├── pageWriter.js        # Page content generator
│   │   │   └── setup-ai-writer.js   # Directory setup script
│   │   └── data/             # Data services
│   │       ├── sync-data.js  # Data synchronization
│   │       └── verify-data.js # Data verification
│   ├── cli/                  # Command-line interfaces
│   │   ├── ai-writer.js      # CLI for manual content generation
│   │   └── setup-writers.js  # Setup and verification script
│   └── styles/               # CSS styles
├── jobs/                     # Automated content generation
│   ├── job-runner.js         # Job orchestration
│   └── jobs.json             # Job definitions
├── public/                   # Static files
│   └── data/                 # Synchronized data for static rendering
│       ├── models/           # Static model data
│       ├── categories/       # Static category data
│       ├── blog/             # Static blog content
│       └── pages/            # Static page content
└── logs/                     # Application logs
```

## API Endpoints

The platform provides a unified API layer for accessing data:

### Models API

- `GET /api/models` - Get models with optional filtering
  - Query parameters:
    - `category`: Filter by category (asian, ebony, latina, etc.)
    - `subcategory`: Filter by subcategory if applicable
    - `limit`: Number of models to return (default: 50)
    - `offset`: Pagination offset
    - `sort`: Sort order (featured, trending, alphabetical)

### Categories API

- `GET /api/categories` - Get all categories
- `GET /api/categories/{category}` - Get details for a specific category

### Content API

- `GET /api/content/blog` - Get blog posts
- `GET /api/content/pages/{slug}` - Get page content by slug

## Dynamic Routing

The platform uses a unified dynamic routing system:

- `/{category}` - Category pages (asian, ebony, latina, etc.)
- `/{category}/{subcategory}` - Subcategory pages (if applicable)

## AI Content Generation

The platform includes AI-powered content generation capabilities:

### Manual Content Generation

Use the CLI script to generate content:

```bash
# Generate model content
node src/cli/ai-writer.js --type=model --category=asian --slug=model-name

# Generate category content
node src/cli/ai-writer.js --type=category --category=ebony

# Generate blog content
node src/cli/ai-writer.js --type=blog --title="Example Blog Post"

# Generate page content
node src/cli/ai-writer.js --type=page --slug=home --sections=featured,trending

# Use dry run mode to preview without saving
node src/cli/ai-writer.js --type=model --category=asian --slug=model-name --dryRun
```

### Automated Content Generation

Use the job runner to automate content generation:

```bash
# Run a specific job type
node jobs/job-runner.js --type=model --category=asian --limit=5

# Run a predefined schedule
node jobs/job-runner.js --schedule=daily

# Run with options
node jobs/job-runner.js --type=category --force --comprehensive
```

## Data Synchronization

The platform synchronizes data between the source directory (`src/data`) and the public directory (`public/data`) for static rendering:

```bash
# Set up directories and synchronize data
node src/cli/setup-writers.js --sync
```

## Content Types

### Models

Generated model content includes:
- Short bio intro (bioTop)
- Extended bio (bioBottom)
- SEO metadata (metaTitle, metaDesc, metaKeywords)
- Showcase content for featured models

### Categories

Generated category content includes:
- Title
- Introduction
- Detailed description
- SEO metadata
- Feature highlights
- Related categories
- Call-to-action

### Blog Posts

Generated blog posts include:
- Title
- Introduction
- Multiple content sections
- Conclusion
- SEO metadata
- Related topics
- Calls-to-action

### Page Sections

Generated page sections vary depending on the section, but typically include:
- Title
- Introduction
- Featured items (models, categories, etc.)
- Section-specific content

## Data Structures

### Home Page Content (`src/data/pages/home.json`)

```json
{
  "featured": {
    "title": "Featured Dominatrix Models",
    "headline": "Explore our exclusive selection of professional dominatrices",
    "intro": "...",
    "models": [
      {
        "name": "Mistress Victoria",
        "description": "...",
        "tags": ["domination", "discipline", "roleplay"]
      }
    ],
    "cta": "View All Models"
  },
  "top-performers": {
    "title": "Top Performing Models",
    "intro": "...",
    "performers": [
      {
        "name": "Goddess Selene",
        "description": "...",
        "category": "Fetish"
      }
    ]
  },
  "trending": {
    "title": "Trending Categories",
    "intro": "...",
    "trends": [
      {
        "name": "BDSM",
        "description": "...",
        "tag": "bdsm"
      }
    ]
  }
}
```

### Category Content (`src/data/categories/[category].json`)

```json
{
  "title": "Category Name",
  "description": "...",
  "meta": {
    "title": "...",
    "description": "...",
    "keywords": "..."
  },
  "sections": [
    {
      "heading": "...",
      "content": "..."
    }
  ],
  "subcategories": [
    {
      "name": "...",
      "description": "...",
      "url": "..."
    }
  ]
}
```

## Development

### Installation

```bash
# Install dependencies
npm install

# Set up .env file with required variables
cp .env.example .env
# Edit .env to add your OpenAI API key and other settings

# Set up the AI writers and data directories
node src/cli/setup-writers.js
```

### Running the Development Server

```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Start the production server
npm start
```

## Environment Variables

The following environment variables are required:

```
# OpenAI API Key for content generation
OPENAI_API_KEY=sk-your-api-key

# Model to use for OpenAI API
OPENAI_MODEL=gpt-4

# AWE API configuration (if applicable)
AWE_API_ENDPOINT=https://example.com/api
AWE_SITE_ID=your-site-id
AWE_PS_ID=your-ps-id
AWE_PS_TOOL=tool-id
AWE_PS_PROGRAM=program-id
AWE_CAMPAIGN_ID=
AWE_IMAGE_SIZES=320x180,320x240,800x600,896x504
```

## Troubleshooting

### Logs

Logs are stored in the `logs/` directory:
- `job-error.log` - Error logs
- `job-combined.log` - All logs

### Common Issues

1. **Missing Content**:
   - Check that the AI writer has proper permissions to write to data directories
   - Verify OpenAI API key is valid
   - Check logs for specific error messages

2. **Rendering Issues**:
   - Ensure JSON structure matches expected format
   - Check component props and data flow
   - Look for null/undefined values in data

3. **API Rate Limiting**:
   - Monitor OpenAI API usage
   - Implement exponential backoff for retries
   - Consider batching content generation jobs

### Component Integration

When integrating AI-generated content with components:

1. **Always check for null/undefined values**:
   ```jsx
   {homePageData && (
     <HomePageSections data={homePageData} />
   )}
   ```

2. **Use consistent prop formats**:
   ```jsx
   <Staticblogpost 
     data={blogPost} 
     key={blogPost.post_id} 
   />
   ```

3. **Handle different data formats with fallbacks**:
   ```jsx
   const postTitle = data?.post_title || element?.post_title || title1;
   ```

## Maintenance Tasks

1. **Regular Content Updates**:
   - Schedule periodic content refreshes
   - Update prompts in writer modules to improve content quality
   - Monitor content for accuracy and relevance

2. **System Monitoring**:
   - Check logs for errors or warnings
   - Monitor API usage and costs
   - Verify content quality periodically

## Project Features

- **Unified API Layer**: Consolidated API endpoints with standardized response formats
- **Centralized Data Storage**: Single source of truth for all data
- **Dynamic Routing**: Standardized routing system for all categories
- **AI Content Generation**: Integrated AI writers for model, category, blog, and page content
- **Automated Jobs**: Scheduled content generation and updating
- **Modular Architecture**: Clean separation of concerns for easy maintenance
