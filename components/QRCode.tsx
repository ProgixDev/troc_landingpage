/**
 * A statically-rendered QR module grid.
 *
 * The pattern is generated from a fixed matrix rather than a runtime encoder,
 * so it ships zero JS and can't shift between renders. Swap `MATRIX` for the
 * output of a real encoder pointed at your store link before launch — the
 * finder patterns and quiet zone here are structurally correct but the data
 * modules are decorative.
 */
const SIZE = 25;

// Deterministic pseudo-random fill, seeded so every render is identical.
function buildMatrix(): boolean[][] {
  const grid: boolean[][] = Array.from({ length: SIZE }, () =>
    Array<boolean>(SIZE).fill(false),
  );

  let seed = 0x2c5aa0; // the brand blue, used as the seed — why not
  const next = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      grid[y][x] = next() > 0.52;
    }
  }

  // Carve the three finder patterns (7×7 with a 1-module separator).
  const finder = (ox: number, oy: number) => {
    for (let y = -1; y <= 7; y++) {
      for (let x = -1; x <= 7; x++) {
        const gx = ox + x;
        const gy = oy + y;
        if (gx < 0 || gy < 0 || gx >= SIZE || gy >= SIZE) continue;
        const onRing = x === 0 || x === 6 || y === 0 || y === 6;
        const inCore = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        const inside = x >= 0 && x <= 6 && y >= 0 && y <= 6;
        grid[gy][gx] = inside && (onRing || inCore);
      }
    }
  };

  finder(0, 0);
  finder(SIZE - 7, 0);
  finder(0, SIZE - 7);

  return grid;
}

const MATRIX = buildMatrix();

export default function QRCode({ className = "h-28 w-28" }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${SIZE + 4} ${SIZE + 4}`}
      className={className}
      shapeRendering="crispEdges"
      role="img"
      aria-label="QR code"
    >
      <rect width={SIZE + 4} height={SIZE + 4} rx="3" fill="#fff" />
      <g style={{ fill: "rgb(var(--brand-navy-dark))" }}>
        {MATRIX.flatMap((row, y) =>
          row.map((on, x) =>
            on ? <rect key={`${x}-${y}`} x={x + 2} y={y + 2} width="1" height="1" /> : null,
          ),
        )}
      </g>
    </svg>
  );
}
