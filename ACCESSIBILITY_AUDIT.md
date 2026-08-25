# Accessibility Audit (summary)

Quick checklist
- Ensure semantic HTML: use `button` elements for clickable controls, `label` elements for inputs.
- Keyboard navigation: all interactive elements reachable via Tab; logical focus order.
- Color contrast: meet WCAG AA for text and interactive controls.
- Form errors: provide inline error text and aria-live regions for announcements.
- Images: provide alt text or empty alt when decorative.

Findings (repo-level)
- Forms use labels and inputs — good coverage in onboarding and invite flows.
- Calendar and calendar-related UI are not implemented yet — calendar accessibility will be critical (aria-grid, keyboard date navigation, screen reader announcements).
- Add `aria-hidden` or `aria-label` where appropriate for icons and decorative SVGs.

Recommended fixes
- Run Lighthouse accessibility and axe-core locally and fix high/critical issues first.
- Implement accessible calendar component or use a tested library (FullCalendar with accessibility extension or `react-aria` patterns).
- Add automated accessibility checks to CI (axe or pa11y).
