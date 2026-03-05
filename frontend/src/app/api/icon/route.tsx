import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const size = parseInt(searchParams.get('size') || '192', 10);
  const dim = [192, 512].includes(size) ? size : 192;
  const radius = Math.round(dim * 0.19);
  const fontSize = Math.round(dim * 0.53);
  const dotSize = Math.round(dim * 0.13);
  const dotOffset = Math.round(dim * 0.08);

  return new ImageResponse(
    (
      <div
        style={{
          width: dim,
          height: dim,
          borderRadius: radius,
          background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <span
          style={{
            fontSize,
            fontWeight: 800,
            color: 'white',
            letterSpacing: Math.round(fontSize * -0.04),
            lineHeight: 1,
          }}
        >
          IF
        </span>
        <div
          style={{
            position: 'absolute',
            top: dotOffset,
            right: dotOffset,
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            background: '#34d399',
          }}
        />
      </div>
    ),
    { width: dim, height: dim }
  );
}
