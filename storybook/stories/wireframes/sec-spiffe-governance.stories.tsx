/**
 * sec-spiffe-governance.stories.tsx
 *
 * Security Engineer — SPIFFE X.509 Audit & Governance
 *
 * 4 components, 11 stories total:
 *
 *   AuditLog             (3) — Default, FilteredErrors, Empty
 *   IdentityInventory    (3) — Default, ExpiringSoon, Empty
 *   CaRotation           (3) — Default, PostRotation, BundleStalenessWarning
 *   ComplianceReport     (3) — Default, Exported, NoData  (minus 1 = 11 total)
 */

import type { Meta, StoryObj } from '@storybook/react';

import {
  AuditLogDefault,
  AuditLogFilteredErrors,
  AuditLogEmpty,
} from './sec/01-audit-log';

import {
  IdentityInventoryDefault,
  IdentityInventoryExpiringSoon,
  IdentityInventoryEmpty,
} from './sec/02-identity-inventory';

import {
  CaRotationDefault,
  CaRotationPostRotation,
  CaRotationBundleStalenessWarning,
} from './sec/03-ca-rotation';

import {
  ComplianceReportDefault,
  ComplianceReportExported,
  ComplianceReportNoData,
} from './sec/04-compliance-report';

/* ── Storybook meta ──────────────────────────────────────────── */

const meta: Meta = {
  title: 'Wireframes/SPIFFE/SecurityEngineer',
  parameters: {
    layout: 'fullscreen',
    wireframeChrome: { title: 'Vault — SPIFFE Governance', height: '90vh' },
  },
};
export default meta;

type Story = StoryObj;

/* ── 1. Audit Log ────────────────────────────────────────────── */

export const AuditLog_Default: Story = {
  name: 'AuditLog / Default',
  render: () => <AuditLogDefault />,
};

export const AuditLog_FilteredErrors: Story = {
  name: 'AuditLog / FilteredErrors',
  render: () => <AuditLogFilteredErrors />,
};

export const AuditLog_Empty: Story = {
  name: 'AuditLog / Empty',
  render: () => <AuditLogEmpty />,
};

/* ── 2. Identity Inventory ───────────────────────────────────── */

export const IdentityInventory_Default: Story = {
  name: 'IdentityInventory / Default',
  render: () => <IdentityInventoryDefault />,
};

export const IdentityInventory_ExpiringSoon: Story = {
  name: 'IdentityInventory / ExpiringSoon',
  render: () => <IdentityInventoryExpiringSoon />,
};

export const IdentityInventory_Empty: Story = {
  name: 'IdentityInventory / Empty',
  render: () => <IdentityInventoryEmpty />,
};

/* ── 3. CA Rotation ──────────────────────────────────────────── */

export const CaRotation_Default: Story = {
  name: 'CaRotation / Default',
  render: () => <CaRotationDefault />,
};

export const CaRotation_PostRotation: Story = {
  name: 'CaRotation / PostRotation',
  render: () => <CaRotationPostRotation />,
};

export const CaRotation_BundleStalenessWarning: Story = {
  name: 'CaRotation / BundleStalenessWarning',
  render: () => <CaRotationBundleStalenessWarning />,
};

/* ── 4. Compliance Report ────────────────────────────────────── */

export const ComplianceReport_Default: Story = {
  name: 'ComplianceReport / Default',
  render: () => <ComplianceReportDefault />,
};

export const ComplianceReport_Exported: Story = {
  name: 'ComplianceReport / Exported',
  render: () => <ComplianceReportExported />,
};

export const ComplianceReport_NoData: Story = {
  name: 'ComplianceReport / NoData',
  render: () => <ComplianceReportNoData />,
};
