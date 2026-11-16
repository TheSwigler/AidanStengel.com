# aidanstengel.com

Static site on GitHub Pages. No build step: edit a file, commit, and it's live in a minute or two.

| Path | File |
|---|---|
| aidanstengel.com | `index.html` |
| aidanstengel.com/resume | `resume/index.html` |
| aidanstengel.com/gifts | `gifts/index.html` (list lives in `gifts/items.json`) |

Shared styles are in `assets/site.css`.

## Editing the wish list

Edit `gifts/items.json`. Each item:

```json
{
  "name": "Thing I want",
  "link": "https://example.com/product",
  "price": "$40",
  "note": "Size large, blue if they have it",
  "top": true
}
```

Only `name` is required. `"top": true` marks it "Really want this" and moves it to the top. Separate items with commas inside the `[ ]`.

## Resume PDF

Open /resume and click **Save as PDF**. The page has print styles, so it prints as a clean one-column resume.
