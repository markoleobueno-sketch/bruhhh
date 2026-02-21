import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const mealPlanData = {
  Monday: {
    meals: [
      {
        name: "Oatmeal + Shake",
        time: "Breakfast",
        items: [
          "0.5 cup oats (150 cal, 5g protein)",
          "1 cup water",
          "1 Vanilla Shake (130 cal, 24g protein)"
        ],
        calories: 280,
        protein: 29
      },
      {
        name: "Turkey, Rice, Broccoli",
        time: "Lunch",
        items: [
          "3 oz ground turkey 93% lean (130 cal, 17g protein)",
          "3/4 cup rice (155 cal, 3g protein)",
          "1 cup broccoli (55 cal, 4g protein)"
        ],
        calories: 340,
        protein: 24
      },
      {
        name: "Chicken, Rice, Broccoli",
        time: "Dinner",
        items: [
          "3 oz chicken breast (105 cal, 20g protein)",
          "3/4 cup rice (155 cal, 3g protein)",
          "1 cup broccoli (55 cal, 4g protein)"
        ],
        calories: 315,
        protein: 27
      },
      {
        name: "Chocolate Shake",
        time: "Snack",
        items: [
          "1 Optimum Nutrition Shake (140 cal, 24g protein)"
        ],
        calories: 140,
        protein: 24
      }
    ],
    totals: {
      calories: 1075,
      protein: 104,
      carbs: 127,
      fat: 16,
      fiber: 11
    }
  }
};

// Apply same data structure to all days
const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const fullWeekData: any = {};

weekDays.forEach(day => {
  fullWeekData[day] = mealPlanData.Monday; // All days have same meal plan
});

export function MealPlanView() {
  const [selectedDay, setSelectedDay] = useState("Monday");

  const currentDayData = fullWeekData[selectedDay];

  return (
    <div className="space-y-6">
      {/* Day Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Day</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedDay === day
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Summary */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader>
          <CardTitle>{selectedDay} Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-1">🔥</div>
              <div className="text-2xl text-blue-600">{currentDayData.totals.calories}</div>
              <div className="text-sm text-slate-600">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-1">💪</div>
              <div className="text-2xl text-blue-600">{currentDayData.totals.protein}g</div>
              <div className="text-sm text-slate-600">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-1">🌾</div>
              <div className="text-2xl text-blue-600">{currentDayData.totals.carbs}g</div>
              <div className="text-sm text-slate-600">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-1">🥑</div>
              <div className="text-2xl text-blue-600">{currentDayData.totals.fat}g</div>
              <div className="text-sm text-slate-600">Fat</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-1">🥬</div>
              <div className="text-2xl text-blue-600">{currentDayData.totals.fiber}g</div>
              <div className="text-sm text-slate-600">Fiber</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meals */}
      <div className="grid md:grid-cols-2 gap-6">
        {currentDayData.meals.map((meal: any, index: number) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="mb-2" variant="outline">{meal.time}</Badge>
                  <CardTitle className="text-xl">{meal.name}</CardTitle>
                </div>
                <div className="text-right">
                  <div className="text-2xl text-blue-600">{meal.calories}</div>
                  <div className="text-xs text-slate-500">calories</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {meal.items.map((item: string, itemIndex: number) => (
                  <li key={itemIndex} className="text-sm text-slate-700 flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Protein</span>
                  <span className="text-blue-600">{meal.protein}g</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
