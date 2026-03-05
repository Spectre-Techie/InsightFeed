/**
 * Generate static PNG icons for PWA and favicons.
 * Run: node scripts/generate-icons.mjs
 *
 * Uses Next.js ImageResponse (Satori + resvg-wasm) under the hood
 * to render the InsightFeed "IF" monogram at multiple sizes.
 */

import { ImageResponse } from 'next/og.js';
import { writeFileSync, mkdirSync } from 'fs';

const sizes = [16, 32, 48, 72, 96, 128, 144, 152, 167, 180, 192, 384, 512];

function iconJSX(dim) {
  const radius = Math.round(dim * 0.19);
  const fontSize = Math.round(dim * 0.53);
  const dotSize = Math.round(dim * 0.13);
  const dotOffset = Math.round(dim * 0.08);

  return {
    type: 'div',
    props: {
      style: {
        width: dim,
        height: dim,
        borderRadius: radius,
        background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      },
      children: [
        {
          type: 'span',
          props: {
            style: {
              fontSize,
              fontWeight: 800,
              color: 'white',
              letterSpacing: Math.round(fontSize * -0.04),
              lineHeight: 1,
            },
            children: 'IF',
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: dotOffset,
              right: dotOffset,
              width: dotSize,
              height: dotSize,
              borderRadius: '50%',
              background: '#34d399',
            },
          },
        },
      ],
    },
  };
}

// Maskable icon — adds 20% safe-zone padding (smaller logo on larger bg)
function maskableIconJSX(dim) {
  const innerDim = Math.round(dim * 0.7);
  const radius = Math.round(innerDim * 0.19);
  const fontSize = Math.round(innerDim * 0.53);
  const dotSize = Math.round(innerDim * 0.13);
  const dotOffset = Math.round(innerDim * 0.08);

  return {
    type: 'div',
    props: {
      style: {
        width: dim,
        height: dim,
        background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              width: innerDim,
              height: innerDim,
              borderRadius: radius,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            },
            children: [
              {
                type: 'span',
                props: {
                  style: {
                    fontSize,
                    fontWeight: 800,
                    color: 'white',
                    letterSpacing: Math.round(fontSize * -0.04),
                    lineHeight: 1,
                  },
                  children: 'IF',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    position: 'absolute',
                    top: dotOffset,
                    right: dotOffset,
                    width: dotSize,
                    height: dotSize,
                    borderRadius: '50%',
                    background: '#34d399',
                  },
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function generate() {
  mkdirSync('public/icons', { recursive: true });

  for (const size of sizes) {
    const response = new ImageResponse(iconJSX(size), { width: size, height: size });
    const buffer = Buffer.from(await response.arrayBuffer());
    writeFileSync(`public/icons/icon-${size}x${size}.png`, buffer);
    console.log(`✓ icon-${size}x${size}.png`);
  }

  // Maskable icons for PWA (with safe zone padding)
  for (const size of [192, 512]) {
    const response = new ImageResponse(maskableIconJSX(size), {
      width: size,
      height: size,
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    writeFileSync(`public/icons/maskable-${size}x${size}.png`, buffer);
    console.log(`✓ maskable-${size}x${size}.png`);
  }

  // Also generate favicon.ico-like file (32x32 PNG as favicon)
  const fav = new ImageResponse(iconJSX(32), { width: 32, height: 32 });
  writeFileSync('public/favicon.png', Buffer.from(await fav.arrayBuffer()));
  console.log('✓ favicon.png');

  console.log('\nAll icons generated successfully!');
}

generate().catch((err) => {
  console.error('Icon generation failed:', err);
  process.exit(1);
});
