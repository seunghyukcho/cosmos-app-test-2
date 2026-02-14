/// <reference types="vite/client" />

declare module '@app-helpers' {
  export function fetchAnalyticsData(
    analyticsName: string,
    params?: Record<string, unknown>,
  ): Promise<{
    type: string;
    rows: unknown[];
    rowCount?: number;
    icebergPath?: string;
  }>;

  export function fetchActionData(
    actionName: string,
    params?: Record<string, unknown>,
  ): Promise<unknown>;

  export function formatCurrency(value: number | null | undefined, currency?: string): string;
  export function formatDate(value: Date | string | number | null | undefined, options?: Intl.DateTimeFormatOptions): string;
  export function formatNumber(value: number | null | undefined, decimals?: number): string;
  export function formatPercentage(value: number | null | undefined, isDecimal?: boolean): string;
  export function calculatePercentageChange(current: number, previous: number): number;
  export function truncateText(text: string | null | undefined, maxLength: number): string;
}

interface Window {
  __COSMOS_APP_CONFIG__?: {
    appKey: string;
    graphKey: string;
    apiBaseUrl: string;
    environment: string;
  };
}
