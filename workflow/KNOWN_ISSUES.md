# Known Issues (site defects, with evidence)

| ID | Area | Description | Evidence | Related TC | Handling |
|----|------|-------------|----------|------------|----------|
| BUG-001 | Contact form | Only Email has `required`; Name, Subject and Message can be empty | DOM check on /contact_us, see reports/BUG_REPORT.md | TC-CONTACT-003 | `test.fail()` with the bug ID; turns red when fixed |
