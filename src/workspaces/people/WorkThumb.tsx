// CONTRACT STUB (core). The People owner replaces the body; the signature is fixed.
// Schematic SVG work thumbnail (§7.1 Selected work), keyed by ThumbKind, drawn at width × height.
export function WorkThumb(props: { kind: string; width: number; height: number }) {
  return (
    <svg
      width={props.width}
      height={props.height}
      viewBox={`0 0 ${props.width} ${props.height}`}
      data-kind={props.kind}
      style={{ background: 'var(--sunken)', borderRadius: 2, boxShadow: 'inset 0 0 0 1px var(--line-1)' }}
    />
  )
}
