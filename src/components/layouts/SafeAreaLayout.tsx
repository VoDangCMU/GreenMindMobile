export default function SafeAreaLayout({ children, header, footer, className = '' }: Props) {
  return (
    <div
      className={`min-h-screen bg-greenery-50 flex flex-col ${className}`}
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >

      {header ? (
        <header className="w-full fixed top-0 left-0 z-20 bg-white" style={{paddingTop: 'env(safe-area-inset-top)'}}>
          <div className="py-3">
            {header}
          </div>
        </header>
      ) : null}

      {/* Add padding-top to main to prevent overlap with fixed header (py-3 = 48px) */}
      <main className="flex-1 w-full overflow-auto" style={{paddingTop: header ? 'calc(48px + env(safe-area-inset-top))' : undefined}}>
        <div>
          {children}
        </div>
      </main>

      {/* Footer: render raw, không thêm padding/margin */}
      {footer ? footer : null}
    </div>
  )
}
