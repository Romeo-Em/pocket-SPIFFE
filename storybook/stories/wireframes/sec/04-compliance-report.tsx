/**
 * 04-compliance-report.tsx
 *
 * Security Engineer — Step 4: Export compliance report summary.
 * States: Default | Exported | NoData
 */
import type { CSSProperties } from 'react';
import { tok, complianceSummary, SEC_STEPS } from './_sec-fixtures';

const SHELL: CSSProperties = {
  position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
  background: tok.bg, fontFamily: tok.fontSans, color: tok.textPrimary, fontSize: 13, overflow: 'hidden',
};
const TOPBAR: CSSProperties = {
  height: 48, borderBottom: `1px solid ${tok.borderSubtle}`, background: tok.layer01,
  display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, flexShrink: 0,
};
const SIDEBAR: CSSProperties = {
  width: 200, borderRight: `1px solid ${tok.borderSubtle}`, background: tok.layer01,
  padding: '16px 0', flexShrink: 0,
};
const BODY: CSSProperties    = { flex: 1, display: 'flex', overflow: 'hidden' };
const MAIN: CSSProperties    = { flex: 1, padding: '24px 28px', overflowY: 'auto' };
const PAGE_TITLE: CSSProperties = { fontSize: 18, fontWeight: 600, margin: 0 };
const PAGE_DESC: CSSProperties = { fontSize: 13, color: tok.textSecondary, marginTop: 4, marginBottom: 20 };
const NAV_ITEM: CSSProperties = { padding: '6px 16px', fontSize: 13, color: tok.textSecondary };
const NAV_ITEM_ACTIVE: CSSProperties = { ...NAV_ITEM, color: tok.textPrimary, fontWeight: 600, background: tok.layer02, borderLeft: `3px solid ${tok.textPrimary}`, paddingLeft: 13 };
const NAV_GROUP: CSSProperties = { padding: '12px 16px 4px', fontSize: 10, fontFamily: tok.fontMono, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: tok.textHelper };
const STEPPER: CSSProperties = { display: 'flex', gap: 0, marginBottom: 28, borderBottom: `1px solid ${tok.borderSubtle}`, paddingBottom: 16 };
const STEP_DONE: CSSProperties = { flex: 1, fontSize: 11, fontFamily: tok.fontMono, color: tok.textHelper, textAlign: 'center' as const };
const STEP_ACTIVE: CSSProperties = { ...STEP_DONE, color: tok.textPrimary, fontWeight: 700 };
const STEP_PENDING: CSSProperties = { ...STEP_DONE, color: tok.textPlaceholder };
const SECTION_TITLE: CSSProperties = { fontSize: 13, fontWeight: 600, margin: '20px 0 10px', borderBottom: `1px solid ${tok.borderSubtle}`, paddingBottom: 6 };
const STAT_ROW: CSSProperties = { display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' as const };
const STAT: CSSProperties = { border: `1px solid ${tok.borderSubtle}`, borderRadius: 4, padding: '12px 18px', minWidth: 120, background: tok.layer01 };
const STAT_VAL: CSSProperties = { fontSize: 22, fontWeight: 700, fontFamily: tok.fontMono, color: tok.textPrimary };
const STAT_LBL: CSSProperties = { fontSize: 11, color: tok.textHelper, marginTop: 2 };
const DETAIL_GRID: CSSProperties = { display: 'grid', gridTemplateColumns: '200px 1fr', rowGap: 10, columnGap: 16, marginBottom: 20, fontSize: 13 };
const DT: CSSProperties = { color: tok.textHelper, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontFamily: tok.fontMono, paddingTop: 1 };
const DD: CSSProperties = { fontFamily: tok.fontMono, color: tok.textPrimary };
const BTN_PRIMARY: CSSProperties = { padding: '8px 14px', fontSize: 13, fontWeight: 500, border: `1.5px solid ${tok.borderStrong}`, borderRadius: 4, background: tok.textPrimary, color: tok.bg, cursor: 'pointer', whiteSpace: 'nowrap' as const };
const BTN_SECONDARY: CSSProperties = { ...BTN_PRIMARY, background: tok.bg, color: tok.textPrimary };
const EMPTY_STATE: CSSProperties = { padding: '40px 0', textAlign: 'center' as const, color: tok.textHelper, fontSize: 13 };

function VaultTopBar() {
  return (
    <div style={TOPBAR}>
      <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.04em' }}>VAULT</span>
      <span style={{ color: tok.borderSubtle, margin: '0 4px' }}>|</span>
      <span style={{ fontSize: 12, color: tok.textSecondary }}>corp-prod</span>
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 12, color: tok.textHelper }}>⚙  👤  ?</span>
    </div>
  );
}

function VaultSidebar() {
  return (
    <div style={SIDEBAR}>
      <div style={NAV_GROUP}>Secrets</div>
      <div style={NAV_ITEM}>SPIFFE (spiffe/)</div>
      <div style={NAV_GROUP}>System</div>
      <div style={NAV_ITEM}>Audit</div>
      <div style={NAV_ITEM_ACTIVE}>Reports</div>
    </div>
  );
}

function StepperBar({ active }: { active: number }) {
  return (
    <div style={STEPPER}>
      {SEC_STEPS.map((label, i) => (
        <div key={label} style={i < active ? STEP_DONE : i === active ? STEP_ACTIVE : STEP_PENDING}>
          {i < active ? '✓ ' : `${i + 1}. `}{label}
        </div>
      ))}
    </div>
  );
}

/* ── Exported wireframes ─────────────────────────────────────── */

export function ComplianceReportDefault() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Compliance Report</h1>
          <p style={PAGE_DESC}>Workload identity posture summary for {complianceSummary.trustDomain}. Report date: {complianceSummary.reportDate}.</p>
          <StepperBar active={3} />
          <div style={STAT_ROW}>
            <div style={STAT}><div style={STAT_VAL}>{complianceSummary.totalIssued}</div><div style={STAT_LBL}>SVIDs issued</div></div>
            <div style={STAT}><div style={STAT_VAL}>{complianceSummary.activeSvids}</div><div style={STAT_LBL}>Active</div></div>
            <div style={STAT}><div style={STAT_VAL}>{complianceSummary.failedAttempts}</div><div style={STAT_LBL}>Failed attempts</div></div>
            <div style={STAT}><div style={STAT_VAL}>{complianceSummary.policyViolations}</div><div style={STAT_LBL}>Policy violations</div></div>
            <div style={STAT}><div style={STAT_VAL}>{complianceSummary.caRotationsLast30d}</div><div style={STAT_LBL}>CA rotations (30d)</div></div>
          </div>
          <div style={SECTION_TITLE}>Engine details</div>
          <div style={DETAIL_GRID}>
            <div style={DT}>Trust domain</div>
            <div style={DD}>{complianceSummary.trustDomain}</div>
            <div style={DT}>Engine path</div>
            <div style={DD}>{complianceSummary.enginePath}/</div>
            <div style={DT}>Root of trust</div>
            <div style={DD}>kubernetes/SA (production)</div>
            <div style={DT}>Audit enabled</div>
            <div style={DD}>Yes — file device</div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button style={BTN_PRIMARY}>Export CSV</button>
            <button style={BTN_SECONDARY}>Export JSON</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ComplianceReportExported() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Compliance Report</h1>
          <p style={PAGE_DESC}>Export complete.</p>
          <StepperBar active={3} />
          <div style={{ border: `1px solid ${tok.borderStrong}`, borderRadius: 4, background: tok.layer01, padding: '12px 16px', marginBottom: 20, fontSize: 12 }}>
            <strong>Report exported.</strong><br />
            <code style={{ fontFamily: tok.fontMono }}>spiffe-compliance-{complianceSummary.reportDate}.csv</code> downloaded to your machine.
            The report covers all issuance, rotation, and failed-auth events for engine{' '}
            <code style={{ fontFamily: tok.fontMono }}>{complianceSummary.enginePath}/</code> on {complianceSummary.reportDate}.
          </div>
          <div style={STAT_ROW}>
            <div style={STAT}><div style={STAT_VAL}>{complianceSummary.totalIssued}</div><div style={STAT_LBL}>SVIDs issued</div></div>
            <div style={STAT}><div style={STAT_VAL}>{complianceSummary.activeSvids}</div><div style={STAT_LBL}>Active</div></div>
            <div style={STAT}><div style={STAT_VAL}>{complianceSummary.failedAttempts}</div><div style={STAT_LBL}>Failed attempts</div></div>
            <div style={STAT}><div style={STAT_VAL}>{complianceSummary.policyViolations}</div><div style={STAT_LBL}>Policy violations</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ComplianceReportNoData() {
  return (
    <div style={SHELL}>
      <VaultTopBar />
      <div style={BODY}>
        <VaultSidebar />
        <div style={MAIN}>
          <h1 style={PAGE_TITLE}>Compliance Report</h1>
          <p style={PAGE_DESC}>Workload identity posture summary.</p>
          <StepperBar active={3} />
          <div style={EMPTY_STATE}>
            No issuance data found for this engine mount.<br />
            <span style={{ fontSize: 11 }}>Reports are generated from audit log data. Enable audit logging and issue at least one SVID.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
