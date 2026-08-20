/**
 * pe-spiffe-setup.stories.tsx
 *
 * Platform Engineer — SPIFFE X.509 Setup
 * PDR-001: Wireframe Plan — SPIFFE X.509 Setup: Platform Engineer
 *
 * 6 components, 21 stories total:
 *
 *   SecretsEngineList   (2)  — Default, WithSpiffe
 *   EnableEngine        (3)  — Default, SpiffeSelected, PathConflict
 *   EngineConfig        (6)  — Default, FilledValid, TrustDomainError, IssuerMissing, Saving, Saved
 *   RoleCreate          (6)  — Default, FilledValid, TemplateError, TtlError, Saving, Saved
 *   AuthMethodMapping   (4)  — Empty, MethodSelected, PolicyPreview, Attached
 *   TrustBundleVerify   (4)  — Checking, Success, Unreachable, EmptyBundle
 */

import type { Meta, StoryObj } from '@storybook/react';

/* ── Component imports ───────────────────────────────────────── */

import {
  SecretsEngineListDefault,
  SecretsEngineListWithSpiffe,
} from './pe/01-secrets-engine-list';

import {
  EnableEngineDefault,
  EnableEngineSpiffeSelected,
  EnableEnginePathConflict,
} from './pe/02-enable-engine';

import {
  EngineConfigDefault,
  EngineConfigFilledValid,
  EngineConfigTrustDomainError,
  EngineConfigIssuerMissing,
  EngineConfigSaving,
  EngineConfigSaved,
} from './pe/03-engine-config';

import {
  RoleCreateDefault,
  RoleCreateFilledValid,
  RoleCreateTemplateError,
  RoleCreateTtlError,
  RoleCreateSaving,
  RoleCreateSaved,
} from './pe/04-role-create';

import {
  AuthMethodMappingEmpty,
  AuthMethodMappingMethodSelected,
  AuthMethodMappingPolicyPreview,
  AuthMethodMappingAttached,
} from './pe/05-auth-method-mapping';

import {
  TrustBundleVerifyChecking,
  TrustBundleVerifySuccess,
  TrustBundleVerifyUnreachable,
  TrustBundleVerifyEmptyBundle,
} from './pe/06-trust-bundle-verify';

/* ── Storybook meta ──────────────────────────────────────────── */

const meta: Meta = {
  title: 'Wireframes/SPIFFE/PlatformEngineer',
  parameters: {
    layout: 'fullscreen',
    wireframeChrome: { title: 'Vault — SPIFFE Setup', height: '90vh' },
  },
};
export default meta;

type Story = StoryObj;

/* ── 1. Secrets Engine List ──────────────────────────────────── */

export const SecretsEngineList_Default: Story = {
  name: 'SecretsEngineList / Default',
  render: () => <SecretsEngineListDefault />,
};

export const SecretsEngineList_WithSpiffe: Story = {
  name: 'SecretsEngineList / WithSpiffe',
  render: () => <SecretsEngineListWithSpiffe />,
};

/* ── 2. Enable Engine ────────────────────────────────────────── */

export const EnableEngine_Default: Story = {
  name: 'EnableEngine / Default',
  render: () => <EnableEngineDefault />,
};

export const EnableEngine_SpiffeSelected: Story = {
  name: 'EnableEngine / SpiffeSelected',
  render: () => <EnableEngineSpiffeSelected />,
};

export const EnableEngine_PathConflict: Story = {
  name: 'EnableEngine / PathConflict',
  render: () => <EnableEnginePathConflict />,
};

/* ── 3. Engine Config ────────────────────────────────────────── */

export const EngineConfig_Default: Story = {
  name: 'EngineConfig / Default',
  render: () => <EngineConfigDefault />,
};

export const EngineConfig_FilledValid: Story = {
  name: 'EngineConfig / FilledValid',
  render: () => <EngineConfigFilledValid />,
};

export const EngineConfig_TrustDomainError: Story = {
  name: 'EngineConfig / TrustDomainError',
  render: () => <EngineConfigTrustDomainError />,
};

export const EngineConfig_IssuerMissing: Story = {
  name: 'EngineConfig / IssuerMissing',
  render: () => <EngineConfigIssuerMissing />,
};

export const EngineConfig_Saving: Story = {
  name: 'EngineConfig / Saving',
  render: () => <EngineConfigSaving />,
};

export const EngineConfig_Saved: Story = {
  name: 'EngineConfig / Saved',
  render: () => <EngineConfigSaved />,
};

/* ── 4. Role Create ──────────────────────────────────────────── */

export const RoleCreate_Default: Story = {
  name: 'RoleCreate / Default',
  render: () => <RoleCreateDefault />,
};

export const RoleCreate_FilledValid: Story = {
  name: 'RoleCreate / FilledValid',
  render: () => <RoleCreateFilledValid />,
};

export const RoleCreate_TemplateError: Story = {
  name: 'RoleCreate / TemplateError',
  render: () => <RoleCreateTemplateError />,
};

export const RoleCreate_TtlError: Story = {
  name: 'RoleCreate / TtlError',
  render: () => <RoleCreateTtlError />,
};

export const RoleCreate_Saving: Story = {
  name: 'RoleCreate / Saving',
  render: () => <RoleCreateSaving />,
};

export const RoleCreate_Saved: Story = {
  name: 'RoleCreate / Saved',
  render: () => <RoleCreateSaved />,
};

/* ── 5. Auth Method Mapping ──────────────────────────────────── */

export const AuthMethodMapping_Empty: Story = {
  name: 'AuthMethodMapping / Empty',
  render: () => <AuthMethodMappingEmpty />,
};

export const AuthMethodMapping_MethodSelected: Story = {
  name: 'AuthMethodMapping / MethodSelected',
  render: () => <AuthMethodMappingMethodSelected />,
};

export const AuthMethodMapping_PolicyPreview: Story = {
  name: 'AuthMethodMapping / PolicyPreview',
  render: () => <AuthMethodMappingPolicyPreview />,
};

export const AuthMethodMapping_Attached: Story = {
  name: 'AuthMethodMapping / Attached',
  render: () => <AuthMethodMappingAttached />,
};

/* ── 6. Trust Bundle Verify ──────────────────────────────────── */

export const TrustBundleVerify_Checking: Story = {
  name: 'TrustBundleVerify / Checking',
  render: () => <TrustBundleVerifyChecking />,
};

export const TrustBundleVerify_Success: Story = {
  name: 'TrustBundleVerify / Success',
  render: () => <TrustBundleVerifySuccess />,
};

export const TrustBundleVerify_Unreachable: Story = {
  name: 'TrustBundleVerify / Unreachable',
  render: () => <TrustBundleVerifyUnreachable />,
};

export const TrustBundleVerify_EmptyBundle: Story = {
  name: 'TrustBundleVerify / EmptyBundle',
  render: () => <TrustBundleVerifyEmptyBundle />,
};
