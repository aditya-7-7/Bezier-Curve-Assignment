# Interactive Cubic Bézier Curve with Spring Physics

This project implements an **interactive cubic Bézier curve** rendered using HTML5 Canvas.  
The curve behaves like a **soft, elastic rope** by combining cubic Bézier mathematics with a **spring–damping physics model** applied to its control points.

All mathematics, physics, and rendering logic are implemented **manually from scratch**, without using any built-in Bézier, animation, or physics libraries.

---

## 1. Project Overview

- The curve is defined by four control points
- Two endpoints remain fixed
- Two control points move dynamically using physics
- Mouse input controls the motion
- The system runs in real time at approximately 60 FPS

The focus of this project is to demonstrate understanding of:
- Curve mathematics
- Analytical derivatives (tangents)
- Basic physics modeling
- Real-time graphics rendering

---

## 2. Vector Math Utilities

To support all math and physics calculations, basic 2D vector operations are implemented manually:

- `vec(x, y)` — create a vector  
- `add(a, b)` — vector addition  
- `sub(a, b)` — vector subtraction  
- `mul(v, s)` — scalar multiplication  
- `len(v)` — vector magnitude  
- `norm(v)` — normalize vector  
- `clamp(v, min, max)` — constrain values to a range  

These utilities are reused throughout the Bézier calculations, physics simulation, and rendering logic.

---

## 3. Cubic Bézier Curve Mathematics

### 3.1 Curve Definition

The curve is defined using four control points:

- **P0** and **P3** → fixed endpoints  
- **P1** and **P2** → dynamic control points  

The cubic Bézier equation implemented in the code is:

```text
B(t) = (1 - t)^3 * P0
     + 3 * (1 - t)^2 * t * P1
     + 3 * (1 - t) * t^2 * P2
     + t^3 * P3
