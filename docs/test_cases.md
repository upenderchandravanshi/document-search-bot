# Test Cases for Document Search Bot

| #  | Scenario                                                  | Steps                                                                                     | Expected Result                                     |
|----|-----------------------------------------------------------|-------------------------------------------------------------------------------------------|-----------------------------------------------------|
| 1  | Admin uploads PDF                                         | 1. Role → Admin (enter `adminpass`)<br>2. Upload `John_Doe.pdf`                           | 200 OK; `/files/` lists `John_Doe.pdf`              |
| 2  | Admin uploads DOCX                                        | 1. Upload `Jane_Smith.docx`                                                               | 200 OK; listed in `/files/`                         |
| 3  | Admin deletes a file                                      | 1. Click Delete next to `Jane_Smith.docx`                                                 | 200 OK; file removed from `/files/`                 |
| 4  | User queries without selecting resume                     | 1. Role → User<br>2. Query “machine learning”                                             | List of relevant snippets from all resumes          |
| 5  | User queries a specific resume                            | 1. Select `John_Doe.pdf`<br>2. Query “data analyst”                                       | Only snippets from `John_Doe.pdf`                   |
| 6  | Role switch resets UI                                     | 1. Switch Admin → User<br>2. Verify query & selection cleared                             | Dropdown reset to “— All Resumes —”, results empty  |
| 7  | Upload > 2MB rejected                                     | 1. Try uploading 3 MB file                                                                 | 400 Bad Request (size limit)                        |
| 8  | Unsupported file type                                     | 1. Upload `.txt`                                                                          | 400 Bad Request (unsupported extension)             |
