# Growth Journal

A keepsake app for each kid — cheap to build, high sentimental retention.

- **The same interview, every year** — ten fixed questions asked on each birthday, so you can watch
  the answers change from "a firefighter" to "a marine biologist."
- **Height marks, weight, and a photo per year** — attach a portrait or a handprint scan.
- **A living "current sizes" card** — shirt, pants, shoe, and coat sizes per kid that grandparents
  and gift-buyers can read *before* they shop, with a one-tap jump to that kid's **Wishlist**.

Adults write; the whole household (grandparents included) can read. Pick a kid from the chips at the
top to see their timeline. Built on `storage: db` with `adult_writable` row policies and hub file
storage for photos.

## Quick start

```bash
npm run dev     # http://localhost:3001
npm run build   # produces dist/bundle.json
npm test
```
