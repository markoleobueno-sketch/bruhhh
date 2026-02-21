import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function WorkoutTrackerSimple() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workout Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading...</p>
        </CardContent>
      </Card>
    </div>
  );
}
