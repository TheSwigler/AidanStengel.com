# aidanstengel.com

Static site on GitHub Pages. No build step: edit a file, commit, and it's live in a minute or two.

| Path | File |
|---|---|
| aidanstengel.com | `index.html` |
| aidanstengel.com/resume | `resume/index.html` |
| aidanstengel.com/gifts | `gifts/index.html` (list lives in `gifts/items.json`) |

Shared styles are in `assets/site.css`.

## Editing the wish list

Everything is in `gifts/items.json`, grouped into `categories`. A category has either `items` or `groups` (subcategories with their own `items`), plus an optional `note`. Each item:

```json
{
  "brand": "ICON",
  "name": "Professional Socket Adapter Set, 4-Piece",
  "store": "Harbor Freight · Richmond · Aisle 4",
  "price": "$16.99",
  "link": "https://go.harborfreight.com/www57324",
  "image": "img/abc123.jpg",
  "qty": 2,
  "top": 3,
  "have": true
}
```

Only `name` and `link` are required. `top` is the item's rank in Top picks (1 shows first). `"have": true` crosses it out as "Already have it". Product photos go in `gifts/img/`; leave `image` out and it shows the brand's initials instead.

## Resume PDF

Open /resume and click **Save as PDF**. The page has print styles, so it prints as a clean one-column resume.
