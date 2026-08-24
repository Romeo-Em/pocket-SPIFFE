/**
 * uc1-agentic-identity.stories.tsx
 *
 * Use Case 1: Agentic Identity
 * Workflow: Node attestation -> JWT-SVID -> Token Exchange -> OAuth JWT -> Vault resource server
 */
import type { Meta, StoryObj } from '@storybook/react';

import { AgentAttestationAttesting, AgentAttestationNodeIdentityIssued, AgentAttestationFailed } from './uc1/01-agent-attestation';
import { JwtSvidIssued, JwtSvidExpired } from './uc1/02-svid-issuance';
import { TokenExchangeRequest, TokenExchangeOAuthJwtMinted, TokenExchangeDenied } from './uc1/03-token-exchange';
import { VaultResourceRequestPending, VaultResourceSecretDelivered, VaultResourcePolicyDenied } from './uc1/04-vault-resource-request';
import { AgentRegistryActive, AgentRegistrySuspended } from './uc1/05-agent-registry';

const meta: Meta = {
  title: 'Wireframes/SPIFFE/UC1-AgenticIdentity',
  parameters: {
    layout: 'fullscreen',
    wireframeChrome: { title: 'Vault — Agentic Identity', height: '90vh' },
  },
};
export default meta;

type Story = StoryObj;

export const Attestation_Attesting: Story = { name: 'Attestation / Attesting', render: () => <AgentAttestationAttesting /> };
export const Attestation_NodeIdentityIssued: Story = { name: 'Attestation / NodeIdentityIssued', render: () => <AgentAttestationNodeIdentityIssued /> };
export const Attestation_Failed: Story = { name: 'Attestation / Failed', render: () => <AgentAttestationFailed /> };

export const SvidIssuance_Issued: Story = { name: 'SvidIssuance / JwtSvidIssued', render: () => <JwtSvidIssued /> };
export const SvidIssuance_Expired: Story = { name: 'SvidIssuance / JwtSvidExpired', render: () => <JwtSvidExpired /> };

export const TokenExchange_Request: Story = { name: 'TokenExchange / Request', render: () => <TokenExchangeRequest /> };
export const TokenExchange_OAuthJwtMinted: Story = { name: 'TokenExchange / OAuthJwtMinted', render: () => <TokenExchangeOAuthJwtMinted /> };
export const TokenExchange_Denied: Story = { name: 'TokenExchange / Denied', render: () => <TokenExchangeDenied /> };

export const VaultResource_Pending: Story = { name: 'VaultResource / Pending', render: () => <VaultResourceRequestPending /> };
export const VaultResource_SecretDelivered: Story = { name: 'VaultResource / SecretDelivered', render: () => <VaultResourceSecretDelivered /> };
export const VaultResource_PolicyDenied: Story = { name: 'VaultResource / PolicyDenied', render: () => <VaultResourcePolicyDenied /> };

export const AgentRegistry_Active: Story = { name: 'AgentRegistry / Active', render: () => <AgentRegistryActive /> };
export const AgentRegistry_Suspended: Story = { name: 'AgentRegistry / Suspended', render: () => <AgentRegistrySuspended /> };
