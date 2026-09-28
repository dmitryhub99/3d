// className join. Falsy values are dropped; an object contributes its truthy keys.
export type ClassValue = string | number | false | null | undefined | Record<string, boolean | null | undefined>

export function cx(...values: ClassValue[]): string {
  let out = ''
  for (const v of values) {
    if (!v) continue
    if (typeof v === 'object') {
      for (const k in v) if (v[k]) out += (out ? ' ' : '') + k
    } else {
      out += (out ? ' ' : '') + v
    }
  }
  return out
}
