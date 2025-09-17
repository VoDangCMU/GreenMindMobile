// Modern, minimal, friendly logo for Green Mind
const Logo = ({ size = 48 }: { size?: number }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Green Mind Logo"
    >
      <circle cx="24" cy="24" r="22" fill="#88c999" stroke="#2f4a37" strokeWidth="2" />
      <path
        d="M24 10c-6 0-11 5-11 11 0 7 7 13 11 17 4-4 11-10 11-17 0-6-5-11-11-11z"
        fill="#f0f9f0"
        stroke="#2f4a37"
        strokeWidth="2"
      />
      <circle cx="24" cy="21" r="4" fill="#88c999" stroke="#2f4a37" strokeWidth="1.5" />
      <path
        d="M24 25v7"
        stroke="#2f4a37"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Logo;
