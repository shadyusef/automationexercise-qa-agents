# Bug Report: automationexercise.com

**Date:** 2026-10-04  **Tested by:** automated Playwright suite (34 cases) plus targeted live checks  **Browser:** Google Chrome (desktop), no ad scripts

Only one confirmed defect was found. Two further behaviours were observed that are probably by design, and are listed so they are not mistaken for test failures.

## Confirmed defects

### BUG-001: Contact form only requires Email; Name, Subject and Message can be empty
| Field | Detail |
|---|---|
| Severity / Priority | Low / P3 (data quality; no security impact seen) |
| Module | Contact Us (`/contact_us`) |
| Related test case | TC-CONTACT-003 (kept in the suite as an expected failure, `test.fail`, so it turns red once fixed) |
| Environment | Chrome on Windows, production site |

**Steps to reproduce**
1. Open https://www.automationexercise.com/contact_us
2. Leave Name, Subject and Message empty; enter a valid email
3. Click Submit and accept the confirm dialog

**Expected:** the browser (or the page) blocks submission and asks for Name, Subject and Message, like the other contact fields behave.
**Actual:** the form is accepted. Inspecting the page shows only the Email input has the `required` attribute (`name: false, email: true, subject: false, message: false`). With every field empty the browser blocks submission only because of Email.

**Evidence:** DOM check run on the live page (required attributes listed above); Playwright test `[TC-CONTACT-003]` asserts the Name field is required and fails against the live site as expected.
**Suggested fix:** add `required` to Name, Subject and Message and show a clear message.

## Observations (probably by design, not bugs)

| ID | Observation | Impact on tests |
|---|---|---|
| OBS-001 | Product search also matches by category. Searching "Top" returns products such as "Little Girls Mr. Panda Shirt", whose name does not contain "top". | TC-PRODUCTS-002 searches the full name "Blue Top" and checks that product is listed. |
| OBS-002 | The site attaches its button behaviour only after the full page has loaded. Clicking Add to cart, Proceed To Checkout or Submit too early does nothing. This can happen to fast users on a slow connection. | Tests wait for the page `load` event before interacting. |
| OBS-003 | The site is slow (a full order flow takes 40 to 60 seconds) and loads third-party ad scripts that can intercept clicks. | Ad hosts are blocked in the test fixture; checkout tests use a 120 s timeout. |

## Failures that were test defects, not site bugs (for transparency)
Fixed during this project: wrong search expectation (OBS-001), a price parser that turned "Rs. 500" into 0.5, a locator that matched only the label "Availability:", cleanup that logged in twice, a logout race, and early clicks (OBS-002). One intermittent DNS failure on the local network was seen once and did not recur in 102 repeat runs.
