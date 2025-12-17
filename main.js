const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const vec = (x, y) => ({ x, y });
const add = (a, b) => vec(a.x + b.x, a.y + b.y);
const sub = (a, b) => vec(a.x - b.x, a.y - b.y);
const mul = (v, s) => vec(v.x * s, v.y * s);
const len = (v) => Math.hypot(v.x, v.y);
const norm = (v) => {
  const l = len(v);
  return l === 0 ? vec(0, 0) : vec(v.x / l, v.y / l);
};
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function cubicBezier(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return add(
    add(mul(p0, u * u * u), mul(p1, 3 * u * u * t)),
    add(mul(p2, 3 * u * t * t), mul(p3, t * t * t))
  );
}

function cubicBezierTangent(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return add(
    add(mul(sub(p1, p0), 3 * u * u),
        mul(sub(p2, p1), 6 * u * t)),
    mul(sub(p3, p2), 3 * t * t)
  );
}

let P0, P3;
let P1, P2;
let v1 = vec(0, 0);
let v2 = vec(0, 0);
let target1, target2;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  P0 = vec(150, canvas.height / 2);
  P3 = vec(canvas.width - 150, canvas.height / 2);

  P1 ??= vec(P0.x + 200, P0.y);
  P2 ??= vec(P3.x - 200, P3.y);

  target1 = { ...P1 };
  target2 = { ...P2 };
}

window.addEventListener("resize", resize);
resize();

const stiffness = 0.02;
const damping = 0.88;
const margin = 80;

function spring(pos, vel, target) {
  const f = sub(target, pos);
  vel.x += f.x * stiffness;
  vel.y += f.y * stiffness;

  vel.x *= damping;
  vel.y *= damping;

  pos.x += vel.x;
  pos.y += vel.y;
}

function softBounds(pos, vel) {
  if (pos.x < margin) vel.x += (margin - pos.x) * 0.08;
  if (pos.x > canvas.width - margin)
    vel.x -= (pos.x - (canvas.width - margin)) * 0.08;

  if (pos.y < margin) vel.y += (margin - pos.y) * 0.08;
  if (pos.y > canvas.height - margin)
    vel.y -= (pos.y - (canvas.height - margin)) * 0.08;
}

window.addEventListener("mousemove", (e) => {
  const x = clamp(e.clientX, margin, canvas.width - margin);
  const y = clamp(e.clientY, margin, canvas.height - margin);

  target1 = vec(x - 120, y);
  target2 = vec(x + 120, y);
});

function drawPoint(p, c) {
  ctx.beginPath();
  ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
  ctx.fillStyle = c;
  ctx.fill();
}

function drawTangent(p, t) {
  const d = norm(t);
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(p.x + d.x * 30, p.y + d.y * 30);
  ctx.strokeStyle = "#00ffaa";
  ctx.stroke();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  spring(P1, v1, target1);
  spring(P2, v2, target2);

  softBounds(P1, v1);
  softBounds(P2, v2);

  ctx.beginPath();
  for (let t = 0; t <= 1.001; t += 0.01) {
    const p = cubicBezier(P0, P1, P2, P3, t);
    t === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  }
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.stroke();

  for (let t = 0; t <= 1; t += 0.1) {
    const p = cubicBezier(P0, P1, P2, P3, t);
    const tan = cubicBezierTangent(P0, P1, P2, P3, t);
    drawTangent(p, tan);
  }

  drawPoint(P0, "#ff5555");
  drawPoint(P1, "#ffaa00");
  drawPoint(P2, "#ffaa00");
  drawPoint(P3, "#ff5555");

  requestAnimationFrame(animate);
}

animate();
