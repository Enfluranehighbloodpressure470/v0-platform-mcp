# v0-platform-mcp

Vercel v0 MCP Server for Claude Code - Rapid multi-screen UI prototyping through the Model Context Protocol.

[![npm version](https://badge.fury.io/js/v0-platform-mcp.svg)](https://www.npmjs.com/package/v0-platform-mcp)

> ✨ Built with Claude Code and Gemini CLI using Vibe Coding methodology

## 🎯 Overview

**Two powerful workflows for UI development:**

### Prototype Workflow (4 tools)
1. **v0_healthcheck** - Verify API connectivity
2. **prepare_prototype_context** - Parse product descriptions into structured requirements
3. **generate_prototype** - Generate complete multi-screen UI prototypes
4. **handoff_to_claude_dev** - Create implementation briefs for developers

### MCP Workflow (5 steps) - Context-Driven Incremental Development
1. **load_project_context** - Load project state and architecture
2. **plan_increment** - Plan feature implementation strategy
3. **generate_prototype** - Generate UI based on project context (shared with Prototype Workflow)
4. **handoff_to_claude_dev** - Create implementation briefs (shared with Prototype Workflow)
5. **update_project_context** - Update project state after implementation

The MCP Workflow enables incremental feature development with persistent project context, ensuring consistency across features.

### Key Features
- 🚀 **Two workflows:** Prototype (4 steps) for new projects, MCP (5 steps) for incremental development
- 📋 Multi-screen prototype generation with streaming progress
- 🎯 Context-driven planning with pattern reuse and component tracking
- 🔧 TypeScript + Zod validation + Winston logging
- 🧪 Full test coverage with Jest (31 new tests for MCP workflow)
- 🔌 Native MCP integration (Claude Code, Claude Desktop, Cursor)

### Workflow Comparison at a Glance

```
┌──────────────────────────────────────────────────────────────────────────┐
│  PROTOTYPE WORKFLOW (4 steps) - New Projects & Rapid Prototyping        │
├──────────────────────────────────────────────────────────────────────────┤
│  1. prepare_prototype_context  (parse description)                       │
│  2. generate_prototype         (create UI)                               │
│  3. handoff_to_claude_dev      (implementation brief)                    │
│  4. [implement]                (Claude Dev builds it)                    │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  MCP WORKFLOW (5 steps) - Existing Projects & Incremental Development   │
├──────────────────────────────────────────────────────────────────────────┤
│  1. load_project_context       (load existing state)                    │
│  2. plan_increment             (analyze & plan based on patterns)       │
│  3. generate_prototype         (create UI following patterns)           │
│  4. handoff_to_claude_dev      (implementation brief)                   │
│  5. update_project_context     (save feature & components)              │
│     ↓                                                                    │
│  [Ready for next feature with updated context]                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

```bash
# 1. Get your v0 API key from https://vercel.com/docs/v0/model-api

# 2. Add to Claude Code
claude mcp add v0-platform-mcp --env V0_API_KEY=YOUR_KEY -- npx v0-platform-mcp

# That's it! The server will auto-install and run via npx
```

### Alternative: Local Development

```bash
# Clone and build locally
git clone <repository-url> && cd v0-platform-mcp
npm install
npm run build

# Add to Claude Code (local)
claude mcp add v0-platform-mcp --env V0_API_KEY=YOUR_KEY -- node $(pwd)/dist/main.js
```

---

## 🔄 MCP Workflow - Context-Driven Incremental Development

The MCP Workflow enables incremental feature development with persistent project context. Instead of generating prototypes from scratch, it tracks your project state and plans each feature based on existing patterns.

### Workflow Comparison

| Aspect | Prototype Workflow (4 steps) | MCP Workflow (5 steps) |
|--------|------------------------------|------------------------|
| **Use Case** | New projects, rapid prototyping | Existing projects, incremental development |
| **State** | Stateless (no memory) | Stateful (persistent context) |
| **Input** | Natural language description | Project context + Feature request |
| **Planning** | Infers screens from description | Analyzes existing patterns & references |
| **Consistency** | No pattern enforcement | Follows existing patterns & reuses components |
| **Context File** | ❌ Not used | ✅ Required (`project-context.json`) |
| **Ideal For** | MVPs, proof-of-concepts | Production apps with multiple features |

### When to Use MCP Workflow

- ✅ Building features incrementally within an existing project
- ✅ Need to maintain consistency with existing UI patterns
- ✅ Want to reuse components across features
- ✅ Track project state (features, routes, components)
- ✅ Reference similar features for new implementations

### 5-Step Workflow

```
┌─────────────────────────────────────────────────┐
│  STEP 1: load_project_context                  │
│  Load project state from context file          │
└─────────────────────────────────────────────────┘
                      ↓
        Project State (features, routes, components)
                      ↓
┌─────────────────────────────────────────────────┐
│  STEP 2: plan_increment                         │
│  Plan feature based on existing patterns       │
└─────────────────────────────────────────────────┘
                      ↓
        Increment Plan (scope, references, sections)
                      ↓
┌─────────────────────────────────────────────────┐
│  STEP 3: generate_prototype                     │
│  Generate UI using V0 API                       │
└─────────────────────────────────────────────────┘
                      ↓
        UI Prototype (screens, components, preview)
                      ↓
┌─────────────────────────────────────────────────┐
│  STEP 4: handoff_to_claude_dev                  │
│  Create implementation brief                    │
└─────────────────────────────────────────────────┘
                      ↓
        Implementation Brief → Claude Dev Implements
                      ↓
┌─────────────────────────────────────────────────┐
│  STEP 5: update_project_context                 │
│  Mark feature done, add routes/components       │
└─────────────────────────────────────────────────┘
                      ↓
        Updated Context → Ready for next feature
```

### Complete 5-Step Implementation Guide

#### 📋 Step 1: Load Project Context

```
Use load_project_context with context_path "project-context.json"
```

**Returns:**
```
✅ Project Context Loaded

Product: TaskMaster Pro
Domain: Project Management

Features:
  - Done: 2
  - In Progress: 1
  - Planned: 2

Infrastructure:
  - Dashboard Shell: ✅ Yes
  - Routes: 2
  - Reusable Components: 7
```

#### 🎯 Step 2: Plan Increment

```
Use plan_increment with the loaded project_context and feature_request "Add Global Configuration page to dashboard"
```

**Returns:**
```
✅ Increment Plan Created

Feature: Global Configuration
Type: page
Generation Scope: content_only

Base Reference: Brand Configuration (similar feature found!)

Expected Sections (3):
  - General Settings
  - Advanced Options
  - Save Actions

Reusable Components (2):
  - ConfigSection
  - SaveBar

New Components Expected (3):
  - GeneralSettingsSection
  - AdvancedOptionsSection
  - SaveActionsSection

Constraints:
  - Do not regenerate dashboard shell
  - Only generate page content
  - Follow layout pattern from: Brand Configuration
  - All pages must fit within dashboard shell

Generation Notes:
  - Similar feature exists: Brand Configuration
  - Reuse layout and component patterns from reference feature
  - Generation scope: content_only
  - Apply design rules: Use Tailwind CSS, Follow shadcn/ui patterns
  - Add appropriate route for this page
```

#### 🎨 Step 3: Generate Prototype

Use the increment plan from Step 2 to construct the prototype context, then generate the UI:

```
Use generate_prototype with prototype_context derived from increment plan
```

This generates the UI screens and components using V0 API, following the patterns and constraints from your project context.

**Returns:**
```
✅ Prototype Generated Successfully

Prototype ID: proto_1234567890
Platform: web
Screens Generated: 3/3

Generated Screens:
  - global-configuration
  - settings-form
  - advanced-options

Components (8): ConfigSection, SaveBar, FormInput...

Preview: https://v0.dev/t/xyz123
```

#### 📝 Step 4: Handoff to Claude Dev

Create an implementation brief from the generated prototype:

```
Use handoff_to_claude_dev with prototype_id, prototype_result, and prototype_context
```

This converts the V0 prototype into a structured implementation brief with UX patterns, component descriptions, and implementation rules.

**Returns:**
```
# Global Configuration - Implementation Brief

Screens: global-configuration, settings-form, advanced-options

UX Patterns:
- Settings layout with sidebar navigation
- Form validation with inline errors
- Save confirmation with toast notifications

Implementation Rules:
- PRESERVE V0-generated UI components
- Implement backend API integration
- Add form validation and error handling
- Add authentication checks
- Write tests for business logic
```

#### 💾 Step 5: Update Project Context

After implementing the feature:

```
Use update_project_context with context_path "project-context.json" and feature_update:
{
  feature_name: "Global Configuration",
  status: "done",
  routes_added: ["/dashboard/global-configuration"],
  components_added: ["ConfigSection", "SaveBar"],
  patterns_added: ["Settings pages use ConfigSection + SaveBar pattern"],
  notes: ["Reuses Brand Configuration layout"]
}
```

**Returns:**
```
✅ Project Context Updated

Feature Completed: Global Configuration

Changes Applied:
  - Feature moved to "done" status
  - Routes added: 1
  - Components added: 2
  - Patterns added: 1

New Routes:
  - /dashboard/global-configuration

Updated Project State:
  - Total Features Done: 3
  - Total Routes: 3
  - Total Reusable Components: 9
```

### Project Context File Format

Create a `project-context.json` file:

```json
{
  "product_name": "TaskMaster Pro",
  "domain": "Project Management",
  "features": {
    "done": ["Dashboard Overview", "Brand Configuration"],
    "in_progress": ["Task List"],
    "planned": ["Global Configuration", "User Management"]
  },
  "routes": [
    "/dashboard",
    "/dashboard/brand-configuration"
  ],
  "layout": {
    "dashboard_shell_exists": true,
    "layout_patterns": [
      "Sidebar navigation with collapsible sections"
    ],
    "page_patterns": [
      "Settings pages use ConfigSection + SaveBar pattern"
    ]
  },
  "reusable_components": [
    "ConfigSection",
    "SaveBar",
    "DataTable"
  ],
  "design_rules": [
    "Use Tailwind CSS for styling",
    "Follow shadcn/ui component patterns"
  ],
  "constraints": [
    "All pages must fit within existing dashboard shell"
  ]
}
```

See `examples/sample-project-context.json` for a complete example.

### 🎯 Quick Reference: 5-Step MCP Workflow

| Step | Tool | Input | Output |
|------|------|-------|--------|
| **1** | `load_project_context` | Context file path | Project state summary |
| **2** | `plan_increment` | Project context + Feature request | Increment plan with scope & references |
| **3** | `generate_prototype` | Prototype context (from plan) | UI prototype with screens & components |
| **4** | `handoff_to_claude_dev` | Prototype + Context | Implementation brief with UX patterns |
| **5** | `update_project_context` | Context path + Feature update | Updated project state |

### Key Benefits

1. **Consistency** - New features follow existing patterns
2. **Efficiency** - Reuse components instead of recreating
3. **Context-Aware** - Plans consider what already exists
4. **Incremental** - Build one feature at a time
5. **Trackable** - Project state persists across features

---

## 🔧 All Tools Reference

### Prototype Workflow Tools

| # | Tool | Purpose | Use Case |
|---|------|---------|----------|
| **1** | **v0_healthcheck** | Verify API configuration | Test connectivity and API key |
| **2** | **prepare_prototype_context** | Parse product description | Extract screens, platform, goals |
| **3** | **generate_prototype** | Generate multi-screen prototype | Create all screens in one call |
| **4** | **handoff_to_claude_dev** | Create implementation brief | Developer handoff with UX patterns |

### MCP Workflow Tools (5-Step Process)

| Step | Tool | Purpose | Use Case |
|------|------|---------|----------|
| **Step 1** | **load_project_context** | Load project state | Read context file with features, routes, components |
| **Step 2** | **plan_increment** | Plan feature implementation | Analyze context, find references, determine scope |
| **Step 3** | **generate_prototype** | Generate UI prototype | Create screens based on increment plan (shared with Prototype Workflow) |
| **Step 4** | **handoff_to_claude_dev** | Create implementation brief | Convert prototype to dev tasks (shared with Prototype Workflow) |
| **Step 5** | **update_project_context** | Update project state | Mark feature done, add routes/components |

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

**Method 1: npx (Recommended)**
```bash
claude mcp add v0-platform-mcp --env V0_API_KEY=your_key -- npx v0-platform-mcp
```

**Method 2: Manual Configuration**

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

**Method 3: Local Development**
```bash
cd /path/to/v0-platform-mcp
claude mcp add v0-platform-mcp --env V0_API_KEY=your_key -- node $(pwd)/dist/main.js
```

### Verification

```bash
# List MCP servers
claude mcp list

# Expected: v0-platform-mcp should be listed
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
│         v0-platform-mcp Server               │
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
