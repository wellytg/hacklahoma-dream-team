# Plan: Update Intake Flow to Match Expanded Documentation

## Context

The Sensei Student Intake app was built before the docs were expanded with:
- Q6 ("When does a day feel wasted?") — the `valueAlignment` field exists in `types.ts` but was never wired to a question
- Optional modules: Energy & Rhythm, Learning & Support, Accessibility & Friction
- Conflict resolution logic with signal priority hierarchy
- Default fallbacks for insufficient/contradictory data
- A richer `StudentStateModel` with nested objects and override flags

The app currently has 7 steps (0-6) covering Q1-Q5 + a summary. It needs to grow to 11 steps (0-10) and compute a structured state model with conflict resolution before displaying the summary.

## Gap Summary

| What's Missing | Source Doc | Impact |
|---|---|---|
| Q6: Wasted day | intake-flow.md lines 303-320 | `valueAlignment` is unused |
| Energy & Rhythm module | intake-flow.md lines 324-334 | No rhythm data collected |
| Learning & Support module | intake-flow.md lines 337-355 | No learning prefs collected |
| Accessibility module | intake-flow.md lines 359-371 | No accessibility data collected |
| Structured state model | intake-flow.md lines 392-447 | Flat strings instead of nested objects |
| Conflict resolution | intake-flow.md lines 451-522 | No signal prioritization |
| Enhanced summary | intake-flow.md lines 375-385 | Summary doesn't show support style or success framing |

## Updated Step Map

| Step | Content | Select Type | New? |
|------|---------|-------------|------|
| 0 | Intro | Static | No |
| 1 | Q1: The Big Why | Multi-select | No |
| 2 | Q2: What drains you | Single | No |
| 3 | Q3: Feeling Capable | Single | No |
| 4 | Q4: Avoidance Pattern | Single | No |
| 5 | Q5: Structure vs Flexibility | Single | No |
| 6 | Q6: When does a day feel wasted | Single | **Yes** |
| 7 | Energy & Rhythm (optional) | 3 sub-questions | **Yes** |
| 8 | Learning & Support (optional) | 3 sub-questions | **Yes** |
| 9 | Accessibility & Friction (optional) | Multi-select | **Yes** |
| 10 | Summary / Confirmation | Computed display | Updated |

## Implementation Steps

### Step 1: Expand types (`src/types.ts`)

Add nested interfaces and update `StudentStateModel`:

```
Add: FrictionMap { primary, secondary[], strategy }
Add: ConfidenceLoop { builder, feedback_style }
Add: AvoidancePattern { root_cause, reframe }
Add: ScaffoldingStrategy { preference, approach }
Add: ValueAlignment { meaningful_day, productivity_framing }
Add: RhythmProfile { focus_time, work_burst, recovery }
Add: LearningPreferences { style, feedback, reminders }
Add: AccessibilityProfile { needs[], adaptations[] }
Add: ConflictOverrides { [key]: boolean }
Add: RawAnswers { flat string/array fields for all 9+ questions }
```

Keep the existing flat `StudentStateModel` fields as `RawAnswers` (the intermediate form). Add `ResolvedStateModel` as the structured version. This avoids rewriting every question handler — questions write to `RawAnswers`, and the summary computes `ResolvedStateModel`.

### Step 2: Update context (`src/context/IntakeContext.tsx`)

- Change `totalSteps` from `7` to `11`
- Expand `DEFAULT_STATE` with new raw answer fields: `valueAlignment`, `focusTime`, `workBurst`, `recovery`, `learnStyle`, `feedbackPref`, `reminderPref`, `accessNeeds[]`
- Add `resolveState(raw: RawAnswers): ResolvedStateModel` function:
  - Maps each raw answer to its structured object using lookup tables from the doc
  - Derives `strategy`, `feedback_style`, `reframe`, `approach`, `productivity_framing`, and `adaptations` from answer IDs
- Add `resolveConflicts(raw: RawAnswers): ConflictOverrides` function implementing key patterns:
  - Energy paradox (long burst claimed + low energy/hyperfocus)
  - Autonomy vs need (figure-it-out + mental/decision drain)
  - Structure + low autonomy avoidance (structure pref + "didn't choose")
  - Flexibility + exec function needs (flexibility pref + starting/remembering trouble)
  - Social contradiction (social drains + helping others capability)
- Add `applyDefaults()` for fallbacks when fields are empty
- Expose `getResolvedState()` on context for the summary step to call

### Step 3: Extract OptionButton (`src/components/QuestionStep.tsx`)

Extract the option button rendering into a reusable `OptionButton` component (exported). This allows the multi-question steps (7, 8) to reuse the same button styling without duplicating ~20 lines of JSX per option.

`QuestionStep` continues to work unchanged — it just uses `OptionButton` internally.

### Step 4: Add new question steps (`src/components/IntakeFlow.tsx`)

**Case 6 — Q6: "A Wasted Day"** (standard `QuestionStep`, single-select)
- Options: learn, progress, help, rest, meaningful (from intake-flow.md lines 305-310)
- Writes to `state.valueAlignment`

**Case 7 — Energy & Rhythm** (3 inline sub-questions using `OptionButton`)
- Header: "Energy & Rhythm" / "This helps me suggest better timing. Skip if you want."
- Sub-question A: Best focus time — morning / afternoon / night / unpredictable
- Sub-question B: Ideal work burst — 15-25 / 30-45 / 60+
- Sub-question C: Recovery style — rest / movement / distraction / switching
- Writes to `state.focusTime`, `state.workBurst`, `state.recovery`

**Case 8 — Learning & Support** (3 inline sub-questions using `OptionButton`)
- Header: "Learning & Support" / "How do you learn and receive feedback best?"
- Sub-question A: Learn by — explanation-first / example-first / trying-first
- Sub-question B: Feedback — encouraging / direct / minimal
- Sub-question C: Reminders — gentle / firm / only-when-asked
- Writes to `state.learnStyle`, `state.feedbackPref`, `state.reminderPref`

**Case 9 — Accessibility** (standard `QuestionStep`, multi-select, no sublabels)
- Header: "Accessibility & Friction" / "You don't need a diagnosis for this."
- Options: starting, remembering, sensory, hyperfocus, anxiety, none
- "none" clears other selections; selecting others clears "none"
- Writes to `state.accessNeeds[]`

### Step 5: Update summary step (`src/components/IntakeFlow.tsx`, case 10)

- Call `getResolvedState()` to get the computed model
- Show header: "Here's how I'll support you based on this. You can change any of it later."
- Display sections: Mode, Primary Friction + Strategy, Confidence Loop, Avoidance Reframe, Scaffolding Approach, Value Alignment
- If optional modules were answered, show: Rhythm profile, Learning preferences, Accessibility adaptations
- If conflict overrides fired, show transparency note (e.g., "I noticed you prefer long focus sessions but also report energy crashes — I'm starting with shorter bursts to protect your energy.")
- Updated summary paragraph reflecting all collected data

### Step 6: Update navigation bounds (`src/components/IntakeFlow.tsx`)

- ProgressBar condition: `currentStep > 0 && currentStep < 10` (was `< 6`)
- Footer nav condition: `currentStep > 0 && currentStep < 10` (was `< 6`)
- Optional steps (7, 8, 9): change Skip button text to "Skip section"

## Files Modified

| File | Change Type |
|------|-------------|
| `src/types.ts` | Add ~10 interfaces, add `RawAnswers`, add `ResolvedStateModel` |
| `src/context/IntakeContext.tsx` | Expand state, add resolve/conflict/default functions |
| `src/components/QuestionStep.tsx` | Extract `OptionButton` export |
| `src/components/IntakeFlow.tsx` | Add cases 6-9, update case 10, update nav bounds |

No changes to: `App.tsx`, `index.tsx`, `ProgressBar.tsx`, stubs, config files.

## Verification

1. `npm run dev` in `src/` — app loads without errors
2. Walk through all 11 steps, verify each renders correctly
3. Test skip behavior on every step including optional modules
4. Test "none" exclusivity on accessibility step
5. Complete flow with contradictory answers (e.g., Test Case 1 from test-cases doc: 60+ min burst + low energy + hyperfocus) — verify overrides appear in summary
6. Complete flow skipping all optional modules — verify defaults applied in summary
7. Reset flow — verify state clears completely
