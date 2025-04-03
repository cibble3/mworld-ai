
# 🌍 MistressWorld i18n Strategy

MistressWorld embraces global reach without compromising performance. This strategy defines how we handle multi-language content efficiently.

---

## ✅ Core Principles

- **Only English content is AI-generated for SEO**
- **No pre-rendering of translated SEO pages**
- **UI is translated on the frontend**
- **Chatbot adapts dynamically per user locale**

---

## 🧠 Why This Works

| Benefit | Impact |
|--------|--------|
| ⚡ Fast builds | No bloated pre-renders |
| 💾 Lean storage | No duplication of AI content |
| 🔍 Clean SEO | Avoids duplicate content penalties |
| 🧠 Adaptive AI | Chatbot feels native, responds in user's language |

---

## 🔧 Chatbot i18n

- Localized phrases are stored in `data/ai-mistress/i18n-config.json`
- Persona can greet, flirt, and respond per language
- Language detected from GeoIP or browser headers
- Fallback is always English

---

## 🖥️ UI Translations

- Use translation API (or Next.js i18n routing)
- Translates navigation, buttons, headings
- Content itself (bios, posts) remains in English

---

## ❌ What We Avoid

| Anti-Pattern | Why |
|--------------|-----|
| Pre-building 10k x 10 languages | Too heavy, not scalable |
| Using AI to translate everything | Risk of poor tone/voice carryover |
| Language toggles for all pages | Clutters UI and breaks SEO |

---

## 📁 File Structure

```bash
/data/
  /ai-mistress/
    └── i18n-config.json
```

---

## ✅ Future Option

If a specific model/page sees consistent foreign traffic:
- Add a **translation job** for that slug only
- Cache it to `/data/{lang}/models/slug.json`

But we never pre-build millions of pages again.

---
