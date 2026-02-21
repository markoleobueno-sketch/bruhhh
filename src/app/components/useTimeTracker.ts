import { useEffect, useRef, useCallback } from "react";
import { logTimeSession } from "./cloudSync";

interface TimeTrackerOptions {
  accessToken: string | null;
  activeTab: string;
  enabled: boolean;
}

/**
 * Tracks time spent in the app per tab, saves to Supabase every 5 minutes
 * and on page unload. Accumulates tab-specific breakdowns.
 */
export function useTimeTracker({ accessToken, activeTab, enabled }: TimeTrackerOptions) {
  const sessionStartRef = useRef<number>(Date.now());
  const tabStartRef = useRef<number>(Date.now());
  const tabBreakdownRef = useRef<Record<string, number>>({});
  const savedMinutesRef = useRef<number>(0);

  const getToday = () => new Date().toISOString().split("T")[0];

  const flushTime = useCallback(async (force = false) => {
    if (!accessToken || !enabled) return;

    const now = Date.now();
    const sessionTotalMs = now - sessionStartRef.current;
    const sessionMinutes = sessionTotalMs / 60000;

    // Add any pending time for current tab
    const tabElapsedMs = now - tabStartRef.current;
    const tabElapsedMins = tabElapsedMs / 60000;
    const breakdown = { ...tabBreakdownRef.current };
    breakdown[activeTab] = (breakdown[activeTab] ?? 0) + tabElapsedMins;

    const newMinutes = sessionMinutes - savedMinutesRef.current;
    if (!force && newMinutes < 1) return; // Don't save tiny intervals

    try {
      await logTimeSession(getToday(), Math.round(newMinutes * 10) / 10, breakdown, accessToken);
      savedMinutesRef.current = sessionMinutes;
      // Reset breakdown after save (don't double-count)
      tabBreakdownRef.current = {};
      tabStartRef.current = now;
    } catch (err) {
      console.log("Time tracker flush error:", err);
    }
  }, [accessToken, activeTab, enabled]);

  // Track tab changes
  useEffect(() => {
    const now = Date.now();
    const elapsed = (now - tabStartRef.current) / 60000;
    tabBreakdownRef.current[activeTab] = (tabBreakdownRef.current[activeTab] ?? 0) + elapsed;
    tabStartRef.current = now;
  }, [activeTab]);

  // Auto-save every 5 minutes
  useEffect(() => {
    if (!enabled || !accessToken) return;
    const interval = setInterval(() => flushTime(false), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [flushTime, enabled, accessToken]);

  // Save on page unload
  useEffect(() => {
    if (!enabled || !accessToken) return;
    const handleUnload = () => flushTime(true);
    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flushTime(true);
    });
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      flushTime(true);
    };
  }, [flushTime, enabled, accessToken]);

  return { flushTime };
}
