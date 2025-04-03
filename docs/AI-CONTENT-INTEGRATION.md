# MistressWorld AI Content Integration System

## Overview

The AI Content Integration System is a comprehensive solution for automatically generating and updating website content using OpenAI's API. This system allows for the scheduled creation of various content types including model profiles, category descriptions, blog posts, and homepage sections.

## System Components

### 1. Content Generation Scripts

Located in the root directory:

- `ai-writer.js`: Main orchestration script for content generation
- `writers/`: Directory containing specialized content writers:
  - `modelWriter.js`: Generates model profiles and descriptions
  - `categoryWriter.js`: Creates category and subcategory content
  - `blogWriter.js`: Produces blog post content
  - `pageWriter.js`: Creates home page sections and other static pages

### 2. Job Scheduling System

Located in the scripts directory:

- `scripts/job-runner.js`: Manages scheduled content generation jobs
- `jobs/jobs.json`: Configuration file defining content generation jobs

### 3. Content Storage

Content is stored in structured JSON files:

- `data/models/`: Model profiles and metadata
- `data/categories/`: Category structure and content
- `data/pages/`: Page content including home page
- `data/blog/`: Blog post content

### 4. Frontend Integration

- `src/components/HomePageSections.js`: Displays AI-generated home page sections
- `src/components/Staticblogpost.js`: Renders blog post previews
- Various page components that consume the generated content

## Installation and Setup

1. Ensure Node.js 16+ is installed
2. Install dependencies: `npm install`
3. Configure environment variables:
   - Create `.env` file with `OPENAI_API_KEY=your_key_here`
   - Set appropriate `NODE_ENV` (development/production)

## Content Generation Workflows

### Running All Jobs

To execute all defined content generation jobs:

```bash
npm run jobs:run
```

### Running a Specific Job

To run a specific job by its ID:

```bash
npm run jobs:run-job <job-id>
```

Available job IDs:
- `models`: Generate model profiles
- `categories`: Generate category content
- `blog`: Generate blog posts
- `home`: Generate home page content

### Starting the Job Scheduler

To start the automated job scheduler:

```bash
npm run jobs:start
```

## Data Structure

### Home Page Content (`data/pages/home.json`)

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
      },
      ...
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
      },
      ...
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
      },
      ...
    ]
  }
}
```

### Category Content (`data/categories/[category].json`)

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
    },
    ...
  ],
  "subcategories": [
    {
      "name": "...",
      "description": "...",
      "url": "..."
    },
    ...
  ]
}
```

## Troubleshooting

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

### Debugging

Logs are stored in the `logs/` directory:
- `content-generation.log`: General content generation logs
- `error.log`: Error-specific logs

## Maintenance Tasks

1. **Regular Content Updates**:
   - Schedule periodic content refreshes
   - Update prompts in writer modules to improve content quality
   - Monitor content for accuracy and relevance

2. **System Monitoring**:
   - Check logs for errors or warnings
   - Monitor API usage and costs
   - Verify content quality periodically

## Browser Compatibility

The content should be compatible with all modern browsers including:
- Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile browsers on iOS and Android

## Security Considerations

1. Protect the OpenAI API key
2. Sanitize AI-generated content before rendering
3. Implement proper error handling to prevent exposing sensitive information

## Future Enhancements

1. Implement content versioning and rollback
2. Add content quality scoring and human review workflow
3. Integrate image generation for blog posts and category pages
4. Add A/B testing for different content variations

---

## For DevOps Team

When deploying this system, please ensure:

1. All dependencies are installed
2. Environment variables are properly configured
3. File system permissions allow writing to data directories
4. Logging is properly configured for the environment
5. Job scheduler is properly configured and monitored

For any questions or issues, please contact the development team. 