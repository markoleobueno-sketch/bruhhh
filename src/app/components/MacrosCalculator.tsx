import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Calculator, TrendingDown, Activity } from "lucide-react";

export function MacrosCalculator() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [gender, setGender] = useState("female");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [goal, setGoal] = useState("loss");
  const [results, setResults] = useState<any>(null);

  const calculateMacros = () => {
    if (!age || !weight || !heightFeet) {
      alert("Please fill in all required fields");
      return;
    }

    const weightKg = parseFloat(weight) * 0.453592;
    const heightCm = (parseFloat(heightFeet) * 12 + parseFloat(heightInches || "0")) * 2.54;
    const ageNum = parseFloat(age);

    // BMR Calculation (Mifflin-St Jeor Equation)
    let bmr;
    if (gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
    } else if (gender === "nonbinary") {
      // Average of male and female Mifflin-St Jeor formulas
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 78;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
    }

    // Activity multiplier
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };

    const tdee = bmr * activityMultipliers[activityLevel];

    // Goal adjustments
    let targetCalories = tdee;
    if (goal === "loss") {
      targetCalories = tdee - 500; // 500 calorie deficit for ~1 lb/week loss
    } else if (goal === "gain") {
      targetCalories = tdee + 300; // 300 calorie surplus for lean gains
    }

    // Macro calculations
    const proteinGrams = parseFloat(weight) * 1.0; // 1g per lb body weight
    const proteinCalories = proteinGrams * 4;

    const fatGrams = parseFloat(weight) * 0.35; // 0.35g per lb
    const fatCalories = fatGrams * 9;

    const carbCalories = targetCalories - proteinCalories - fatCalories;
    const carbGrams = carbCalories / 4;

    const fiberGrams = 25 + (carbGrams / 100) * 5; // Scale with carbs

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      protein: Math.round(proteinGrams),
      carbs: Math.round(carbGrams),
      fat: Math.round(fatGrams),
      fiber: Math.round(fiberGrams),
      currentPlanCalories: 1075,
      currentPlanProtein: 104,
      currentPlanCarbs: 127,
      currentPlanFat: 16,
      currentPlanFiber: 11
    });
  };

  const getDeficitSurplus = () => {
    if (!results) return null;
    const diff = results.currentPlanCalories - results.targetCalories;
    return diff;
  };

  return (
    <div className="space-y-6">
      {/* Calculator Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            Macros & TDEE Calculator
          </CardTitle>
          <CardDescription>
            Calculate your personalized daily calorie and macro needs based on your stats and goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="25"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="weight">Current Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="150"
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Height</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <Input
                      type="number"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(e.target.value)}
                      placeholder="Feet"
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      value={heightInches}
                      onChange={(e) => setHeightInches(e.target.value)}
                      placeholder="Inches"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="nonbinary">Non-Binary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="activity">Activity Level</Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                    <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                    <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                    <SelectItem value="veryActive">Very Active (2x per day)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="goal">Goal</Label>
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="loss">Weight Loss (1 lb/week)</SelectItem>
                    <SelectItem value="maintain">Maintain Weight</SelectItem>
                    <SelectItem value="gain">Lean Gain (0.5 lb/week)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-8">
                <Button onClick={calculateMacros} className="w-full" size="lg">
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculate My Macros
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <>
          {/* Energy Calculations */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle>Your Energy Needs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-sm text-slate-600 mb-2">BMR (Basal Metabolic Rate)</div>
                  <div className="text-3xl text-blue-600">{results.bmr}</div>
                  <div className="text-xs text-slate-500 mt-1">calories/day at rest</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-600 mb-2">TDEE (Total Daily Energy)</div>
                  <div className="text-3xl text-blue-600">{results.tdee}</div>
                  <div className="text-xs text-slate-500 mt-1">calories/day with activity</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-600 mb-2">Target Calories</div>
                  <div className="text-3xl text-blue-600">{results.targetCalories}</div>
                  <div className="text-xs text-slate-500 mt-1">for your goal</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Macros */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Daily Macros</CardTitle>
              <CardDescription>Based on your stats and goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-center">
                  <div className="text-3xl mb-1">🔥</div>
                  <div className="text-2xl text-red-600">{results.targetCalories}</div>
                  <div className="text-sm text-slate-600">Calories</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
                  <div className="text-3xl mb-1">💪</div>
                  <div className="text-2xl text-blue-600">{results.protein}g</div>
                  <div className="text-sm text-slate-600">Protein</div>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-center">
                  <div className="text-3xl mb-1">🌾</div>
                  <div className="text-2xl text-amber-600">{results.carbs}g</div>
                  <div className="text-sm text-slate-600">Carbs</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                  <div className="text-3xl mb-1">🥑</div>
                  <div className="text-2xl text-green-600">{results.fat}g</div>
                  <div className="text-sm text-slate-600">Fat</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Plan Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Current Plan vs. Recommended
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left p-3">Nutrient</th>
                      <th className="text-center p-3">Current Plan</th>
                      <th className="text-center p-3">Recommended</th>
                      <th className="text-center p-3">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-3">Calories</td>
                      <td className="text-center p-3">{results.currentPlanCalories}</td>
                      <td className="text-center p-3">{results.targetCalories}</td>
                      <td className="text-center p-3">
                        <Badge variant={getDeficitSurplus()! < 0 ? "default" : "secondary"}>
                          {getDeficitSurplus()! > 0 ? "+" : ""}{getDeficitSurplus()}
                        </Badge>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3">Protein (g)</td>
                      <td className="text-center p-3">{results.currentPlanProtein}</td>
                      <td className="text-center p-3">{results.protein}</td>
                      <td className="text-center p-3">
                        <Badge variant={results.currentPlanProtein >= results.protein ? "default" : "secondary"}>
                          {results.currentPlanProtein - results.protein > 0 ? "+" : ""}
                          {results.currentPlanProtein - results.protein}
                        </Badge>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3">Carbs (g)</td>
                      <td className="text-center p-3">{results.currentPlanCarbs}</td>
                      <td className="text-center p-3">{results.carbs}</td>
                      <td className="text-center p-3">
                        <Badge variant="outline">
                          {results.currentPlanCarbs - results.carbs > 0 ? "+" : ""}
                          {results.currentPlanCarbs - results.carbs}
                        </Badge>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3">Fat (g)</td>
                      <td className="text-center p-3">{results.currentPlanFat}</td>
                      <td className="text-center p-3">{results.fat}</td>
                      <td className="text-center p-3">
                        <Badge variant="outline">
                          {results.currentPlanFat - results.fat > 0 ? "+" : ""}
                          {results.currentPlanFat - results.fat}
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start gap-3">
                  <Activity className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm mb-2">Analysis</h4>
                    <p className="text-sm text-slate-700">
                      {getDeficitSurplus()! < -200 && 
                        "Your current plan creates a significant calorie deficit, which may lead to faster weight loss. Monitor your energy levels and adjust if needed."}
                      {getDeficitSurplus()! >= -200 && getDeficitSurplus()! < 0 && 
                        "Your current plan aligns well with your weight loss goals. Continue monitoring progress weekly."}
                      {getDeficitSurplus()! >= 0 && 
                        "Your current plan may not create enough deficit for weight loss. Consider reducing rice portions to 1/2 cup as suggested in the meal prep guide."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}