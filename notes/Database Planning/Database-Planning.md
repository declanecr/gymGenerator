## Want to log:
a users workouts -> which consist of exercises -> which consist of sets -> which consist of reps

## Important Functionality:
- allow future planning of workouts
	this requires a ["template" based approach](Templates-and-Instances):

> [!note] Model as of 5/20 5:37PM
> #### User
> 
> #### Template Side:
> (for planning)
> - WorkoutTemplate
> - TemplateExercise
> - TemplateSet
> #### Log Side:
> (for tracking performance data)
> - Workout
> - WorkoutExercise
> - Set
> 	- excluding Reps for now, as per-rep metadata may be overboard


