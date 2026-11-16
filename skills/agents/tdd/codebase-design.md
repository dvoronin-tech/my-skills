# Codebase design

Design **deep modules**: a lot of behaviour behind a small interface, placed at a clean seam, testable through that interface. Use this language wherever code is being designed or restructured. The aim is leverage for callers, locality for maintainers, and testability for everyone.

`tdd` reads this when the shape of a seam is in question. It is a vocabulary. The Deepening and Design it twice sections are sessions: run them only when the user asks to explore an interface.

## Glossary

Use these terms exactly. Consistent language is the point.

**Module**: anything with an interface and an implementation. Deliberately scale-agnostic: a function, class, package, or tier-spanning slice. Avoid: unit, component, service.

**Interface**: everything a caller must know to use the module correctly: the type signature, but also invariants, ordering constraints, error modes, required configuration, and performance characteristics. Avoid: API, signature (too narrow, they refer only to the type-level surface).

**Implementation**: what's inside a module, its body of code. Distinct from **Adapter**: a thing can be a small adapter with a large implementation (a Postgres repo) or a large adapter with a small implementation (an in-memory fake). Reach for "adapter" when the seam is the topic; "implementation" otherwise.

**Depth**: leverage at the interface. The amount of behaviour a caller (or test) can exercise per unit of interface they have to learn. A module is **deep** when a large amount of behaviour sits behind a small interface, **shallow** when the interface is nearly as complex as the implementation.

**Seam** (Michael Feathers): a place where you can alter behaviour without editing in that place; the location at which a module's interface lives. Where to put the seam is its own design decision, distinct from what goes behind it. Avoid: boundary (overloaded with DDD's bounded context).

**Adapter**: a concrete thing that satisfies an interface at a seam. Describes role (what slot it fills), not substance (what's inside).

**Leverage**: what callers get from depth. More capability per unit of interface they learn. One implementation pays back across N call sites and M tests.

**Locality**: what maintainers get from depth. Change, bugs, knowledge, and verification concentrate in one place rather than spreading across callers. Fix once, fixed everywhere.

## Deep vs shallow

**Deep module** = small interface + lots of implementation. Few methods, simple params, complex logic hidden.

**Shallow module** = large interface + little implementation. Many methods, complex params, a body that passes through. Avoid this shape.

When designing an interface, ask:

- Can I reduce the number of methods?
- Can I simplify the parameters?
- Can I hide more complexity inside?

## Principles

- **Depth is a property of the interface, not the implementation.** A deep module can be internally composed of small, mockable, swappable parts; they just aren't part of the interface. A module can have **internal seams** (private to its implementation, used by its own tests) as well as the **external seam** at its interface.
- **The deletion test.** Imagine deleting the module. If complexity vanishes, it was a pass-through. If complexity reappears across N callers, it was earning its keep.
- **The interface is the test surface.** Callers and tests cross the same seam. If you want to test past the interface, the module is probably the wrong shape.
- **One adapter means a hypothetical seam. Two adapters means a real one.** Don't introduce a seam unless something actually varies across it.

## Designing for testability

Good interfaces make testing natural:

1. **Accept dependencies, don't create them.** A function that receives its payment gateway can be tested with a stand-in. A function that constructs the gateway inside cannot.
2. **Return results, don't produce side effects.** A function that returns a discount can be asserted on. A function that mutates the cart's total hides the result.
3. **Small surface area.** Fewer methods means fewer tests. Fewer params means simpler test setup.

## Relationships

- A **Module** has exactly one **Interface** (the surface it presents to callers and tests).
- **Depth** is a property of a **Module**, measured against its **Interface**.
- A **Seam** is where a **Module**'s **Interface** lives.
- An **Adapter** sits at a **Seam** and satisfies the **Interface**.
- **Depth** produces **Leverage** for callers and **Locality** for maintainers.

## Rejected framings

- **Depth as ratio of implementation-lines to interface-lines** (Ousterhout): rewards padding the implementation. We use depth-as-leverage instead.
- **"Interface" as the TypeScript `interface` keyword or a class's public methods**: too narrow. Interface here includes every fact a caller must know.
- **"Boundary"**: overloaded with DDD's bounded context. Say **seam** or **interface**.

## Deepening

How to deepen a cluster of shallow modules, given its dependencies. Uses module, interface, seam, and adapter as defined above.

### Dependency categories

When assessing a candidate for deepening, classify its dependencies. The category determines how the deepened module is tested across its seam.

1. **In-process.** Pure computation, in-memory state, no I/O. Always deepenable: merge the modules and test through the new interface directly. No adapter needed.
2. **Local-substitutable.** Dependencies that have local test stand-ins (PGLite for Postgres, in-memory filesystem). Deepenable if the stand-in exists. The deepened module is tested with the stand-in running in the test suite. The seam is internal; no port at the module's external interface.
3. **Remote but owned (ports and adapters).** Your own services across a network boundary (microservices, internal APIs). Define a port (interface) at the seam. The deep module owns the logic; the transport is injected as an adapter. Tests use an in-memory adapter. Production uses an HTTP, gRPC, or queue adapter.
4. **True external (mock).** Third-party services you don't control. The deepened module takes the external dependency as an injected port; tests provide a mock adapter.

### Seam discipline

- **One adapter means a hypothetical seam. Two adapters means a real one.** Don't introduce a port unless at least two adapters are justified (typically production + test). A single-adapter seam is just indirection.
- **Internal seams vs external seams.** A deep module can have internal seams (private to its implementation, used by its own tests) as well as the external seam at its interface. Don't expose internal seams through the interface just because tests use them.

### Testing strategy: replace, don't layer

- Old unit tests on shallow modules become waste once tests at the deepened module's interface exist; delete them.
- Write new tests at the deepened module's interface. The interface is the test surface.
- Tests assert on observable outcomes through the interface, not internal state.
- Tests should survive internal refactors, since they describe behaviour, not implementation. If a test has to change when the implementation changes, it's testing past the interface.

## Design it twice

When the user wants to explore alternative interfaces for a chosen deepening candidate, use this parallel sub-agent pattern. The first idea is unlikely to be the best.

### 1. Frame the problem space

Before spawning sub-agents, write a user-facing explanation of the problem space for the chosen candidate:

- The constraints any new interface would need to satisfy
- The dependencies it would rely on, and which category they fall into (see Deepening)
- A rough illustrative code sketch to ground the constraints, not a proposal

Show this to the user, then proceed to the next step. The user reads and thinks while the sub-agents work in parallel.

### 2. Spawn sub-agents

Spawn 3 or more sub-agents in parallel. Each must produce a radically different interface for the deepened module.

Prompt each sub-agent with a separate technical brief (file paths, coupling details, dependency category, what sits behind the seam). Give each agent a different design constraint:

- Agent 1: minimize the interface. Aim for 1–3 entry points. Maximise leverage per entry point.
- Agent 2: maximise flexibility. Support many use cases and extension.
- Agent 3: optimise for the most common caller. Make the default case trivial.
- Agent 4, when it applies: design around ports and adapters for cross-seam dependencies.

Include this file's vocabulary and the project's glossary in the brief so each sub-agent names things the same way.

Each sub-agent outputs:

1. Interface (types, methods, params, plus invariants, ordering, error modes)
2. Usage example showing how callers use it
3. What the implementation hides behind the seam
4. Dependency strategy and adapters
5. Trade-offs: where leverage is high, where it's thin

### 3. Present and compare

Present designs sequentially so the user can absorb each one, then compare them in prose. Contrast by depth (leverage at the interface), locality (where change concentrates), and seam placement.

After comparing, give a recommendation: which design is strongest and why. If elements from different designs combine well, propose a hybrid.
