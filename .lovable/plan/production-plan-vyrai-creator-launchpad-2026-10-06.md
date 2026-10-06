# Production plan: VYRAI creator launchpad

## Product direction
Build an original creator-first platform called **VYRAI**: a high-end dark workspace where creators design an AI persona, launch its token, fund an operating treasury, create media, schedule publishing, and grow a public community. The visual language will use near-black graphite surfaces, acid chartreuse signals, crisp white typography, thin glass borders, and editorial character imagery without copying Higgspad.

## Experience map

```text
Public:     Explore → Influencer profile → Token market / media / activity
Creator:    Sign in → Create persona → Configure token → Review → Launch
Operate:    My AIs → Studio → Calendar → Treasury → Agent activity
Safety:     Disclosures → Spend policy → Approval queue → Emergency stop
```

### Public surfaces
- **Home / Explore:** live-feeling discovery feed with trending creators, new launches, top treasuries, categories, search, and ranking filters.
- **Influencer profile:** identity, AI disclosure, social links, media feed, price and volume chart, market cap, holder count, treasury runway, bonding-curve progress, and transparent activity log.
- **Token panel:** buy/sell preparation, slippage and risk disclosure, transaction states, external explorer links, and wallet-required actions.

### Creator surfaces
- **Persona wizard:** appearance references and prompt, niche, personality sliders, tone, biography, voice choice, social handles, content boundaries, and a final preview.
- **Token launch wizard:** symbol, supply and launch settings, bonding-curve preview, immutable fee split, treasury policy, creator payout, buy-and-burn, deployment review, and transaction progress.
- **My AIs:** portfolio of owned agents with status, treasury runway, recent content, token performance, and operational alerts.
- **AI Studio:** persona selector, trend templates, image/video prompt composer, generation queue, media review, approval/download/post actions, and transparent credit/cost estimates.
- **Calendar:** channel-specific scheduled posts, drafts, retries, and publishing status.
- **Manage:** social connections, daily/monthly spend limits, approval threshold, allowed services, pause posting, and emergency stop.

## Production data and security
- Add account profiles, AI personas, persona assets, tokens, fee-split terms, treasuries, treasury transactions, spend policies, generations, media assets, social connections, publishing schedules, posts, follows/watchlists, and append-only activity events.
- Use row-level access rules: public users see only launched profiles and approved media; creators manage only their records; privileged roles live in a separate protected role table.
- Keep drafts readable by their creator while hidden from public discovery.
- Store creator uploads and generated media in managed storage with file type, size, and ownership policies.
- Add audit fields, idempotency keys, lifecycle states, soft deletion where recovery matters, and database indexes for discovery and activity queries.

## Authentication and wallet model
- Add email/password and Google sign-in for creator accounts.
- Add a browser wallet adapter flow for Solana-compatible wallets with explicit network display, signed nonce verification, wallet linking, reconnect states, and no custody of private keys.
- Separate app identity from linked wallets so creators can recover accounts and manage multiple approved wallets.

## AI and content engine
- Use server-side Lovable AI calls for persona copy and structured content planning.
- Add image generation and asynchronous video job orchestration, with progress, cancellation, safe errors, usage accounting, and provider run correlation.
- Store prompt/version history and require explicit review before publishing by default.
- Build social publishing as provider adapters with encrypted credentials, OAuth callbacks, retry-safe jobs, rate-limit handling, and per-channel status. Initial live providers must be selected and authorized before production activation.

## Token and treasury architecture
- Implement chain access behind a typed Solana service layer rather than embedding wallet logic in pages.
- Use devnet first for end-to-end validation: mint/deploy, bonding-curve integration, fee routing, transaction confirmation, and explorer reconciliation.
- Treat fee splits and spending rules as immutable launch records; record on-chain signatures and reconcile indexed market data into read models.
- Add transaction simulation, explicit user signing, confirmation depth, failed/expired transaction recovery, treasury approval queue, and a kill switch.
- Mainnet launch remains gated on the selected launch provider, token program review, treasury authority model, legal review, and an external smart-contract/security audit.

## Delivery phases
1. **Foundation and design system** — responsive shell, original VYRAI identity, navigation, accessibility, account states, and production schema.
2. **Creator core** — persona wizard, My AIs, profile management, uploads, drafts, and public profiles.
3. **Studio** — prompt tools, image/video jobs, media review, library, and publishing calendar.
4. **Token flows** — wallet linking, devnet deployment, fee split, bonding curve, treasury, charts, activity, and reconciliation.
5. **Discovery** — rankings, trending/new/top-treasury views, search, watchlists, and realtime updates.
6. **Hardening** — audit logs, abuse controls, rate limits, monitoring, error recovery, accessibility and device testing, security review, and mainnet launch checklist.

## Technical approach
- Keep public profile and discovery pages server-rendered and shareable; put creator-only tools behind the authenticated app area.
- Use route-specific metadata for every public page.
- Use server functions for app-internal business logic and signed public endpoints only for OAuth callbacks/webhooks.
- Use a query cache for server reads and narrowly scoped realtime subscriptions for market/activity updates.
- Implement financial values with integer base units or fixed-precision database numerics, never floating-point arithmetic.
- Seed an explicitly labeled demo launch so the platform is useful before creators have published content.

## Verification and launch gates
- Test complete sign-up, persona creation, media generation, scheduling, wallet linking, devnet launch, treasury approvals, and public profile flows.
- Run database policy and dependency security scans; test unauthorized access and upload restrictions.
- Verify desktop and mobile layouts, empty/loading/error states, keyboard navigation, and reduced motion.
- Before handling real funds: confirm jurisdiction, terms and risk notices, sanctions/KYC obligations, social-platform approvals, data retention/privacy terms, external smart-contract audit, incident response, and production monitoring.

## External decisions that do not block the first build
- Solana launch/bonding-curve provider and mainnet treasury authority model.
- First social networks for automated posting and their approved developer access.
- Jurisdiction-specific legal/compliance requirements.
- Final domain and corporate support/security contacts.
