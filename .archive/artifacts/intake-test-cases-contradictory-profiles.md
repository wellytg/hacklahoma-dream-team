# Sensei Intake Flow - Test Cases: Contradictory Profiles

## Purpose
Test the conflict resolution logic with real-world contradictory student signals. Each case includes:
- Raw intake responses (with conflicts)
- Min/max parameter boundaries
- Conflict analysis
- Resolution strategy
- Final Student State Model
- Example system outputs

---

## Test Case 1: The Aspirational Overachiever

### **Raw Intake Responses**

| Question | Answer |
|----------|--------|
| Q1: Help with | Starting tasks, Finishing tasks, Reducing overwhelm |
| Q2: What drains | Mental effort, Decision-making |
| Q3: Feel capable | Figuring it out myself, Seeing progress |
| Q4: Avoidance | Perfectionism, Low energy |
| Q5: Structure | Mostly structure |
| Q6: Wasted day | Didn't make progress |
| Energy: Focus time | Morning (but reports low energy in Q4) |
| Energy: Work burst | 60+ minutes (but drains fast from mental effort) |
| Accessibility | Hyperfocus then crash, Anxiety around performance |

### **Identified Conflicts**

1. **Energy Paradox:**
   - Says: "Morning focus, 60+ minute bursts"
   - But: Reports low energy (Q4), hyperfocus crashes (accessibility)
   - **Conflict:** Aspirational preference vs. behavioral reality

2. **Autonomy vs. Need:**
   - Says: "Figure it out myself" (Q3)
   - But: Drains from mental effort and decisions (Q2), needs structure (Q5)
   - **Conflict:** Independence desire vs. cognitive load reality

3. **Perfectionism Loop:**
   - Needs to finish tasks and see progress (Q1, Q3, Q6)
   - But: Perfectionism blocks completion (Q4), anxiety around performance
   - **Conflict:** Progress-driven but self-sabotaging

### **Min/Max Parameters**

```javascript
{
  task_size: {
    min: 5,    // minutes - absolute minimum before "too small"
    max: 25,   // minutes - maximum before cognitive overload
    stated: 60, // what they claim they can do
    actual: 15  // realistic sustainable burst
  },

  daily_capacity: {
    min: 30,   // minutes - bare minimum on worst days
    max: 120,  // minutes - theoretical max before crash
    stated: 240, // what they think they should do
    actual: 90   // realistic sustainable daily focus
  },

  structure_level: {
    min: 0.3,  // some flexibility needed for autonomy
    max: 0.9,  // high structure to reduce decision fatigue
    stated: 0.9, // "I want structure"
    actual: 0.7  // structure with autonomy language
  },

  feedback_frequency: {
    min: 1,    // days - at least daily check-ins
    max: 1,    // days - needs frequent reassurance
    actual: 1   // daily gentle check-ins
  }
}
```

### **Resolution Strategy**

**Apply Priority Hierarchy:**

1. **Behavioral signals win:**
   - Low energy (Q4) + hyperfocus crashes → SHORT work bursts (15-20 min)
   - Mental effort drains (Q2) → REDUCE cognitive load, ignore "figure it out"
   - Perfectionism (Q4) → Explicit "good enough" bars override progress obsession

2. **Safe defaults:**
   - Start with 15-minute tasks, not 60
   - Morning timing OK (not contradicted by behavior)
   - High structure BUT with autonomy framing

3. **Test hypothesis:**
   - Week 1: 15-min bursts with clear "done" criteria
   - Observe: Do they complete? Do they extend naturally?
   - Adjust: Only increase if completion rate >80%

### **Final Student State Model**

```javascript
{
  intent: ["starting_tasks", "finishing_tasks", "reducing_overwhelm"],
  mode: "STABILIZER", // Overwhelm trumps other goals

  drains: {
    primary: "mental_effort",
    secondary: ["decisions", "perfectionism"],
    strategy: "reduce_cognitive_load_and_choices"
  },

  capabilities: {
    builder: "seeing_progress", // Use this, not "figure it out"
    feedback_style: "structured_with_explicit_done_criteria"
  },

  avoidance: {
    root_cause: "perfectionism_plus_low_energy",
    reframe: "good_enough_bars_and_energy_respect"
  },

  structure: {
    preference: "high_structure_with_autonomy_language",
    approach: "clear_steps_with_choice_within_bounds"
  },

  values: {
    meaningful_day: "progress",
    productivity_framing: "micro_progress_counts"
  },

  rhythm: {
    focus_time: "morning",
    work_burst: 15, // NOT 60
    recovery: "rest" // Respect the crash pattern
  },

  accessibility: {
    needs: ["hyperfocus_crash_prevention", "performance_anxiety"],
    adaptations: ["hard_stop_timers", "normalize_good_enough"]
  },

  // Conflict Resolution Overrides
  overrides: {
    ignore_stated_work_burst: true, // 60 min is aspirational
    reduce_autonomy_language: false, // Still wants to feel independent
    increase_structure: true // Needs it despite "figure it out"
  }
}
```

### **Example System Outputs**

**Task Framing:**
> ❌ "Take 60 minutes to work through this problem yourself."
>
> ✅ "Let's do a 15-minute sprint on this. Your goal: get ONE piece done—doesn't have to be perfect. Ready?"

**Habit Suggestion:**
> ❌ "Try longer focus sessions to build stamina."
>
> ✅ "You're doing great with short bursts. Let's protect that—set a 15-min timer and STOP when it rings, even if you want to continue. Prevents crashes."

**Feedback Style:**
> ❌ "Good progress! Push yourself harder tomorrow."
>
> ✅ "That's enough for today—seriously. You hit the goal. Rest now so you can start fresh tomorrow."

---

## Test Case 2: The Chaotic Freedom-Seeker

### **Raw Intake Responses**

| Question | Answer |
|----------|--------|
| Q1: Help with | Starting tasks, Studying/learning |
| Q2: What drains | Boring tasks, People/social |
| Q3: Feel capable | Figuring it out myself, Helping others |
| Q4: Avoidance | Boredom, I didn't choose this |
| Q5: Structure | Mostly flexibility |
| Q6: Wasted day | I didn't learn anything |
| Energy: Focus time | Unpredictable |
| Energy: Work burst | 30-45 minutes |
| Accessibility | Trouble starting, Trouble remembering steps |

### **Identified Conflicts**

1. **Social Contradiction:**
   - Drains: People/social (Q2)
   - Capable: Helping others (Q3)
   - **Conflict:** Social energy vs. social fulfillment

2. **Structure Paradox:**
   - Says: "Mostly flexibility" (Q5)
   - But: Trouble starting, trouble remembering (accessibility)
   - **Conflict:** Wants freedom but needs scaffolding to function

3. **Autonomy vs. Function:**
   - Avoidance: "I didn't choose this" → needs autonomy
   - But: "Trouble starting" → needs activation help
   - **Conflict:** Freedom desire vs. executive function reality

### **Min/Max Parameters**

```javascript
{
  task_size: {
    min: 10,   // Too small feels patronizing
    max: 45,   // Can sustain stated burst length
    stated: 45,
    actual: 30  // Sweet spot before attention wanders
  },

  structure_level: {
    min: 0.2,  // Needs SOME structure to start
    max: 0.5,  // Too much feels constraining
    stated: 0.1, // "Mostly flexibility"
    actual: 0.35 // Light scaffold, hidden structure
  },

  novelty_frequency: {
    min: 2,    // New thing at least every other task
    max: 1,    // Ideal: something new every task
    actual: 2   // Rotate approaches/topics every other task
  },

  autonomy_language: {
    min: 0.7,  // High autonomy framing required
    max: 1.0,  // Maximum choice language
    actual: 0.9 // "Your call" language constant
  }
}
```

### **Resolution Strategy**

**Apply Priority Hierarchy:**

1. **Behavioral signals:**
   - Trouble starting (accessibility) → NEEDS structure, ignore "flexibility"
   - Trouble remembering → NEEDS explicit steps/checklists
   - Boredom (Q2) → Add variety, novelty, rotation

2. **Reconcile social conflict:**
   - Drains from people → minimize forced collaboration
   - Capable when helping → offer OPTIONAL teaching/mentoring
   - Resolution: "Help others on YOUR terms, when YOU choose"

3. **Hidden structure:**
   - Provide scaffolding but frame as "options" not "requirements"
   - Example: Not "Do steps 1-2-3" but "Here are 3 approaches—pick your favorite"

### **Final Student State Model**

```javascript
{
  intent: ["starting_tasks", "learning"],
  mode: "IGNITION", // Starting is the core problem

  drains: {
    primary: "boredom",
    secondary: ["social_energy", "forced_tasks"],
    strategy: "add_novelty_and_autonomy"
  },

  capabilities: {
    builder: "figuring_it_out",
    feedback_style: "minimal_guidance_with_hidden_structure"
  },

  avoidance: {
    root_cause: "boredom_and_low_autonomy",
    reframe: "find_interesting_angle_or_choice"
  },

  structure: {
    preference: "hidden_structure_with_autonomy_framing",
    approach: "provide_options_within_guardrails"
  },

  values: {
    meaningful_day: "learning",
    productivity_framing: "curiosity_driven"
  },

  rhythm: {
    focus_time: "unpredictable",
    work_burst: 30,
    recovery: "switching_tasks" // Novelty as recovery
  },

  accessibility: {
    needs: ["starting_support", "memory_aids"],
    adaptations: ["first_step_only", "checklists_framed_as_tools"]
  },

  overrides: {
    increase_structure: true, // Despite saying "flexibility"
    hide_structure_language: true, // Frame as autonomy
    vary_presentation: true // Boredom prevention
  }
}
```

### **Example System Outputs**

**Task Framing:**
> ❌ "Follow these 5 steps to complete the assignment."
>
> ✅ "Three ways to tackle this—pick whichever sounds most interesting: A) Start with examples, B) Dive into theory first, C) Build something broken and fix it."

**Habit Suggestion:**
> ❌ "Set a consistent study schedule every morning."
>
> ✅ "You learn best when curious. Keep a 'Questions I Want Answered' list—when something grabs you, chase it for 30 min. That's your study session."

**Feedback Style:**
> ❌ "Great job following the process!"
>
> ✅ "You found a creative approach I didn't expect. Teach me how you thought of that?"

---

## Test Case 3: The Depressed High-Achiever

### **Raw Intake Responses**

| Question | Answer |
|----------|--------|
| Q1: Help with | Managing energy, Reducing overwhelm, Finishing tasks |
| Q2: What drains | Emotional effort, Mental effort |
| Q3: Feel capable | Clear instructions, Seeing progress |
| Q4: Avoidance | Low energy, Fear of doing it wrong |
| Q5: Structure | Structure to start → freedom later |
| Q6: Wasted day | I was busy but it didn't matter, I didn't rest |
| Energy: Focus time | Unpredictable |
| Energy: Work burst | 15-25 minutes |
| Accessibility | Trouble starting, Anxiety around performance, Hyperfocus then crash |

### **Identified Conflicts**

1. **Productivity Paradox:**
   - Feels wasted if "busy but didn't matter" AND "didn't rest" (Q6)
   - **Conflict:** Guilt about both working and resting

2. **Capability vs. Reality:**
   - Feels capable with clear instructions and progress (Q3)
   - But: Emotional/mental effort draining, low energy, fear of wrong
   - **Conflict:** Intellectually capable but emotionally/energetically depleted

3. **Achievement Orientation vs. Energy:**
   - Wants to finish tasks (Q1), see progress (Q3), avoid "wasted" days (Q6)
   - But: Multiple energy red flags (Q2, Q4, accessibility)
   - **Conflict:** High standards with low capacity

### **Min/Max Parameters**

```javascript
{
  task_size: {
    min: 5,    // Micro-tasks only
    max: 15,   // Absolute max before energy crash
    stated: 25,
    actual: 10  // Realistic sustainable
  },

  daily_capacity: {
    min: 15,   // Some days this is all they have
    max: 60,   // Better days, still limited
    stated: 120, // What they think they "should" do
    actual: 30   // Realistic average
  },

  rest_validation: {
    min: 0.8,  // HIGH validation that rest is productive
    max: 1.0,  // Constant reframing needed
    actual: 0.9 // Nearly every interaction
  },

  impact_vs_activity: {
    min: 0.7,  // Strong emphasis on meaningful > busy
    max: 1.0,
    actual: 0.9 // Frame every task as impact, not activity
  }
}
```

### **Resolution Strategy**

**Apply Priority Hierarchy:**

1. **Energy is NON-NEGOTIABLE:**
   - All behavioral signals point to depletion
   - Ignore stated task sizes—use minimums
   - Prioritize rest as productive, not wasteful

2. **Reframe "wasted day":**
   - "Busy but didn't matter" → Focus on ONE impactful thing
   - "Didn't rest" → Rest IS productive
   - Resolution: Micro-impact + rest = successful day

3. **Reduce performance pressure:**
   - Fear of wrong (Q4) + anxiety (accessibility) → Lower stakes
   - "Good enough" explicit on every task
   - Celebrate starting, not just finishing

### **Final Student State Model**

```javascript
{
  intent: ["managing_energy", "reducing_overwhelm", "finishing_tasks"],
  mode: "PACER", // Energy management is primary

  drains: {
    primary: "emotional_effort",
    secondary: ["mental_effort", "performance_pressure"],
    strategy: "extreme_friction_reduction"
  },

  capabilities: {
    builder: "clear_instructions_and_progress",
    feedback_style: "gentle_with_explicit_done_criteria"
  },

  avoidance: {
    root_cause: "low_energy_and_fear",
    reframe: "rest_is_productive_and_mistakes_are_safe"
  },

  structure: {
    preference: "clear_structure_with_compassion",
    approach: "one_thing_at_a_time_with_rest_validation"
  },

  values: {
    meaningful_day: "impact_or_rest", // Both are valid
    productivity_framing: "micro_impact_counts"
  },

  rhythm: {
    focus_time: "unpredictable",
    work_burst: 10, // Very short
    recovery: "rest" // And validate it
  },

  accessibility: {
    needs: ["energy_accommodation", "performance_anxiety", "starting_support"],
    adaptations: ["tiny_tasks", "rest_as_success", "normalize_low_capacity_days"]
  },

  overrides: {
    reduce_expectations: true,
    validate_rest_heavily: true,
    reframe_busy_vs_meaningful: true,
    minimize_guilt_language: true
  }
}
```

### **Example System Outputs**

**Task Framing:**
> ❌ "Let's knock out these 5 tasks today!"
>
> ✅ "Today, pick ONE thing that would matter. Even 10 minutes on it = success. If your energy says 'rest,' that's also success."

**Habit Suggestion:**
> ❌ "Build a morning routine to boost productivity."
>
> ✅ "On days you wake up exhausted, rest is your task. On days you have a little energy, spend 10 min on something meaningful. Both days are wins."

**Feedback Style:**
> ❌ "Great work! Can you do more tomorrow?"
>
> ✅ "You did something meaningful today. That's enough. Seriously. Rest tonight—tomorrow can wait."

---

## Test Case 4: The ADHD Masked as Lazy

### **Raw Intake Responses**

| Question | Answer |
|----------|--------|
| Q1: Help with | Starting tasks, Finishing tasks, Staying consistent |
| Q2: What drains | Boring tasks, Decision-making |
| Q3: Feel capable | Completing small wins, Helping others |
| Q4: Avoidance | I don't know where to start, Boredom |
| Q5: Structure | It depends |
| Q6: Wasted day | I didn't make progress, I was busy but it didn't matter |
| Energy: Focus time | Unpredictable |
| Energy: Work burst | 15-25 minutes |
| Accessibility | Trouble starting, Trouble remembering steps, Hyperfocus then crash |

### **Identified Conflicts**

1. **Capability vs. Execution:**
   - Capable with small wins (Q3)
   - But: Can't start, can't finish, can't stay consistent (Q1)
   - **Conflict:** Knowledge of what works vs. inability to execute

2. **Structure Ambiguity:**
   - Says "It depends" (Q5)
   - But: Trouble starting, trouble remembering (accessibility)
   - **Conflict:** Unclear preference + clear executive function needs

3. **Energy Pattern:**
   - Unpredictable focus, hyperfocus crashes
   - Boredom drains, short bursts
   - **Conflict:** Variable capacity makes planning hard

### **Min/Max Parameters**

```javascript
{
  task_size: {
    min: 5,    // Tiny first steps
    max: 20,   // Before attention drifts
    stated: 25,
    actual: 12  // Average sustainable
  },

  friction_to_start: {
    min: 0,    // Must be ZERO friction
    max: 0.1,  // Any friction = won't start
    actual: 0.05 // Near-zero activation energy
  },

  external_structure: {
    min: 0.6,  // Needs significant external scaffolding
    max: 0.9,  // But needs flexibility for hyperfocus
    actual: 0.75 // High structure, adaptive to flow states
  },

  novelty_rotation: {
    min: 2,    // tasks before boredom
    max: 3,
    actual: 2   // Rotate every 2 tasks
  },

  reminder_frequency: {
    min: 2,    // hours - needs frequent external cues
    max: 4,
    actual: 3   // Every 3 hours
  }
}
```

### **Resolution Strategy**

**Apply Priority Hierarchy:**

1. **Accessibility signals dominate:**
   - Trouble starting + remembering = STRONG structure needed
   - Ignore "it depends"—they need consistent external scaffolding
   - Hyperfocus crashes = need hard stops and break enforcement

2. **Reduce friction to zero:**
   - First step must be absurdly easy
   - No decisions at start time
   - Pre-decided tasks, one-click start

3. **Work WITH executive function gaps:**
   - External memory (checklists, visual cues)
   - Body-doubling option (working "with" others asynchronously)
   - Gamification to combat boredom

### **Final Student State Model**

```javascript
{
  intent: ["starting_tasks", "finishing_tasks", "consistency"],
  mode: "IGNITION", // Starting is the bottleneck

  drains: {
    primary: "boredom",
    secondary: ["decisions", "unclear_next_steps"],
    strategy: "zero_friction_and_external_structure"
  },

  capabilities: {
    builder: "small_wins",
    feedback_style: "frequent_and_encouraging"
  },

  avoidance: {
    root_cause: "unclear_start_and_boredom",
    reframe: "first_step_only_and_variety"
  },

  structure: {
    preference: "high_external_structure_with_flow_flexibility",
    approach: "preset_tasks_with_one_click_start"
  },

  values: {
    meaningful_day: "progress",
    productivity_framing: "any_movement_counts"
  },

  rhythm: {
    focus_time: "unpredictable",
    work_burst: 12,
    recovery: "switching_tasks"
  },

  accessibility: {
    needs: ["executive_function_support", "starting_support", "memory_aids", "hyperfocus_management"],
    adaptations: [
      "external_task_queue",
      "zero_decision_starts",
      "visual_checklists",
      "hard_stop_timers",
      "novelty_rotation"
    ]
  },

  overrides: {
    provide_high_structure: true, // Despite "it depends"
    reduce_decision_points: true,
    add_external_reminders: true,
    gamify_where_possible: true
  }
}
```

### **Example System Outputs**

**Task Framing:**
> ❌ "Work on your project for 30 minutes."
>
> ✅ "Next task (already picked for you): Open the file. That's it. 2 minutes. Timer starts... now. [Auto-starts timer]"

**Habit Suggestion:**
> ❌ "Try to build a consistent study schedule."
>
> ✅ "Every day at 3pm, you get a notification: 'Open your laptop and click this link.' No decisions. Just click. If you work for 5 min or 50 min, both count."

**Feedback Style:**
> ❌ "You completed the task! Now do the next one."
>
> ✅ "🎉 Task done! +1 point. [Auto-queues next task with different type to prevent boredom] Ready for a completely different task, or need a break?"

---

## Test Case 5: The Burnt-Out Perfectionist with Imposter Syndrome

### **Raw Intake Responses**

| Question | Answer |
|----------|--------|
| Q1: Help with | Reducing overwhelm, Managing energy, Building habits |
| Q2: What drains | Emotional effort, People/social, Decision-making |
| Q3: Feel capable | Clear instructions, Encouragement |
| Q4: Avoidance | Perfectionism, Fear of doing it wrong, Low energy |
| Q5: Structure | Structure to start → freedom later |
| Q6: Wasted day | I didn't help anyone, I didn't learn anything |
| Energy: Focus time | Unpredictable |
| Energy: Work burst | 30-45 minutes |
| Accessibility | Performance anxiety, Trouble starting, Hyperfocus then crash |

### **Identified Conflicts**

1. **Self-Worth Contradiction:**
   - Wasted day if "didn't help anyone" (external validation)
   - But: People/social drains them (Q2)
   - **Conflict:** Needs others' approval but socializing depletes

2. **Perfectionism + Low Energy:**
   - Avoidance from perfectionism (Q4)
   - But: Also low energy and performance anxiety
   - **Conflict:** High standards + low capacity = paralysis

3. **Work Burst Overestimation:**
   - Says 30-45 minutes
   - But: Emotional effort drains, low energy, hyperfocus crashes
   - **Conflict:** Aspirational capacity vs. crash reality

4. **Need for Validation:**
   - Feels capable with encouragement (Q3)
   - Wasted day if didn't help others (Q6)
   - But: Emotional effort and social drain (Q2)
   - **Conflict:** External validation needed but exhausting

### **Min/Max Parameters**

```javascript
{
  task_size: {
    min: 5,    // Tiny to overcome perfectionism paralysis
    max: 20,   // Before emotional exhaustion
    stated: 45,
    actual: 15  // Realistic before crash
  },

  daily_capacity: {
    min: 20,   // Burnt-out baseline
    max: 60,   // Even "good" days are limited
    stated: 90,
    actual: 40  // Realistic sustainable
  },

  validation_frequency: {
    min: 1,    // Needs daily encouragement
    max: 1,
    actual: 1   // But framed as internal, not external
  },

  perfection_bars: {
    min: 0.5,  // Current: 100% = "good enough"
    max: 0.7,  // Target: 70% = "good enough"
    actual: 0.6 // Start here, work toward 0.5
  },

  social_interaction: {
    min: 0,    // No forced social
    max: 0.2,  // Minimal, asynchronous only
    actual: 0.1 // Optional, on their terms
  }
}
```

### **Resolution Strategy**

**Apply Priority Hierarchy:**

1. **Energy + Emotional signals override everything:**
   - Emotional effort + low energy + crashes = TINY tasks
   - Ignore stated 30-45 min bursts
   - Social draining + "didn't help" conflict = reframe helping

2. **Address perfectionism + imposter syndrome:**
   - Explicit "good enough" percentages (60% is done)
   - Fear of wrong + performance anxiety = normalize mistakes
   - Separate self-worth from productivity

3. **Resolve validation paradox:**
   - Needs encouragement but social drains
   - Solution: System provides validation (not people)
   - Reframe "helping others" to include future self

4. **Protect from burnout spiral:**
   - Structure to start (Q5) = provide it
   - Rest as non-negotiable
   - Progress ≠ perfection

### **Final Student State Model**

```javascript
{
  intent: ["reducing_overwhelm", "managing_energy", "building_habits"],
  mode: "STABILIZER", // Crisis management mode

  drains: {
    primary: "emotional_effort",
    secondary: ["social_performance", "decisions", "perfectionism"],
    strategy: "extreme_simplification_and_validation"
  },

  capabilities: {
    builder: "clear_instructions_and_encouragement",
    feedback_style: "warm_with_explicit_imperfection_permission"
  },

  avoidance: {
    root_cause: "perfectionism_fear_and_depletion",
    reframe: "good_enough_explicit_and_rest_validation"
  },

  structure: {
    preference: "high_structure_with_compassion",
    approach: "tiny_steps_with_constant_reassurance"
  },

  values: {
    meaningful_day: "helped_self_or_others_or_rested", // All valid
    productivity_framing: "survival_is_success"
  },

  rhythm: {
    focus_time: "unpredictable",
    work_burst: 15,
    recovery: "rest" // Not social
  },

  accessibility: {
    needs: ["performance_anxiety", "starting_support", "burnout_recovery"],
    adaptations: [
      "micro_tasks",
      "explicit_perfection_bars",
      "system_validation_not_social",
      "rest_as_primary_task"
    ]
  },

  overrides: {
    reduce_work_burst: true, // 45 min is dangerous
    provide_validation: true, // System, not people
    reframe_helping: true, // Include self-care as helping future self
    normalize_imperfection: true, // Constant messaging
    protect_from_overwork: true // Hard caps on daily load
  }
}
```

### **Example System Outputs**

**Task Framing:**
> ❌ "Complete this assignment to the best of your ability."
>
> ✅ "This task is done when you hit 60%. Not 100%—sixty. Seriously. If it's 'pretty okay,' it's done. Here's your 15-minute timer."

**Habit Suggestion:**
> ❌ "Volunteer to help others build your resume."
>
> ✅ "You want to help people? Start with one person who really needs it: Future You. Today's task: something that makes tomorrow easier. That's helping."

**Feedback Style:**
> ❌ "Great work! You're so talented."
>
> ✅ "You finished something imperfect, and that's brave. You're learning that 'done' matters more than 'perfect.' I'm proud of you—you should be too."

**Daily Check-in:**
> "Today you did enough. You really did. Rest isn't giving up—it's preparation. Tomorrow's a new day, and you'll be there for it because you rested today."

---

## Test Summary Matrix

| Test Case | Primary Conflict | Signal Priority | Key Override | Risk of Mishandling |
|-----------|------------------|-----------------|--------------|---------------------|
| **1: Aspirational Overachiever** | Stated capacity vs. actual | Energy/avoidance > preferences | Reduce task size from 60→15 min | Burnout from accepting stated capacity |
| **2: Chaotic Freedom-Seeker** | Stated flexibility vs. executive function needs | Accessibility > autonomy desire | Add hidden structure | Rejection if structure is visible |
| **3: Depressed High-Achiever** | Achievement drive vs. depleted energy | Energy > all goals | Validate rest as success | Guilt spiral from productivity pressure |
| **4: ADHD Masked as Lazy** | "It depends" vs. clear executive dysfunction | Accessibility > stated flexibility | Provide strong external structure | Task avoidance from unclear starts |
| **5: Burnt-Out Perfectionist** | Need for validation vs. social depletion | Energy + emotional > social goals | System validation, no people | Isolation or perfectionism spiral |

---

## Implementation Checklist

For each contradictory profile, the system must:

- [ ] **Identify conflicts** between stated preferences and behavioral signals
- [ ] **Apply signal priority hierarchy** (behavioral > emotional > stated preferences)
- [ ] **Calculate min/max boundaries** for task size, structure, validation needs
- [ ] **Generate overrides** when stated preferences would cause harm
- [ ] **Test one variable** at a time (don't change everything at once)
- [ ] **Observe outcomes** and adapt (completion rates, engagement, reported satisfaction)
- [ ] **Provide transparency** ("I'm suggesting X because you mentioned Y")

---

## Edge Case: All Answers Skipped

**Scenario:** Student skips every question except Q1.

**Min/Max Parameters:**
```javascript
{
  task_size: { min: 10, max: 30, actual: 20 }, // Conservative middle
  structure_level: { min: 0.4, max: 0.6, actual: 0.5 }, // Moderate
  feedback: "encouraging", // Safe default
  check_in_frequency: 2 // Every other day to gather data
}
```

**Strategy:**
- Default to safest, most generalizable settings
- Prioritize gathering observational data
- Frequent check-ins: "I don't know much about you yet—help me learn what works?"

---

**Document Version:** 1.0
**Last Updated:** 2026-02-07
**Status:** Ready for Implementation Testing
