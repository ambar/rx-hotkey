import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

const deps = Object.keys({...pkg.dependencies, ...pkg.peerDependencies})
const reExternal = new RegExp(`^(${deps.join('|')})($|/)`)

/**
 * @type {import('rollup').RollupOptions[]}
 */
const config = [
  {
    input: pkg.source,
    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
      {
        file: pkg.module,
        format: 'esm',
      },
    ],
    plugins: [
      typescript({
        include: [],
        tsconfigOverride: {
          include: ['src/**/*'],
          exclude: ['**/*.spec.*', '**/__tests__'],
        },
      }),
    ],
    external: (id) => (deps.length ? reExternal.test(id) : false),
  },
]

export default config
