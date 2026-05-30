import { useEffect, useRef } from 'react';

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const WORDS = [
  'COMMON_CORE', 'TYPERUN', 'FT_TRANSCENDANCE',
  'JEROME', 'AKHMED', 'TIMOTHEE', 'AXELLE', 'KEVIN', '42'
];

const SPECIAL = '{}[]()<>;:=!|/\\&#@%*+-_~^$';
const CHAR_POOL = [...new Set([...WORDS.join(''), ...SPECIAL, '0', '1'])].join('');

function randomChar() {
  return CHAR_POOL[randomInt(0, CHAR_POOL.length - 1)];
}

function pickWord() {
  const word = WORDS[randomInt(0, WORDS.length - 1)];
  return [...word, ' ', ' '];
}

export default function MatrixRain() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    let cancelled = false;

    function init() {
      cancelled = true;
      container!.innerHTML = '';
      cancelled = false;

      function loop(fn: () => void, delay: number) {
        let lastTime = Date.now();

        function tick() {
          if (cancelled) return;

          const now = Date.now();
          if (now - lastTime >= delay) {
            fn();
            lastTime = now;
          }

          requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      }

      const charSize = Math.max(14, Math.min(window.innerWidth, window.innerHeight) * 0.02);
      const cols = Math.ceil(window.innerWidth / charSize) + 2;
      const rows = Math.ceil(window.innerHeight / charSize) + 2;

      for (let c = 0; c < cols; c++) {
        const col = document.createElement('div');
        col.style.display = 'inline-block';
        col.style.verticalAlign = 'top';
        col.style.width = charSize + 'px';

        const isWordColumn = Math.random() < 0.5;
        const wordChars = isWordColumn ? pickWord() : null;
        const spans: HTMLSpanElement[] = [];

        for (let i = 0; i < rows; i++) {
          const span = document.createElement('span');

          if (wordChars) {
            span.textContent = wordChars[i % wordChars.length];
          } else {
            span.textContent = randomChar();
          }

          span.style.display = 'block';
          span.style.width = charSize + 'px';
          span.style.height = charSize + 'px';
          span.style.fontSize = (charSize * 0.85) + 'px';
          span.style.textAlign = 'center';
          span.style.color = '#9bff9b11';
          span.style.fontFamily = 'monospace';

          col.appendChild(span);
          spans.push(span);

          if (!wordChars && Math.random() < 0.5) {
            loop(() => { span.textContent = randomChar(); }, randomInt(1000, 5000));
          }
        }

        const trailSize = wordChars ? wordChars.length + 2 : randomInt(10, 30);
        const speed = wordChars ? randomInt(60, 100) : randomInt(30, 80);
        let offset = randomInt(0, 100);

        loop(() => {
          const total = spans.length + trailSize - 1;

          for (let i = 0; i < trailSize; i++) {
            const span = spans[offset + i - trailSize + 1];
            if (!span) continue;

            const isHead = i === trailSize - 1;

            if (isHead) {
              if (!wordChars) {
                span.textContent = randomChar();
              }
              span.style.color = 'hsl(136, 100%, 95%)';
              span.style.textShadow = '0 0 .5em #fff, 0 0 1em currentColor';
            } else {
              const brightness = (85 / trailSize) * (i + 1);
              span.style.color = `hsl(136, 100%, ${brightness}%)`;
              span.style.textShadow = '';
            }
          }

          offset = (offset + 1) % total;
        }, speed);

        container!.appendChild(col);
      }
    }

    init();

    let resizeTimer: ReturnType<typeof setTimeout>;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(init, 200);
    });

    return () => {
      cancelled = true;
      container.innerHTML = '';
    };
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      style={{ lineHeight: 1 }}
    />
  );
}
