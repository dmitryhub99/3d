import { FootReadout } from '../../components/workspace/FootReadout'
import { KeyHints, PEOPLE_KEY_HINTS } from '../../components/workspace/KeyHints'
import { ActionStrip, PEOPLE_STRIP_ACTIONS } from '../../components/workspace/ActionStrip'
import { Fig } from '../../components/primitives/Readout'
import { useApp, useDispatch } from '../../state/store'
import { usePeopleResults, usePeopleQuery } from './PeopleWorkspace'

export function PeopleFoot() {
  const dispatch = useDispatch()
  const checked = useApp((st) => st.checked.people.length)
  const hasSelection = useApp((st) => st.selection.people !== null)
  const results = usePeopleResults()
  const query = usePeopleQuery()
  const n = query.clauses.length
  const all = results.filter((r) => r.fit.every(Boolean)).length

  if (checked >= 2) {
    return (
      <ActionStrip
        count={checked}
        actions={PEOPLE_STRIP_ACTIONS.map((a) => ({ ...a, onSelect: () => {} }))}
        onClear={() => dispatch({ type: 'clearChecks' })}
      />
    )
  }

  return (
    <FootReadout
      items={[
        <>
          <Fig>{results.length}</Fig> results
        </>,
        <>
          <Fig>{all}</Fig> match all <Fig>{n}</Fig>
        </>,
        ...(hasSelection
          ? [
              <>
                <Fig>1</Fig> selected
              </>,
            ]
          : []),
        <>by {query.sort.value}, then years in skill</>,
        <>
          updated <Fig>2m</Fig> ago
        </>,
      ]}
      right={<KeyHints hints={PEOPLE_KEY_HINTS} />}
    />
  )
}
