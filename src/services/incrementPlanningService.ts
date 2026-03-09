/**
 * Increment Planning Service
 * Analyzes project context and plans feature implementation strategy
 * for context-driven incremental development workflow
 */

import {
  ProjectContext,
  IncrementPlan,
  IncrementPlanResult,
} from '../types/index.js';
import { logger } from '../utils/logger.js';

export class IncrementPlanningService {
  /**
   * Plan how a new feature should be implemented based on project context
   */
  async planIncrement(
    projectContext: ProjectContext,
    featureRequest: string
  ): Promise<IncrementPlanResult> {
    try {
      logger.info('Planning increment', { featureRequest });

      // Parse feature request
      const featureName = this.extractFeatureName(featureRequest);
      const featureType = this.determineFeatureType(featureRequest, projectContext);

      // Find similar existing features
      const baseReferenceFeature = this.findSimilarFeature(
        featureName,
        projectContext
      );

      // Determine generation scope
      const generationScope = this.determineGenerationScope(
        featureType,
        projectContext,
        baseReferenceFeature
      );

      // Identify expected sections
      const expectedSections = this.identifyExpectedSections(
        featureRequest,
        featureType,
        baseReferenceFeature
      );

      // Identify reusable components
      const reusableComponents = this.identifyReusableComponents(
        featureRequest,
        projectContext
      );

      // Identify new components expected
      const newComponentsExpected = this.identifyNewComponents(
        featureRequest,
        expectedSections
      );

      // Extract constraints
      const constraints = this.extractConstraints(
        projectContext,
        baseReferenceFeature,
        generationScope
      );

      // Generate notes for generation
      const notesForGeneration = this.generateNotes(
        featureName,
        featureType,
        baseReferenceFeature,
        generationScope,
        projectContext
      );

      const incrementPlan: IncrementPlan = {
        feature_name: featureName,
        feature_type: featureType,
        base_reference_feature: baseReferenceFeature || undefined,
        generation_scope: generationScope,
        expected_sections: expectedSections,
        reusable_components: reusableComponents,
        new_components_expected: newComponentsExpected,
        constraints: constraints,
        notes_for_generation: notesForGeneration,
      };

      logger.info('Increment plan created', {
        featureName,
        featureType,
        generationScope,
        hasReference: !!baseReferenceFeature,
      });

      return {
        success: true,
        increment_plan: incrementPlan,
      };
    } catch (error) {
      logger.error('Error planning increment', { error, featureRequest });
      return {
        success: false,
        error: `Failed to plan increment: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Extract feature name from request
   */
  private extractFeatureName(featureRequest: string): string {
    // Look for patterns like "Add X page", "Create X", "Build X"
    const patterns = [
      /add\s+([^.]+?)(?:\s+page|\s+module|\s+component|\s+to)/i,
      /create\s+([^.]+?)(?:\s+page|\s+module|\s+component|\s+for)/i,
      /build\s+([^.]+?)(?:\s+page|\s+module|\s+component|\s+for)/i,
      /implement\s+([^.]+?)(?:\s+page|\s+module|\s+component|\s+for)/i,
    ];

    for (const pattern of patterns) {
      const match = featureRequest.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    // Fallback: use first few words
    const words = featureRequest.split(/\s+/);
    return words.slice(0, Math.min(3, words.length)).join(' ');
  }

  /**
   * Determine feature type (page, module, component)
   */
  private determineFeatureType(
    featureRequest: string,
    projectContext: ProjectContext
  ): 'page' | 'module' | 'component' {
    const lowerRequest = featureRequest.toLowerCase();

    if (
      lowerRequest.includes('page') ||
      lowerRequest.includes('screen') ||
      lowerRequest.includes('view')
    ) {
      return 'page';
    }

    if (
      lowerRequest.includes('component') ||
      lowerRequest.includes('widget') ||
      lowerRequest.includes('card')
    ) {
      return 'component';
    }

    // Default to page if we have a dashboard shell, otherwise module
    if (projectContext.layout.dashboard_shell_exists) {
      return 'page';
    }

    return 'module';
  }

  /**
   * Find similar existing feature as reference
   */
  private findSimilarFeature(
    featureName: string,
    projectContext: ProjectContext
  ): string | null {
    const allFeatures = [
      ...projectContext.features.done,
      ...projectContext.features.in_progress,
    ];

    if (allFeatures.length === 0) {
      return null;
    }

    // Look for features with similar keywords
    const keywords = featureName.toLowerCase().split(/\s+/);
    const scoredFeatures = allFeatures.map(feature => {
      const featureLower = feature.toLowerCase();
      let score = 0;

      for (const keyword of keywords) {
        if (featureLower.includes(keyword)) {
          score += 1;
        }
      }

      // Boost score for common patterns (e.g., "configuration", "settings")
      if (
        (featureLower.includes('config') && featureName.toLowerCase().includes('config')) ||
        (featureLower.includes('settings') && featureName.toLowerCase().includes('settings')) ||
        (featureLower.includes('dashboard') && featureName.toLowerCase().includes('dashboard'))
      ) {
        score += 2;
      }

      return { feature, score };
    });

    // Sort by score descending
    scoredFeatures.sort((a, b) => b.score - a.score);

    // Return top match if score > 0
    if (scoredFeatures[0].score > 0) {
      return scoredFeatures[0].feature;
    }

    return null;
  }

  /**
   * Determine generation scope based on context
   */
  private determineGenerationScope(
    featureType: 'page' | 'module' | 'component',
    projectContext: ProjectContext,
    baseReferenceFeature: string | null
  ): 'full_page' | 'content_only' | 'section_only' {
    // If no dashboard shell exists, generate full page
    if (!projectContext.layout.dashboard_shell_exists) {
      return 'full_page';
    }

    // If we have a reference feature and dashboard exists, generate content only
    if (baseReferenceFeature && projectContext.layout.dashboard_shell_exists) {
      return 'content_only';
    }

    // For components, generate section only
    if (featureType === 'component') {
      return 'section_only';
    }

    // For pages within existing dashboard, generate content only
    if (featureType === 'page' && projectContext.layout.dashboard_shell_exists) {
      return 'content_only';
    }

    return 'full_page';
  }

  /**
   * Identify expected sections for the feature
   */
  private identifyExpectedSections(
    featureRequest: string,
    featureType: 'page' | 'module' | 'component',
    _baseReferenceFeature: string | null
  ): string[] {
    const sections: string[] = [];
    const lowerRequest = featureRequest.toLowerCase();

    // Common section patterns
    if (lowerRequest.includes('settings') || lowerRequest.includes('config')) {
      sections.push('General Settings', 'Advanced Options');
    }

    if (lowerRequest.includes('dashboard')) {
      sections.push('Overview Stats', 'Recent Activity', 'Quick Actions');
    }

    if (lowerRequest.includes('list') || lowerRequest.includes('table')) {
      sections.push('Filter Bar', 'Data Table', 'Pagination');
    }

    if (lowerRequest.includes('form') || lowerRequest.includes('create') || lowerRequest.includes('edit')) {
      sections.push('Form Fields', 'Validation', 'Submit Actions');
    }

    if (lowerRequest.includes('profile') || lowerRequest.includes('account')) {
      sections.push('Profile Information', 'Account Settings', 'Security');
    }

    // If no specific sections identified, use generic ones
    if (sections.length === 0) {
      if (featureType === 'page') {
        sections.push('Main Content', 'Actions');
      } else if (featureType === 'component') {
        sections.push('Component Content');
      } else {
        sections.push('Module Content');
      }
    }

    return sections;
  }

  /**
   * Identify reusable components from project context
   */
  private identifyReusableComponents(
    featureRequest: string,
    projectContext: ProjectContext
  ): string[] {
    const lowerRequest = featureRequest.toLowerCase();
    const reusable: string[] = [];

    // Match request keywords with existing components
    for (const component of projectContext.reusable_components) {
      const componentLower = component.toLowerCase();

      // Check for common UI elements
      if (
        (lowerRequest.includes('button') && componentLower.includes('button')) ||
        (lowerRequest.includes('form') && componentLower.includes('form')) ||
        (lowerRequest.includes('card') && componentLower.includes('card')) ||
        (lowerRequest.includes('table') && componentLower.includes('table')) ||
        (lowerRequest.includes('list') && componentLower.includes('list')) ||
        (lowerRequest.includes('modal') && componentLower.includes('modal'))
      ) {
        reusable.push(component);
      }
    }

    return reusable;
  }

  /**
   * Identify new components expected to be created
   */
  private identifyNewComponents(
    featureRequest: string,
    expectedSections: string[]
  ): string[] {
    const newComponents: string[] = [];
    const lowerRequest = featureRequest.toLowerCase();

    // Generate component names from sections
    for (const section of expectedSections) {
      const componentName = section.replace(/\s+/g, '') + 'Section';
      newComponents.push(componentName);
    }

    // Add specific components based on request
    if (lowerRequest.includes('card')) {
      newComponents.push('FeatureCard');
    }

    if (lowerRequest.includes('form')) {
      newComponents.push('FeatureForm');
    }

    if (lowerRequest.includes('table') || lowerRequest.includes('list')) {
      newComponents.push('FeatureList');
    }

    return [...new Set(newComponents)]; // Remove duplicates
  }

  /**
   * Extract constraints from project context
   */
  private extractConstraints(
    projectContext: ProjectContext,
    baseReferenceFeature: string | null,
    generationScope: 'full_page' | 'content_only' | 'section_only'
  ): string[] {
    const constraints: string[] = [...projectContext.constraints];

    if (projectContext.layout.dashboard_shell_exists && generationScope !== 'full_page') {
      constraints.push('Do not regenerate dashboard shell');
      constraints.push('Only generate page content');
    }

    if (baseReferenceFeature) {
      constraints.push(`Follow layout pattern from: ${baseReferenceFeature}`);
    }

    if (projectContext.layout.page_patterns.length > 0) {
      const pattern = projectContext.layout.page_patterns[0];
      constraints.push(`Follow existing pattern: ${pattern}`);
    }

    return constraints;
  }

  /**
   * Generate notes for the generation process
   */
  private generateNotes(
    _featureName: string,
    featureType: 'page' | 'module' | 'component',
    baseReferenceFeature: string | null,
    generationScope: 'full_page' | 'content_only' | 'section_only',
    projectContext: ProjectContext
  ): string[] {
    const notes: string[] = [];

    if (baseReferenceFeature) {
      notes.push(`Similar feature exists: ${baseReferenceFeature}`);
      notes.push('Reuse layout and component patterns from reference feature');
    } else {
      notes.push('No similar feature found - creating new pattern');
    }

    notes.push(`Generation scope: ${generationScope}`);

    if (projectContext.design_rules.length > 0) {
      notes.push(`Apply design rules: ${projectContext.design_rules.join(', ')}`);
    }

    if (featureType === 'page' && projectContext.routes.length > 0) {
      notes.push('Add appropriate route for this page');
    }

    return notes;
  }
}
