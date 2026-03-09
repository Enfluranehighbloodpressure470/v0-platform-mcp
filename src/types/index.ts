/**
 * Type definitions for v0-platform-mcp
 */

import { z } from 'zod';

// v0 API Models
export const V0ModelSchema = z.enum(['v0-1.5-md', 'v0-1.5-lg', 'v0-1.0-md']);
export type V0Model = z.infer<typeof V0ModelSchema>;

// Tool Input Schemas
export const GenerateUISchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  model: V0ModelSchema.default('v0-1.5-md'),
  stream: z.boolean().default(false),
  context: z.string().optional(),
});

export const GenerateFromImageSchema = z.object({
  imageUrl: z.string().url('Valid image URL is required'),
  prompt: z.string().optional(),
  model: V0ModelSchema.default('v0-1.5-md'),
});

export const ChatCompleteSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
  })),
  model: V0ModelSchema.default('v0-1.5-md'),
  stream: z.boolean().default(false),
});

// Tool Input Types
export type GenerateUIInput = z.infer<typeof GenerateUISchema>;
export type GenerateFromImageInput = z.infer<typeof GenerateFromImageSchema>;
export type ChatCompleteInput = z.infer<typeof ChatCompleteSchema>;

// Tool Output Types
export interface ToolResult {
  success: boolean;
  content?: string;
  error?: string;
  metadata?: {
    model?: string;
    usage?: {
      promptTokens?: number;
      completionTokens?: number;
      totalTokens?: number;
    } | undefined;
    chatId?: string | undefined;
    webUrl?: string | undefined;
    duration?: number | undefined;
    errorType?: string | undefined;
    statusCode?: number | undefined;
    retryable?: boolean | undefined;
    context?: string | undefined;
  };
}

// Configuration Types
export interface V0Config {
  apiKey: string;
  baseUrl: string;
  defaultModel: V0Model;
  timeout: number;
}

export interface AppConfig {
  v0: V0Config;
  mcp: {
    serverName: string;
    version: string;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
  };
}

// Prototype Workflow Types (US-001+)
export const PlatformSchema = z.enum(['web', 'mobile']);
export type Platform = z.infer<typeof PlatformSchema>;

export const PrototypeContextSchema = z.object({
  product_name: z.string().min(1, 'Product name is required'),
  goal: z.string().optional(),
  platform: PlatformSchema,
  screens: z.array(z.string()).min(1, 'At least one screen is required'),
  design_style: z.string().optional(),
  ui_reference: z.array(z.string().url()).optional(),
  raw_input: z.string().optional(),
  layout_hints: z.object({
    structure: z.array(z.string()).optional(), // header, sidebar, main, footer
    components: z.array(z.string()).optional(), // buttons, forms, cards, tables
    source: z.enum(['image_analysis', 'inferred']).optional(),
    conflicts: z.array(z.string()).optional(), // noted conflicts from multiple images
  }).optional(),
});

export const PreparePrototypeContextSchema = z.object({
  text: z.string().min(1, 'Text input is required').max(5000, 'Text input must be less than 5000 characters'),
  images: z.array(z.string().url()).optional(),
});

export const PrototypeContextResultSchema = z.object({
  status: z.enum(['valid', 'weak_input', 'validation_error']),
  context: PrototypeContextSchema.optional(),
  suggestions: z.array(z.string()).optional(),
  missing_fields: z.array(z.string()).optional(),
  confidence: z.enum(['high', 'medium', 'low']).optional(),
});

export type PrototypeContext = z.infer<typeof PrototypeContextSchema>;
export type PreparePrototypeContextInput = z.infer<typeof PreparePrototypeContextSchema>;
export type PrototypeContextResult = z.infer<typeof PrototypeContextResultSchema>;

// US-006, US-007: Generate Prototype Tool (V0 API Call)
export const GeneratePrototypeSchema = z.object({
  prototype_context: PrototypeContextSchema,
  model: V0ModelSchema.optional().default('v0-1.5-md'),
  stream: z.boolean().optional().default(false),
});

export const PrototypeResultSchema = z.object({
  status: z.enum(['success', 'partial_success', 'generation_failed']),
  prototype_id: z.string(),
  screens_requested: z.number(),
  screens_generated: z.number(),
  generated_screens: z.array(z.string()).optional(),
  components: z.array(z.string()).optional(),
  preview_reference: z.string().optional(),
  error: z.string().optional(),
  retryable: z.boolean().optional(),
  retry_after_seconds: z.number().optional(),
  metadata: z.object({
    model: z.string().optional(),
    duration: z.number().optional(),
    webUrl: z.string().optional(),
  }).optional(),
});

export type GeneratePrototypeInput = z.infer<typeof GeneratePrototypeSchema>;
export type PrototypeResult = z.infer<typeof PrototypeResultSchema>;

// US-013: Handoff to Claude Dev Tool (Implementation Brief)
export const HandoffToClaudeDevSchema = z.object({
  prototype_id: z.string().min(1, 'Prototype ID is required'),
  prototype_result: PrototypeResultSchema,
  prototype_context: PrototypeContextSchema,
});

export const ImplementationBriefSchema = z.object({
  prototype_id: z.string(),
  summary: z.string(),
  screens: z.array(z.object({
    name: z.string(),
    description: z.string(),
    components: z.array(z.string()),
  })),
  components: z.array(z.string()),
  ux_notes: z.object({
    navigation_patterns: z.array(z.string()),
    screen_flows: z.array(z.string()),
    interaction_patterns: z.array(z.string()),
  }),
  implementation_rules: z.array(z.string()),
  preview_reference: z.string().optional(),
});

export type HandoffToClaudeDevInput = z.infer<typeof HandoffToClaudeDevSchema>;
export type ImplementationBrief = z.infer<typeof ImplementationBriefSchema>;

// MCP Workflow Types - Context-driven incremental development
export const FeatureStatusSchema = z.enum(['done', 'in_progress', 'planned']);
export type FeatureStatus = z.infer<typeof FeatureStatusSchema>;

export const ProjectContextSchema = z.object({
  product_name: z.string(),
  domain: z.string(),
  features: z.object({
    done: z.array(z.string()),
    in_progress: z.array(z.string()),
    planned: z.array(z.string()),
  }),
  routes: z.array(z.string()),
  layout: z.object({
    dashboard_shell_exists: z.boolean(),
    layout_patterns: z.array(z.string()),
    page_patterns: z.array(z.string()),
  }),
  reusable_components: z.array(z.string()),
  design_rules: z.array(z.string()),
  constraints: z.array(z.string()),
});

export const LoadProjectContextSchema = z.object({
  context_path: z.string().min(1, 'Context path is required'),
});

export const ProjectContextResultSchema = z.object({
  success: z.boolean(),
  project_context: ProjectContextSchema.optional(),
  error: z.string().optional(),
});

export const IncrementPlanSchema = z.object({
  feature_name: z.string(),
  feature_type: z.enum(['page', 'module', 'component']),
  base_reference_feature: z.string().optional(),
  generation_scope: z.enum(['full_page', 'content_only', 'section_only']),
  expected_sections: z.array(z.string()),
  reusable_components: z.array(z.string()),
  new_components_expected: z.array(z.string()),
  constraints: z.array(z.string()),
  notes_for_generation: z.array(z.string()),
});

export const PlanIncrementSchema = z.object({
  project_context: ProjectContextSchema,
  feature_request: z.string().min(1, 'Feature request is required'),
});

export const IncrementPlanResultSchema = z.object({
  success: z.boolean(),
  increment_plan: IncrementPlanSchema.optional(),
  error: z.string().optional(),
});

export const FeatureUpdateSchema = z.object({
  feature_name: z.string().min(1, 'Feature name is required'),
  status: z.literal('done'),
  routes_added: z.array(z.string()).optional(),
  components_added: z.array(z.string()).optional(),
  patterns_added: z.array(z.string()).optional(),
  notes: z.array(z.string()).optional(),
});

export const UpdateProjectContextSchema = z.object({
  context_path: z.string().min(1, 'Context path is required'),
  feature_update: FeatureUpdateSchema,
});

export const UpdateProjectContextResultSchema = z.object({
  success: z.boolean(),
  updated_context: ProjectContextSchema.optional(),
  error: z.string().optional(),
});

export type ProjectContext = z.infer<typeof ProjectContextSchema>;
export type LoadProjectContextInput = z.infer<typeof LoadProjectContextSchema>;
export type ProjectContextResult = z.infer<typeof ProjectContextResultSchema>;
export type IncrementPlan = z.infer<typeof IncrementPlanSchema>;
export type PlanIncrementInput = z.infer<typeof PlanIncrementSchema>;
export type IncrementPlanResult = z.infer<typeof IncrementPlanResultSchema>;
export type FeatureUpdate = z.infer<typeof FeatureUpdateSchema>;
export type UpdateProjectContextInput = z.infer<typeof UpdateProjectContextSchema>;
export type UpdateProjectContextResult = z.infer<typeof UpdateProjectContextResultSchema>;