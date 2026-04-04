import type { UiFormRule, UiFormRuleContext, UiFormValue } from './internal/formContext';
import type { UiTreeNode } from './internal/tree';

export type { UiFormRule, UiFormRuleContext, UiFormValue, UiTreeNode };

export interface UiUploadItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: 'queued' | 'uploading' | 'success' | 'error' | 'canceled';
  progress: number;
  response?: unknown;
  error?: string | undefined;
}

export interface UiUploadTransportContext {
  file: File;
  id: string;
  signal: AbortSignal;
  onProgress: (value: number) => void;
}

export type UiUploadTransport = (context: UiUploadTransportContext) => Promise<unknown>;

export interface UiTourStep {
  target?: string | HTMLElement | (() => HTMLElement | null);
  title: string;
  description?: string;
  placement?: 'top' | 'right' | 'bottom' | 'left' | 'center';
  nextLabel?: string;
  previousLabel?: string;
}
