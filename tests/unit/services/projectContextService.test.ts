/**
 * Tests for ProjectContextService
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { ProjectContextService } from '../../../src/services/projectContextService.js';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('ProjectContextService', () => {
  let service: ProjectContextService;
  let testDir: string;
  let testFilePath: string;

  beforeEach(async () => {
    service = new ProjectContextService();
    testDir = await fs.mkdtemp(join(tmpdir(), 'v0-mcp-test-'));
    testFilePath = join(testDir, 'project-context.json');
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('loadProjectContext', () => {
    it('should load valid project context', async () => {
      const validContext = {
        product_name: 'TestApp',
        domain: 'Testing',
        features: {
          done: ['Feature A'],
          in_progress: ['Feature B'],
          planned: ['Feature C'],
        },
        routes: ['/dashboard'],
        layout: {
          dashboard_shell_exists: true,
          layout_patterns: ['Pattern 1'],
          page_patterns: ['Pattern 2'],
        },
        reusable_components: ['ComponentA'],
        design_rules: ['Rule 1'],
        constraints: ['Constraint 1'],
      };

      await fs.writeFile(testFilePath, JSON.stringify(validContext, null, 2));

      const result = await service.loadProjectContext(testFilePath);

      expect(result.success).toBe(true);
      expect(result.project_context).toBeDefined();
      expect(result.project_context?.product_name).toBe('TestApp');
      expect(result.project_context?.features.done).toContain('Feature A');
    });

    it('should return error for non-existent file', async () => {
      const result = await service.loadProjectContext('/non/existent/file.json');

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    it('should return error for invalid JSON', async () => {
      await fs.writeFile(testFilePath, 'invalid json {');

      const result = await service.loadProjectContext(testFilePath);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid JSON');
    });

    it('should return error for invalid structure', async () => {
      const invalidContext = {
        product_name: 'TestApp',
        // Missing required fields
      };

      await fs.writeFile(testFilePath, JSON.stringify(invalidContext, null, 2));

      const result = await service.loadProjectContext(testFilePath);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid project context structure');
    });
  });

  describe('updateProjectContext', () => {
    beforeEach(async () => {
      const initialContext = {
        product_name: 'TestApp',
        domain: 'Testing',
        features: {
          done: ['Feature A'],
          in_progress: ['Feature B'],
          planned: ['Feature C'],
        },
        routes: ['/dashboard'],
        layout: {
          dashboard_shell_exists: true,
          layout_patterns: [],
          page_patterns: [],
        },
        reusable_components: ['ComponentA'],
        design_rules: [],
        constraints: [],
      };

      await fs.writeFile(testFilePath, JSON.stringify(initialContext, null, 2));
    });

    it('should move feature from in_progress to done', async () => {
      const featureUpdate = {
        feature_name: 'Feature B',
        status: 'done' as const,
      };

      const result = await service.updateProjectContext(testFilePath, featureUpdate);

      expect(result.success).toBe(true);
      expect(result.updated_context?.features.done).toContain('Feature B');
      expect(result.updated_context?.features.in_progress).not.toContain('Feature B');
    });

    it('should add new routes', async () => {
      const featureUpdate = {
        feature_name: 'Feature B',
        status: 'done' as const,
        routes_added: ['/dashboard/feature-b', '/dashboard/feature-b/settings'],
      };

      const result = await service.updateProjectContext(testFilePath, featureUpdate);

      expect(result.success).toBe(true);
      expect(result.updated_context?.routes).toContain('/dashboard/feature-b');
      expect(result.updated_context?.routes).toContain('/dashboard/feature-b/settings');
    });

    it('should add new components', async () => {
      const featureUpdate = {
        feature_name: 'Feature B',
        status: 'done' as const,
        components_added: ['FeatureBCard', 'FeatureBList'],
      };

      const result = await service.updateProjectContext(testFilePath, featureUpdate);

      expect(result.success).toBe(true);
      expect(result.updated_context?.reusable_components).toContain('FeatureBCard');
      expect(result.updated_context?.reusable_components).toContain('FeatureBList');
    });

    it('should add new patterns', async () => {
      const featureUpdate = {
        feature_name: 'Feature B',
        status: 'done' as const,
        patterns_added: ['Feature pages use XYZ pattern'],
      };

      const result = await service.updateProjectContext(testFilePath, featureUpdate);

      expect(result.success).toBe(true);
      expect(result.updated_context?.layout.page_patterns).toContain('Feature pages use XYZ pattern');
    });

    it('should handle feature from planned status', async () => {
      const featureUpdate = {
        feature_name: 'Feature C',
        status: 'done' as const,
      };

      const result = await service.updateProjectContext(testFilePath, featureUpdate);

      expect(result.success).toBe(true);
      expect(result.updated_context?.features.done).toContain('Feature C');
      expect(result.updated_context?.features.planned).not.toContain('Feature C');
    });

    it('should not duplicate feature in done status', async () => {
      const featureUpdate = {
        feature_name: 'Feature A',
        status: 'done' as const,
      };

      const result = await service.updateProjectContext(testFilePath, featureUpdate);

      expect(result.success).toBe(true);
      const doneFeatures = result.updated_context?.features.done.filter(f => f === 'Feature A');
      expect(doneFeatures?.length).toBe(1);
    });
  });

  describe('createProjectContext', () => {
    it('should create new project context file', async () => {
      const result = await service.createProjectContext(
        testFilePath,
        'NewProject',
        'New Domain'
      );

      expect(result.success).toBe(true);
      expect(result.project_context?.product_name).toBe('NewProject');
      expect(result.project_context?.domain).toBe('New Domain');
      expect(result.project_context?.features.done).toEqual([]);
      expect(result.project_context?.features.in_progress).toEqual([]);
      expect(result.project_context?.features.planned).toEqual([]);

      // Verify file was created
      const fileExists = await fs.access(testFilePath).then(() => true).catch(() => false);
      expect(fileExists).toBe(true);
    });

    it('should create directory if it does not exist', async () => {
      const nestedPath = join(testDir, 'nested', 'path', 'context.json');

      const result = await service.createProjectContext(
        nestedPath,
        'NestedProject',
        'Nested Domain'
      );

      expect(result.success).toBe(true);

      const fileExists = await fs.access(nestedPath).then(() => true).catch(() => false);
      expect(fileExists).toBe(true);
    });
  });
});
