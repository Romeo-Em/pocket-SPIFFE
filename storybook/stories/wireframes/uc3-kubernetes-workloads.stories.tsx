/**
 * uc3-kubernetes-workloads.stories.tsx
 *
 * Use Case 3: Kubernetes Workloads
 * Workflow: K8s auth -> SVID to filesystem -> Istio mTLS -> Trust bundle distribution
 */
import type { Meta, StoryObj } from '@storybook/react';

import { K8sAuthTokenPresented, K8sAuthBound, K8sAuthUnboundSA } from './uc3/01-k8s-auth';
import { SvidMountEmpty, SvidWritten, SvidPermissionDenied } from './uc3/02-svid-to-filesystem';
import { IstioMtlsMeshPeers, IstioMtlsAllVerified, IstioMtlsTrustMismatch } from './uc3/03-istio-mtls';
import { TrustBundleLive, TrustBundleFederationPartner, TrustBundleStale } from './uc3/04-trust-bundle-distribution';

const meta: Meta = {
  title: 'Wireframes/SPIFFE/UC3-KubernetesWorkloads',
  parameters: {
    layout: 'fullscreen',
    wireframeChrome: { title: 'Vault — Kubernetes Workloads', height: '90vh' },
  },
};
export default meta;

type Story = StoryObj;

export const K8sAuth_TokenPresented: Story = { name: 'K8sAuth / TokenPresented', render: () => <K8sAuthTokenPresented /> };
export const K8sAuth_Bound: Story = { name: 'K8sAuth / Bound', render: () => <K8sAuthBound /> };
export const K8sAuth_UnboundSA: Story = { name: 'K8sAuth / UnboundSA', render: () => <K8sAuthUnboundSA /> };

export const SvidFilesystem_Empty: Story = { name: 'SvidFilesystem / Empty', render: () => <SvidMountEmpty /> };
export const SvidFilesystem_Written: Story = { name: 'SvidFilesystem / Written', render: () => <SvidWritten /> };
export const SvidFilesystem_PermissionDenied: Story = { name: 'SvidFilesystem / PermissionDenied', render: () => <SvidPermissionDenied /> };

export const IstioMtls_MeshPeers: Story = { name: 'IstioMtls / MeshPeers', render: () => <IstioMtlsMeshPeers /> };
export const IstioMtls_AllVerified: Story = { name: 'IstioMtls / AllVerified', render: () => <IstioMtlsAllVerified /> };
export const IstioMtls_TrustMismatch: Story = { name: 'IstioMtls / TrustMismatch', render: () => <IstioMtlsTrustMismatch /> };

export const TrustBundle_Live: Story = { name: 'TrustBundle / Live', render: () => <TrustBundleLive /> };
export const TrustBundle_FederationPartner: Story = { name: 'TrustBundle / FederationPartner', render: () => <TrustBundleFederationPartner /> };
export const TrustBundle_Stale: Story = { name: 'TrustBundle / Stale', render: () => <TrustBundleStale /> };
