# Client logos

Drop a logo here as `<slug>.svg` (preferred) or `<slug>.png`, then point the
matching entry in `src/content/clients.ts` at it:

```ts
{ slug: "speechify", name: "Speechify", logo: "/logos/speechify.svg", … }
```

Until a `logo` is set, the wall sets the company name as a wordmark instead.

Use light or white artwork — the wall sits on a dark panel, and each logo is
rendered muted at rest and brought to full brightness on hover.
