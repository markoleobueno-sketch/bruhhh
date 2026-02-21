import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ShoppingCart, ChefHat, Container, Lightbulb } from "lucide-react";

export function MealPrepGuide() {
  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-6 w-6" />
            Meal Prep Overview
          </CardTitle>
          <CardDescription className="text-slate-700">
            1 Hour Prep Time • 7 Days of Meals • ~$46 Total Cost
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Shopping List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping List (7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span>7 Protein Shakes</span>
                <Badge variant="outline">$25</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span>2 cups dry rice</span>
                <Badge variant="outline">$2</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span>7 cups broccoli (2 lb)</span>
                <Badge variant="outline">$4</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span>21 oz ground turkey</span>
                <Badge variant="outline">$5</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span>21 oz chicken breast</span>
                <Badge variant="outline">$5</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span>3.5 cups dry oatmeal</span>
                <Badge variant="outline">$2</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span>Salt/pepper/garlic powder</span>
                <Badge variant="outline">$1</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span>Optional hot sauce</span>
                <Badge variant="outline">$2</Badge>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <span>Total Estimated Cost</span>
              <span className="text-2xl text-purple-600">~$46</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prep Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Preparation Steps</CardTitle>
          <CardDescription>Follow these steps in order for efficient meal prep</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl">
                1
              </div>
              <div className="flex-1">
                <h4 className="mb-2">Cook Rice</h4>
                <p className="text-sm text-slate-600 mb-2">
                  Cook 2 cups dry rice + 4 cups water (pot/rice cooker, 20 min). Yields 5.25 cups. Cool.
                </p>
                <Badge>20 minutes</Badge>
              </div>
            </div>

            <Separator />

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl">
                2
              </div>
              <div className="flex-1">
                <h4 className="mb-2">Steam Broccoli</h4>
                <p className="text-sm text-slate-600 mb-2">
                  Steam 7 cups broccoli (fresh: 5–7 min; frozen: microwave 3–4 min with 1 tbsp water). Cool.
                </p>
                <Badge>5-7 minutes</Badge>
              </div>
            </div>

            <Separator />

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl">
                3
              </div>
              <div className="flex-1">
                <h4 className="mb-2">Cook Ground Turkey</h4>
                <p className="text-sm text-slate-600 mb-2">
                  Cook 21 oz turkey in skillet, season, 5–7 min. Drain fat. Cool.
                </p>
                <Badge>5-7 minutes</Badge>
              </div>
            </div>

            <Separator />

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl">
                4
              </div>
              <div className="flex-1">
                <h4 className="mb-2">Bake Chicken Breast</h4>
                <p className="text-sm text-slate-600 mb-2">
                  Season 21 oz chicken, bake 400°F 18–22 min (165°F). Slice. Cool.
                </p>
                <Badge>18-22 minutes</Badge>
              </div>
            </div>

            <Separator />

            {/* Step 5 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl">
                5
              </div>
              <div className="flex-1">
                <h4 className="mb-2">Assembly</h4>
                <p className="text-sm text-slate-600 mb-3">
                  Divide into 14 containers:
                </p>
                <div className="space-y-2 ml-4">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm mb-1">
                      <strong>7 Lunch Containers:</strong>
                    </div>
                    <div className="text-sm text-slate-600">
                      3 oz turkey + 3/4 cup rice + 1 cup broccoli
                    </div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-sm mb-1">
                      <strong>7 Dinner Containers:</strong>
                    </div>
                    <div className="text-sm text-slate-600">
                      3 oz chicken + 3/4 cup rice + 1 cup broccoli
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mt-3">
                  Store shakes in pantry (unopened) or fridge (opened).
                </p>
              </div>
            </div>

            <Separator />

            {/* Step 6 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl">
                6
              </div>
              <div className="flex-1">
                <h4 className="mb-2">Oatmeal</h4>
                <p className="text-sm text-slate-600 mb-2">
                  Prep daily (5 min) or batch-cook 3.5 cups dry oats (15 min), store in fridge, reheat with water.
                </p>
                <Badge>5-15 minutes</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage & Containers */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Container className="h-5 w-5" />
              Storage Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="p-3 bg-blue-50 rounded-lg">
              <strong className="text-blue-900">Refrigerator:</strong>
              <p className="text-slate-700 mt-1">Store meals 4–5 days. Store oatmeal 5 days.</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <strong className="text-purple-900">Freezer:</strong>
              <p className="text-slate-700 mt-1">Freeze extra meals up to 1 month. Label with date.</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <strong className="text-green-900">Shakes:</strong>
              <p className="text-slate-700 mt-1">Unopened in pantry. Opened in fridge (24 hours).</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <strong className="text-orange-900">Reheating:</strong>
              <p className="text-slate-700 mt-1">Microwave meals 1–2 min to 165°F. Serve shakes chilled.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Container Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong>Requirements:</strong>
              <ul className="mt-2 space-y-1 ml-4 list-disc text-slate-700">
                <li>BPA-free, microwave-safe</li>
                <li>24–32 oz capacity</li>
                <li>Buy 10–14 containers</li>
              </ul>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <strong className="text-blue-900">Bayco Plastic:</strong>
              <p className="text-slate-700 mt-1">$15/10-pack (Amazon) - Stackable</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <strong className="text-green-900">Prep Naturals Glass:</strong>
              <p className="text-slate-700 mt-1">$25/5-pack (Amazon) - Durable</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Pro Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-amber-600">💪</span>
                <p><strong>Exercise:</strong> 3 strength sessions (30 min), 150 min cardio/week. Drink snack shake post-workout.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600">💧</span>
                <p><strong>Hydrate:</strong> Drink 8–10 cups water daily.</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-amber-600">🌶️</span>
                <p><strong>Flavor:</strong> Add hot sauce/mustard (0–10 cal) for variety.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600">⚖️</span>
                <p><strong>Adjust:</strong> Reduce rice to 1/2 cup if weight loss stalls. Weigh weekly (aim 1–1.5 lb loss).</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
