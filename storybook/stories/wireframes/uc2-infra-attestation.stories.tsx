/**
 * uc2-infra-attestation.stories.tsx
 *
 * Use Case 2: Infrastructure-agnostic Workload Attestation (TPM, CSP, on-prem VMs)
 * Workflow: EK enrollment -> TPM attestation -> X.509 SVID -> mTLS -> Vault SPIFFE auth
 */
import type { Meta, StoryObj } from '@storybook/react';

import { EkRegistryEmpty, EkRegistered, EkConflict } from './uc2/01-ek-enrollment';
import { TpmAttestationInProgress, TpmAttestationComplete, TpmAttestationFailed } from './uc2/02-tpm-attestation';
import { X509SvidIssued, X509SvidDetails } from './uc2/03-x509-svid-issued';
import { MtlsHandshake, MtlsVerified, MtlsFailed } from './uc2/04-mtls-service-mesh';
import { VaultSpiffeAuthRequest, VaultSpiffeAuthGranted, VaultSpiffeDynamicCredential } from './uc2/05-vault-spiffe-auth';

const meta: Meta = {
  title: 'Wireframes/SPIFFE/UC2-InfraAttestation',
  parameters: {
    layout: 'fullscreen',
    wireframeChrome: { title: 'Vault — Infra Attestation', height: '90vh' },
  },
};
export default meta;

type Story = StoryObj;

export const EkEnrollment_Empty: Story = { name: 'EkEnrollment / Empty', render: () => <EkRegistryEmpty /> };
export const EkEnrollment_Registered: Story = { name: 'EkEnrollment / Registered', render: () => <EkRegistered /> };
export const EkEnrollment_Conflict: Story = { name: 'EkEnrollment / Conflict', render: () => <EkConflict /> };

export const TpmAttestation_InProgress: Story = { name: 'TpmAttestation / InProgress', render: () => <TpmAttestationInProgress /> };
export const TpmAttestation_Complete: Story = { name: 'TpmAttestation / Complete', render: () => <TpmAttestationComplete /> };
export const TpmAttestation_Failed: Story = { name: 'TpmAttestation / Failed', render: () => <TpmAttestationFailed /> };

export const X509Svid_Issued: Story = { name: 'X509Svid / Issued', render: () => <X509SvidIssued /> };
export const X509Svid_Details: Story = { name: 'X509Svid / Details', render: () => <X509SvidDetails /> };

export const MtlsMesh_Handshake: Story = { name: 'MtlsMesh / Handshake', render: () => <MtlsHandshake /> };
export const MtlsMesh_Verified: Story = { name: 'MtlsMesh / Verified', render: () => <MtlsVerified /> };
export const MtlsMesh_Failed: Story = { name: 'MtlsMesh / Failed', render: () => <MtlsFailed /> };

export const VaultSpiffeAuth_Request: Story = { name: 'VaultSpiffeAuth / Request', render: () => <VaultSpiffeAuthRequest /> };
export const VaultSpiffeAuth_Granted: Story = { name: 'VaultSpiffeAuth / Granted', render: () => <VaultSpiffeAuthGranted /> };
export const VaultSpiffeAuth_DynamicCred: Story = { name: 'VaultSpiffeAuth / DynamicCredential', render: () => <VaultSpiffeDynamicCredential /> };
