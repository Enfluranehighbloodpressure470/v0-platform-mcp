# v0-platform-mcp

[![npm version](https://badge.fury.io/js/v0-platform-mcp.svg)](https://www.npmjs.com/package/v0-platform-mcp)

Vercel v0 MCP Server for Claude Code - Multi-screen UI prototyping and incremental development through the Model Context Protocol.

> Built with Claude Code using Vibe Coding methodology

## Quick Start

```bash
# 1. Get your v0 API key from https://vercel.com/docs/v0/model-api

# 2. Add to Claude Code
claude mcp add v0-platform-mcp --env V0_API_KEY=YOUR_KEY -- npx v0-platform-mcp
```

That's it! Start building prototypes immediately.

## Two Workflows

### Prototype Workflow (New Projects)
Fast track from idea to implementation in 3 steps:

```
1. prepare_prototype_context  → Parse description into structured context
2. generate_prototype         → Generate multi-screen UI prototype
3. handoff_to_claude_dev      → Create implementation brief
```

**Use for:** MVPs, rapid prototyping, proof-of-concepts

### MCP Workflow (Existing Projects)
Incremental development with persistent context in 5 steps:

```
1. load_project_context       → Load existing project state
2. plan_increment             → Analyze patterns & plan feature
3. generate_prototype         → Generate UI following patterns
4. handoff_to_claude_dev      → Create implementation brief
5. update_project_context     → Save feature & components
```

**Use for:** Production apps, incremental features, pattern consistency

## Core Tools

| Tool | Purpose |
|------|---------|
| **v0_healthcheck** | Verify API connectivity |
| **prepare_prototype_context** | Parse descriptions into structured requirements |
| **generate_prototype** | Generate multi-screen UI prototypes |
| **handoff_to_claude_dev** | Create implementation briefs |
| **load_project_context** | Load project state (MCP Workflow) |
| **plan_increment** | Plan features based on existing patterns (MCP Workflow) |
| **update_project_context** | Update project state after implementation (MCP Workflow) |

## Example: E-commerce Store

```
Step 1: Parse Requirements
Use prepare_prototype_context to "building ShopZen - an e-commerce platform
with product catalog, detail page, cart, checkout, and user account. For web."

Step 2: Generate Prototype
Use generate_prototype with the context from prepare_prototype_context

Step 3: Create Implementation Brief
Use handoff_to_claude_dev with the prototype from generate_prototype
```

**Result:** Complete 5-screen prototype with 18+ components and implementation brief

## MCP Workflow: Incremental Development

The MCP Workflow maintains project context across features:

**Create `project-context.json`:**
```json
{
  "product_name": "TaskMaster Pro",
  "domain": "Project Management",
  "features": {
    "done": ["Dashboard Overview"],
    "in_progress": ["Task List"],
    "planned": ["Settings Page"]
  },
  "routes": ["/dashboard"],
  "reusable_components": ["DataTable", "FilterBar"],
  "design_rules": ["Use Tailwind CSS", "Follow shadcn/ui patterns"],
  "constraints": ["All pages fit within dashboard shell"]
}
```

**5-Step Workflow:**

```
1. load_project_context       Load state from project-context.json
2. plan_increment             Plan "Settings Page" using existing patterns
3. generate_prototype         Generate UI following project patterns
4. handoff_to_claude_dev      Create implementation brief
5. update_project_context     Mark feature done, add routes/components
```

**Benefits:**
- ✅ Consistency across features
- ✅ Reuse components automatically
- ✅ Context-aware planning
- ✅ Incremental development
- ✅ Persistent project state

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `V0_API_KEY` | ✅ | - | Your v0 API key |
| `V0_BASE_URL` | ❌ | `https://api.v0.dev/v1` | v0 API base URL |
| `V0_DEFAULT_MODEL` | ❌ | `v0-1.5-md` | Default model |
| `LOG_LEVEL` | ❌ | `info` | Logging level |

### Manual Configuration

Edit `~/.claude.json`:
```json
{
  "mcpServers": {
    "v0-platform-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["v0-platform-mcp"],
      "env": {
        "V0_API_KEY": "your_v0_api_key_here"
      }
    }
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Testing
npm test
npm run test:coverage

# Build
npm run build

# Lint
npm run lint
```

## Architecture

The v0-platform-mcp follows a clean layered architecture:

- **Client Layer**: Claude Code, Claude Desktop, Cursor IDE (via MCP)
- **Tool Layer**: 7 MCP tools for prototype generation and planning
- **Service Layer**: Business logic (Context, Prototype, Handoff, Planning services)
- **Infrastructure**: Configuration, logging (Winston), validation (Zod)
- **External Services**: v0 API, File System

See `diagrams/` folder for detailed architecture diagrams.

## v0 Model Options

| Model | Speed | Quality | Use Case |
|-------|-------|---------|----------|
| `v0-1.5-md` | ⚡⚡⚡ | ⭐⭐⭐ | Default, balanced |
| `v0-1.5-lg` | ⚡⚡ | ⭐⭐⭐⭐ | Complex components |
| `v0-1.0-md` | ⚡⚡⚡ | ⭐⭐ | Legacy support |

## Integration

### Claude Desktop

Edit `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "v0-platform-mcp": {
      "command": "npx",
      "args": ["v0-platform-mcp"],
      "env": {"V0_API_KEY": "your_key"}
    }
  }
}
```

### Cursor IDE

Add to Cursor MCP configuration:
```json
{
  "mcpServers": {
    "v0-platform-mcp": {
      "command": "npx",
      "args": ["v0-platform-mcp"],
      "env": {"V0_API_KEY": "your_key"}
    }
  }
}
```

## Workflow Principles

**v0 generates:**
- ✅ UI design and layout
- ✅ Visual components
- ✅ Styling (Tailwind CSS)
- ✅ Component structure

**Claude Dev implements:**
- ✅ Backend logic
- ✅ API integration
- ✅ Data management
- ✅ Authentication
- ✅ Testing

## Links

- [v0 Model API Docs](https://vercel.com/docs/v0/model-api)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Claude Code](https://claude.ai/code)
- [npm Package](https://www.npmjs.com/package/v0-platform-mcp)

## License

MIT - See LICENSE file for details

## Author

Long Nguyen
