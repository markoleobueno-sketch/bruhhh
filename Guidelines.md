# BruhhH - System Guidelines

## Core Identity
*   **Name:** BruhhH
*   **Vibe:** Heavy, Status, Sturdy, Sharp, Polarizing, Metal.
*   **Meaning:** The core of your structure. A daily reminder of capability and discipline.
*   **Voice:**
    *   *Daily:* Strict but supportive ("Rest is important. Do better tomorrow").
    *   *Weekly/Monthly:* Analytical, data-driven, medical precision.

## Design System: "Earth, Iron & Medical"

### Color Palette
*   **Backgrounds:** Deep "Iron" Greys (#121212, #1E1E1E) - The Garage/Industrial base.
*   **Text:** "Medical" White (#F0F0F0) & Muted Steel (#A0A0A0) - High contrast, legible, clinical.
*   **Primary Accent:** "Rust" Orange (#D95436) - Usage: Call to actions, active states, critical alerts.
*   **Secondary Accent:** "Olive" Green (#6B705C) - Usage: Success states, progress bars, consistent habits.
*   **Borders:** Sharp, distinct "Steel" borders (#333333).

### Typography
*   **Font:** Outfit (Geometric Sans).
*   **Weights:** Lean heavily into **Bold (700)** and **ExtraBold (800)** for headings to convey "Heavy/Status". Use Regular/Medium for data to convey "Medical/Precision".
*   **Casing:** Uppercase for labels and small headers (Industrial feel).

#### Type Scale (STRICT — always override component defaults)
| Role | Size | Notes |
|---|---|---|
| **Main Numbers** | **48px minimum** | Weight, steps, streak, any hero metric. Go bigger if it fits. |
| **Section Headers** | **22px, bold (700+)** | Tab titles, card headers, screen names. |
| **Body / Descriptions** | **16px minimum** | Any sentence or phrase the user reads. Never go below 16px. |
| **Labels / Small Caps** | **13px max** | Only for things you don't need to read mid-workout: unit suffixes, timestamps, legend keys. |

*   **Rule:** If you're unsure whether something is a "label" or "body", default to 16px.
*   **Rule:** Numbers the user tracks (weight, reps, time, calories, streak) must never be smaller than 48px when displayed as a hero/stat value.

### Layout & Shape
*   **Radius:** Small/Sharp. Use `4px` or `6px` (Sturdy). Avoid fully rounded "pill" shapes unless necessary for status.
*   **Spacing:** Dense but organized. "Dashboard" feel rather than "Airy website" feel.
*   **Input Fields:** Large, blocky, distinct borders.

### Components
*   **Buttons:** Solid, rectangular or slightly rounded. High contrast.
*   **Cards:** Dark grey backgrounds with subtle steel borders.
*   **Charts:** Precise lines, using the Rust/Olive palette.