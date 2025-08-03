# END GOAL = AI RECOMMENDATION ENGINE



# Engine 1: Workout Split recommender
## Input Data
- User specific data
	- height
	- weight
	- calorie consumption (if being tracked)
	- personally preferred exercises/machines (if marked by user)
- days available per week
- Beginner, Amateur, Intermediate, Advanced, Expert
- Goal (hypertrophy, strength, endurance, general)
- Goal muscles
- Preferred Equipment
- Time in the gym
- Sectors of the gym preferred (available equipment)
- preferred equipment

## Plan
Starting with a SplitTemplate 
``` ts
interface SplitTemplate {
	id: string;
	name: string; // e.g. "Push Pull Legs"
	frequency: number; // how many training days per week (max)
	focusAreas: string[]; // e.g. ["push", "pull", "legs", "rest", "upper", "lower"]
	expectedDurationMins: number[]; // match index to day
}
```
#### Notes:
- `focusAreas` allows more semantic meaning than raw muscle groups -- easier to swap out a "push" day with different muscle depending on the user
- `expectedDurationMins` as an array implies duration per day, matches `focusAreas[].length`.

## Personalization Logic:
### Inputs:
- `preferredMuscleGroups`
- `fitnessGoal` (`"strength"` | `"hypertrophy"` | `"endurance"` | `"general"`)
- `daysAvailable`
### Transformation Rules:
1. **Filter splits where** `frequency > daysAvailable`
2. **Filter out days where** `focusArea` **doesn't match user's muscle preferences** (i.e. if they hate legs, skip or reduce leg days)
3. **Adjust focusArea sequence based on goal**
	1. Strength -> fewer sessions, more rest, compound splits
	2. Hypertrophy -> more days, more muscle-group targeting
	3. Endurance -> full-body curcuits, low rest, higher frequency

## Finalized Interface:
``` ts
interface PersonalizedSplit {
	templateId: string;
	templateName: string;
	frequency: number;
	generationContext: {
		goal: 'strength' | 'hypertrophy' | 'endurance' | 'general';
		daysAvailable: number;
		preferredMuscleGroups?: string[];
		fitnessLevel:	'beginner' | 'amateur' | 'intermediate' | 'advanced' | 'expert';
		notes?: string; //optional debugging info
	}
	days: SplitDay[];
}

interface SplitDay {
  dayIndex: number;               // 0-based index for ordering
  focus: string;                  // e.g., "Push", "Pull", "Full Body"
  estimatedDurationMins: number;
  targetMuscleGroups: string[];   // e.g., ["chest", "shoulders", "triceps"]
  notes?: string;                 // why this day was included, removed, or modified
}
```

# Engine 2: Workout Exercise recommender

## Inputs:
#### From Engine 1's output:
``` ts
interface SplitDay {
  dayIndex: number;
  focus: string;
  estimatedDurationMins: number;
  targetMuscleGroups: string[];
  notes?: string;
}
```
- `userPreferredExercises` (machine, dumbbell, barbell, etc)
- `availableEquipment`
- `maxTime`
- `recent history` (to avoid duplicates or overtraining)
- `exercise catalog` (my `Exercise` model)
## Output design:
Engine 2 should return
``` ts
interface GeneratedWorkout {
  name: string;
  durationEstimate: number;
  muscleFocus: string[];
  exercises: GeneratedExercise[];
}

interface GeneratedExercise {
  name: string;
  exerciseId: string;
  targetMuscle: string;
  equipment: string;
  sets: GeneratedSet[]; //FROM ENGINE 3
  reason?: string; // e.g. "matches push day + user likes dumbbell"
}
```

## Selection Logic:
### Core Rules:
-  **Respect User Preferences**
    
    - Exclude disliked equipment (stored in User model)
        
    - Prioritize preferred movement patterns or machines
        
- **Muscle Volume Targets**
    
    - Big (e.g. quads, chest, back): **3 exercises**
        
    - Medium (e.g. hamstrings, glutes, shoulders): **2 exercises**
        
    - Small (e.g. triceps, calves): **1 exercise**
        
- **Avoid Overtraining**
    
    - Don’t repeat a muscle group if it was trained in the last 2 days
-  **Experience Scaling** 
	- Beginner: fewer exercises, lower volume
	
### Other potential rules:

| Category                     | Rule                                                                                 | Why?                                          |
| ---------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------- |
| **Fatigue Avoidance**        | Don’t schedule high CNS-taxing exercises (e.g. deadlift, squat) on back-to-back days | Mimics good periodization                     |
| **Movement Diversity**       | Avoid repeating the same exercise within a 7-day window                              | Encourages variety, reduces repetitive strain |
| **Modality Preference**      | Vary equipment across the workout: e.g. barbell + dumbbell + cable                   | Keeps engagement high                         |
| **Priority Order**           | Compound → Isolation → Finisher                                                      | Standard structure                            |
| **Time Constraint Matching** | Don’t exceed `estimatedDurationMins` by more than 10%                                | UI/UX realism                                 |
| **Warmup Inclusion**         | Always include 1 activation/warmup set for primary movers                            | Prehab/safety mindset                         |

# Engine 3: Next Set weight & reps calculator

## Inputs
### Required:
- ExerciseId 
- UserID
- Goal
- Experience Level
- **Previous performance data** for this exercise
### Optional:
- fatigue scores (rest days? soreness?)
- RPE logs
- Time of day?, stress?, nutrition (AI/ML features down the line)

## Output
something like:
``` ts
interface GeneratedSet {
	setNumber: number;
	targetReps: number;
	targetWeight: number;
	rpeTarget?: number;
	reason?: string; // e.g. "increased weight due to last session success"
}
```
---
## Progression Logic:
potential options for set weight/reps :

| Strategy               | Rule                                                                     | Applies to                            |
| ---------------------- | ------------------------------------------------------------------------ | ------------------------------------- |
| **Double Progression** | If user hits top of rep range for all sets, increase weight next session | Hypertrophy                           |
| **Linear**             | Add 2.5–5 lbs per session                                                | Beginners, strength                   |
| **Wave Loading**       | Cycle 3 weeks: light → medium → heavy → repeat                           | Strength-focused                      |
| **Autoregulated**      | If RPE was < 7 last time, increase reps or weight                        | Advanced                              |
| **Backoff Sets**       | After top set, reduce weight by 10–20% and do more reps                  | Powerbuilding                         |
| **Reverse Pyramid**    | Start heavy, reduce weight each set, increase reps                       | Time-efficient or fatigue-prone users |
