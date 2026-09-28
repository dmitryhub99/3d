// CONTRACT STUB (core). The People owner replaces the bodies; the signatures are fixed.
//   PersonInspector:     §7.1 anatomy for any person id. `afterFit` is inserted right after the Fit block
//                        (Hiring uses it for the Pipeline section, §5.4).
//   PersonInspectorFoot: §7.1 inspector foot (provenance + ↵ Full profile).
import type { ReactNode } from 'react'

export function PersonInspector(props: { id: string; afterFit?: ReactNode }) {
  return (
    <div style={{ padding: 20, font: 'var(--t-11)', color: 'var(--text-3)' }}>
      {props.id}
      {props.afterFit}
    </div>
  )
}

export function PersonInspectorFoot(_props: { id: string }) {
  return <div />
}
