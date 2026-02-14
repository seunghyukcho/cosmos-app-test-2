/**
 * Cosmos App Helper Functions
 *
 * Data fetching and formatting utilities for Cosmos platform apps.
 * Uses window.__COSMOS_APP_CONFIG__ injected at runtime.
 */

function getConfig() {
  return (window as any).__COSMOS_APP_CONFIG__ || {};
}

/**
 * Fetch data from an Analytics function
 */
export async function fetchAnalyticsData(
  analyticsName: string,
  params: Record<string, unknown> = {},
) {
  const config = getConfig();
  const apiBaseUrl = config.apiBaseUrl || '/api';
  const graphKey = config.graphKey || '';

  if (!graphKey) {
    throw new Error('graphKey not configured in app');
  }

  // Step 1: Look up analytics by name to get the key
  const lookupUrl = `${apiBaseUrl}/analytics/by-name/${encodeURIComponent(analyticsName)}?graphKey=${encodeURIComponent(graphKey)}`;
  const lookupResponse = await fetch(lookupUrl, {
    method: 'GET',
    credentials: 'same-origin',
  });

  if (!lookupResponse.ok) {
    const error = await lookupResponse.json().catch(() => ({}));
    throw new Error(error.message || `Analytics not found: ${analyticsName}`);
  }

  const analyticsMetadata = await lookupResponse.json();
  const analyticsKey = analyticsMetadata.key;

  if (!analyticsKey) {
    throw new Error(`Analytics key not found for: ${analyticsName}`);
  }

  // Step 2: Execute analytics with the key
  const executeUrl = `${apiBaseUrl}/analytics/${encodeURIComponent(analyticsKey)}/execute`;
  const response = await fetch(executeUrl, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ parameters: params }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch analytics data');
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Analytics execution failed');
  }

  if (data.engine === 'spark' && data.icebergPath) {
    return {
      type: 'iceberg_table',
      rows: data.data || [],
      icebergPath: data.icebergPath,
      rowCount: data.rowCount,
    };
  }

  return {
    type: 'dataframe',
    rows: data.data || [],
    rowCount: data.rowCount,
  };
}

/**
 * Fetch data from an Action function
 */
export async function fetchActionData(
  actionName: string,
  params: Record<string, unknown> = {},
) {
  const config = getConfig();
  const apiBaseUrl = config.apiBaseUrl || '/api';
  const graphKey = config.graphKey || '';

  if (!graphKey) {
    throw new Error('graphKey not configured in app');
  }

  // Step 1: Look up action by name to get the key
  const lookupUrl = `${apiBaseUrl}/actions/by-name/${encodeURIComponent(actionName)}?graphKey=${encodeURIComponent(graphKey)}`;
  const lookupResponse = await fetch(lookupUrl, {
    method: 'GET',
    credentials: 'same-origin',
  });

  if (!lookupResponse.ok) {
    const error = await lookupResponse.json().catch(() => ({}));
    throw new Error(error.message || `Action not found: ${actionName}`);
  }

  const actionMetadata = await lookupResponse.json();
  const actionKey = actionMetadata.key;

  if (!actionKey) {
    throw new Error(`Action key not found for: ${actionName}`);
  }

  // Step 2: Execute action with the key
  const executeUrl = `${apiBaseUrl}/actions/${encodeURIComponent(actionKey)}/execute`;
  const response = await fetch(executeUrl, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ parameters: params }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch action data');
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Action execution failed');
  }

  return data.result;
}

/**
 * Format number as currency
 */
export function formatCurrency(value: number | null | undefined, currency = 'KRW') {
  if (value === null || value === undefined) return '-';

  if (currency === 'KRW' || currency === 'krw') {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(value);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(value);
}

/**
 * Format date
 */
export function formatDate(
  value: Date | string | number | null | undefined,
  options: Intl.DateTimeFormatOptions = {},
) {
  if (!value) return '-';

  const date = new Date(value);
  if (isNaN(date.getTime())) return 'Invalid Date';

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options,
  };

  return new Intl.DateTimeFormat('ko-KR', defaultOptions).format(date);
}

/**
 * Format number with decimals
 */
export function formatNumber(value: number | null | undefined, decimals = 0) {
  if (value === null || value === undefined) return '-';

  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number | null | undefined, isDecimal = false) {
  if (value === null || value === undefined) return '-';

  const percentValue = isDecimal ? value * 100 : value;
  return `${formatNumber(percentValue, 2)}%`;
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(current: number, previous: number) {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string | null | undefined, maxLength: number) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
