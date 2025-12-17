# Interactive Cubic Bézier Curve
---

## 1. Vector Math Utilities

Basic 2D vector operations are implemented:

- `vec(x, y)` → creates a vector
- `add(a, b)` → vector addition
- `sub(a, b)` → vector subtraction
- `mul(v, s)` → scalar multiplication
- `len(v)` → vector magnitude
- `norm(v)` → normalized unit vector
- `clamp(v, min, max)` → limits values to a range

These utilities are used consistently throughout the math, physics, and rendering stages.

---

## 2. Cubic Bézier Curve Mathematics

### 2.1 Curve Equation

The curve is defined using **four control points**:

- **P₀** and **P₃**: fixed endpoints  
- **P₁** and **P₂**: dynamic control points driven by physics

The cubic Bézier equation implemented in the code is:

\[
B(t) = (1 - t)^3 P_0
     + 3(1 - t)^2 t P_1
     + 3(1 - t) t^2 P_2
     + t^3 P_3
\]

where:
- \( t \in [0, 1] \)
- The curve is sampled at small increments (`t += 0.01`) for smooth rendering

This equation ensures a smooth curve that interpolates between the endpoints while responding naturally to control point motion.

---

### 2.2 Tangent Computation

To visualize the direction of the curve, the **analytical derivative** of the Bézier curve is computed:

\[
B'(t) = 3(1 - t)^2 (P_1 - P_0)
      + 6(1 - t)t (P_2 - P_1)
      + 3t^2 (P_3 - P_2)
\]

- Tangents are computed mathematically, not approximated
- Each tangent vector is normalized
- Short tangent lines are drawn at intervals along the curve

---

## 3. Control Points and Canvas Setup

- The canvas automatically resizes to match the browser window
- Endpoints **P₀** and **P₃** are recalculated on resize to remain centered horizontally
- Control points **P₁** and **P₂** are initialized relative to the endpoints
- Targets for **P₁** and **P₂** are updated dynamically based on user input

This makes the system responsive to both window resizing and interaction.

---

## 4. Physics Model (Spring–Damping System)

### 4.1 Spring Force

The dynamic control points (**P₁** and **P₂**) follow a spring equation:

\[
\text{force} = \text{target} - \text{position}
\]

Velocity is updated using:

\[
v = v + k \cdot \text{force}
\]

where:
- \( k \) is the spring stiffness (`stiffness = 0.02`)

---

### 4.2 Damping

To prevent endless oscillations, damping is applied:

\[
v = v \cdot d
\]

where:
- \( d \) is the damping factor (`damping = 0.88`)

This results in smooth, realistic motion that gradually settles.

---

### 4.3 Position Update

After applying force and damping, positions are updated using velocity:

\[
x = x + v
\]

This explicit integration maintains simplicity and stability in the physics.

---

## 5. Soft Boundary Constraints

A Bézier curve can extend outside the viewport even if control points are near the edge.  
To prevent this while preserving realism, **soft boundary forces** are applied:

- When a control point approaches the canvas edge, a restoring force pushes it back
- No hard clamping is used, avoiding abrupt motion
- This maintains smooth and physically plausible behavior

The margin distance is defined as:

```js
const margin = 80;
