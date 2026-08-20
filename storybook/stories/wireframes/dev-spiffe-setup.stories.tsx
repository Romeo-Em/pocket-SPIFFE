/**
 * dev-spiffe-setup.stories.tsx
 *
 * App Developer — SPIFFE X.509 SVID Minting
 *
 * 4 components, 13 stories total:
 *
 *   AgentConfig       (4) — Default, FilledValid, MissingRole, ServiceAccountMismatch
 *   AgentRunning      (3) — Starting, Authenticated, AuthFailed
 *   SvidVerify        (3) — Default, Verified, Expired
 *   MtlsTest          (3) — PeerList, AllVerified, NoSvid
 */

import type { Meta, StoryObj } from '@storybook/react';

import {
  AgentConfigDefault,
  AgentConfigFilledValid,
  AgentConfigMissingRole,
  AgentConfigServiceAccountMismatch,
} from './dev/01-agent-config';

import {
  AgentRunningStarting,
  AgentRunningAuthenticated,
  AgentRunningAuthFailed,
} from './dev/02-agent-running';

import {
  SvidVerifyDefault,
  SvidVerifyVerified,
  SvidVerifyExpired,
} from './dev/03-svid-verify';

import {
  MtlsTestPeerList,
  MtlsTestAllVerified,
  MtlsTestNoSvid,
} from './dev/04-mtls-test';

/* ── Storybook meta ──────────────────────────────────────────── */

const meta: Meta = {
  title: 'Wireframes/SPIFFE/AppDeveloper',
  parameters: {
    layout: 'fullscreen',
    wireframeChrome: { title: 'Vault — SVID Minting', height: '90vh' },
  },
};
export default meta;

type Story = StoryObj;

/* ── 1. Agent Config ─────────────────────────────────────────── */

export const AgentConfig_Default: Story = {
  name: 'AgentConfig / Default',
  render: () => <AgentConfigDefault />,
};

export const AgentConfig_FilledValid: Story = {
  name: 'AgentConfig / FilledValid',
  render: () => <AgentConfigFilledValid />,
};

export const AgentConfig_MissingRole: Story = {
  name: 'AgentConfig / MissingRole',
  render: () => <AgentConfigMissingRole />,
};

export const AgentConfig_ServiceAccountMismatch: Story = {
  name: 'AgentConfig / ServiceAccountMismatch',
  render: () => <AgentConfigServiceAccountMismatch />,
};

/* ── 2. Agent Running ────────────────────────────────────────── */

export const AgentRunning_Starting: Story = {
  name: 'AgentRunning / Starting',
  render: () => <AgentRunningStarting />,
};

export const AgentRunning_Authenticated: Story = {
  name: 'AgentRunning / Authenticated',
  render: () => <AgentRunningAuthenticated />,
};

export const AgentRunning_AuthFailed: Story = {
  name: 'AgentRunning / AuthFailed',
  render: () => <AgentRunningAuthFailed />,
};

/* ── 3. SVID Verify ──────────────────────────────────────────── */

export const SvidVerify_Default: Story = {
  name: 'SvidVerify / Default',
  render: () => <SvidVerifyDefault />,
};

export const SvidVerify_Verified: Story = {
  name: 'SvidVerify / Verified',
  render: () => <SvidVerifyVerified />,
};

export const SvidVerify_Expired: Story = {
  name: 'SvidVerify / Expired',
  render: () => <SvidVerifyExpired />,
};

/* ── 4. mTLS Test ────────────────────────────────────────────── */

export const MtlsTest_PeerList: Story = {
  name: 'MtlsTest / PeerList',
  render: () => <MtlsTestPeerList />,
};

export const MtlsTest_AllVerified: Story = {
  name: 'MtlsTest / AllVerified',
  render: () => <MtlsTestAllVerified />,
};

export const MtlsTest_NoSvid: Story = {
  name: 'MtlsTest / NoSvid',
  render: () => <MtlsTestNoSvid />,
};
