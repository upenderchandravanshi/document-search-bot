# Test Report for Document Search Bot

**Test Date:** 2025‑07‑25  
**Tested By:** QA Team

| Case # | Description                               | Status | Notes                                  |
|--------|-------------------------------------------|--------|----------------------------------------|
| 1      | Admin uploads PDF                         | ✅ Pass | Listed correctly                       |
| 2      | Admin uploads DOCX                        | ✅ Pass |                                        |
| 3      | Admin deletes a file                      | ✅ Pass |                                        |
| 4      | User general query                        | ✅ Pass | Returned snippets from multiple docs   |
| 5      | User specific resume query                | ✅ Pass | Filter worked successfully             |
| 6      | Role switch resets UI                     | ✅ Pass | Dropdown & results cleared             |
| 7      | Upload > 2MB rejected                     | ⚠️ Warn | Size check not yet implemented         |
| 8      | Unsupported file type                     | ⚠️ Warn | Text files still uploadable            |

> **Overall**: Core functionality ✔️, edge cases (7,8) require enhancements.
