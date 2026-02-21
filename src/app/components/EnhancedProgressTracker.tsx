import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Scale, Target, CheckCircle2, Calendar, Ruler, TrendingDown, Activity } from "lucide-react";

interface DailyWeightEntry {
  date: string;
  day: string;
  morningWeight: string;
  eodWeight: string;
  notes: string;
}

interface WeeklyMeasurements {
  weekStartDate: string;
  weight: string;
  chest: string;
  waist: string;
  hips: string;
  thighs: string;
  arms: string;
  notes: string;
}

export function EnhancedProgressTracker() {
  const [dailyEntries, setDailyEntries] = useState<DailyWeightEntry[]>([]);
  const [weeklyMeasurements, setWeeklyMeasurements] = useState<WeeklyMeasurements[]>([]);
  
  // Daily entry form state
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [morningWeight, setMorningWeight] = useState("");
  const [eodWeight, setEodWeight] = useState("");
  const [dailyNotes, setDailyNotes] = useState("");

  // Weekly measurements form state
  const [weekWeight, setWeekWeight] = useState("");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [hips, setHips] = useState("");
  const [thighs, setThighs] = useState("");
  const [arms, setArms] = useState("");
  const [weeklyNotes, setWeeklyNotes] = useState("");

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const addDailyEntry = () => {
    if (!morningWeight && !eodWeight) {
      alert("Please enter at least one weight measurement");
      return;
    }

    const newEntry: DailyWeightEntry = {
      date: new Date().toLocaleDateString(),
      day: selectedDay,
      morningWeight,
      eodWeight,
      notes: dailyNotes
    };

    setDailyEntries([newEntry, ...dailyEntries]);
    
    // Reset form
    setMorningWeight("");
    setEodWeight("");
    setDailyNotes("");
  };

  const addWeeklyMeasurements = () => {
    if (!weekWeight) {
      alert("Please enter at least your weight");
      return;
    }

    const newMeasurement: WeeklyMeasurements = {
      weekStartDate: new Date().toLocaleDateString(),
      weight: weekWeight,
      chest,
      waist,
      hips,
      thighs,
      arms,
      notes: weeklyNotes
    };

    setWeeklyMeasurements([newMeasurement, ...weeklyMeasurements]);
    
    // Reset form
    setWeekWeight("");
    setChest("");
    setWaist("");
    setHips("");
    setThighs("");
    setArms("");
    setWeeklyNotes("");
  };

  const getWeightDifference = (morning: string, eod: string) => {
    if (!morning || !eod) return null;
    const diff = parseFloat(eod) - parseFloat(morning);
    return diff.toFixed(1);
  };

  const getWeeklyTrend = () => {
    if (weeklyMeasurements.length < 2) return null;
    const latest = parseFloat(weeklyMeasurements[0].weight);
    const previous = parseFloat(weeklyMeasurements[1].weight);
    return (latest - previous).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Latest Morning Weight</p>
                <p className="text-3xl text-blue-600">
                  {dailyEntries.length > 0 && dailyEntries[0].morningWeight 
                    ? `${dailyEntries[0].morningWeight} lbs` 
                    : "—"}
                </p>
              </div>
              <Scale className="h-10 w-10 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Weekly Change</p>
                <p className="text-3xl text-green-600">
                  {getWeeklyTrend() !== null
                    ? `${parseFloat(getWeeklyTrend()!) > 0 ? "+" : ""}${getWeeklyTrend()} lbs`
                    : "—"}
                </p>
              </div>
              <TrendingDown className="h-10 w-10 text-green-600 opacity-50" />
            </div>
            {getWeeklyTrend() !== null && (
              <div className="mt-2">
                <Badge variant={parseFloat(getWeeklyTrend()!) < 0 ? "default" : "secondary"}>
                  {parseFloat(getWeeklyTrend()!) <= -1.0 && parseFloat(getWeeklyTrend()!) >= -1.5 
                    ? "Perfect! 🎯" 
                    : parseFloat(getWeeklyTrend()!) < -1.5 
                    ? "Too fast ⚠️" 
                    : parseFloat(getWeeklyTrend()!) > 0
                    ? "Adjust diet 📉"
                    : "Slow progress 🐢"}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Entries</p>
                <p className="text-3xl text-purple-600">{dailyEntries.length}</p>
              </div>
              <Calendar className="h-10 w-10 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Daily vs Weekly */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="daily">Daily Weight Tracking</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Measurements</TabsTrigger>
        </TabsList>

        {/* Daily Weight Tab */}
        <TabsContent value="daily" className="space-y-6">
          {/* Daily Entry Form */}
          <Card>
            <CardHeader>
              <CardTitle>Log Today's Weight</CardTitle>
              <CardDescription>Track your morning and end-of-day weight to understand daily fluctuations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Day Selector */}
              <div>
                <Label>Select Day</Label>
                <div className="grid grid-cols-7 gap-2 mt-2">
                  {weekDays.map(day => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-2 py-2 rounded text-sm transition-colors ${
                        selectedDay === day
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight Inputs */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="morning-weight">Morning Weight (lbs)</Label>
                  <Input
                    id="morning-weight"
                    type="number"
                    step="0.1"
                    placeholder="Enter AM weight..."
                    value={morningWeight}
                    onChange={(e) => setMorningWeight(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-xs text-slate-500 mt-1">Weigh after waking up, after bathroom</p>
                </div>

                <div>
                  <Label htmlFor="eod-weight">End of Day Weight (lbs)</Label>
                  <Input
                    id="eod-weight"
                    type="number"
                    step="0.1"
                    placeholder="Enter EOD weight..."
                    value={eodWeight}
                    onChange={(e) => setEodWeight(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-xs text-slate-500 mt-1">Weigh before bed</p>
                </div>
              </div>

              {/* Daily Notes */}
              <div>
                <Label htmlFor="daily-notes">Daily Notes (optional)</Label>
                <Textarea
                  id="daily-notes"
                  placeholder="How did you feel today? Energy levels, hunger, mood?"
                  value={dailyNotes}
                  onChange={(e) => setDailyNotes(e.target.value)}
                  className="mt-2"
                  rows={2}
                />
              </div>

              <Button onClick={addDailyEntry} className="w-full" size="lg">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Save Daily Entry
              </Button>
            </CardContent>
          </Card>

          {/* Variables Explanation */}
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Understanding Daily Weight Fluctuations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="p-3 bg-white rounded-lg">
                <strong className="text-amber-900">💧 Water Retention:</strong>
                <p className="text-slate-700 mt-1">Can add 2-5 lbs. Affected by sodium intake, carbs, menstrual cycle, and exercise.</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <strong className="text-amber-900">🍽️ Food Weight:</strong>
                <p className="text-slate-700 mt-1">Undigested food can add 1-3 lbs. Weight is lowest in morning before eating.</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <strong className="text-amber-900">💪 Muscle Inflammation:</strong>
                <p className="text-slate-700 mt-1">Post-workout inflammation can temporarily increase weight by 1-2 lbs.</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <strong className="text-amber-900">⏰ Consistency is Key:</strong>
                <p className="text-slate-700 mt-1">Always weigh at same time, same conditions. Focus on weekly averages, not daily changes.</p>
              </div>
            </CardContent>
          </Card>

          {/* Daily History */}
          {dailyEntries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Daily Weight History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dailyEntries.map((entry, index) => {
                    const diff = getWeightDifference(entry.morningWeight, entry.eodWeight);
                    return (
                      <div
                        key={index}
                        className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-slate-500" />
                            <div>
                              <span className="font-medium">{entry.day}</span>
                              <span className="text-sm text-slate-500 ml-2">{entry.date}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-3">
                          {entry.morningWeight && (
                            <div className="text-center p-2 bg-blue-50 rounded">
                              <div className="text-xs text-slate-600 mb-1">Morning</div>
                              <div className="text-lg text-blue-600">{entry.morningWeight} lbs</div>
                            </div>
                          )}
                          {entry.eodWeight && (
                            <div className="text-center p-2 bg-purple-50 rounded">
                              <div className="text-xs text-slate-600 mb-1">End of Day</div>
                              <div className="text-lg text-purple-600">{entry.eodWeight} lbs</div>
                            </div>
                          )}
                          {diff && (
                            <div className="text-center p-2 bg-amber-50 rounded">
                              <div className="text-xs text-slate-600 mb-1">Daily Change</div>
                              <div className="text-lg text-amber-600">
                                {parseFloat(diff) > 0 ? "+" : ""}{diff} lbs
                              </div>
                            </div>
                          )}
                        </div>

                        {entry.notes && (
                          <div className="p-3 bg-white rounded border border-slate-200">
                            <p className="text-sm text-slate-700">{entry.notes}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Weekly Measurements Tab */}
        <TabsContent value="weekly" className="space-y-6">
          {/* Target Guide */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="text-lg mb-2">Weekly Check-In Day</h3>
                <div className="text-3xl text-green-600 mb-2">Every Sunday</div>
                <p className="text-sm text-slate-600">Take measurements at the same time each week for consistency</p>
              </div>
            </CardContent>
          </Card>

          {/* Measurements Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                Weekly Body Measurements
              </CardTitle>
              <CardDescription>Track your progress beyond the scale</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="week-weight">Weight (lbs) *</Label>
                <Input
                  id="week-weight"
                  type="number"
                  step="0.1"
                  placeholder="Enter your weight..."
                  value={weekWeight}
                  onChange={(e) => setWeekWeight(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="chest">Chest (inches)</Label>
                  <Input
                    id="chest"
                    type="number"
                    step="0.25"
                    placeholder="Around fullest part"
                    value={chest}
                    onChange={(e) => setChest(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="waist">Waist (inches)</Label>
                  <Input
                    id="waist"
                    type="number"
                    step="0.25"
                    placeholder="Around belly button"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="hips">Hips (inches)</Label>
                  <Input
                    id="hips"
                    type="number"
                    step="0.25"
                    placeholder="Around fullest part"
                    value={hips}
                    onChange={(e) => setHips(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="thighs">Thighs (inches)</Label>
                  <Input
                    id="thighs"
                    type="number"
                    step="0.25"
                    placeholder="Around fullest part"
                    value={thighs}
                    onChange={(e) => setThighs(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="arms">Arms (inches)</Label>
                  <Input
                    id="arms"
                    type="number"
                    step="0.25"
                    placeholder="Around bicep flexed"
                    value={arms}
                    onChange={(e) => setArms(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="weekly-notes">Weekly Notes</Label>
                <Textarea
                  id="weekly-notes"
                  placeholder="How was this week? Progress photos taken? Energy levels?"
                  value={weeklyNotes}
                  onChange={(e) => setWeeklyNotes(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>

              <Button onClick={addWeeklyMeasurements} className="w-full" size="lg">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Save Weekly Measurements
              </Button>
            </CardContent>
          </Card>

          {/* Measurement Tips */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle>Measurement Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">📏</span>
                  <p><strong>Same time:</strong> Measure in the morning before eating</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">📸</span>
                  <p><strong>Progress photos:</strong> Take photos in same lighting/pose weekly</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">🎯</span>
                  <p><strong>Same spots:</strong> Use birthmarks/tattoos as reference points</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">💡</span>
                  <p><strong>Tape measure:</strong> Keep tape snug but not tight</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Weekly History */}
          {weeklyMeasurements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Weekly Measurement History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyMeasurements.map((measurement, index) => (
                    <div
                      key={index}
                      className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Calendar className="h-5 w-5 text-slate-500" />
                        <span className="font-medium">{measurement.weekStartDate}</span>
                        {index === 0 && <Badge>Latest</Badge>}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                        <div className="p-2 bg-white rounded text-center">
                          <div className="text-xs text-slate-600 mb-1">Weight</div>
                          <div className="text-lg text-blue-600">{measurement.weight} lbs</div>
                        </div>
                        {measurement.chest && (
                          <div className="p-2 bg-white rounded text-center">
                            <div className="text-xs text-slate-600 mb-1">Chest</div>
                            <div className="text-lg">{measurement.chest}"</div>
                          </div>
                        )}
                        {measurement.waist && (
                          <div className="p-2 bg-white rounded text-center">
                            <div className="text-xs text-slate-600 mb-1">Waist</div>
                            <div className="text-lg">{measurement.waist}"</div>
                          </div>
                        )}
                        {measurement.hips && (
                          <div className="p-2 bg-white rounded text-center">
                            <div className="text-xs text-slate-600 mb-1">Hips</div>
                            <div className="text-lg">{measurement.hips}"</div>
                          </div>
                        )}
                        {measurement.thighs && (
                          <div className="p-2 bg-white rounded text-center">
                            <div className="text-xs text-slate-600 mb-1">Thighs</div>
                            <div className="text-lg">{measurement.thighs}"</div>
                          </div>
                        )}
                        {measurement.arms && (
                          <div className="p-2 bg-white rounded text-center">
                            <div className="text-xs text-slate-600 mb-1">Arms</div>
                            <div className="text-lg">{measurement.arms}"</div>
                          </div>
                        )}
                      </div>

                      {measurement.notes && (
                        <div className="p-3 bg-white rounded border border-slate-200">
                          <p className="text-sm text-slate-700">{measurement.notes}</p>
                        </div>
                      )}

                      {/* Show changes from previous week */}
                      {index > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <p className="text-xs text-slate-600 mb-2">Changes from previous week:</p>
                          <div className="flex flex-wrap gap-2">
                            {measurement.weight && weeklyMeasurements[index - 1].weight && (
                              <Badge variant="outline">
                                Weight: {(parseFloat(measurement.weight) - parseFloat(weeklyMeasurements[index - 1].weight)).toFixed(1)} lbs
                              </Badge>
                            )}
                            {measurement.waist && weeklyMeasurements[index - 1].waist && (
                              <Badge variant="outline">
                                Waist: {(parseFloat(measurement.waist) - parseFloat(weeklyMeasurements[index - 1].waist)).toFixed(2)}"
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
