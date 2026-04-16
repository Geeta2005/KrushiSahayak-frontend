interface KrushiSahayakLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  iconOnly?: boolean;
  variant?: "default" | "light";
}

export function KrushiSahayakLogo({
  size = "md",
  iconOnly = false,
  variant = "default",
}: KrushiSahayakLogoProps) {
  const sizeConfig = {
    sm: { icon: 24, text: "text-lg", gap: "gap-2" },
    md: { icon: 32, text: "text-2xl", gap: "gap-2.5" },
    lg: { icon: 40, text: "text-3xl", gap: "gap-3" },
    xl: { icon: 56, text: "text-5xl", gap: "gap-4" },
  };

  const config = sizeConfig[size];
  const iconSize = config.icon;

  const colors =
    variant === "light"
      ? { primary: "#FFFFFF", secondary: "#F0FDF4", text: "#FFFFFF" }
      : { primary: "#2D5016", secondary: "#65A830", text: "#2D5016" };

  return (
    <div className={`flex items-center ${config.gap}`}>
      {/* Icon: Tractor + Leaf Combination */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Leaf Background Circle */}
        <circle cx="32" cy="32" r="30" fill={colors.secondary} opacity="0.2" />

        {/* Leaf Element */}
        <path
          d="M42 18C42 18 38 22 38 28C38 32 40 34 42 34C44 34 46 32 46 28C46 22 42 18 42 18Z"
          fill={colors.secondary}
          stroke={colors.primary}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M42 18L42 34"
          stroke={colors.primary}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Tractor Body */}
        <rect
          x="18"
          y="28"
          width="20"
          height="10"
          rx="2"
          fill={colors.primary}
        />

        {/* Tractor Cabin */}
        <rect x="26" y="22" width="8" height="6" rx="1" fill={colors.primary} />

        {/* Front Wheel (Small) */}
        <circle
          cx="24"
          cy="42"
          r="4"
          fill={colors.primary}
          stroke={variant === "light" ? "#FFFFFF" : "#8B6914"}
          strokeWidth="1.5"
        />
        <circle
          cx="24"
          cy="42"
          r="2"
          fill={variant === "light" ? "#FFFFFF" : "#8B6914"}
        />

        {/* Back Wheel (Large) */}
        <circle
          cx="34"
          cy="44"
          r="6"
          fill={colors.primary}
          stroke={variant === "light" ? "#FFFFFF" : "#8B6914"}
          strokeWidth="2"
        />
        <circle
          cx="34"
          cy="44"
          r="3"
          fill={variant === "light" ? "#FFFFFF" : "#8B6914"}
        />

        {/* Exhaust Pipe */}
        <rect x="20" y="22" width="2" height="6" rx="1" fill={colors.primary} />
        <circle cx="21" cy="20" r="1.5" fill={colors.secondary} />
      </svg>

      {/* Text */}
      {!iconOnly && (
        <div
          className={`font-bold tracking-tight ${config.text}`}
          style={{ color: colors.text }}
        >
          Farm<span style={{ color: colors.secondary }}>Rent</span>
        </div>
      )}
    </div>
  );
}
