# Dependency notes

Checked on 2026-10-06 with Node.js 24.14.0 and npm 11.20.0.

## Compatibility choices

- **Nuxt 4.5.2** is pinned because it supports the available Node.js 24.14.0 runtime. Nuxt 4.6.0 requires at least Node.js 24.15.0 on the 24.x line.
- **TypeScript 6.0.2** is pinned because the installed Vue type checker does not support TypeScript 7's changed package exports.
- **Lucide** uses the current `@lucide/vue` package rather than the deprecated `lucide-vue-next` package.

## Applied transitive fixes

The two package overrides have specific purposes:

| Package       | Version | Reason                                                                                |
| ------------- | ------- | ------------------------------------------------------------------------------------- |
| `simple-git`  | 4.0.2   | Replaces the vulnerable version pulled in by Nuxt development tools.                  |
| `compression` | 1.8.2   | Fixes the premature-response-close memory leak in the static preview dependency tree. |

Installation, type checking, price tests, generation, and browser interactions are verified with this dependency set.

## Remaining audit findings

`npm audit` reports **11 high-severity findings and zero critical findings**. They propagate through the dependency graph from two advisories:

- [`braces` 3.0.3: stack exhaustion with deeply nested patterns](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).
- [`node-forge` 1.4.0: RSA signature verification accepts nested algorithm elements](https://github.com/advisories/GHSA-86w9-cpqp-85rv).

Those were the latest published versions of the affected packages at verification time. A normal `npm audit fix` did not resolve them. A forced fix was not applied because it changes the Nuxt dependency set and supported runtime.

The included Vercel configuration deploys only `.output/public`: HTML, CSS, browser JavaScript, fonts, and images. It does not deploy a Nuxt server or npm development tooling. The advisories still matter for the local/build environment; static deployment does not resolve the underlying dependency findings.

Recheck with `npm audit` when updating the project. A move to newer Nuxt tooling should include a supported Node.js version, updated lockfile, type checking, static generation, and a browser check.
