# 🌱 Sensei Student Intake Flow - Decision Tree

## Design Principles (Non-Negotiable)

- ✅ **Skippable at every step**
- ✅ **Plain language, no psych jargon**
- ✅ **Answers can change over time** (humans are not static)
- ✅ **Framed as "help me help you", not assessment**
- ✅ **5-7 minutes max**
- ✅ **Zero shame approach**

---

## Flow Overview

```
Step 0: Set the Tone (Micro-Consent)
   ↓
Step 1: The Big Why (Intent Alignment) → Sets Initial Mode
   ↓
Step 2: Intrinsic Core (5 Questions) → Builds Student State Model
   ↓
Step 3-5: Optional Modules (Energy, Learning, Accessibility)
   ↓
Step 6: Confirmation & Reflection → Transparent Summary
   ↓
LLM Immediate Adaptations → Personalized Experience
```

---

## Complete Decision Tree

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 0: SET THE TONE (Micro-Consent)                       │
│  "I'll ask a few questions to support you better.           │
│   No right answers. Skip anything."                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: THE BIG WHY (Intent Alignment)                     │
│  Q1: What do you want help with right now?                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┬──────────────┐
        ▼              ▼              ▼              ▼
   Consistency    Starting Tasks  Managing Energy  Reducing Overwhelm
        │              │              │              │
        └──────────────┴──────────────┴──────────────┘
                       │
                       ▼ [Sets Initial Mode]
                       │
    ┌──────────────────┼──────────────────┬──────────────┐
    ▼                  ▼                  ▼              ▼
  COACH            IGNITION           PACER         STABILIZER
  (habits)       (start help)      (energy)       (overwhelm)
    │                  │                  │              │
    └──────────────────┴──────────────────┴──────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: INTRINSIC CORE (5 Questions)                       │
│  Builds the Student State Model                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ├─→ Q2: What DRAINS you?
                       │    ├─ Mental effort → [reduce cognitive load]
                       │    ├─ Emotional effort → [provide stability]
                       │    ├─ Social → [minimize collaboration pressure]
                       │    ├─ Boring tasks → [add variety/gamification]
                       │    ├─ Decisions → [reduce choice paralysis]
                       │    └─ Not sure → [observe & adapt]
                       │
                       ├─→ Q3: What makes you feel CAPABLE?
                       │    ├─ Clear instructions → [provide structure]
                       │    ├─ Seeing progress → [show metrics/visuals]
                       │    ├─ Encouragement → [warm feedback style]
                       │    ├─ Figure it out → [minimal guidance]
                       │    ├─ Helping others → [suggest teaching]
                       │    └─ Small wins → [micro-task breakdown]
                       │
                       ├─→ Q4: What's underneath AVOIDANCE?
                       │    ├─ Low energy → [schedule light tasks]
                       │    ├─ Fear of wrong → [normalize mistakes]
                       │    ├─ Perfectionism → [set "good enough" bars]
                       │    ├─ Boredom → [add challenge/variety]
                       │    ├─ Didn't choose → [find autonomy angle]
                       │    └─ Don't know where to start → [first-step only]
                       │
                       ├─→ Q5: Structure vs Flexibility?
                       │    ├─ Structure→Freedom → [scaffold then release]
                       │    ├─ Freedom→Structure → [explore then constrain]
                       │    ├─ Mostly structure → [clear schedules]
                       │    ├─ Mostly flexibility → [loose frameworks]
                       │    └─ Depends → [adaptive mode]
                       │
                       └─→ Q6: When does a day feel WASTED?
                            ├─ Didn't learn → [frame as learning]
                            ├─ No progress → [emphasize movement]
                            ├─ Didn't help → [suggest contribution]
                            ├─ Didn't rest → [validate downtime]
                            └─ Busy ≠ meaningful → [focus on impact]
                            │
                            ▼
            ┌───────────────────────────────────────┐
            │  CORE STATE MODEL ESTABLISHED         │
            │  ✓ Friction Map                       │
            │  ✓ Confidence Loop                    │
            │  ✓ Avoidance Pattern                  │
            │  ✓ Scaffolding Strategy               │
            │  ✓ Value Alignment                    │
            └───────────────┬───────────────────────┘
                            │
                 ┌──────────┴──────────┐
                 ▼                     ▼
         CONTINUE TO          OR     SKIP TO
         OPTIONAL MODULES            STEP 6
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
┌────────┐  ┌────────┐  ┌─────────────┐
│ STEP 3 │  │ STEP 4 │  │   STEP 5    │
│ Energy │  │Learning│  │Accessibility│
│Rhythm  │  │Support │  │  Friction   │
└───┬────┘  └───┬────┘  └──────┬──────┘
    │           │              │
    ├─ Best focus time        ├─ Learn by explanation/example
    ├─ Work burst length      ├─ Feedback: encouraging/direct
    └─ Recovery style         └─ Reminders: gentle/firm

    ├─ Trouble starting
    ├─ Trouble remembering
    ├─ Sensory overwhelm
    ├─ Hyperfocus/crash
    └─ Performance anxiety
         │
         └──────────┬──────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 6: CONFIRMATION & REFLECTION                          │
│  LLM Summarizes:                                             │
│  ✓ Primary friction                                          │
│  ✓ Preferred support style                                   │
│  ✓ What success will feel like                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│           LLM IMMEDIATE ADAPTATIONS                          │
├─────────────────────────────────────────────────────────────┤
│  TONE: coach / calm guide / collaborator                     │
│  TASK SIZE: micro / small / moderate chunks                  │
│  PACING: gentle / steady / ambitious                         │
│  LANGUAGE: value-aligned framing                             │
│  AVOIDS: mismatched advice based on their answers            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
              ┌────────────────────┐
              │  PERSONALIZED APP  │
              │   EXPERIENCE       │
              └────────────────────┘
```

---

## Detailed Question Breakdown

### **STEP 0: Set the Tone**

**Purpose:** Establish psychological safety and consent

**Script:**
> "I'm going to ask a few questions so I can support you in a way that actually fits you. There are no right answers. You can skip anything."

**LLM Behavior:** Gentle, curious, non-authoritative

---

### **STEP 1: The Big Why**

**Q1. What do you want help with right now?**

**Options:** (Multi-select or free text)
- Staying consistent
- Starting tasks
- Finishing tasks
- Managing energy
- Reducing overwhelm
- Studying / learning
- Building habits
- "I don't know, I just feel stuck"

**Purpose:** Aligns LLM priorities immediately

**LLM Output Modes:**

| Answer | Mode | Focus |
|--------|------|-------|
| Staying consistent | **COACH** | Habit formation, accountability |
| Starting tasks | **IGNITION** | Overcoming activation energy |
| Managing energy | **PACER** | Energy-aware scheduling |
| Reducing overwhelm | **STABILIZER** | Simplification, calm |
| Multiple answers | **ADAPTIVE** | Multi-modal support |

---

### **STEP 2: Intrinsic Core (5 Questions)**

#### **Q2. What drains you faster than it should?**

**Options:**
- Mental effort
- Emotional effort
- People / social stuff
- Boring or repetitive tasks
- Decision-making
- "I'm not sure"

**LLM Use:** Friction reduction + pacing

| Answer | Adaptation |
|--------|------------|
| Mental effort | Reduce cognitive load, break into smaller steps |
| Emotional effort | Provide stability, normalize feelings |
| Social | Minimize collaboration pressure, solo work |
| Boring tasks | Add variety, gamification, novelty |
| Decisions | Reduce choice paralysis, provide defaults |
| Not sure | Observe patterns, adapt over time |

---

#### **Q3. What helps you feel capable pretty quickly?**

**Options:**
- Clear instructions
- Seeing progress
- Encouragement
- Figuring things out myself
- Helping others
- Completing small wins

**LLM Use:** Confidence loop + feedback style

| Answer | Adaptation |
|--------|------------|
| Clear instructions | Provide detailed structure, step-by-step |
| Seeing progress | Show visual metrics, completion bars |
| Encouragement | Warm, supportive feedback style |
| Figure it out | Minimal guidance, autonomy-supportive |
| Helping others | Suggest teaching/mentoring opportunities |
| Small wins | Micro-task breakdown, frequent completion |

---

#### **Q4. When you avoid something, what's usually underneath it?**

**Options:**
- Low energy
- Fear of doing it wrong
- Perfectionism
- Boredom
- I didn't choose this
- I don't know where to start

**LLM Use:** Reframing avoidance, not shaming

| Answer | Adaptation |
|--------|------------|
| Low energy | Schedule light tasks, respect energy limits |
| Fear of wrong | Normalize mistakes, reduce stakes |
| Perfectionism | Set explicit "good enough" bars |
| Boredom | Add challenge, variety, autonomy |
| Didn't choose | Find autonomy within constraints |
| Don't know where to start | Provide ONLY the first step |

---

#### **Q5. Do you prefer structure or flexibility—and where does that flip?**

**Options:**
- Structure to start → freedom later
- Freedom to start → structure later
- Mostly structure
- Mostly flexibility
- It depends

**LLM Use:** Scaffolding strategy

| Answer | Adaptation |
|--------|------------|
| Structure→Freedom | High scaffolding initially, gradual release |
| Freedom→Structure | Open exploration, then consolidation |
| Mostly structure | Clear schedules, explicit expectations |
| Mostly flexibility | Loose frameworks, emergent planning |
| Depends | Context-aware adaptive mode |

---

#### **Q6. When does a day feel "wasted" to you?**

**Options:**
- I didn't learn anything
- I didn't make progress
- I didn't help anyone
- I didn't rest
- I was busy but it didn't matter

**LLM Use:** Value-aligned productivity

| Answer | Adaptation |
|--------|------------|
| Didn't learn | Frame tasks as learning opportunities |
| No progress | Emphasize forward movement, any size |
| Didn't help | Suggest contribution/service angles |
| Didn't rest | Validate downtime, reframe rest as productive |
| Busy ≠ meaningful | Focus on impact over activity |

---

### **STEP 3: Energy & Rhythm** (Optional Module)

**Prompt:** "This helps me suggest better timing. Skip if you want."

**Questions:**
1. **Best focus time:** morning / afternoon / night / unpredictable
2. **Ideal work burst:** 15-25 / 30-45 / 60+ minutes
3. **Recovery style:** rest / movement / distraction / switching tasks

**LLM Use:** Schedule realism (no 6am grind nonsense)

---

### **STEP 4: Learning & Support Preferences** (Optional)

**Questions:**
1. **I learn best by:**
   - Explanation → example
   - Example → explanation
   - Trying it first

2. **Feedback style:**
   - Encouraging
   - Direct
   - Minimal

3. **Reminders:**
   - Gentle nudges
   - Firm check-ins
   - Only when I ask

**LLM Use:** Tone, verbosity, pacing

---

### **STEP 5: Accessibility & Friction** (Optional, No Labels)

**Prompt:** "You don't need a diagnosis for this."

**Options:**
- Trouble starting tasks
- Trouble remembering steps
- Sensory overwhelm
- Hyperfocus then crash
- Anxiety around performance
- None of these / prefer not to say

**LLM Use:** Chunk size, reminder design, expectation-setting

---

### **STEP 6: Confirmation & Reflection**

**Prompt:** "Here's how I'll support you based on this. You can change any of it later."

**LLM Summarizes:**
1. Primary friction points
2. Preferred support style
3. What success will feel like for you

**Purpose:** Build trust and transparency

---

## Student State Model Structure

After intake, the system generates:

```javascript
{
  // Core Identity
  intent: ["consistency", "starting_tasks"],
  mode: "COACH",

  // Friction Map
  drains: {
    primary: "mental_effort",
    secondary: ["decisions"],
    strategy: "reduce_cognitive_load"
  },

  // Confidence Loop
  capabilities: {
    builder: "clear_instructions",
    feedback_style: "structured"
  },

  // Avoidance Pattern
  avoidance: {
    root_cause: "perfectionism",
    reframe: "set_good_enough_bars"
  },

  // Scaffolding Strategy
  structure: {
    preference: "structure_then_freedom",
    approach: "scaffold_then_release"
  },

  // Value Alignment
  values: {
    meaningful_day: "progress",
    productivity_framing: "movement_focused"
  },

  // Optional Modules
  rhythm: {
    focus_time: "night",
    work_burst: "30-45",
    recovery: "movement"
  },

  learning: {
    style: "example_first",
    feedback: "encouraging",
    reminders: "gentle_nudges"
  },

  accessibility: {
    needs: ["trouble_starting", "hyperfocus_crash"],
    adaptations: ["smaller_chunks", "break_reminders"]
  }
}
```

---

## Handling Conflicting Signals

Students are complex and often give contradictory answers. The system must handle this gracefully.

### **Conflict Resolution Priority**

When student signals conflict:

1. **Prioritize energy and avoidance signals over preference statements**
   - What drains them (Q2) and what triggers avoidance (Q4) are behavioral truths
   - What they say they prefer (Q3, Q5) may reflect aspirations, not reality
   - Example: Says "I prefer structure" but avoidance is "I didn't choose this" → Offer structure with autonomy framing

2. **Favor reversible, low-risk suggestions**
   - Don't make big changes based on ambiguous data
   - Start with safe, adaptable defaults
   - Example: Uncertain about work burst length? Start with 25 minutes (Pomodoro standard), adjust based on observed completion

3. **Test one hypothesis at a time**
   - Don't change multiple variables simultaneously
   - Isolate what's working from what isn't
   - Example: Try "encouraging feedback style" for a week before also changing task chunk size

4. **Observe response and adapt**
   - Track engagement, completion, and satisfaction
   - If student skips suggestions, that's data → adjust approach
   - If student consistently extends 25-min blocks → increase default burst length

### **Common Conflict Patterns**

| Conflict | Resolution Strategy |
|----------|---------------------|
| "I want structure" + "Avoidance = didn't choose this" | Provide structure WITH autonomy language: "Here's a framework—pick your order" |
| "Mental effort drains me" + "I learn by figuring it out" | Reduce cognitive load in setup, allow exploration within bounds |
| "I need encouragement" + "Avoidance = perfectionism" | Encouraging + explicit "good enough" bars: "Great start! This is enough for now." |
| "Low energy" + "Progress = meaningful day" | Micro-wins: "One tiny step = progress. That's a successful day." |
| Skips energy questions + signals overwhelm | Default to conservative: short bursts, flexible timing, gentle pacing |

### **Signal Hierarchy (Most to Least Reliable)**

1. **Behavioral signals** (Q2: drains, Q4: avoidance, Step 5: accessibility)
   - What actually happens in their life
   - Harder to misreport or aspire to

2. **Emotional signals** (Q6: wasted day feeling)
   - What they care about deeply
   - Reveals true values, not stated preferences

3. **Preference statements** (Q3: capability builders, Q5: structure preference)
   - May reflect ideals or past experiences
   - Useful but verify with behavior

4. **Optional modules** (Steps 3-5)
   - Helpful context but not essential
   - More likely to be skipped or uncertain

### **Default Fallbacks**

When signals are insufficient or contradictory:

```javascript
{
  tone: "calm_guide",           // Safe, neutral
  task_size: "small",            // Conservative
  pacing: "gentle",              // Low pressure
  feedback: "encouraging",       // Supportive default
  structure: "light_scaffold",   // Some structure, not rigid
  check_ins: "frequent_but_optional" // Build data without pressure
}
```

**Philosophy:** When in doubt, **reduce friction and observe**. Better to under-support initially and add more than to overwhelm and lose trust.

---

## Example Persona Paths

### **Path A: The Overwhelmed Perfectionist**

**Intake Responses:**
- Q1: Reducing overwhelm → `STABILIZER mode`
- Q2: Drains = Decisions → `reduce choices`
- Q3: Capable = Clear instructions → `provide structure`
- Q4: Avoidance = Perfectionism → `set "good enough" bars`
- Q5: Structure → Freedom → `scaffold then release`
- Q6: Wasted = Didn't rest → `validate downtime`

**LLM Becomes:**
- **Tone:** Calm guide
- **Task Size:** Small, achievable chunks
- **Pacing:** Gentle, no pressure
- **Special:** Normalizes "good enough", validates rest as productive

**Example Output:**
> "Let's start with one small thing. Aim for 'done' not 'perfect.' And if you need to rest first, that's smart—not lazy."

---

### **Path B: The Energetic Self-Starter**

**Intake Responses:**
- Q1: Starting tasks → `IGNITION mode`
- Q2: Drains = Boring tasks → `add variety`
- Q3: Capable = Figure it out → `minimal guidance`
- Q4: Avoidance = Boredom → `add challenge`
- Q5: Freedom → Structure → `explore then constrain`
- Q6: Wasted = No progress → `emphasize movement`

**LLM Becomes:**
- **Tone:** Collaborator
- **Task Size:** Moderate chunks
- **Pacing:** Ambitious, challenging
- **Special:** Gets out of the way, offers variety

**Example Output:**
> "Pick the most interesting part and start there. Once you're in flow, we can organize the rest. Want a challenge? Try the hard version first."

---

### **Path C: The Exhausted Achiever**

**Intake Responses:**
- Q1: Managing energy → `PACER mode`
- Q2: Drains = Mental effort → `reduce cognitive load`
- Q3: Capable = Seeing progress → `show metrics`
- Q4: Avoidance = Low energy → `schedule light tasks`
- Q5: Mostly structure → `clear schedules`
- Q6: Wasted = Busy ≠ meaningful → `focus on impact`
- Optional: Night owl, 25min bursts, rest recovery

**LLM Becomes:**
- **Tone:** Coach
- **Task Size:** Micro-tasks
- **Pacing:** Respects energy limits
- **Special:** Evening scheduling, emphasizes impact over hours

**Example Output:**
> "You've got a 25-minute window tonight at 9pm. Let's do one high-impact task. Progress > perfection. Then rest."

---

## Implementation Notes

### **Technical Requirements**

1. **Skip Logic:**
   - Every question must have a "Skip" or "Prefer not to say" option
   - System must function with minimal data
   - Defaults should be safe and generalizable

2. **State Persistence:**
   - Save intake responses
   - Allow users to retake/update answers
   - Track changes over time (learning loop)

3. **LLM Integration:**
   - Pass state model as system context
   - Update behavior flags in real-time
   - Log adaptations for transparency

4. **UI/UX:**
   - Progress indicator (not pressure)
   - Clear "Skip" buttons
   - Conversational, not clinical
   - Mobile-friendly (students use phones)

### **Testing Scenarios**

- **Minimal answers:** Only Q1 answered, rest skipped
- **Contradictory answers:** Different signals, system must reconcile
- **Changed mind:** User retakes intake with different responses
- **Edge cases:** "I don't know" for every question

### **Future Enhancements**

- **Reflection loop:** Weekly check-ins to refine the model
- **Pattern detection:** Observe behavior, suggest intake updates
- **Team mode:** Intake for group projects (different model)
- **Crisis detection:** Answers that suggest need for additional support

---

## Success Metrics

**Intake Quality:**
- ✅ Completion rate >80%
- ✅ Time to complete <7 minutes
- ✅ Skip rate <30% per question

**Adaptation Effectiveness:**
- ✅ Users report system "gets them"
- ✅ Task completion rates increase
- ✅ Reduced friction reported in follow-ups

**Trust Indicators:**
- ✅ Users retake intake to update (shows trust in system)
- ✅ Users engage with optional modules (curiosity)
- ✅ Low dropout rate after Step 1

---

## Philosophy Summary

> **"We don't measure you. We learn how to support you."**

This intake flow is designed around:
- **Dignity:** No shaming, no judgment
- **Agency:** User controls data sharing
- **Transparency:** System explains its reasoning
- **Adaptivity:** Humans change, so should the system
- **Pragmatism:** Fast, practical, respectful of time

The goal is not perfect assessment—it's **sufficient understanding to provide meaningfully personalized support**.

---

**Document Version:** 1.0
**Last Updated:** 2026-02-07
**Status:** Ready for Implementation
