/**
 * API service layer — currently returns mock data.
 * Interfaces match the .NET backend DTOs.
 * Replace with real fetch() calls when backend is ready.
 */

import type {
  AppConfigDto,
  WorkflowTemplateDto,
  WorkflowTemplateDetailDto,
} from '../types';

const BASE_URL = '/api';

// ── App Config ──
export async function getAppConfigs(category?: string): Promise<AppConfigDto[]> {
  // Mock
  void category;
  void BASE_URL;
  return [];
}

export async function updateAppConfig(id: number, payload: Partial<AppConfigDto>): Promise<AppConfigDto> {
  return { id, configKey: '', configValue: null, dataType: 'bool', category: 'mobile', description: null, isActive: true, created: new Date().toISOString(), createdBy: null, lastModified: null, lastModifiedBy: null, ...payload } as AppConfigDto;
}

// ── Workflow Templates ──
export async function getWorkflowTemplates(): Promise<WorkflowTemplateDto[]> {
  return [];
}

export async function createWorkflowTemplate(payload: {
  name: string;
  description?: string;
  clientId?: number;
  speedId?: number;
  isActive?: boolean;
  mirrorToAgentPortal?: boolean;
  details: Omit<WorkflowTemplateDetailDto, 'id' | 'templateId' | 'statusName' | 'eventTypeName'>[];
}): Promise<WorkflowTemplateDto> {
  void payload;
  return {} as WorkflowTemplateDto;
}

export async function updateWorkflowTemplate(id: number, payload: Parameters<typeof createWorkflowTemplate>[0]): Promise<WorkflowTemplateDto> {
  void id;
  void payload;
  return {} as WorkflowTemplateDto;
}
