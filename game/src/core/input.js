// CALDERA COURIER — core/input.js
// Keyboard + mouse state, with edge-triggered "pressed" keys so menus
// and toggles (C camera, M mouse-aim, Space drop) fire once per press.
export function createInput() {
  return {
    keys: new Set(), pressed: new Set(),
    mouseX: 0, mouseY: 0, mouseDown: false,
    /** -1..1 steer from mouse position when mouse-aim is on. */
    aimX: 0, aimY: 0,
  };
}
export function attachInput(input, canvas) {
  const down = (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
    if (!e.repeat) input.pressed.add(e.key.length === 1 ? e.key.toLowerCase() : e.key);
    input.keys.add(e.key.length === 1 ? e.key.toLowerCase() : e.key);
  };
  const up = (e) => input.keys.delete(e.key.length === 1 ? e.key.toLowerCase() : e.key);
  window.addEventListener('keydown', down);
  window.addEventListener('keyup', up);
  window.addEventListener('blur', () => { input.keys.clear(); });
  canvas.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    input.mouseX = e.clientX - r.left; input.mouseY = e.clientY - r.top;
    input.aimX = ((input.mouseX / r.width) * 2 - 1);
    input.aimY = ((input.mouseY / r.height) * 2 - 1);
  });
  canvas.addEventListener('mousedown', () => { input.mouseDown = true; });
  window.addEventListener('mouseup', () => { input.mouseDown = false; });
}
export const isDown = (input, ...names) => names.some((n) => input.keys.has(n));
export const wasPressed = (input, ...names) => names.some((n) => input.pressed.has(n));
export function endFrame(input) { input.pressed.clear(); }
