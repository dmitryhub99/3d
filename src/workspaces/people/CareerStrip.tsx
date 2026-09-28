// CONTRACT STUB (core). The People owner replaces the body; the signature is fixed.
// Career strip (§7.1 Experience): a 360 × 6 timeline of entries placed at their real dates ('YYYY-MM'),
// the current entry in text-2 and past ones in text-4, plus the mono axis labels.
export function CareerStrip(props: { entries: { from: string; to?: string; current?: boolean }[]; width?: number }) {
  return <div style={{ width: props.width ?? 360, height: 6 }} data-entries={props.entries.length} />
}
