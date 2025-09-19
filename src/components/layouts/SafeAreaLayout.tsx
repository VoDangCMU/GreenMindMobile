export default function SafeAreaLayout({ children, header, footer, className = '' }: Props) {
  return (
    <div
      className={`min-h-screen bg-white flex flex-col ${className}`}
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {header ? (
        <header className="w-full z-10">
          <div className="max-w-5xl mx-auto px-2 py-3">
            {header}
          </div>
        </header>
      ) : null}

      <main className="flex-1 w-full overflow-auto">
        <div className="max-w-5xl mx-auto px-2 py-4">
          {children}
        </div>
      </main>

      {/* Footer: render raw, không thêm padding/margin */}
      {footer ? footer : null}
    </div>
  )
}
