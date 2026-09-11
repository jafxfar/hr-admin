export const AdminShellBackground = () => (
  <div
    className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    aria-hidden
  >
    <div className="absolute inset-0 h-full w-full">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'var(--app-bg-image)' }}
      />
      <div className="absolute inset-0 bg-(--app-bg-overlay)" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgb(var(--theme-primary-rgb) / 0.08), transparent 70%)',
        }}
      />
    </div>
  </div>
)
