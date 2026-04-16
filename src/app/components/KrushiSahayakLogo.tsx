interface KrushiSahayakLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  iconOnly?: boolean;
  variant?: 'default' | 'light';
}

export function KrushiSahayakLogo({ 
  size = 'md', 
  iconOnly = false,
  variant = 'default'
}: KrushiSahayakLogoProps) {
  const sizeConfig = {
    sm: { icon: 40, text: 'text-lg', gap: 'gap-2' },
    md: { icon: 48, text: 'text-xl', gap: 'gap-2.5' },
    lg: { icon: 56, text: 'text-2xl', gap: 'gap-3' },
    xl: { icon: 64, text: 'text-3xl', gap: 'gap-4' },
  };

  const config = sizeConfig[size];
  const iconSize = config.icon;

  const colors = variant === 'light' 
    ? { primary: '#10b981', secondary: '#34d399', text: '#FFFFFF', subtext: '#D1D5DB' }
    : { primary: '#10b981', secondary: '#34d399', text: '#1F2937', subtext: '#6B7280' };

  return (
    <div className={`flex items-center ${config.gap}`}>
      {/* Logo Icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Circular background */}
        <circle cx="100" cy="100" r="95" fill={colors.primary} opacity="0.1" />
        
        {/* Main circle border */}
        <circle
          cx="100"
          cy="100"
          r="90"
          stroke={colors.primary}
          strokeWidth="3"
          fill="none"
        />
        
        {/* Tractor wheel (left) */}
        <circle cx="65" cy="130" r="25" fill="#059669" />
        <circle cx="65" cy="130" r="18" fill="#047857" />
        <circle cx="65" cy="130" r="8" fill="#065f46" />
        
        {/* Tractor wheel (right) */}
        <circle cx="135" cy="130" r="18" fill="#059669" />
        <circle cx="135" cy="130" r="12" fill="#047857" />
        <circle cx="135" cy="130" r="5" fill="#065f46" />
        
        {/* Tractor body */}
        <path
          d="M 50 110 L 90 110 L 90 90 L 110 90 L 110 70 L 130 70 L 130 110 L 150 110 L 150 130 L 50 130 Z"
          fill={colors.primary}
        />
        
        {/* Tractor cabin */}
        <rect x="90" y="75" width="30" height="30" fill={colors.secondary} rx="2" />
        <rect x="95" y="80" width="20" height="15" fill="#6ee7b7" opacity="0.7" />
        
        {/* Exhaust pipe */}
        <rect x="125" y="60" width="5" height="15" fill="#047857" rx="1" />
        <circle cx="127.5" cy="58" r="3" fill="#047857" />
        
        {/* Wheat stalks - left */}
        <g transform="translate(30, 50)">
          <line x1="0" y1="30" x2="0" y2="0" stroke={colors.primary} strokeWidth="2" />
          <path
            d="M -3 5 Q 0 3 3 5 M -3 10 Q 0 8 3 10 M -3 15 Q 0 13 3 15"
            stroke={colors.primary}
            strokeWidth="1.5"
            fill="none"
          />
        </g>
        
        {/* Wheat stalks - right */}
        <g transform="translate(170, 50)">
          <line x1="0" y1="30" x2="0" y2="0" stroke={colors.primary} strokeWidth="2" />
          <path
            d="M -3 5 Q 0 3 3 5 M -3 10 Q 0 8 3 10 M -3 15 Q 0 13 3 15"
            stroke={colors.primary}
            strokeWidth="1.5"
            fill="none"
          />
        </g>
        
        {/* Ground line */}
        <line
          x1="30"
          y1="155"
          x2="170"
          y2="155"
          stroke="#059669"
          strokeWidth="2"
          strokeDasharray="5,3"
        />
      </svg>

      {/* Logo Text */}
      {!iconOnly && (
        <div className="flex flex-col">
          <div className={`font-bold tracking-tight ${config.text}`}>
            <span className="text-green-600">Krushi</span>
            <span style={{ color: colors.text }}>Sahayak</span>
          </div>
        </div>
      )}
    </div>
  );
}
