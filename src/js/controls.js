export function setupTouchControls({ left, right, rotate, down }) {
  const container = document.getElementById('touch-controls');
  if (!container || window.getComputedStyle(container).display === 'none') {
    return;
  }

  const bind = (action, handler) => {
    const btn = container.querySelector(`[data-action="${action}"]`);
    if (btn) {
      btn.addEventListener(
        'touchstart',
        (e) => {
          e.preventDefault();
          handler();
        },
        { passive: false }
      );
    }
  };

  bind('left', left);
  bind('right', right);
  bind('rotate', rotate);
  bind('down', down);
}
