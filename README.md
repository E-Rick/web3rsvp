# 🎟 Web3Rsvp

![TS](https://badgen.net/badge/-/TypeScript?icon=typescript&label&labelColor=blue&color=555555)
[![GPLv3 license](https://img.shields.io/badge/License-MIT-blue.svg)](http://perso.crans.org/besson/LICENSE.html)

### Installation & Usage

**Installation**

[`pnpm`](https://pnpm.io/) is the **recommended** package manager.

```sh
pnpm install
```

**Build**

```sh
pnpm build
```

**Tests**

```sh
pnpm test
```

## Modules

The monorepo includes 3 primary folders.

- [apps](https://github.com/web3rsvp/tree/main/apps)
- [contracts](hhttps://github.com/web3rsvp/tree/main/apps/contracts)
- [subgraph](https://github.com/web3rsvp/tree/main/appsmain/packages)

Each folder contains similar `modules` i.e. frontend applications go in the `apps` folder and the smart contracts go in the `contracts` folder, `subgraph` in the subgraph folder; very straight-forward.

### Environment Variables

Each module requires unique environment variables. Specifically the `apps` and `contracts` modules when preparing for deployment or forking a blockchain network.

The `.env.example` can be copied/pasted and updated to include the required variables deployment.

## Task Pipelines

Builds, tests and deployments are handled via tasks pipelines. Task pipelines orchestrate build and dependency requirements between mono-repo packages.

Edit the `turbo.json` file in the root directory to add new [pipelines](https://turborepo.org/docs/core-concepts/pipelines) and custom workflows.

## Developer Experience

The build system uses [Turborepo](https://turborepo.org/) and PNPM; a high-performance build system and a fast, disk space efficient package manager. Giving developers the best experience possible while minimizing demand on local compute resources.

#### Core Technologies

- [Turborepo](https://turborepo.org/docs)
- [pNPM](https://pnpm.io/)
- [RainbowKit](https://www.rainbowkit.com/)
- [Tailwind](https://tailwindui.com/)
- [Next](https://nextjs.org/)

<hr />

Copyright 2022 [Erick Martinez Jr.](https://erickmartinezjr.com)
