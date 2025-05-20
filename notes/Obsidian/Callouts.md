# Obsidian Callouts - Reference Template

Use this note to experiment with and compare callout types, aliases, custom titles, foldable behavior, and nesting.

---

## 📝 Basic Callouts

> [!note]
> This is a **note** callout — the generic default.

> [!abstract]
> This is an **abstract** callout, aliased as `summary` or `tldr`.

> [!info]
> This callout is `info` — useful for general information.

> [!todo]
> Represents a **to‑do** item or task.

---

## 💡 Tips & Warnings

> [!tip] Custom Title: “Quick Tip”
> ⚡ Use `> [!tip] Title` to add your own heading.

> [!success]
> Indicates **success** — also aliased as `check` or `done`.

> [!question]
> Marks a question or **FAQ** — also `help`, `faq`.

> [!warning]
> ⚠️ **Warning** callout — aliases: `caution`, `attention`.

> [!failure]
> Represents **failure** or missing content — aliases: `fail`, `missing`.

> [!danger]
> **Danger** / error callout — alias: `error`.

> [!bug]
> Use for documenting bugs or issues.

---

## 🏷️ Other Specialized Callouts

> [!example]
> Use for **examples** or case studies.

> [!quote]
> Quotation style callout — alias: `cite`.

---

## 🔁 Foldable Callouts

> [!info]+ Click to expand — this callout starts **expanded**.
> tada!

> [!warning]- Click to expand — this one starts **collapsed** by default.
> see look at that

---

## 🧩 Nested Callouts

> [!question] Can callouts nest?
> > [!todo] Yes — this is a **nested** todo inside a question.
> > > [!example] And it can go deeper if needed.

---

## 🚀 Summary of All Types

> [!abstract]- TL;DR – Here’s the full list, collapsed by default:
> - note  
> - abstract / summary / tldr  
> - info  
> - todo  
> - tip / hint / important  
> - success / check / done  
> - question / help / faq  
> - warning / caution / attention  
> - failure / fail / missing  
> - danger / error  
> - bug  
> - example  
> - quote / cite

---

## 🧰 Usage Guidance

- To **customize titles**, add text after the type:  
  `> [!tip] Custom Title`  
- To make a callout **foldable**, append `+` (expanded) or `-` (collapsed) after the type:  
  `> [!info]+` or `> [!warning]-`  
- Aliases (like `hint`, `done`, `faq`, etc.) function identically—they differ only visually or semantically.
- Nesting works naturally—just indent with extra `>` characters.
- Once you get comfortable, you can create a **template** of this note and insert it using the Templates plugin or QuickAdd for faster reuse.
