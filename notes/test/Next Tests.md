### copyFromTemplate - USER
- [ ] create a new template. 
- [ ] save it blank, should produce error message
- [ ] add exercise with no sets, save it, should save
- [ ] open again, add blank set, attempt save, should produce error message
- [ ] make reps negative, attempt save should produce error message
- [ ] update set to be valid, save, should save
- [ ] open again, add second exercise with its own 2 sets, save it, should save
- [ ] add third exercise, remove 1 set from second exercise, press 'start this workout'. should save template then duplicate to a new copied workout on workoutPage.
- [ ] save that workout, should be linked to the template
- [ ] create a new template with 3 exercises, each with 3 sets, then immediately copy to a workout. should have same functionality as above.
- [ ] delete that workout, the template should no longer be linked to a workout instance
- [ ] delete the original template, the workout created from it, should no longer be connected to it.

### copyFromTemplate - ADMIN
- [ ] add new global template and save, should be able to delete it
- [ ] create new global template, log out, then log in as user, shouldn't be able to delete