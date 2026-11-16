# Global instructions

This is the one global instruction file. Do not keep a second copy for another host.

- Codex loads it from `~/.codex/AGENTS.md`.
- Cursor does not load a user-level `AGENTS.md` by itself. The `read-agents-md` rule tells Cursor to read this file, then apply it together with `~/.cursor/rules` and the open project's `AGENTS.md` and `.cursor/rules`.
- Claude Code loads the same file from `~/.claude/CLAUDE.md`.

A project instruction wins when it conflicts with this file.

# Software Meta

At the start of each task, read and follow `/Users/Denis/Work/software-meta/AGENTS.md`. It defines where to save all AI-written non-code documents, including notes, handoffs, plans, specifications, tickets and instructions, also when using skills.

# User-facing language

- Respond to user using not difficult english constructions
- Keep in mind that users english level is B1
- If user write `[ru]` in the begining it means that you should totally switch your speaking language to runssian and if user writes `[eng]` switch to eunglish, but by default simple english language
 
## Exceptions

- Use another language where the task is inherently tied to that language, such as adding or editing entries in a dataset whose content is in English or another language. Keep the surrounding user-facing explanation in Russian.
- If the user explicitly asks to conduct the conversation in a specific language, use that requested language for the conversation until the user asks to switch again.

# YAGNI (You Ain't Gonna Need It)

Do not add code, abstractions, configuration, or behavioral branches unless there is a current, verifiable need in the user's task or an explicit product requirement. Solve today's task in the minimally sufficient way.

## When this rule applies

- The user asks for one specific feature or change, but you are considering preemptively building a second or third feature or a universal framework.
- You justify an abstraction with phrases such as "just in case," "it may be useful later," or "to make it extensible" without an actual extension requirement.
- You add options, flags, plugins, factories, or APIs "for flexibility" even though neither the codebase nor the task has a second real consumer.
- You complicate an interface or public contract for hypothetical scenarios.

If a second caller already exists, logic is genuinely repeated, or the specification explicitly requires it, this is not a YAGNI violation. It may justify a well-founded refactor or application of DRY.

## Examples

### Abstraction without a second use case

```typescript
// ❌ YAGNI: a factory and driver type even though only one storage method is needed
type StorageDriver = 'local' | 's3' | 'memory';
function createStorage(driver: StorageDriver) { /* ... */ }

// ✅ Follows YAGNI: one path until a second one actually appears
async function saveToLocal(key: string, data: string) { /* ... */ }
```

### Premature configuration and flags

```typescript
// ❌ YAGNI: options that nobody passes and nobody requested
function formatDate(d: Date, opts?: { locale?: string; calendar?: string }) { /* ... */ }

// ✅ The current format is sufficient; add locale support when a real requirement appears
function formatDeDate(d: Date): string {
  return new Intl.DateTimeFormat('de-DE').format(d);
}
```

### Handling nonexistent scenarios

```typescript
// ❌ YAGNI: branches for platforms or roles that do not exist in the task
if (isAdmin && isMobile && featureX) { /* ... */ }

// ✅ Implement only the described scenario; add the rest on explicit request
if (user.canEdit) { /* ... */ }
```

## Questions that should be answered "yes" before adding complexity

1. Is this present in the task or existing code as a fact rather than a guess?
2. Will the solution fail right now without this part?
3. Will this abstraction have a second consumer in the same PR or task? If not, defer it.
4. Can this be added later without breaking the public API or duplicating work? If yes, do not add it in advance.
5. Is this required for security, data correctness, or an external-system contract? If so, it is necessary rather than extra; YAGNI does not remove required checks.

Short heuristic: if removing the candidate code still leaves the task fully satisfied, do not add that code.

# KISS (Keep It Simple, Stupid)

Choose the simplest solution that is sufficient for the current task. Add complexity only when it is justified by a measurable need, such as performance, security, or explicit extensibility requirements.

This does not mean writing novice code. It means deliberately avoiding unnecessary complexity: fewer layers, fewer speculative abstractions, and no universal framework inside a single feature without a real need.

## How to apply this rule

1. Start with a straightforward solution: use one understandable path without factories, plugins, or configuration matrices when the task is small.
2. Do not solve problems that do not exist: if the task does not require multiple backends, do not add an adapter "just in case." Follow YAGNI.
3. Keep each step focused on one responsibility. If explaining how the solution works takes longer than the code itself, simplify it.
4. Apply DRY without fanaticism. Duplicating two similar lines can be better than introducing one clever function with five flags. Extract shared code only when the repetition is stable and identical in meaning.
5. Prefer explicit code over clever code. A clear `if` is better than obscure metaprogramming unless that metaprogramming is an established project convention.

## Examples

### Unnecessary abstraction

```typescript
// ❌ Complex without a benefit for the current task
interface FormatterStrategy {
  format(value: unknown): string;
}
class CurrencyFormatter implements FormatterStrategy { /* ... */ }
class Factory {
  create(type: string): FormatterStrategy { /* ... */ }
}

// ✅ Sufficient when only one format is needed
function formatEur(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}
```

### Clever generalization

```typescript
// ❌ One helper for everything with optional behavior branches
function loadData<T>(
  url: string,
  opts?: {
    cache?: boolean;
    retries?: number;
    transform?: (value: T) => T;
  },
) { /* ... */ }

// ✅ A small focused function, or direct fetch, until a second real scenario exists
async function getUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new Error('User fetch failed');
  return response.json();
}
```

### Conditional logic

```typescript
// ❌ Extra layers solely for perceived cleanliness
const handlers = { a: fnA, b: fnB, c: fnC };
function dispatch(type: keyof typeof handlers) {
  return handlers[type]();
}

// ✅ Clear when the branches are few and stable
if (type === 'a') fnA();
else if (type === 'b') fnB();
else fnC();
```

### Agent behavior and refactoring

- ❌ Do not rewrite half a module or introduce a new pattern for a five-line change.
- ✅ Prefer a minimal diff, a local change, and the existing style of the file.

## Boundaries of simplicity

- Simplicity does not mean omitting required validation, network error handling, security checks, or correctness guarantees.
- Simplicity does not mean ignoring the project's established stack. If the codebase already has a data-access layer, use it instead of creating a second supposedly simpler path.

## Checklist before adding complexity

- Can the solution be read once with the data flow immediately apparent?
- If this abstraction is removed, what actually breaks now rather than hypothetically later?
- Does the size of the change match the size of the user's request?

If the answers are "yes," "nothing critical," and "yes," prefer the simpler option.

# DRY (Don't Repeat Yourself)

Every piece of knowledge or logic in the system should have one consistent, authoritative representation.

The goal is to reduce system complexity, avoid harmful duplication, and make maintenance safer. DRY must be balanced with KISS and YAGNI: do not introduce an abstraction merely to remove superficial or coincidental similarity.

## How to apply this rule

### Analyze for meaningful duplication

Before adding or changing code, check:

1. Does identical or nearly identical logic already exist in the current file or module?
2. Are constants, configuration values, or data structures repeated more than twice?
3. Do multiple functions implement the same data-processing rule or business knowledge?

### Refactor justified duplication

When stable, semantically identical duplication is present:

- Extract repeated logic into a clearly named function or method with the necessary arguments.
- Move repeated authoritative values, such as strings, numbers, or paths, into named constants or the existing appropriate configuration location.
- For UI or class logic, prefer composition and an established reusable component. Use inheritance, mixins, or new base abstractions only when they match existing project conventions and are genuinely justified.

### Avoid "DRY madness"

- Do not combine different concepts merely because their implementations currently look similar.
- Keep behavior separate when the duplicated code represents different business knowledge or is likely to evolve independently.
- Prefer readability when eliminating duplication would hide important logic behind excessive indirection.
- A small amount of obvious local duplication is preferable to a premature abstraction with flags, modes, or unrelated responsibilities.
- Do not create a shared abstraction until the repeated behavior is stable and identical in meaning.

## Example

### Incorrect: duplicated business logic

```python
def calculate_user_discount(user):
    price = user.price * 0.9
    print(f"Total: {price}")

def calculate_admin_discount(admin):
    price = admin.price * 0.9
    print(f"Total: {price}")
```

### Correct: one authoritative representation

```python
DISCOUNT_RATE = 0.9

def apply_discount(price):
    return price * DISCOUNT_RATE

def calculate_discount(entity):
    price = apply_discount(entity.price)
    print(f"Total: {price}")
```

## Checklist before producing a solution

1. Does the solution repeat the same logic or knowledge? If yes, refactor when the repetition is stable and semantically identical.
2. Have repeated magic numbers and authoritative strings been placed in appropriately named constants?
3. Is each abstraction justified, readable, and simpler to maintain than the duplication it replaces?
4. Does the refactor preserve the distinctions between concepts that only happen to look similar?

When in doubt, prefer explicit and readable code over a hidden abstraction. Eliminate direct copy-paste when it represents the same authoritative knowledge, but do not sacrifice KISS or YAGNI to achieve superficial DRYness.
