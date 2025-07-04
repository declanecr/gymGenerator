
| action preceding              | finish button pressed? | appears? | correct result                                                                       |
| ----------------------------- | ---------------------- | -------- | ------------------------------------------------------------------------------------ |
| first exercise added          | true                   | true     | true                                                                                 |
| add set button pressed        | false                  | false    | true                                                                                 |
| remove set button pressed     | false                  | true     | true (but if it didn't appear until finish button was pressed again that would work) |
| finish button pressed         | true                   | true     | true                                                                                 |
| set added then removed        | false                  | true     | true, same as 2 above                                                                |
| finish button pressed         | true                   | true     | true                                                                                 |
| set added                     | true                   | false    | true                                                                                 |
| exercise removed and re added | false                  | true     | false                                                                                |
