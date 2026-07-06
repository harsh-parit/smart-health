/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FeatureDetail {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  iconName: string;
  accentColor: string;
  bulletPoints: string[];
  techImpact: string;
}

export type ActiveModalType = 'symptom' | 'copilot' | 'dashboard' | 'get-started' | null;
