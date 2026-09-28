// CONTRACT STUB (core). The Jobs owner replaces the bodies; the signatures are fixed.
//   JobReader:     the Reader 560 body for a job id (§5.4 Jobs, §13.7).
//   JobReaderFoot: its inspector foot.
export function JobReader(props: { id: string }) {
  return <div style={{ padding: 24, font: 'var(--t-11)', color: 'var(--text-3)' }}>{props.id}</div>
}

export function JobReaderFoot(_props: { id: string }) {
  return <div />
}
