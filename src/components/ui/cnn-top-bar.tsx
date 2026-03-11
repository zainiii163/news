"use client";

export function CnnTopBar() {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#1a3a3a', // Dark teal color matching CNN
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      }}
    >
      <div
        style={{
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        Live Breaking News • World • Politics • Business
      </div>
    </div>
  );
}
