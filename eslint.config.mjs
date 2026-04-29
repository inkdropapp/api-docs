import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

const config = [
  ...nextCoreWebVitals,
  {
    ignores: ['.next/**', 'node_modules/**', 'public/**']
  },
  {
    rules: {
      // Disabled to preserve patterns inherited from the upstream Tailwind UI
      // Protocol template:
      //   - setMounted(true) / setModifierKey(...) in useEffect for SSR/CSR
      //     hydration gates (ThemeToggle, Search)
      //   - inputElement: inputRef.current passed during render to autocomplete
      //     getFormProps (Search)
      // Both are upstream's chosen patterns; refactoring would diverge from the
      // template without functional benefit. Revisit if upstream itself migrates
      // these to useSyncExternalStore / ref-as-prop.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'off'
    }
  }
]

export default config
