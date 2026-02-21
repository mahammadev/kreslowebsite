---
name: session-summary
description: Generates a structured session handover document when user types `/done`. Triggers at the end of development sessions to document what was built, changed, and left unfinished. Creates a markdown file at docs/session_states/session_[YYYY-MM-DD].md with Quick reference, Files Modified, New Dependencies, Current State, Next Steps, and Common Pitfalls.
---

# Session Summary Generator

When the user types `/done`, generate a structured session handover document.

## Output Location

Create the file at: `docs/session_states/session_[YYYY-MM-DD].md`

If the directory doesn't exist, create it. If file creation isn't supported, output the raw markdown.

## Output Format

Use this exact structure:

```markdown
# Session Summary - [Brief Title of Work Done]

## When to use this log
**Use this manifest when:**
- Resuming work after a break to avoid the "context bottleneck."
- Reviewing recent logic changes for debugging.
- Tracking the evolution of the codebase without manual git diffing.

**Key areas covered today:**
- **Core Logic:** [Summary of the main problem solved]
- **File System:** [List of created/modified files]
- **Technical Debt:** [What was left messy or temporary]

## Quick reference

### Critical Updates
1. **[Primary Change]** - [Brief description]
2. **[Secondary Change]** - [Brief description]

### Logic Patterns Introduced
[Provide a code snippet of the most important function or component written today]

## Categories overview

### 1. Files Modified
- `file/path/here.ext`: [Specific change made]
- `another/file.ext`: [Specific change made]

### 2. New Dependencies & Env
- [List any npm/pip installs or .env additions]

### 3. Current State of Play
- [Describe exactly where the code stands. Does it run? Is the UI finished? Is the API connected?]

### 4. The "Start Here" Instruction (Next Steps)
1. **First Priority:** [The very next line of code or command to run]
2. **Secondary:** [Next logical task]

## Common Pitfalls encountered
- [List any bugs we hit today and how we bypassed them to avoid repeating mistakes]
```

## Process

1. Review the entire conversation history
2. Identify all files created, modified, or deleted
3. Identify the main problem solved and core logic changes
4. Extract the most important code pattern written (for Logic Patterns section)
5. Document current state honestly - does it run? Is it finished?
6. Create specific, actionable next steps
7. List any bugs hit and how they were bypassed

## Guidelines

- Be concise but thorough
- The "Start Here" section should be specific enough to act on immediately
- Don't sugarcoat issues - document technical debt clearly
- Include specific file paths
- The Logic Patterns snippet should be the most important/reusable code from the session
