# Medical Services Section (SASS 7-1)

This mini project replicates a clean medical services marketing block using the SASS 7-1 architecture. It lives inside the `SASS Laps` workspace folder and ships with compiled CSS plus the original Sass source.

## Structure

```
SASS Laps/
├── abstracts/      # variables, mixins
├── base/           # resets, typography
├── components/     # reusable UI pieces
├── layout/         # structural helpers (containers, sections)
├── pages/          # page-level styles (hero & service grid)
├── main.scss       # Sass entry point
├── style.css       # compiled output
└── index.html      # static markup showcasing the section
```

## Development

Install dependencies (only needed once) and compile Sass:

```bash
npm install
npm run build
```

To keep Sass compiling automatically during development:

```bash
npm run watch
```

Then open `index.html` in a browser to view the section.

## Notes

- Typography uses the Inter font and clamps for responsive type scales.
- Cards leverage CSS Grid to reflow between 1–3 columns depending on the viewport.
- Hover and focus states match the soft elevation shown in the reference mockup.
