# Resolution of REVIEW-1 (20 findings, verdict was CHANGES REQUESTED)

Re-verified by the full suite: 34 tests x 3 repeats = 102 passed, 0 failed, 0 flaky (20.6 min), plus a final headed run with video.

| # | Sev | Status | What was done |
|---|-----|--------|---------------|
| 1 | Major | Fixed (changed approach) | CSV and spec aligned: PRODUCTS-002 searches the full name "Blue Top". The reviewer's "every result contains the term" does not hold on the live site because search also matches categories (OBS-001). |
| 2 | Major | Fixed | PRODUCTS-001 now compares list vs detail name and price and asserts non-empty category, availability, condition, brand. Spec title matches the CSV. |
| 3 | Major | Fixed | CART-005 asserts the cart line name and price equal the recommended item. |
| 4 | Major | Fixed | CHECKOUT-003 asserts state and that login succeeded. |
| 5 | Major | Fixed | AUTH-001/003/005 assert heading texts, "Signup / Login" visible, and no "Logged in as" text. |
| 6 | Major | Fixed | New `trackAccount` fixture deletes the account after the test if it still exists, so a mid-test failure cannot leak accounts (AUTH-001, CHECKOUT-001). |
| 7 | Major | Fixed | `registeredUser` registers for cleanup before the UI work; teardown uses web-first waiting (`isLoggedInAs`) instead of a one-shot `isVisible()`. |
| 8 | Major | Fixed | Contact test generates its attachment in the test output folder. |
| 9 | Major | Fixed (key cases) | Steps split to one action each for AUTH-001, CART-001, CONTACT-001, CHECKOUT-001, UI-002. |
| 10 | Major | Fixed | Concrete data (card, user, file) and exact message texts added. |
| 11 | Major | Fixed (partly) | All 7 cheap "Later" cases automated (AUTH-007/008, CONTACT-002/003, CHECKOUT-006, SUB-003, CART-006). Remaining gaps are listed as backlog in the final report. |
| 12 | Minor | Fixed | `waitReady` now tolerates only a load `TimeoutError`; other errors are rethrown. |
| 13 | Minor | Open | Some CSS/href selectors remain where a role exists; low risk. |
| 14 | Minor | Fixed | UI-002 uses real mouse-wheel scrolling via `scrollToTopManually()`. |
| 15 | Minor | Fixed | Removed the non-retrying count assertion in PRODUCTS-001. |
| 16 | Minor | Fixed | Removed unused `orderPlaced` and duplicate `heading`. |
| 17 | Minor | Fixed | Duplicate login-and-checkout flow extracted to a helper. |
| 18 | Minor | Fixed (partly) | Status column updated to Verified; Type/Polarity split not done. |
| 19 | Minor | Fixed | Local retries set to 0; `test:regression` script added. `strict: true` confirmed in tsconfig. |
| 20 | Sugg. | Fixed | `downloadInvoice` has an explicit return type. |

Tally: 17 fixed, 2 partly fixed (#11, #18), 1 open (#13, minor).
