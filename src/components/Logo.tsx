import { Leaf } from 'lucide-react';

// Modern, minimal, friendly logo for Green Mind
const Logo = ({ size = 48 }: { size?: number }) => {
  return (
    <Leaf className="text-greenery-700" size={size} />
  );
};

export default Logo;
