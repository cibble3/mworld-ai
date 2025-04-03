# AI Content Generation System

This document provides an overview of the AI content generation system for MistressWorld, including how it works, how to use it, and how to extend it.

## 📋 Overview

The AI content generation system automatically creates and maintains content across the site, including:

- Home page sections
- Category and subcategory pages
- Model bios and showcases
- Blog posts
- SEO metadata

## 🔧 Components

The system consists of several components:

1. **AI Writer** (`ai-writer.js`) - The main script that orchestrates content generation
2. **Writer Modules** (`writers/`) - Specialized content generators for different types of content:
   - `modelWriter.js` - Generates model bios and showcases
   - `categoryWriter.js` - Generates category and subcategory content
   - `blogWriter.js` - Generates blog posts
   - `pageWriter.js` - Generates page content (e.g., home page sections)
3. **Job Runner** (`scripts/job-runner.js`) - Schedules and executes content generation jobs
4. **Jobs Configuration** (`jobs/jobs.json`) - Defines what content to generate and when
5. **Data Storage** (`data/`) - Where generated content is stored:
   - `data/models/` - Model content (bios, showcases)
   - `data/categories/` - Category and subcategory content
   - `data/blog/` - Blog posts
   - `data/pages/` - Page content

## 🚀 Usage

### Running Jobs

You can run content generation jobs in several ways:

#### Run All Jobs

```bash
npm run jobs:run
```

This will run all jobs defined in `jobs/jobs.json` immediately.

#### Run a Specific Job

```bash
npm run jobs:run-job <job-id>
```

For example:
```bash
npm run jobs:run-job blog-content-for-girls
```

#### Start the Job Scheduler

```bash
npm run jobs:start
```

This will start the job scheduler, which will run jobs according to their defined schedules in `jobs/jobs.json`.

### Direct Content Generation

You can also run the AI writer directly for specific content types:

```bash
npm run model:gen -- --category=girls --limit=5 
npm run category:gen -- --category=girls --subcategories=asian,blonde
npm run blog:gen -- --topics="Top Live Cam Girls" --tags="girls,featured"
npm run page:gen -- --page=home --sections=featured,trending
```

## 📋 Content Types

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

## 🔧 Configuration

### Jobs Configuration

Jobs are defined in `jobs/jobs.json`. Each job includes:

- `id` - Unique identifier for the job
- `type` - Type of content to generate (model, category, blog, page)
- `schedule` - Cron schedule expression (when to run the job)
- `priority` - Job priority (high, medium, low)
- `params` - Job-specific parameters

Example job configuration:

```json
{
  "id": "home-page-content",
  "type": "page",
  "schedule": "0 0 * * *",
  "priority": "high",
  "params": {
    "page": "home",
    "sections": "featured,top-performers,trending",
    "limit": 10
  }
}
```

## 🔄 Content Flow

1. The job runner reads jobs from `jobs/jobs.json`
2. Based on the schedule, it executes the appropriate job
3. The job calls the AI writer with specific parameters
4. The AI writer uses the appropriate writer module to generate content
5. The writer module uses OpenAI to generate content
6. The content is stored in the appropriate location in the `data/` directory
7. The website reads content from the `data/` directory when rendering pages

## 📂 Directory Structure

```
/
├── ai-writer.js             # Main AI writer script
├── jobs/
│   └── jobs.json            # Job definitions
├── scripts/
│   └── job-runner.js        # Job scheduler and runner
├── writers/
│   ├── utils/
│   │   └── ai.js            # OpenAI integration
│   ├── modelWriter.js       # Model content generator
│   ├── categoryWriter.js    # Category content generator
│   ├── blogWriter.js        # Blog post generator
│   └── pageWriter.js        # Page content generator
└── data/                    # Generated content
    ├── models/              # Model content
    │   ├── girls/           # Female model content
    │   └── trans/           # Trans model content
    ├── categories/          # Category content
    ├── blog/                # Blog posts
    └── pages/               # Page content
```

## 📝 Extending the System

### Adding a New Content Type

1. Create a new writer module in `writers/`
2. Add a new case in the `ai-writer.js` script
3. Define a new job type in `jobs/jobs.json`

### Modifying Content Generation

To change how content is generated, modify the `generatePrompt` function in the appropriate writer module.

## 🔧 Troubleshooting

### Logs

Logs are stored in the `logs/` directory:
- `job-error.log` - Error logs
- `job-combined.log` - All logs

### Common Issues

- **OpenAI API Key**: Make sure your OpenAI API key is set in the `.env` file
- **File Permissions**: Ensure the system has write permissions to the `data/` directory
- **Rate Limiting**: OpenAI API has rate limits, so avoid running too many jobs simultaneously

### Common Issues

1. **"Failed to fetch home page data" error**:
   - Check that data files exist in both `data/pages/` and `public/data/pages/`
   - Run `npm run verify-data` to confirm file locations
   - Ensure the Next.js server is running in development mode

2. **Components not rendering correctly**:
   - Check browser console for errors
   - Verify that component props match expected format
   - Make sure image imports are properly configured

3. **"TypeError: Cannot read properties of undefined"**:
   - This usually indicates missing null checks in components
   - Add proper null/undefined checks in your components
   - Use optional chaining (?.) when accessing nested properties

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

## 📝 Reporting Issues

If you encounter any issues with the AI content system, please:

1. Check the console for error messages
2. Run `npm run verify-data` to check data integrity
3. Consult the troubleshooting section above
4. File an issue with detailed reproduction steps

## 📝 Deployment Considerations

When deploying the application:

1. Ensure all data files are properly copied to the deployment environment
2. Configure proper environment variables (OPENAI_API_KEY, etc.)
3. Run verification tests before deploying
4. Monitor error logs after deployment

## 📝 Resources

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Next.js Documentation](https://nextjs.org/docs)

## Quick Start

1. **Verify your environment**: Make sure your .env file contains a valid OpenAI API key.
2. **Verify data files**: Run `npm run verify-data` to check that all required data files exist.
3. **Synchronize data directories**: Run `npm run sync-data` to ensure content is accessible to the frontend.
4. **Generate content**: Run one of the following commands:
   - `npm run jobs:run` - Run all content generation jobs
   - `npm run jobs:run-job <job-id>` - Run a specific job (e.g., home, models, categories, blog)
   - `npm run jobs:start` - Start the job scheduler (runs jobs according to their defined schedules) 