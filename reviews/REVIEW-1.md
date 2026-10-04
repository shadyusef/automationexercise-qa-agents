# QA Review 1 - automationexercise.com Playwright suite

## Verdict: CHANGES REQUESTED

Static review. POM structure is sound and every spec ID exists in the CSV. Several specs under-verify their CSV expected results, cleanup has gaps, and the CSV needs quality and coverage work. No Blockers.

## Findings

| # | Severity | File / TC ID | Problem | Required correction |
|---|---|---|---|---|
| 1 | Major | TC-PRODUCTS-002 | CSV: search `Top`, every name contains 'top'. Spec searches `Blue Top` and checks one exact card. Spec title differs from the CSV. | Search `Top`, assert every name contains it (`allTextContents` with `expect.poll`). Use the CSV title. |
| 2 | Major | TC-PRODUCTS-001 | CSV: same name, category, price, etc. Spec compares only the name; other fields are visibility only; list price never compared. Title differs from the CSV. | Compare the price. Assert non-empty text for the other fields. Fix the title. |
| 3 | Major | TC-CART-005 | CSV: cart contains the added product. Spec checks only row count = 1. | Assert the item's name and price in the cart row. |
| 4 | Major | TC-CHECKOUT-003 | CSV lists state. Spec never asserts `state`, and does not assert login succeeded. | Add the state assertion and a logged-in assertion. |
| 5 | Major | TC-AUTH-001/003/005 | AUTH-005: 'Signup / Login' header not asserted. AUTH-003: "stays logged out" not asserted. AUTH-001: 'ACCOUNT CREATED!' / 'ACCOUNT DELETED!' text only checked as visible. | Assert `navSignupLogin` visible, and heading text via `toHaveText`. |
| 6 | Major | TC-AUTH-001, TC-CHECKOUT-001 | Account deletion is the last step. Any earlier failure leaks the account, and retries add more. | Move deletion to a fixture or `try/finally`. |
| 7 | Major | test-fixtures.ts `registeredUser` | Teardown uses one-shot `isVisible()` right after `open()` (false negatives). If setup fails after account creation, no teardown runs. | Wrap setup in `try/finally`. Use a web-first check, e.g. `loggedInUserLabel(...).or(navSignupLogin)`, then branch. |
| 8 | Major | contact.spec.ts | Uploads `src/utils/sample-upload.txt`, which is not in the bundle. I cannot confirm it exists. | Confirm it is committed, or generate the file in `testInfo.outputPath()`. |
| 9 | Major | CSV, all modules | Steps are not atomic: AUTH-001 step 4 (ten fields), CART-001 steps 2-3, CONTACT-001 step 4, CHECKOUT-001 steps 3-6. | One action per step. |
| 10 | Major | CSV expected results / data | Vague wording: "valid details", "small txt file", "valid card details", "as registered", "right name and price", "at least one product", "any password", "named like 'invoice'". CHECKOUT-002 has no exact message text. | Give concrete values and exact strings: card 4111111111111111 / 123 / 12 / 2030, the confirmation text, the filename pattern, the validation message. |
| 11 | Major | CSV coverage | Boundary cases are absent or "Later" in every module. CONTACT, CHECKOUT and SUB have no automated negative. CART has no negative. | Automate the cheap "Later" cases (AUTH-007/008, CONTACT-002/003, CHECKOUT-006, SUB-003, CART-006) and add the scenarios below. |
| 12 | Minor | BasePage.waitReady | See the judgement below. | Catch only `TimeoutError` and surface it. |
| 13 | Minor | Page objects | Many CSS/href/id selectors where a role exists: `a[href="/login"]`, `getByText('Proceed To Checkout')`, `button.cart`. Locators built inline in Signup/Checkout/Contact/ProductDetail. | Prefer `getByRole` and `data-qa`. Declare locators as readonly fields. |
| 14 | Minor | TC-UI-002 | Spec calls `page.evaluate(window.scrollTo)` directly; this is not "manual" scrolling. It is also near-duplicate of UI-001. | Add `HomePage.scrollToTop()` using `mouse.wheel`. Justify or drop the case. |
| 15 | Minor | PRODUCTS-001, CART-001 | `expect(await count()).toBeGreaterThan(0)` is non-retrying and redundant. `textContent()` snapshots for expected values. | Remove it. Use `allTextContents()` after a visibility assertion. |
| 16 | Minor | Page objects | `CheckoutPage.orderPlaced` unused. `ProductsPage.heading` and `pageTitle` identical. `productsPage.viewCartFromModal` reused for the home flow. | Delete the unused and duplicate locators. Extract a `CartModal` component. |
| 17 | Minor | checkout.spec.ts 002/003/004 | The login, add-to-cart and checkout flow is repeated three times. | Extract a helper or fixture. |
| 18 | Minor | CSV | Status is "Draft" for all automated cases. `Type` mixes kind and polarity. CART-004 typed "UI". | Update Status. Split Type and Polarity. |
| 19 | Minor | playwright.config.ts | Local `retries: 1` hides flakiness. `@smoke`/`@regression` tags have no script. `tsconfig.json` is not in the bundle, so strict TS is unverified. | Local retries 0. Add tag scripts. Confirm `"strict": true`. |
| 20 | Suggestion | CheckoutPage.downloadInvoice | No explicit return type. | Add `Promise<Download>`. |

## waitReady judgement

Acceptable in principle, not as written. It is a readiness hint for a site that binds handlers on `window.load`. Real failures still surface in later web-first assertions, and ad hosts are blocked in the fixture. But `.catch(() => undefined)` swallows every error (for example "page closed"), and a 20 s stall per navigation would be invisible. Fix: catch only `errors.TimeoutError`, rethrow the rest, and add a test annotation or warning when it times out.

## Missing important scenarios

- AUTH: empty mandatory fields on the account form, weak password, email format boundary, login after account deletion fails, session persists on reload.
- CONTACT: submit without an attachment, dismissed confirm dialog.
- PRODUCTS: case-insensitive and special-character search, Men/Kids categories, review with empty or invalid fields.
- CART: same product added twice, quantity 0 / negative / very large, totals across lines, removing one of several lines, cart persistence after login.
- CHECKOUT: invalid or expired card, cart empty after an order, multi-item totals.
- Cross-cutting: API-based account setup and teardown, mobile viewport.

## What was good

- No assertions in page objects. No `waitForTimeout`. Web-first assertions almost everywhere.
- `uniqueEmail` (time, pid, counter) is parallel-safe. `newUser` and `registeredUser` fixtures give independence and cleanup.
- Ad-host blocking is centralised in the `page` fixture.
- Every spec title starts with an existing `[TC-ID]`. Automation and Spec columns match the files.
- Config has `forbidOnly`, trace on retry and sensible timeouts. AUTH negatives carry exact error strings.
