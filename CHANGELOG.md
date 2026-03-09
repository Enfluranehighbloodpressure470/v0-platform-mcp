# Changelog

All notable changes to v0-platform-mcp will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.2] - 2026-03-09

### Fixed
- Fixed MCP server connection failure when installed via npx from another project
  - Improved ESM module entry point detection using `fileURLToPath()` for reliable path comparison
  - Entry point check now works correctly across all environments (npx, npm scripts, direct execution)
  - Made dotenv configuration loading more explicit with path parameter
- Server now starts correctly when run from any directory, not just the project root

### Changed
- Improved entry point detection to use proper URL-to-path conversion for ESM modules
- Added `fileURLToPath` import from 'url' module for cross-platform path handling

## [1.2.1] - Previous Release

### Added
- MCP Workflow (5 steps) for context-driven incremental development
- Prototype Workflow (4 steps) for rapid prototyping
- Full test coverage with Jest
- TypeScript + Zod validation + Winston logging
- Multi-screen prototype generation with streaming progress
- Context-driven planning with pattern reuse

### Features
- `v0_healthcheck` - Verify API connectivity
- `prepare_prototype_context` - Parse product descriptions
- `generate_prototype` - Generate multi-screen UI prototypes
- `handoff_to_claude_dev` - Create implementation briefs
- `load_project_context` - Load project state
- `plan_increment` - Plan feature implementation
- `update_project_context` - Update project state

[1.2.2]: https://github.com/yourusername/v0-platform-mcp/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/yourusername/v0-platform-mcp/releases/tag/v1.2.1
