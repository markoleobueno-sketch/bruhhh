import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Scale, Target, CheckCircle2, Calendar } from "lucide-react";

interface DailyEntry {
  date: string;
  bodyWeight: string;
  tasks: string[];
  taskStatuses: string[];
  notes: string;
}

export function ProgressTracker() {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [currentWeight, setCurrentWeight] = useState("");
  const [currentTasks, setCurrentTasks] = useState(["", "", "", "", ""]);
  const [currentStatuses, setCurrentStatuses] = useState(["", "", "", "", ""]);
  const [currentNotes, setCurrentNotes] = useState("");

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const addEntry = () => {
    if (!currentWeight) {
      alert("Please enter your body weight");
      return;
    }

    const newEntry: DailyEntry = {
      date: new Date().toLocaleDateString(),
      bodyWeight: currentWeight,
      tasks: currentTasks,
      taskStatuses: currentStatuses,
      notes: currentNotes
    };

    setEntries([newEntry, ...entries]);
    
    // Reset form
    setCurrentWeight("");
    setCurrentTasks(["", "", "", "", ""]);
    setCurrentStatuses(["", "", "", "", ""]);
    setCurrentNotes("");
  };

  const updateTask = (index: number, value: string) => {
    const newTasks = [...currentTasks];
    newTasks[index] = value;
    setCurrentTasks(newTasks);
  };

  const updateStatus = (index: number, value: string) => {
    const newStatuses = [...currentStatuses];
    newStatuses[index] = value;
    setCurrentStatuses(newStatuses);
  };

  const getWeightTrend = () => {
    if (entries.length < 2) return null;
    const latest = parseFloat(entries[0].bodyWeight);
    const previous = parseFloat(entries[1].bodyWeight);
    const diff = latest - previous;
    return diff;
  };

  const weightTrend = getWeightTrend();

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Current Weight</p>
                <p className="text-3xl text-blue-600">
                  {entries.length > 0 ? `${entries[0].bodyWeight} lbs` : "—"}
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
                <p className="text-sm text-slate-600 mb-1">Weight Change</p>
                <p className="text-3xl text-green-600">
                  {weightTrend !== null
                    ? `${weightTrend > 0 ? "+" : ""}${weightTrend.toFixed(1)} lbs`
                    : "—"}
                </p>
              </div>
              <Target className="h-10 w-10 text-green-600 opacity-50" />
            </div>
            {weightTrend !== null && (
              <div className="mt-2">
                <Badge variant={weightTrend < 0 ? "default" : "secondary"}>
                  {weightTrend < 0 ? "On Track! 🎯" : "Adjust calories"}
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
                <p className="text-3xl text-purple-600">{entries.length}</p>
              </div>
              <Calendar className="h-10 w-10 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Target */}
      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <Target className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <h3 className="text-lg mb-2">Weekly Weight Loss Goal</h3>
            <div className="text-3xl text-amber-600 mb-2">1.0 - 1.5 lbs</div>
            <p className="text-sm text-slate-600">Aim for consistent, sustainable progress</p>
          </div>
        </CardContent>
      </Card>

      {/* New Entry Form */}
      <Card>
        <CardHeader>
          <CardTitle>Log Today's Progress</CardTitle>
          <CardDescription>Track your daily weight, tasks, and notes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Body Weight */}
          <div>
            <Label htmlFor="weight">Body Weight (lbs)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="Enter your weight..."
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Daily Tasks */}
          <div>
            <Label className="mb-3 block">Daily Tasks & Status</Label>
            <div className="space-y-3">
              {[0, 1, 2, 3, 4].map((index) => (
                <div key={index} className="grid md:grid-cols-2 gap-3">
                  <Input
                    placeholder={`Task ${index + 1}`}
                    value={currentTasks[index]}
                    onChange={(e) => updateTask(index, e.target.value)}
                  />
                  <Input
                    placeholder="Status"
                    value={currentStatuses[index]}
                    onChange={(e) => updateStatus(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="How are you feeling? Any challenges or wins?"
              value={currentNotes}
              onChange={(e) => setCurrentNotes(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>

          <Button onClick={addEntry} className="w-full" size="lg">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Save Entry
          </Button>
        </CardContent>
      </Card>

      {/* Progress History */}
      {entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Progress History</CardTitle>
            <CardDescription>Your logged entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entries.map((entry, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-slate-500" />
                      <span>{entry.date}</span>
                    </div>
                    <Badge variant="outline" className="text-lg">
                      {entry.bodyWeight} lbs
                    </Badge>
                  </div>

                  {entry.tasks.some(task => task) && (
                    <div className="mb-3">
                      <h4 className="text-sm mb-2">Tasks:</h4>
                      <div className="space-y-1">
                        {entry.tasks.map((task, taskIndex) =>
                          task ? (
                            <div
                              key={taskIndex}
                              className="text-sm flex items-center gap-2"
                            >
                              <span className="text-blue-600">•</span>
                              <span>{task}</span>
                              {entry.taskStatuses[taskIndex] && (
                                <Badge variant="secondary" className="text-xs">
                                  {entry.taskStatuses[taskIndex]}
                                </Badge>
                              )}
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}

                  {entry.notes && (
                    <div className="mt-3 p-3 bg-white rounded border border-slate-200">
                      <p className="text-sm text-slate-700">{entry.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Meal Tracking Table */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Meal Tracker</CardTitle>
          <CardDescription>Use this table to track your daily meals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left p-3 bg-slate-50">Day</th>
                  <th className="text-left p-3 bg-slate-50">Breakfast</th>
                  <th className="text-left p-3 bg-slate-50">Lunch</th>
                  <th className="text-left p-3 bg-slate-50">Dinner</th>
                  <th className="text-left p-3 bg-slate-50">Snack</th>
                  <th className="text-left p-3 bg-slate-50">Daily Total</th>
                </tr>
              </thead>
              <tbody>
                {weekDays.map((day, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3">{day}</td>
                    <td className="p-3 text-slate-500">280 cal</td>
                    <td className="p-3 text-slate-500">340 cal</td>
                    <td className="p-3 text-slate-500">315 cal</td>
                    <td className="p-3 text-slate-500">140 cal</td>
                    <td className="p-3">
                      <Badge className="bg-blue-600">1,075 cal</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
