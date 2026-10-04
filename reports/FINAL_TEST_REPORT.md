# Final Test Report: automationexercise.com

**Date:** 2026-10-04  **Scope:** UI end-to-end flows  **Stack:** Playwright + TypeScript, Page Object Model  **Browser:** Google Chrome (desktop)  **Target:** https://www.automationexercise.com/

## 1. Summary
| Measure | Result |
|---|---|
| Test cases written | 34 (P0: 11, P1: 13, P2: 10) |
| Cases automated | 34 of 34 |
| Final headed run (video recorded) | **34 passed, 0 failed, 0 flaky**, about 20 min |
| Stability check (every test x 3, headless, 3 workers) | **102 of 102 passed**, 20.6 min |
| Confirmed site bugs | **1** (BUG-001, low severity). See `BUG_REPORT.md` |
| Independent review | REVIEW-1: 20 findings; 17 fixed, 2 partly fixed, 1 open (low-risk minor). See `reviews/REVIEW-1-RESOLUTION.md` |

**Verdict:** the suite is stable and ready for use. One test (TC-CONTACT-003) is deliberately an *expected failure* tied to BUG-001: it passes in the report because the bug exists, and will turn red when the site is fixed, which is the signal to remove the marker.

## 2. How the suite went from first run to green
| Run | Passed | Failed | Main cause of failures |
|---|---|---|---|
| 1 (first live run, 27 automated tests) | 13 | 14 | Slow page loads timing out |
| 2 | 18 | 9 | Clicking before the site's JavaScript is attached |
| 3 | 22 | 5 | Cleanup logging in twice; ambiguous contact message |
| 4 | 27 | 0 | none |
| 5 (34 tests, after review fixes and 7 new cases) | 29 | 5 | 4 test defects + 1 real site bug (BUG-001) |
| 6 (focused repeat of the 5) | 13 of 15 | 2 | Checkout test hit the 60 s limit; limit raised to 120 s |
| 7 (stability, 102 executions) | **102** | **0** | none |
| 8 (final headed run) | **34** | **0** | none |

## 3. Results by module (final headed run)
| Module | Cases | Passed | Run time (s) |
|---|---|---|---|
| Login / signup | 8 | 8 | 341 |
| Contact us | 3 | 3 | 40 |
| Products | 6 | 6 | 136 |
| Cart | 6 | 6 | 123 |
| Checkout | 6 | 6 | 445 |
| Subscription | 3 | 3 | 44 |
| Page behaviour | 2 | 2 | 40 |

## 4. Every test case
| ID | Title | Priority | Result | Time (s) |
|---|---|---|---|---|
| TC-AUTH-001 | Register a new user and delete the account | P0 | Pass | 78 |
| TC-AUTH-002 | Login with valid credentials | P0 | Pass | 42 |
| TC-AUTH-003 | Login fails with an incorrect password | P0 | Pass | 62 |
| TC-AUTH-004 | Login fails with an unregistered email | P1 | Pass | 8 |
| TC-AUTH-005 | Logout returns the user to the login page | P0 | Pass | 69 |
| TC-AUTH-006 | Signup fails with an already registered email | P1 | Pass | 63 |
| TC-AUTH-007 | Signup is blocked when the name is empty | P2 | Pass | 13 |
| TC-AUTH-008 | Login is blocked when email and password are empty | P2 | Pass | 7 |
| TC-CART-001 | Add two products and verify price, quantity and total | P0 | Pass | 15 |
| TC-CART-002 | Cart shows the quantity chosen on the product page | P0 | Pass | 25 |
| TC-CART-003 | Remove a product from the cart | P0 | Pass | 25 |
| TC-CART-004 | An empty cart shows the empty message | P1 | Pass | 5 |
| TC-CART-005 | Add a product from the recommended items | P2 | Pass | 31 |
| TC-CART-006 | Line total equals unit price times quantity | P1 | Pass | 23 |
| TC-CHECKOUT-001 | Register during checkout and place an order | P0 | Pass | 81 |
| TC-CHECKOUT-002 | A logged-in user places an order | P0 | Pass | 98 |
| TC-CHECKOUT-003 | Delivery and billing addresses match the registration data | P1 | Pass | 64 |
| TC-CHECKOUT-004 | Download the invoice after a purchase | P1 | Pass | 86 |
| TC-CHECKOUT-005 | A guest is asked to register or log in at checkout | P1 | Pass | 31 |
| TC-CHECKOUT-006 | Payment is blocked when card fields are empty | P2 | Pass | 85 |
| TC-CONTACT-001 | Submit the contact form with an attachment | P1 | Pass | 21 |
| TC-CONTACT-002 | Contact form rejects an invalid email format | P2 | Pass | 5 |
| TC-CONTACT-003 | Contact form requires mandatory fields | P2 | Pass (expected failure, BUG-001) | 14 |
| TC-PRODUCTS-001 | All products and product details are displayed | P0 | Pass | 29 |
| TC-PRODUCTS-002 | Search by product name lists that product | P0 | Pass | 23 |
| TC-PRODUCTS-003 | Search with an unknown term shows no products | P1 | Pass | 23 |
| TC-PRODUCTS-004 | Filter products by category Women > Dress | P1 | Pass | 21 |
| TC-PRODUCTS-005 | Filter products by brand Polo | P1 | Pass | 18 |
| TC-PRODUCTS-006 | Submit a review on a product | P2 | Pass | 23 |
| TC-SUB-001 | Subscribe from the home page footer | P1 | Pass | 17 |
| TC-SUB-002 | Subscribe from the cart page footer | P1 | Pass | 5 |
| TC-SUB-003 | Subscription rejects an invalid email | P2 | Pass | 23 |
| TC-UI-001 | Scroll to the top using the arrow button | P2 | Pass | 14 |
| TC-UI-002 | Scroll to the top without the arrow button | P2 | Pass | 25 |

## 5. Environment notes
- The site is slow (a full order flow takes 40 to 60 s) and serves third-party ads. Ad hosts are blocked in the test fixture; checkout tests have a 120 s limit.
- The site only enables its buttons after the full page load, so every navigation waits for the page `load` event.
- Playwright's own Chromium download was unavailable on this computer, so tests run on installed Google Chrome (`PW_CHANNEL=chrome`).
- One intermittent DNS failure on the local network appeared once and never again.

## 6. Known gaps and backlog (not done)
- Cross-browser (Firefox, WebKit) and API tests were out of scope by your choice.
- Extra scenarios suggested by the reviewer: password and email boundary cases on signup, quantity 0 / negative in the cart, adding the same product twice, invalid or expired card, Men and Kids categories, mobile viewport, API-based account setup to speed up tests.
- The CSV has no separate Polarity column (Type mixes kind and polarity); a few CSS/href locators could move to roles.
- Not yet connected to CI.

## 7. Evidence
- Videos of every test: `test-results/` (one `.webm` per test).
- HTML report: `playwright-report/index.html` (`npm run report`).
- Test cases: `test-cases/TestCases.xlsx` and `.csv`.
