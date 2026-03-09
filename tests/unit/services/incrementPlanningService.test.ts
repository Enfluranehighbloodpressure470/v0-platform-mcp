/**
 * Tests for IncrementPlanningService
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { IncrementPlanningService } from '../../../src/services/incrementPlanningService.js';
import { ProjectContext } from '../../../src/types/index.js';

describe('IncrementPlanningService', () => {
  let service: IncrementPlanningService;
  let mockProjectContext: ProjectContext;

  beforeEach(() => {
    service = new IncrementPlanningService();
    mockProjectContext = {
      product_name: 'TaskMaster Pro',
      domain: 'Project Management',
      features: {
        done: ['Dashboard Overview', 'Brand Configuration'],
        in_progress: ['Task List'],
        planned: ['Global Configuration', 'User Management'],
      },
      routes: ['/dashboard', '/dashboard/brand-configuration'],
      layout: {
        dashboard_shell_exists: true,
        layout_patterns: ['Sidebar navigation'],
        page_patterns: ['Settings pages use ConfigSection + SaveBar pattern'],
      },
      reusable_components: ['ConfigSection', 'SaveBar', 'FilterBar', 'DataTable'],
      design_rules: ['Use Tailwind CSS', 'Follow shadcn/ui patterns'],
      constraints: ['All pages must fit within dashboard shell'],
    };
  });

  describe('planIncrement', () => {
    it('should create increment plan for new feature', async () => {
      const result = await service.planIncrement(
        mockProjectContext,
        'Add Global Configuration page to dashboard'
      );

      expect(result.success).toBe(true);
      expect(result.increment_plan).toBeDefined();
      expect(result.increment_plan?.feature_name).toBeTruthy();
      expect(result.increment_plan?.feature_type).toBeDefined();
    });

    it('should identify feature as page type', async () => {
      const result = await service.planIncrement(
        mockProjectContext,
        'Add Global Configuration page to dashboard'
      );

      expect(result.increment_plan?.feature_type).toBe('page');
    });

    it('should identify feature as component type', async () => {
      const result = await service.planIncrement(
        mockProjectContext,
        'Create a TaskCard component for displaying task information'
      );

      expect(result.increment_plan?.feature_type).toBe('component');
    });

    it('should find similar reference feature', async () => {
      const result = await service.planIncrement(
        mockProjectContext,
        'Add Global Configuration page'
      );

      expect(result.increment_plan?.base_reference_feature).toBe('Brand Configuration');
    });

    it('should return null reference when no similar feature exists', async () => {
      const result = await service.planIncrement(
        mockProjectContext,
        'Add completely unique analytics module'
      );

      // No similar feature should be found
      expect(result.increment_plan?.base_reference_feature).toBeFalsy();
    });

    it('should set generation_scope to content_only when dashboard exists', async () => {
      const result = await service.planIncrement(
        mockProjectContext,
        'Add Global Configuration page'
      );

      expect(result.increment_plan?.generation_scope).toBe('content_only');
    });

    it('should set generation_scope to full_page when no dashboard exists', async () => {
      const contextNoDashboard = {
        ...mockProjectContext,
        layout: {
          dashboard_shell_exists: false,
          layout_patterns: [],
          page_patterns: [],
        },
      };

      const result = await service.planIncrement(
        contextNoDashboard,
        'Add Dashboard Overview page'
      );

      expect(result.increment_plan?.generation_scope).toBe('full_page');
    });

    it('should identify expected sections for settings page', async () => {
      const result = await service.planIncrement(
        mockProjectContext,
        'Add Global Configuration settings page'
      );

      expect(result.increment_plan?.expected_sections).toBeDefined();
      expect(result.increment_plan?.expected_sections.length).toBeGreaterThan(0);
      expect(result.increment_plan?.expected_sections.some(s =>
        s.toLowerCase().includes('settings')
      )).toBe(true);
    });

    it('should identify expected sections for dashboard', async () => {
      const result = await service.planIncrement(
        mockProjectContext,
        'Add Analytics Dashboard'
      );

      expect(result.increment_plan?.expected_sections).toBeDefined();
      expect(result.increment_plan?.expected_sections.length).toBeGreaterThan(0);
    });

    it('should identify reusable components', async () => {
      const result = await service.planIncrement(
        mockProjectContext,
        'Add Task List page with table and filter bar'
      );

      expect(result.increment_plan?.reusable_components).toBeDefined();
      // Check that at least one component is found
      expect(result.increment_plan?.reusable_components.length).toBeGreaterThan(0);
      // Should find DataTable since request mentions table
      expect(result.increment_plan?.reusable_components).toContain('DataTable');
    });

    it('should identify new components expected', async () => {
      const result = await service.planIncrement(
        mockProjectContext,
        'Add Global Configuration page'
      );

      expect(result.increment_plan?.new_components_expected).toBeDefined();
      expect(result.increment_plan?.new_components_expected.length).toBeGreaterThan(0);
    });

    it('should include constraints from project context', async () => {
      const result = await service.planIncrement(
        mockProjectContext,
        'Add Global Configuration page'
      );

      expect(result.increment_plan?.constraints).toBeDefined();
      expect(result.increment_plan?.constraints).toContain('All pages must fit within dashboard shell');
    });

    it('should add constraint to not regenerate dashboard shell', async () => {
      const result = await service.planIncrement(
        mockProjectContext,
        'Add Global Configuration page'
      );

      expect(result.increment_plan?.constraints.some(c =>
        c.toLowerCase().includes('dashboard shell')
      )).toBe(true);
    });

    it('should add constraint to follow reference pattern', async () => {
      const result = await service.planIncrement(
        mockProjectContext,
        'Add Global Configuration page'
      );

      expect(result.increment_plan?.constraints.some(c =>
        c.includes('Brand Configuration')
      )).toBe(true);
    });

    it('should generate notes for generation', async () => {
      const result = await service.planIncrement(
        mockProjectContext,
        'Add Global Configuration page'
      );

      expect(result.increment_plan?.notes_for_generation).toBeDefined();
      expect(result.increment_plan?.notes_for_generation.length).toBeGreaterThan(0);
    });

    it('should include design rules in notes', async () => {
      const result = await service.planIncrement(
        mockProjectContext,
        'Add Global Configuration page'
      );

      const notesText = result.increment_plan?.notes_for_generation.join(' ');
      expect(notesText).toContain('design rules');
    });

    it('should handle form-based feature requests', async () => {
      const result = await service.planIncrement(
        mockProjectContext,
        'Create a form for adding new tasks'
      );

      expect(result.success).toBe(true);
      expect(result.increment_plan?.expected_sections.some(s =>
        s.toLowerCase().includes('form')
      )).toBe(true);
    });

    it('should handle list/table-based feature requests', async () => {
      const result = await service.planIncrement(
        mockProjectContext,
        'Add list page for viewing all projects'
      );

      expect(result.success).toBe(true);
      expect(result.increment_plan?.expected_sections.some(s =>
        s.toLowerCase().includes('table') || s.toLowerCase().includes('list')
      )).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle errors gracefully', async () => {
      // Create invalid context that might cause errors
      const invalidContext = {} as ProjectContext;

      const result = await service.planIncrement(
        invalidContext,
        'Add some feature'
      );

      // Should still return a result, even if unsuccessful
      expect(result).toBeDefined();
      expect(result.success).toBeDefined();
    });
  });
});
