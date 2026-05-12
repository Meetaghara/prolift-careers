# ProLift Careers — v2 Notes

Drop these three files into your project folder, replacing the existing `Index.html`, `style.css`, and `script.js`. Your existing image files (`proliftlogo.webp` and `meetaghara.webp`) work as-is — no renaming needed.

## What's new

### Bold editorial redesign
- **Typography**: Fraunces (display serif) + Manrope (body sans). Distinctive, premium, breaks from generic SaaS look.
- **Color**: Deep ink + warm cream paper + electric teal accent. One confident palette instead of multi-gradient.
- **Layout**: Editorial spacing, italic serif accents on key phrases, hairline rules, numbered sections (01–06).

### Global positioning
- Country badges (IN · AE · US · CA) in hero, footer, and throughout
- Service copy updated for India, UAE/Gulf, US, Canada
- New plan name: **Global Premium** (replaces Gulf Premium)
- Region-aware messaging in services and process sections
- Locale-based initial currency detection (US visitors land on USD by default)

### Conversion upgrades
1. **Multi-currency pricing toggle** — INR / USD / AED / CAD. Prices recalculate live, including add-ons and totals.
2. **Inline lead-capture form** — proper form with name, email, WhatsApp, target country, target role, LinkedIn, concern. On submit, opens WhatsApp with the data pre-formatted as a message.
3. **Sticky mobile CTA bar** — appears after scrolling past hero. Primary "Free profile review" + secondary WhatsApp icon.
4. **Animated trust counters** — 4 countries, 100% human-led, 200+ profiles, 0 fake guarantees. Count up when they enter the viewport.
5. **Smart plan CTA** — clicking "Choose Growth" pre-fills the form's concern field AND updates the WhatsApp link with a full breakdown (plan, base price, selected add-ons, total in the user's chosen currency).
6. **Auto-WhatsApp handoff** — after form submission, WhatsApp opens automatically with the full lead data formatted as a message. Removes the "did they get my message?" anxiety.

### Trust & proof
- Reorganized testimonials into editorial pull-quote format
- Added "What we guarantee / What we don't" framing throughout
- New stats block in About section
- LinkedIn buttons styled prominently
- Removed Party Math section (was charming but inconsistent with the premium global positioning — happy to add it back if you want)

### Mobile experience
- Sticky bottom CTA bar
- Full-screen serif navigation menu (premium feel)
- Comparison table converts to stacked cards
- Add-ons live in a collapsible `<details>` block (cleaner cards)
- Form fields stack properly on small screens
- Larger tap targets throughout

### Performance & SEO
- JSON-LD structured data (Organization + FAQPage) — both will help Google understand the business
- Proper meta descriptions, Open Graph, Twitter cards, canonical URL
- Font preconnect + preload for Fraunces & Manrope
- Native `<details>` for accordions (no JS needed)
- Reduced-motion respected throughout
- Print styles preserved

## Things you should do

1. **Update WhatsApp number** if needed — line 9 of `script.js`:
   ```js
   const WHATSAPP_NUMBER = "919104485504";
   ```

2. **Update currency rates** when you want to refresh them — `script.js` line 15. Right now I've used approximate rates:
   - USD: 0.012 (₹14,999 → ~$180)
   - AED: 0.044 (₹14,999 → ~AED 660)
   - CAD: 0.016 (₹14,999 → ~C$240)
   
   You can adjust these to whatever makes sense for your pricing strategy in each market.

3. **Update canonical URL** in `Index.html` — currently `https://proliftcareers.com/`. Change to your actual domain.

4. **Replace OG image** — currently using `proliftlogo.webp`. A 1200×630 promotional image would render better when shared on LinkedIn / WhatsApp.

5. **Wire form submission to a backend** if you want lead capture beyond WhatsApp. Right now the form opens WhatsApp with the data — you get the lead via WhatsApp. If you want emails too, hook up the `submit` handler in `script.js` to send to your endpoint (Formspree, Tally, Zapier webhook, your own API).

6. **Add Google Analytics or Plausible** — the JS already fires a custom event `prolift:lead` on form submit. Easy hook for tracking.

7. **Consider a favicon ICO** in addition to the WebP one.

## Things I intentionally did NOT change

- Your WhatsApp number
- Your LinkedIn URLs
- Plan prices (kept exactly as before)
- Add-on prices (kept exactly as before)
- Disclaimer language about no job guarantees
- Founder name / About content

## File structure (drop-in replacement)

```
your-project/
├── Index.html         ← replace
├── style.css          ← replace
├── script.js          ← replace
├── proliftlogo.webp   ← keep
└── meetaghara.webp    ← keep
```

That's it.
