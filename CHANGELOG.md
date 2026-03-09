# Changelog

All notable changes to v0-platform-mcp will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-03-09

### Added
- **Complete Prototype Workflow** - 3-step workflow for rapid UI prototyping
  - `prepare_prototype_context` - Parse natural language descriptions into structured requirements
  - `generate_prototype` - Generate multi-screen UI prototypes via V0 API
  - `handoff_to_claude_dev` - Convert prototypes into implementation briefs
- **MCP Workflow Tools** - 5-step workflow for incremental development
  - `load_project_context` - Load existing project state and patterns
  - `plan_increment` - Plan new features based on existing architecture
  - `update_project_context` - Update project state after implementation
- **Advanced Features**
  - Image analysis for wireframes and design references
  - Screen inference from product descriptions
  - Platform detection (web/mobile) with confidence scoring
  - Streaming progress updates during generation
  - UX pattern extraction (navigation, flows, interactions)
  - Retry logic with exponential backoff for API calls
  - Partial generation support with graceful degradation

### Changed
- Restructured tools around two distinct workflows: Prototype and MCP
- Enhanced error handling with categorization and user-friendly messages
- Improved documentation with complete workflow examples

### Technical
- Added 4 new services: ContextPreparationService, PrototypeGenerationService, HandoffService, ImageAnalysisService
- Added 3 new MCP workflow services: ProjectContextService, IncrementPlanningService
- Comprehensive test coverage with 215+ passing tests
- Full Zod schema validation for all tool inputs
- End-to-end workflow tests with 18 test cases
- Platform-specific implementation guidance (web: SEO/responsive, mobile: offline/native)

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
