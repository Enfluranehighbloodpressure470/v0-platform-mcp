# v0-mcp

Vercel v0 MCP Server for Claude Code - Rapid multi-screen UI prototyping through the Model Context Protocol.

> ✨ Built with Claude Code and Gemini CLI using Vibe Coding methodology

## 🎯 Overview

**4 specialized tools** for AI-powered multi-screen prototype development:

1. **v0_healthcheck** - Verify API connectivity
2. **prepare_prototype_context** - Parse product descriptions into structured requirements
3. **generate_prototype** - Generate complete multi-screen UI prototypes
4. **handoff_to_claude_dev** - Create implementation briefs for developers

### Key Features
- 🚀 Multi-screen prototype generation with streaming progress
- 📋 Automated developer handoff with UX patterns
- 🔧 TypeScript + Zod validation + Winston logging
- 🧪 Full test coverage with Jest
- 🔌 Native MCP integration (Claude Code, Claude Desktop, Cursor)

---

## 🚀 Quick Start

```bash
# 1. Install
git clone <repository-url> && cd v0-mcp
npm install

# 2. Setup environment
npm run setup
# Edit .env with your V0_API_KEY from https://vercel.com/docs/v0/model-api

# 3. Build
npm run build

# 4. Add to Claude Code
claude mcp add v0-mcp --env V0_API_KEY=$(grep V0_API_KEY .env | cut -d '=' -f2) -- node $(pwd)/dist/main.js

# 5. Verify
npm run verify:claude-code
```

---

## 🔧 All Tools Reference

| # | Tool | Purpose | Use Case |
|---|------|---------|----------|
| **1** | **v0_healthcheck** | Verify API configuration | Test connectivity and API key |
| **2** | **prepare_prototype_context** | Parse product description | Extract screens, platform, goals |
| **3** | **generate_prototype** | Generate multi-screen prototype | Create all screens in one call |
| **4** | **handoff_to_claude_dev** | Create implementation brief | Developer handoff with UX patterns |

---

## 📖 Tool Documentation

### 1️⃣ v0_healthcheck

Validate API configuration and connectivity.

**How to use:**
```
Use v0_healthcheck to verify the API connection
```

**Returns:** ✅ Connection status, API validation, model availability

---

### 2️⃣ prepare_prototype_context (Step 1)

Parse product description into structured requirements.

**How to use:**
```
Use prepare_prototype_context to building TaskMaster - a task management system. Needs dashboard, task list, and settings pages. For web.
```

**With wireframes:**
```
Use prepare_prototype_context with text "Building an e-commerce store..." and images ["https://wireframe1.png", "https://wireframe2.png"]
```

**Returns:**
```
✅ Prototype Context Prepared

Product Name: TaskMaster
Platform: web
Goal: Task management system
Screens (3):
  - dashboard
  - task-list
  - settings

Confidence: high
```

---

### 3️⃣ generate_prototype (Step 2)

Generate multi-screen prototype from context.

**How to use:**
```
Use generate_prototype with the context from prepare_prototype_context
```

**With options:**
```
Use generate_prototype with the context from prepare_prototype_context, model v0-1.5-lg, and streaming enabled
```

**Returns:**
```
✅ Prototype Generated Successfully

Prototype ID: proto_123456
Platform: web
Screens Generated: 3/3

Generated Screens:
  - dashboard
  - task-list
  - settings

Components (12):
  task-card, filter-bar, stat-widget, header, sidebar...

Preview: https://v0.dev/t/abc123
```

---

### 4️⃣ handoff_to_claude_dev (Step 3)

Create implementation brief for development.

**How to use:**
```
Use handoff_to_claude_dev with the prototype from generate_prototype
```

**Note:** Claude automatically passes the correct prototype_id, prototype_result, and prototype_context.

**Returns:** Implementation brief with:
- Product summary and screens
- Component list
- UX patterns (navigation, flows, interactions)
- Implementation rules (preserve UI, add backend, auth, testing)

---

## 💡 Complete Workflow Example

### Building an E-commerce Store (ShopZen)

**Step 1: Parse Requirements**
```
Use prepare_prototype_context to building ShopZen - an e-commerce platform. Users need a product catalog page with filters, product detail page with image gallery, shopping cart, checkout with payment form, and user account with order history. This is for web.
```

**Result:**
```
✅ Prototype Context Prepared
Product: ShopZen
Platform: web
Screens (5): catalog, product-detail, cart, checkout, account
Confidence: high
```

---

**Step 2: Generate Prototype**
```
Use generate_prototype with the context from prepare_prototype_context and enable streaming
```

**Result:**
```
✅ Prototype Generated Successfully
Prototype ID: proto_789012
Screens Generated: 5/5
Components (18): product-card, filter-panel, image-gallery,
  cart-item, checkout-form, payment-input, order-card...
Preview: https://v0.dev/t/xyz789
```

---

**Step 3: Create Implementation Brief**
```
Use handoff_to_claude_dev with the prototype from generate_prototype
```

**Result:**
```
# ShopZen - Implementation Brief

Screens: catalog, product-detail, cart, checkout, account

UX Patterns:
- Product catalog with filtering and search
- Image gallery with zoom on product detail
- Shopping cart with quantity controls
- Multi-step checkout flow
- Order history with status tracking

Implementation Rules:
- Preserve V0-generated UI components
- Implement product API integration
- Add cart state management (Context/Redux)
- Integrate payment gateway (Stripe/PayPal)
- Add authentication and user sessions
- Implement order processing workflow
- Add email notifications for orders
```

---

## ⚙️ Configuration

### Get v0 API Key

1. Visit [v0 Model API documentation](https://vercel.com/docs/v0/model-api)
2. Sign in to Vercel account
3. Generate new API key
4. Copy and save securely

### Claude Code Setup

**Method 1: CLI (Recommended)**
```bash
cd /path/to/v0-mcp
claude mcp add v0-mcp --env V0_API_KEY=your_key -- node $(pwd)/dist/main.js
```

**Method 2: Manual Configuration**

Edit `~/.claude.json`:
```json
{
  "mcpServers": {
    "v0-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/v0-mcp/dist/main.js"],
      "env": {
        "V0_API_KEY": "your_v0_api_key_here"
      }
    }
  }
}
```

### Verification

```bash
# List MCP servers
claude mcp list

# Verify setup
npm run verify:claude-code
```

**Expected tools in Claude:**
- ✅ v0_healthcheck
- ✅ prepare_prototype_context
- ✅ generate_prototype
- ✅ handoff_to_claude_dev

---

## 🧪 Development

```bash
# Development mode
npm run dev

# Testing
npm test
npm run test:coverage
npm run test:ci

# Linting
npm run lint

# Build
npm run build
npm run clean
```

---

## 🔑 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `V0_API_KEY` | ✅ | - | Your v0 API key |
| `V0_BASE_URL` | ❌ | `https://api.v0.dev/v1` | v0 API base URL |
| `V0_DEFAULT_MODEL` | ❌ | `v0-1.5-md` | Default model |
| `V0_TIMEOUT` | ❌ | `60000` | API timeout (ms) |
| `LOG_LEVEL` | ❌ | `info` | Logging level |

---

## 📋 Quick Reference

### 3-Step Workflow

```
Natural Language Description
          ↓
  [prepare_prototype_context]
          ↓
  Structured Context (product, platform, screens)
          ↓
  [generate_prototype]
          ↓
  Multi-Screen Prototype (screens, components, preview)
          ↓
  [handoff_to_claude_dev]
          ↓
  Implementation Brief (UX patterns, dev rules)
          ↓
  Production Code (Claude Dev implements)
```

### v0 Model Comparison

| Model | Speed | Quality | Best For |
|-------|-------|---------|----------|
| `v0-1.5-md` | ⚡⚡⚡ | ⭐⭐⭐ | Default, balanced |
| `v0-1.5-lg` | ⚡⚡ | ⭐⭐⭐⭐ | Complex components |
| `v0-1.0-md` | ⚡⚡⚡ | ⭐⭐ | Legacy compatibility |

### Workflow Principles

**v0 Handles:**
- ✅ UI design and layout
- ✅ Visual components
- ✅ Styling (Tailwind CSS)
- ✅ Component structure

**Claude Dev Handles:**
- ✅ Backend logic
- ✅ API integration
- ✅ Data management
- ✅ Authentication
- ✅ Testing

---

## 🎯 Architecture

```
┌─────────────────────────────────────────────┐
│              v0-mcp Server                  │
├─────────────────────────────────────────────┤
│                                             │
│  Tools                                      │
│  ├─ v0_healthcheck        (API check)      │
│  ├─ ContextService        (Step 1)         │
│  ├─ PrototypeService      (Step 2)         │
│  └─ HandoffService        (Step 3)         │
│                                             │
│  ↓ MCP Protocol                             │
│                                             │
│  Claude Code / Claude Desktop / Cursor      │
└─────────────────────────────────────────────┘
```

---

## 📦 Integration

### Claude Desktop

Edit `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "v0-mcp": {
      "command": "node",
      "args": ["/path/to/v0-mcp/dist/main.js"],
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
    "v0-mcp": {
      "command": "node",
      "args": ["/path/to/v0-mcp/dist/main.js"],
      "env": {"V0_API_KEY": "your_key"}
    }
  }
}
```

---

## 🎨 More Examples

### Booking System (ReserveIt)

```
Step 1:
Use prepare_prototype_context to building ReserveIt - a restaurant booking system. Users need a calendar view to see available time slots, a reservations list to manage bookings, a booking form to create new reservations, and an admin dashboard to manage restaurants and settings. For web.

Step 2:
Use generate_prototype with the context from prepare_prototype_context with streaming enabled

Step 3:
Use handoff_to_claude_dev with the prototype from generate_prototype
```

**What you get:** Complete 4-screen prototype with implementation brief including availability logic, booking workflow, and admin controls

---

### Social Media Dashboard (SocialHub)

```
Step 1:
Use prepare_prototype_context to building SocialHub - social media management tool. Needs post scheduler, analytics dashboard, content calendar, account settings. For web.

Step 2:
Use generate_prototype with the context from prepare_prototype_context

Step 3:
Use handoff_to_claude_dev with the prototype from generate_prototype
```

**What you get:** Dashboard with scheduling, analytics, and calendar views plus implementation brief for API integrations and post queuing

---

## 🔗 Links

- [v0 Model API Docs](https://vercel.com/docs/v0/model-api)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Claude Code](https://claude.ai/code)
