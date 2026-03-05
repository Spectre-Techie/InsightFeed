import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 36,
          background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <span
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: 'white',
            letterSpacing: -4,
            lineHeight: 1,
          }}
        >
          IF
        </span>
        <div
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: '#34d399',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
