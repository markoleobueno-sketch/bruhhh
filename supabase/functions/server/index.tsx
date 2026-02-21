import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ── Helpers ────────────────────────────────────────────────────────────────────
function adminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

async function getUserFromToken(token: string | undefined) {
  if (!token) return null;
  const supabase = adminClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// ── Health check ───────────────────────────────────────────────────────────────
app.get("/make-server-c1c566ee/health", (c) => {
  return c.json({ status: "ok" });
});

// ── Auth: Sign Up ──────────────────────────────────────────────────────────────
app.post("/make-server-c1c566ee/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    if (!email || !password || !name) {
      return c.json({ error: "Missing required fields: email, password, name" }, 400);
    }
    const supabase = adminClient();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });
    if (error) {
      console.log(`Signup error for ${email}:`, error.message);
      return c.json({ error: error.message }, 400);
    }
    console.log(`Signup success for ${email}, userId=${data.user?.id}`);
    return c.json({ user: data.user });
  } catch (err) {
    console.log("Signup unexpected error:", err);
    return c.json({ error: `Server error during signup: ${err}` }, 500);
  }
});

// ── Sync: Save user data ────────────────────────────────────────────────────────
app.post("/make-server-c1c566ee/sync", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const user = await getUserFromToken(accessToken);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const { key, value } = await c.req.json();
    if (!key) return c.json({ error: "Missing key" }, 400);

    await kv.set(`user:${user.id}:${key}`, value);
    console.log(`Sync save: userId=${user.id}, key=${key}`);
    return c.json({ success: true });
  } catch (err) {
    console.log("Sync save error:", err);
    return c.json({ error: `Server error during sync save: ${err}` }, 500);
  }
});

// ── Sync: Load all user data at once ───────────────────────────────────────────
app.get("/make-server-c1c566ee/sync-all", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const user = await getUserFromToken(accessToken);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const keys = ["profile", "weeklyData", "foodLog", "timeStats"];
    const values = await kv.mget(keys.map((k) => `user:${user.id}:${k}`));

    const result: Record<string, any> = {};
    keys.forEach((k, i) => { result[k] = values[i] ?? null; });

    console.log(`Sync load-all: userId=${user.id}`);
    return c.json(result);
  } catch (err) {
    console.log("Sync load-all error:", err);
    return c.json({ error: `Server error during sync load: ${err}` }, 500);
  }
});

// ── Time Tracking: Log session time ────────────────────────────────────────────
app.post("/make-server-c1c566ee/time-log", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const user = await getUserFromToken(accessToken);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const { date, totalMinutes, tabBreakdown, sessionMinutes } = await c.req.json();
    if (!date) return c.json({ error: "Missing date" }, 400);

    const existing: Record<string, any> = (await kv.get(`user:${user.id}:timeStats`)) ?? {};
    const prevEntry = existing[date] ?? { totalMinutes: 0, tabBreakdown: {}, sessions: 0 };

    // Merge tab breakdown
    const mergedTabs: Record<string, number> = { ...prevEntry.tabBreakdown };
    for (const [tab, mins] of Object.entries(tabBreakdown ?? {})) {
      mergedTabs[tab] = (mergedTabs[tab] ?? 0) + (mins as number);
    }

    existing[date] = {
      totalMinutes: (prevEntry.totalMinutes ?? 0) + (sessionMinutes ?? totalMinutes ?? 0),
      tabBreakdown: mergedTabs,
      sessions: (prevEntry.sessions ?? 0) + 1,
      lastUpdated: new Date().toISOString(),
    };

    await kv.set(`user:${user.id}:timeStats`, existing);
    console.log(`Time log: userId=${user.id}, date=${date}, mins=${totalMinutes}`);
    return c.json({ success: true });
  } catch (err) {
    console.log("Time log error:", err);
    return c.json({ error: `Server error during time log: ${err}` }, 500);
  }
});

// ── Time Stats: Get time history ───────────────────────────────────────────────
app.get("/make-server-c1c566ee/time-stats", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const user = await getUserFromToken(accessToken);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const timeStats = await kv.get(`user:${user.id}:timeStats`) ?? {};
    console.log(`Time stats fetched: userId=${user.id}`);
    return c.json({ timeStats });
  } catch (err) {
    console.log("Time stats error:", err);
    return c.json({ error: `Server error during time stats: ${err}` }, 500);
  }
});

// ── Health Sync: External trigger (Apple Watch / Shortcuts) ────────────────────
// Usage: POST from Apple Shortcuts with Bearer token + JSON body
// Accepts: steps, heartRate, activeMinutes, workoutType, calories
app.post("/make-server-c1c566ee/health-sync", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const user = await getUserFromToken(accessToken);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const body = await c.req.json();
    const {
      date = new Date().toISOString().split("T")[0],
      steps,
      heartRate,
      activeMinutes,
      workoutType,
      caloriesBurned,
      source = "external",
    } = body;

    const existing: Record<string, any> = (await kv.get(`user:${user.id}:healthSync`)) ?? {};
    existing[date] = {
      ...existing[date],
      ...(steps !== undefined && { steps }),
      ...(heartRate !== undefined && { heartRate }),
      ...(activeMinutes !== undefined && { activeMinutes }),
      ...(workoutType !== undefined && { workoutType }),
      ...(caloriesBurned !== undefined && { caloriesBurned }),
      source,
      syncedAt: new Date().toISOString(),
    };

    await kv.set(`user:${user.id}:healthSync`, existing);
    console.log(`Health sync: userId=${user.id}, date=${date}, source=${source}`);
    return c.json({ success: true, date, synced: existing[date] });
  } catch (err) {
    console.log("Health sync error:", err);
    return c.json({ error: `Server error during health sync: ${err}` }, 500);
  }
});

// ── Health Sync: Get data ──────────────────────────────────────────────────────
app.get("/make-server-c1c566ee/health-sync", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const user = await getUserFromToken(accessToken);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const healthData = await kv.get(`user:${user.id}:healthSync`) ?? {};
    return c.json({ healthData });
  } catch (err) {
    console.log("Health sync get error:", err);
    return c.json({ error: `Server error: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);
