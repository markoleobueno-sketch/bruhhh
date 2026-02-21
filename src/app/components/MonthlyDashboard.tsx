import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { BarChart3, Calendar, TrendingDown, Award, Dumbbell, UtensilsCrossed, Target } from "lucide-react";

export function MonthlyDashboard() {
  // Mock data - in real app, this would come from logged entries
  const monthlyStats = {
    totalWorkouts: 16,
    plannedWorkouts: 20,
    workoutCompletionRate: 80,
    totalWorkoutTime: 1712, // minutes
    avgWorkoutTime: 107,
    
    mealsTracked: 28,
    totalDays: 30,
    mealCompletionRate: 93,
    avgDailyCalories: 1075,
    avgDailyProtein: 104,
    
    startingWeight: 155.2,
    currentWeight: 150.8,
    totalWeightLoss: 4.4,
    avgWeeklyLoss: 1.1,
    
    measurements: {
      chestLost: 1.5,
      waistLost: 2.0,
      hipsLost: 1.0,
      thighsLost: 0.8,
      armsGained: 0.3
    }
  };

  const weeks = [
    { week: "Week 1", weight: 155.2, loss: 0, workouts: 4, mealsCompleted: 7 },
    { week: "Week 2", weight: 153.8, loss: 1.4, workouts: 4, mealsCompleted: 7 },
    { week: "Week 3", weight: 152.5, loss: 1.3, workouts: 4, mealsCompleted: 7 },
    { week: "Week 4", weight: 150.8, loss: 1.7, workouts: 4, mealsCompleted: 7 }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <Card className="bg-gradient-to-br from-purple-600 to-purple-800 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl mb-2">Monthly Summary</h2>
              <p className="text-purple-100">February 2026 - Your Complete Progress Report</p>
            </div>
            <Calendar className="h-16 w-16 opacity-50" />
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <TrendingDown className="h-8 w-8 text-green-600" />
              <Badge className="bg-green-600">Success!</Badge>
            </div>
            <div className="text-3xl text-green-600 mb-1">{monthlyStats.totalWeightLoss} lbs</div>
            <div className="text-sm text-slate-600">Total Weight Lost</div>
            <div className="text-xs text-slate-500 mt-1">Avg: {monthlyStats.avgWeeklyLoss} lbs/week</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <Dumbbell className="h-8 w-8 text-blue-600" />
              <Badge variant="outline">{monthlyStats.workoutCompletionRate}%</Badge>
            </div>
            <div className="text-3xl text-blue-600 mb-1">{monthlyStats.totalWorkouts}</div>
            <div className="text-sm text-slate-600">Workouts Completed</div>
            <div className="text-xs text-slate-500 mt-1">of {monthlyStats.plannedWorkouts} planned</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <UtensilsCrossed className="h-8 w-8 text-orange-600" />
              <Badge variant="outline">{monthlyStats.mealCompletionRate}%</Badge>
            </div>
            <div className="text-3xl text-orange-600 mb-1">{monthlyStats.mealsTracked}</div>
            <div className="text-sm text-slate-600">Days Tracked</div>
            <div className="text-xs text-slate-500 mt-1">of {monthlyStats.totalDays} days</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <Award className="h-8 w-8 text-purple-600" />
              <Badge className="bg-purple-600">💪</Badge>
            </div>
            <div className="text-3xl text-purple-600 mb-1">{(monthlyStats.totalWorkoutTime / 60).toFixed(1)}h</div>
            <div className="text-sm text-slate-600">Time Invested</div>
            <div className="text-xs text-slate-500 mt-1">{monthlyStats.totalWorkoutTime} minutes total</div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Weekly Breakdown
          </CardTitle>
          <CardDescription>Track your progress across each week of the month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeks.map((week, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{week.week}</Badge>
                    <span className="text-sm text-slate-600">Weight: {week.weight} lbs</span>
                  </div>
                  {week.loss > 0 && (
                    <Badge className="bg-green-600">
                      -{week.loss} lbs
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Workouts</span>
                      <Dumbbell className="h-4 w-4 text-blue-600" />
                    </div>
                    <Progress value={(week.workouts / 5) * 100} className="mb-2" />
                    <div className="text-xs text-slate-500">{week.workouts} of 5 completed</div>
                  </div>

                  <div className="p-3 bg-white rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Meals Tracked</span>
                      <UtensilsCrossed className="h-4 w-4 text-orange-600" />
                    </div>
                    <Progress value={(week.mealsCompleted / 7) * 100} className="mb-2" />
                    <div className="text-xs text-slate-500">{week.mealsCompleted} of 7 days</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nutrition Summary</CardTitle>
            <CardDescription>Average daily intake this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <div className="text-sm text-slate-600">Calories</div>
                  <div className="text-2xl text-red-600">{monthlyStats.avgDailyCalories}</div>
                </div>
                <div className="text-3xl">🔥</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="text-sm text-slate-600">Protein</div>
                  <div className="text-2xl text-blue-600">{monthlyStats.avgDailyProtein}g</div>
                </div>
                <div className="text-3xl">💪</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-900 mb-1">
                  <strong>Consistency:</strong> {monthlyStats.mealCompletionRate}%
                </div>
                <Progress value={monthlyStats.mealCompletionRate} className="bg-green-200" />
                <p className="text-xs text-slate-600 mt-2">
                  Great job sticking to your meal plan! Consistency is key to results.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Body Measurements</CardTitle>
            <CardDescription>Changes this month (in inches)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm">Chest</span>
                <Badge variant="outline" className="text-green-600">
                  -{monthlyStats.measurements.chestLost}"
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm">Waist</span>
                <Badge variant="outline" className="text-green-600">
                  -{monthlyStats.measurements.waistLost}"
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm">Hips</span>
                <Badge variant="outline" className="text-green-600">
                  -{monthlyStats.measurements.hipsLost}"
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm">Thighs</span>
                <Badge variant="outline" className="text-green-600">
                  -{monthlyStats.measurements.thighsLost}"
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm">Arms</span>
                <Badge variant="outline" className="text-blue-600">
                  +{monthlyStats.measurements.armsGained}"
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements & Insights */}
      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Monthly Achievements & Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium mb-2">🎉 Achievements</h4>
              <div className="p-3 bg-white rounded-lg">
                <p className="text-sm">✅ Lost {monthlyStats.totalWeightLoss} lbs - Excellent progress!</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="text-sm">✅ Completed {monthlyStats.totalWorkouts} workouts - Great consistency!</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="text-sm">✅ Tracked meals for {monthlyStats.mealsTracked} days - Outstanding discipline!</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="text-sm">✅ Lost 2" from waist - Major NSV (Non-Scale Victory)!</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium mb-2">💡 Insights & Recommendations</h4>
              <div className="p-3 bg-white rounded-lg">
                <p className="text-sm"><strong>Weight Loss Trend:</strong> Your avg loss of {monthlyStats.avgWeeklyLoss} lbs/week is perfect for sustainable fat loss.</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="text-sm"><strong>Workout Consistency:</strong> {monthlyStats.workoutCompletionRate}% completion rate. Aim for 100% next month!</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="text-sm"><strong>Body Composition:</strong> Arms increased while losing weight - you're building muscle!</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="text-sm"><strong>Next Month Goal:</strong> Continue current plan. Consider adding 0.25 cups more rice if energy drops.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goal Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goal Progress Tracker
          </CardTitle>
          <CardDescription>How close are you to your overall goals?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Weight Loss Goal (10 lbs in 8 weeks)</span>
              <span className="text-sm font-medium">{monthlyStats.totalWeightLoss} / 10 lbs</span>
            </div>
            <Progress value={(monthlyStats.totalWeightLoss / 10) * 100} className="mb-2" />
            <p className="text-xs text-slate-500">
              {((monthlyStats.totalWeightLoss / 10) * 100).toFixed(0)}% complete - {(10 - monthlyStats.totalWeightLoss).toFixed(1)} lbs to go
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Workout Streak Goal (80% completion)</span>
              <span className="text-sm font-medium">{monthlyStats.workoutCompletionRate}%</span>
            </div>
            <Progress value={monthlyStats.workoutCompletionRate} className="mb-2" />
            <p className="text-xs text-slate-500">
              On track! Keep up the great work.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Waist Reduction Goal (3 inches)</span>
              <span className="text-sm font-medium">{monthlyStats.measurements.waistLost} / 3 inches</span>
            </div>
            <Progress value={(monthlyStats.measurements.waistLost / 3) * 100} className="mb-2" />
            <p className="text-xs text-slate-500">
              {((monthlyStats.measurements.waistLost / 3) * 100).toFixed(0)}% complete - {(3 - monthlyStats.measurements.waistLost).toFixed(1)}" to go
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
