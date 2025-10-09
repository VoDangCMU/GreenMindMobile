interface Props {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

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
        <header
          className="w-full relative z-20"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <div className="py-3">
            {header}
          </div>
        </header>
      ) : null}

      {/* Content — bỏ paddingTop để header và nội dung khít nhau */}
      <main className="flex-1 w-full overflow-auto">
        <div>
          {children}
        </div>
      </main>

      {/* Footer: render raw, không thêm padding/margin */}
      {footer ? footer : null}
    </div>
  );
}
