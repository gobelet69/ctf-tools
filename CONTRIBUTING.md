# Contributing

Thank you for contributing to CTF Tools! 

Our dependency philosophy is strict:
1. **Native Web API first.**
2. **Small local dependency second.**
3. **Heavy dependency only when clearly justified.**

## How to add a tool

1. Fork and clone the repository.
2. Create a new feature branch.
3. Add your tool HTML page to the appropriate category folder (e.g., `/crypto/`). Link to `../style.css` and `../js/common.js`.
4. Add the catalog entry to `js/tools.js` with `ready: true`.
5. Keep processing 100% local (no backend requests).
6. Avoid unnecessary dependencies. Use native browser APIs whenever possible.
7. Avoid unsafe DOM rendering. Never use `innerHTML` with user-supplied data. Use `textContent` or `document.createElement()`.
8. **Do not mark `ready:true` without a functional browser test.** Update the Playwright test suite to include your tool.
9. Open a Pull Request.

## Testing Documentation

The project includes an automated test suite that must pass before any tool is marked ready.

1. Start a local HTTP server in the project root:
   ```bash
   python3 -m http.server 8000
   ```
2. In a separate terminal, run the Playwright test suite (if configured locally):
   ```bash
   npx playwright test
   ```
   *(Note: Playwright is for DEVELOPMENT ONLY and is not shipped to production.)*
3. Test results are output to `tests/report.json`. To regenerate the report, run the provided evaluation scripts against the local server.
