/**
 * Project Context Service
 * Handles loading, parsing, and updating project context files
 * for context-driven incremental development workflow
 */

import { promises as fs } from 'fs';
import { resolve, dirname } from 'path';
import {
  ProjectContext,
  ProjectContextResult,
  FeatureUpdate,
  UpdateProjectContextResult,
  ProjectContextSchema,
} from '../types/index.js';
import { logger } from '../utils/logger.js';

export class ProjectContextService {
  /**
   * Load and parse project context from a file
   */
  async loadProjectContext(contextPath: string): Promise<ProjectContextResult> {
    try {
      logger.info('Loading project context', { contextPath });

      // Resolve to absolute path
      const absolutePath = resolve(contextPath);

      // Check if file exists
      try {
        await fs.access(absolutePath);
      } catch {
        return {
          success: false,
          error: `Context file not found: ${contextPath}`,
        };
      }

      // Read and parse file
      const fileContent = await fs.readFile(absolutePath, 'utf-8');

      let parsedContext: unknown;
      try {
        parsedContext = JSON.parse(fileContent);
      } catch (parseError) {
        return {
          success: false,
          error: `Invalid JSON in context file: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
        };
      }

      // Validate against schema
      const validationResult = ProjectContextSchema.safeParse(parsedContext);
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        return {
          success: false,
          error: `Invalid project context structure: ${errors}`,
        };
      }

      logger.info('Project context loaded successfully', {
        product: validationResult.data.product_name,
        featuresCount: {
          done: validationResult.data.features.done.length,
          inProgress: validationResult.data.features.in_progress.length,
          planned: validationResult.data.features.planned.length,
        },
      });

      return {
        success: true,
        project_context: validationResult.data,
      };
    } catch (error) {
      logger.error('Error loading project context', { error, contextPath });
      return {
        success: false,
        error: `Failed to load project context: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Update project context with completed feature information
   */
  async updateProjectContext(
    contextPath: string,
    featureUpdate: FeatureUpdate
  ): Promise<UpdateProjectContextResult> {
    try {
      logger.info('Updating project context', {
        contextPath,
        featureName: featureUpdate.feature_name,
      });

      // Load current context
      const loadResult = await this.loadProjectContext(contextPath);
      if (!loadResult.success || !loadResult.project_context) {
        return {
          success: false,
          error: loadResult.error || 'Failed to load project context',
        };
      }

      const context = loadResult.project_context;

      // Update context
      const updatedContext = this.applyFeatureUpdate(context, featureUpdate);

      // Validate updated context
      const validationResult = ProjectContextSchema.safeParse(updatedContext);
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        return {
          success: false,
          error: `Invalid updated context: ${errors}`,
        };
      }

      // Write updated context back to file
      const absolutePath = resolve(contextPath);
      await fs.mkdir(dirname(absolutePath), { recursive: true });
      await fs.writeFile(
        absolutePath,
        JSON.stringify(validationResult.data, null, 2),
        'utf-8'
      );

      logger.info('Project context updated successfully', {
        featureName: featureUpdate.feature_name,
        routesAdded: featureUpdate.routes_added?.length || 0,
        componentsAdded: featureUpdate.components_added?.length || 0,
      });

      return {
        success: true,
        updated_context: validationResult.data,
      };
    } catch (error) {
      logger.error('Error updating project context', { error, contextPath });
      return {
        success: false,
        error: `Failed to update project context: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Apply feature update to project context
   */
  private applyFeatureUpdate(
    context: ProjectContext,
    update: FeatureUpdate
  ): ProjectContext {
    const updatedContext = { ...context };

    // Move feature from in_progress to done
    updatedContext.features = {
      done: [...context.features.done],
      in_progress: [...context.features.in_progress],
      planned: [...context.features.planned],
    };

    // Remove from in_progress if present
    const inProgressIndex = updatedContext.features.in_progress.indexOf(update.feature_name);
    if (inProgressIndex !== -1) {
      updatedContext.features.in_progress.splice(inProgressIndex, 1);
    }

    // Remove from planned if present
    const plannedIndex = updatedContext.features.planned.indexOf(update.feature_name);
    if (plannedIndex !== -1) {
      updatedContext.features.planned.splice(plannedIndex, 1);
    }

    // Add to done if not already there
    if (!updatedContext.features.done.includes(update.feature_name)) {
      updatedContext.features.done.push(update.feature_name);
    }

    // Add new routes
    if (update.routes_added) {
      updatedContext.routes = [
        ...new Set([...context.routes, ...update.routes_added]),
      ];
    }

    // Add new components
    if (update.components_added) {
      updatedContext.reusable_components = [
        ...new Set([...context.reusable_components, ...update.components_added]),
      ];
    }

    // Add new patterns to page_patterns
    if (update.patterns_added) {
      updatedContext.layout.page_patterns = [
        ...new Set([...context.layout.page_patterns, ...update.patterns_added]),
      ];
    }

    return updatedContext;
  }

  /**
   * Create a new empty project context file
   */
  async createProjectContext(
    contextPath: string,
    productName: string,
    domain: string
  ): Promise<ProjectContextResult> {
    try {
      const newContext: ProjectContext = {
        product_name: productName,
        domain: domain,
        features: {
          done: [],
          in_progress: [],
          planned: [],
        },
        routes: [],
        layout: {
          dashboard_shell_exists: false,
          layout_patterns: [],
          page_patterns: [],
        },
        reusable_components: [],
        design_rules: [],
        constraints: [],
      };

      const absolutePath = resolve(contextPath);
      await fs.mkdir(dirname(absolutePath), { recursive: true });
      await fs.writeFile(
        absolutePath,
        JSON.stringify(newContext, null, 2),
        'utf-8'
      );

      logger.info('Created new project context', { contextPath, productName });

      return {
        success: true,
        project_context: newContext,
      };
    } catch (error) {
      logger.error('Error creating project context', { error, contextPath });
      return {
        success: false,
        error: `Failed to create project context: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
}
