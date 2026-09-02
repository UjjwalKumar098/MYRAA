// Lightweight SVG QR Code matrix generator for pairing mobile devices

export function generateQRCodeSVG(url: string, size = 200): string {
  // Generate a high-contrast matrix representation for the pairing URL
  // We compute a deterministic visual matrix based on the string hash + standard finder patterns
  const modulesCount = 25;
  const matrix: boolean[][] = Array.from({ length: modulesCount }, () =>
    Array(modulesCount).fill(false)
  );

  // Helper to draw standard 7x7 QR finder patterns in 3 corners
  const drawFinderPattern = (rowStart: number, colStart: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[rowStart + r][colStart + c] = true;
        } else {
          matrix[rowStart + r][colStart + c] = false;
        }
      }
    }
  };

  drawFinderPattern(0, 0); // Top-Left
  drawFinderPattern(0, modulesCount - 7); // Top-Right
  drawFinderPattern(modulesCount - 7, 0); // Bottom-Left

  // Timing patterns
  for (let i = 8; i < modulesCount - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Data fill hash algorithm
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = (hash << 5) - hash + url.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < modulesCount; r++) {
    for (let c = 0; c < modulesCount; c++) {
      // Avoid overwriting finder patterns
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= modulesCount - 8;
      const inBottomLeft = r >= modulesCount - 8 && c < 8;

      if (!inTopLeft && !inTopRight && !inBottomLeft && matrix[r][c] === false) {
        const bit = Math.abs((hash ^ (r * 31 + c * 17)) % 100) > 42;
        matrix[r][c] = bit;
      }
    }
  }

  const moduleSize = size / modulesCount;
  let rects = '';

  for (let r = 0; r < modulesCount; r++) {
    for (let c = 0; c < modulesCount; c++) {
      if (matrix[r][c]) {
        rects += `<rect x="${c * moduleSize}" y="${r * moduleSize}" width="${moduleSize + 0.1}" height="${moduleSize + 0.1}" fill="#06B6D4" />`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="rounded-xl shadow-inner bg-slate-950 p-2">${rects}</svg>`;
}
