import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Clock, Timer, Droplets } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const exerciseImages: Record<string, string> = {
  push: "https://images.unsplash.com/photo-1584827387150-8ae4caebe906?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB3b3Jrb3V0JTIwZXhlcmNpc2UlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzcwNjE1NTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080",
  pull: "https://images.unsplash.com/photo-1720788073779-04a9e709935c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXQlMjBwdWxsZG93biUyMGV4ZXJjaXNlfGVufDF8fHx8MTc3MDYxNTU0Nnww&ixlib=rb-4.1.0&q=80&w=1080",
  legs: "https://images.unsplash.com/photo-1758271613743-748b409c196b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWclMjBwcmVzcyUyMG1hY2hpbmV8ZW58MXx8fHwxNzcwNTcxNTE1fDA&ixlib=rb-4.1.0&q=80&w=1080",
  cable: "https://images.unsplash.com/photo-1764426445438-9c88377d4b01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWJsZSUyMG1hY2hpbmUlMjB3b3Jrb3V0fGVufDF8fHx8MTc3MDYxNTU0N3ww&ixlib=rb-4.1.0&q=80&w=1080"
};

const workoutSchedule = {
  Tuesday: {
    type: "Push",
    duration: {
      warmup: 13, // 5 min treadmill + 4 min arm circles + 4 min leg swings
      mainExercises: 45, // Estimated based on sets and rest
      coreCardio: 30, // 6 min core + 4 min abs + 20 min cardio
      cooldown: 4,
      shower: 15,
      total: 107
    },
    sections: [
      {
        category: "Warm-Up",
        exercises: [
          { name: "Treadmill walk", details: "5 min, 3 mph, 5% incline, ~50 cal" },
          { name: "Arm circles", details: "2x30 sec forward/backward" },
          { name: "Leg swings", details: "2x30 sec/side" }
        ]
      },
      {
        category: "Main Exercises",
        exercises: [
          { 
            name: "Machine Shoulder Press", 
            details: "3 sets, 12–15 reps, 60–75% 1RM",
            rest: "60–90 sec rest between sets",
            estimatedTime: "8 min"
          },
          { 
            name: "Chest Press Machine", 
            details: "3 sets, 12–15 reps, 60–75% 1RM",
            rest: "60–90 sec rest between sets",
            estimatedTime: "8 min"
          },
          { 
            name: "Cable Tricep Pushdowns (Rope)", 
            details: "4 sets, 12–15 reps",
            rest: "60 sec rest between sets",
            estimatedTime: "10 min"
          },
          { 
            name: "Dumbbell Lateral Raises", 
            details: "3 sets, 12–15 reps, light (5–10 lbs)",
            rest: "60 sec rest between sets",
            estimatedTime: "8 min"
          }
        ]
      },
      {
        category: "Core & Cardio",
        exercises: [
          { name: "Cable Woodchoppers (Low to High)", details: "3 sets, 15 reps/side, 30 sec rest" },
          { name: "Seated Machine Crunches", details: "3 sets, 15–20 reps, 30 sec rest" },
          { name: "Cardio: Treadmill incline walk", details: "15–20 min, 3.5 mph, 8% incline, ~200 cal" }
        ]
      },
      {
        category: "Cooldown",
        exercises: [
          { name: "Shoulder stretch (cross-arm)", details: "1 min/side" },
          { name: "Chest opener", details: "1 min" }
        ]
      }
    ]
  },
  Wednesday: {
    type: "Pull",
    duration: {
      warmup: 13,
      mainExercises: 45,
      coreCardio: 30,
      cooldown: 4,
      shower: 15,
      total: 107
    },
    sections: [
      {
        category: "Warm-Up",
        exercises: [
          { name: "Treadmill walk", details: "5 min, 3 mph, 5% incline, ~50 cal" },
          { name: "Arm circles", details: "2x30 sec forward/backward" },
          { name: "Leg swings", details: "2x30 sec/side" }
        ]
      },
      {
        category: "Main Exercises",
        exercises: [
          { 
            name: "Lat Pulldown (Wide Grip)", 
            details: "3 sets, 12–15 reps, 60–75% 1RM",
            rest: "60–90 sec rest between sets",
            estimatedTime: "8 min"
          },
          { 
            name: "Seated Cable Row", 
            details: "3 sets, 12–15 reps, 60–75% 1RM",
            rest: "60–90 sec rest between sets",
            estimatedTime: "8 min"
          },
          { 
            name: "Dumbbell Bicep Curls (Seated)", 
            details: "4 sets, 12–15 reps",
            rest: "60 sec rest between sets",
            estimatedTime: "10 min"
          },
          { 
            name: "Face Pulls (Cable, Rope)", 
            details: "3 sets, 12–15 reps",
            rest: "60 sec rest between sets",
            estimatedTime: "8 min"
          }
        ]
      },
      {
        category: "Core & Cardio",
        exercises: [
          { name: "Russian Twists (Cable Machine)", details: "3 sets, 15 reps/side, 30 sec rest" },
          { name: "Leg Raises (Captain's Chair)", details: "3 sets, 15–20 reps, 30 sec rest" },
          { name: "Cardio: Treadmill incline walk", details: "15–20 min, 3.5 mph, 8% incline, ~200 cal" }
        ]
      },
      {
        category: "Cooldown",
        exercises: [
          { name: "Upper back stretch (child's pose)", details: "1 min" },
          { name: "Bicep stretch", details: "1 min/side" }
        ]
      }
    ]
  },
  Thursday: {
    type: "Legs",
    duration: {
      warmup: 13,
      mainExercises: 50,
      coreCardio: 30,
      cooldown: 4,
      shower: 15,
      total: 112
    },
    sections: [
      {
        category: "Warm-Up",
        exercises: [
          { name: "Treadmill walk", details: "5 min, 3 mph, 5% incline, ~50 cal" },
          { name: "Leg swings", details: "2x30 sec/side" },
          { name: "Hip circles", details: "2x30 sec/side" }
        ]
      },
      {
        category: "Main Exercises",
        exercises: [
          { 
            name: "Barbell Hip Thrusts (Machine/Bench)", 
            details: "4 sets, 10–12 reps, 60–75% 1RM",
            rest: "90 sec rest between sets",
            estimatedTime: "12 min"
          },
          { 
            name: "Leg Press (Glute Focus, Feet High)", 
            details: "3 sets, 12–15 reps, 60–75% 1RM",
            rest: "90 sec rest between sets",
            estimatedTime: "10 min"
          },
          { 
            name: "Seated Leg Curl", 
            details: "3 sets, 12–15 reps, 60–75% 1RM",
            rest: "60–90 sec rest between sets",
            estimatedTime: "8 min"
          },
          { 
            name: "Cable Kickbacks", 
            details: "3 sets, 15 reps/leg",
            rest: "60 sec rest between sets",
            estimatedTime: "10 min"
          }
        ]
      },
      {
        category: "Core & Cardio",
        exercises: [
          { name: "Cable Woodchoppers (High to Low)", details: "3 sets, 15 reps/side, 30 sec rest" },
          { name: "Seated Machine Crunches", details: "3 sets, 15–20 reps, 30 sec rest" },
          { name: "Cardio: Treadmill incline walk", details: "15–20 min, 3.5 mph, 10% incline, ~200 cal" }
        ]
      },
      {
        category: "Cooldown",
        exercises: [
          { name: "Glute stretch (pigeon pose)", details: "1 min/side" },
          { name: "Hamstring stretch", details: "1 min" }
        ]
      }
    ]
  },
  Friday: {
    type: "Push",
    duration: {
      warmup: 13,
      mainExercises: 45,
      coreCardio: 30,
      cooldown: 4,
      shower: 15,
      total: 107
    },
    sections: [
      {
        category: "Warm-Up",
        exercises: [
          { name: "Treadmill walk", details: "5 min, 3 mph, 5% incline, ~50 cal" },
          { name: "Arm circles", details: "2x30 sec forward/backward" },
          { name: "Leg swings", details: "2x30 sec/side" }
        ]
      },
      {
        category: "Main Exercises",
        exercises: [
          { 
            name: "Incline Chest Press Machine", 
            details: "3 sets, 12–15 reps, 60–75% 1RM",
            rest: "60–90 sec rest between sets",
            estimatedTime: "8 min"
          },
          { 
            name: "Machine Shoulder Press (Neutral Grip)", 
            details: "3 sets, 12–15 reps, 60–75% 1RM",
            rest: "60–90 sec rest between sets",
            estimatedTime: "8 min"
          },
          { 
            name: "Overhead Cable Tricep Extensions", 
            details: "4 sets, 12–15 reps",
            rest: "60 sec rest between sets",
            estimatedTime: "10 min"
          },
          { 
            name: "Dumbbell Front Raises", 
            details: "3 sets, 12–15 reps, light (5–10 lbs)",
            rest: "60 sec rest between sets",
            estimatedTime: "8 min"
          }
        ]
      },
      {
        category: "Core & Cardio",
        exercises: [
          { name: "Russian Twists (Cable Machine)", details: "3 sets, 15 reps/side, 30 sec rest" },
          { name: "Leg Raises (Captain's Chair)", details: "3 sets, 15–20 reps, 30 sec rest" },
          { name: "Cardio: Treadmill incline walk", details: "15–20 min, 3.5 mph, 10% incline, ~200 cal" }
        ]
      },
      {
        category: "Cooldown",
        exercises: [
          { name: "Shoulder stretch (cross-arm)", details: "1 min/side" },
          { name: "Chest opener", details: "1 min" }
        ]
      }
    ]
  },
  Saturday: {
    type: "Pull",
    duration: {
      warmup: 13,
      mainExercises: 45,
      coreCardio: 30,
      cooldown: 4,
      shower: 15,
      total: 107
    },
    sections: [
      {
        category: "Warm-Up",
        exercises: [
          { name: "Treadmill walk", details: "5 min, 3 mph, 5% incline, ~50 cal" },
          { name: "Arm circles", details: "2x30 sec forward/backward" },
          { name: "Leg swings", details: "2x30 sec/side" }
        ]
      },
      {
        category: "Main Exercises",
        exercises: [
          { 
            name: "Lat Pulldown (Close Grip)", 
            details: "3 sets, 12–15 reps, 60–75% 1RM",
            rest: "60–90 sec rest between sets",
            estimatedTime: "8 min"
          },
          { 
            name: "Single-Arm Cable Row", 
            details: "3 sets, 12–15 reps/side",
            rest: "60–90 sec rest between sets",
            estimatedTime: "10 min"
          },
          { 
            name: "EZ-Bar Preacher Curls", 
            details: "4 sets, 12–15 reps",
            rest: "60 sec rest between sets",
            estimatedTime: "10 min"
          },
          { 
            name: "Face Pulls (Cable, Rope)", 
            details: "3 sets, 12–15 reps",
            rest: "60 sec rest between sets",
            estimatedTime: "8 min"
          }
        ]
      },
      {
        category: "Core & Cardio",
        exercises: [
          { name: "Cable Woodchoppers (Low to High)", details: "3 sets, 15 reps/side, 30 sec rest" },
          { name: "Seated Machine Crunches", details: "3 sets, 15–20 reps, 30 sec rest" },
          { name: "Cardio: Treadmill incline walk", details: "15–20 min, 3.5 mph, 10% incline, ~200 cal" }
        ]
      },
      {
        category: "Cooldown",
        exercises: [
          { name: "Upper back stretch (child's pose)", details: "1 min" },
          { name: "Bicep stretch", details: "1 min/side" }
        ]
      }
    ]
  }
};

export function WorkoutTracker() {
  const [selectedDay, setSelectedDay] = useState("Tuesday");
  const [checkedExercises, setCheckedExercises] = useState<Record<string, boolean>>({});

  const workoutDays = ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentWorkout = workoutSchedule[selectedDay as keyof typeof workoutSchedule];

  const toggleExercise = (exerciseKey: string) => {
    setCheckedExercises(prev => ({
      ...prev,
      [exerciseKey]: !prev[exerciseKey]
    }));
  };

  const getCompletionPercentage = () => {
    const totalExercises = currentWorkout.sections.reduce(
      (acc, section) => acc + section.exercises.length,
      0
    );
    const completedCount = Object.values(checkedExercises).filter(Boolean).length;
    return totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;
  };

  const getWorkoutImage = () => {
    const type = currentWorkout.type.toLowerCase();
    if (type === "push") return exerciseImages.push;
    if (type === "pull") return exerciseImages.pull;
    if (type === "legs") return exerciseImages.legs;
    return exerciseImages.cable;
  };

  return (
    <div className="space-y-6">
      {/* Workout Image Banner */}
      <Card className="overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-slate-900 to-slate-700">
          <ImageWithFallback
            src={getWorkoutImage()}
            alt={`${currentWorkout.type} workout`}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-4xl mb-2">{selectedDay} - {currentWorkout.type} Day</h2>
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Total: {currentWorkout.duration.total} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4" />
                  <span>Incl. 15 min shower</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Day Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Workout Day</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {workoutDays.map(day => {
              const workout = workoutSchedule[day as keyof typeof workoutSchedule];
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-3 rounded-lg transition-colors flex-1 min-w-[140px] ${
                    selectedDay === day
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <div className="text-sm">{day}</div>
                  <Badge
                    variant="outline"
                    className={`mt-1 ${
                      selectedDay === day ? "border-white text-white" : ""
                    }`}
                  >
                    {workout.type}
                  </Badge>
                  <div className="text-xs mt-1 flex items-center justify-center gap-1">
                    <Clock className="h-3 w-3" />
                    {workout.duration.total} min
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Duration Breakdown */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Time Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl text-purple-600">{currentWorkout.duration.warmup}</div>
              <div className="text-xs text-slate-600 mt-1">Warm-Up</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl text-purple-600">{currentWorkout.duration.mainExercises}</div>
              <div className="text-xs text-slate-600 mt-1">Main Work</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl text-purple-600">{currentWorkout.duration.coreCardio}</div>
              <div className="text-xs text-slate-600 mt-1">Core/Cardio</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl text-purple-600">{currentWorkout.duration.cooldown}</div>
              <div className="text-xs text-slate-600 mt-1">Cooldown</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl text-purple-600">{currentWorkout.duration.shower}</div>
              <div className="text-xs text-slate-600 mt-1">Shower</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-lg">
              <div className="text-2xl">{currentWorkout.duration.total}</div>
              <div className="text-xs mt-1">Total Min</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Card */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-700">Today's Progress</span>
            <span className="text-2xl text-green-600">{getCompletionPercentage()}%</span>
          </div>
          <div className="h-3 bg-white rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
              style={{ width: `${getCompletionPercentage()}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Workout Sections */}
      <div className="space-y-4">
        {currentWorkout.sections.map((section, sectionIndex) => (
          <Card key={sectionIndex}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {section.category === "Warm-Up" && "🔥"}
                {section.category === "Main Exercises" && "💪"}
                {section.category === "Core & Cardio" && "🏃"}
                {section.category === "Cooldown" && "🧘"}
                {section.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {section.exercises.map((exercise, exerciseIndex) => {
                  const exerciseKey = `${selectedDay}-${sectionIndex}-${exerciseIndex}`;
                  return (
                    <div
                      key={exerciseIndex}
                      className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <Checkbox
                        id={exerciseKey}
                        checked={checkedExercises[exerciseKey] || false}
                        onCheckedChange={() => toggleExercise(exerciseKey)}
                        className="mt-1"
                      />
                      <label
                        htmlFor={exerciseKey}
                        className="flex-1 cursor-pointer"
                      >
                        <div className={`flex items-center justify-between ${checkedExercises[exerciseKey] ? "line-through text-slate-500" : ""}`}>
                          <div className="font-medium">{exercise.name}</div>
                          {(exercise as any).estimatedTime && (
                            <Badge variant="outline" className="ml-2">
                              <Clock className="h-3 w-3 mr-1" />
                              {(exercise as any).estimatedTime}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-slate-600 mt-1">
                          {exercise.details}
                        </div>
                        {(exercise as any).rest && (
                          <div className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            {(exercise as any).rest}
                          </div>
                        )}
                      </label>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rest Days Info */}
      <Card className="bg-slate-50">
        <CardContent className="pt-6">
          <div className="text-center text-slate-600">
            <p className="mb-2">🌟 <strong>Rest Days:</strong> Sunday & Monday</p>
            <p className="text-sm">Recovery is essential for muscle growth and preventing injury.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}