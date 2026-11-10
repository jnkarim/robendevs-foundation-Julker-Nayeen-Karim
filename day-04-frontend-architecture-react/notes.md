## Start With React

Components are the building blocks of UI in React.

### Implement a UI in React

**Step 1: Break the UI into a Component Hierarchy**
- Break the UI into small Components.
- Each Component should have a single responsibility.
- One Component can contain multiple Child Components.

---

**Step 2: Build the Static Version First**
- Build the UI without adding interactivity.
- Create Components that reuse other Components.
- Pass data from Parent to Child using Props.
- Props flow from Parent to Child.
- There are two approaches to building Components: Top Down and Bottom Up.

---

**Step 3: Find the Minimal but Complete Representation of UI State**
- Introduce State to make the UI interactive.
- Keep State minimal by following the DRY (Don't Repeat Yourself) principle.
- Store only necessary changing data in State.
- Keep State in the nearest common Parent Component when multiple Components need the same data (Lifting State Up).
- Derive other values from existing State instead of storing duplicate data.

**Reference:** [Thinking in React](https://react.dev/learn/thinking-in-react)