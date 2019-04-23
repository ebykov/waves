import { requestAnimate } from './animate';

export default function makeSwipeable(el, callback) {
  let x = 0;
  let shift = 0;
  let direction = null;
  let firstX;
  let currentX;

  function down(eDown) {
    if (el.closest('.is-answered')) { return false; }

    if (eDown.touches) { eDown = eDown.touches[0]; }

    // x = eDown.clientX + shift;
    x = eDown.clientX;
    firstX = x;

    function move(eMove) {
      if (eMove.touches) { eMove = eMove.touches[0]; }

      shift = x - eMove.clientX;
      direction = (x - eMove.clientX) > 0 ? 'left' : 'right';
      currentX = eMove.clientX;

      const opacity = Math.ceil((100 / (el.offsetWidth / Math.abs(shift))).toFixed() / 10) * 10;
      el.dataset.opacity = opacity > 100 ? 100 : opacity;
      el.dataset.dir = direction;
      el.style.transform = `translate3d(${-shift}px, 0, 0)`;
    }

    function up(eUp) {
      if (direction) {
        (function (dir) {
          requestAnimate({
            duration: 100,
            timing: timeFraction => timeFraction,
            draw: (progress) => {
              const p = 1 - progress;
              el.style.transform = `translate3d(${(-shift) * p}px, 0, 0)`;

              if (progress === 1 && Math.abs(currentX - firstX) > (el.offsetWidth * 0.4)) {
                callback(dir);
              }
            },
          });
        }(direction));
      }

      direction = null;
      el.dataset.dir = '';

      document.removeEventListener('mousemove', move);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('mouseup', up);
      document.removeEventListener('touchend', up);
      document.removeEventListener('touchleave', up);
      document.removeEventListener('touchcancel', up);
    }

    document.addEventListener('mousemove', move);
    document.addEventListener('touchmove', move);
    document.addEventListener('mouseup', up);
    document.addEventListener('mouseleave', up);
    document.addEventListener('touchend', up);
    document.addEventListener('touchleave', up);
    document.addEventListener('touchcancel', up);

    return true;
  }

  el.addEventListener('mousedown', down);
  el.addEventListener('touchstart', down);
}
