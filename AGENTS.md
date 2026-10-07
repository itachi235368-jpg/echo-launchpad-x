<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep public discovery/profile pages separate from authenticated creator operations so public content remains shareable and creator data stays protected.
- Model blockchain integration behind a typed service boundary and validate on Solana devnet before any mainnet activation.
- Load Solana SDKs only from browser event handlers; keep wallet state in a root provider so navigation preserves the connection.
- The standalone launch path creates a wallet-owned fixed-supply devnet Token-2022 mint; do not describe it as a bonding-curve launch or fee-split deployment.
- Keep submitted transaction receipts locally for recovery without treating wallet connection as creator-account authentication or publishing unverified token data.
