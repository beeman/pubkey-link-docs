---
title: "Get Started"
---
## Self-hosting instructions


[PubKey Link](https://github.com/pubkeyapp/pubkey-link) is a Free and Open Source tool that enables token gating on Discord.

PubKey Link is written in Node using the [Nest.js](https://nestjs.com) framework.

This documents explains how to self-host PubKey Link.

If you run into any issues, please don't hesitate to reach out by joining our [Discord](https://discord.gg/XxuZQeDPNf) or ask [beeman](https://discord.com/users/386584531353862154) over DM. We'll be happy to hop on a call and help troubleshooting!

### Dependencies

In order to run PubKey Link, you need the following components:

- [ ] Server that can run Docker containers.
- [ ] Postgres instance for data storage.
- [ ] Redis instance for job queues (ephemeral).
- [ ] Solana RPC endpoint with support for the [Digital Asset Standard API (DAS)](https://github.com/metaplex-foundation/digital-asset-standard-api).