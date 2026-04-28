import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

const config = [
  ...nextCoreWebVitals,
  {
    ignores: ['.next/**', 'node_modules/**', 'public/**']
  },
  {
    rules: {
      // New strict rules in react-hooks@7 (shipped with eslint-config-next@16)
      // flag patterns that are standard in the upstream Protocol template:
      //   setMounted(true) / setModifierKey(...) in useEffect for hydration gates,
      //   accessing ref.current during render when forwarding to imperative APIs,
      //   reassigning destructured props parameters.
      // Keep them off until Phase 6 when components are rewritten in TS and can
      // be revisited against React 19 guidance.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'off'
    }
  }
]

export default config
