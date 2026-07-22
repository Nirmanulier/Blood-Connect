function BloodBadge({ group, selected = false, onClick, size = "md" }) {
  const sizes = {
    sm: "w-12 h-9 text-xs",
    md: "w-16 h-12 text-sm",
    lg: "w-20 h-14 text-base",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative ${sizes[size]} rounded-md font-mono font-medium flex items-center justify-center
        transition-all border
        ${
          selected
            ? "bg-crimson text-white border-crimson shadow-sm"
            : "bg-white text-ink border-ink/15 hover:border-crimson/50 hover:text-crimson"
        }`}
    >
      {/* notch, like a die-cut label */}
      <span
        className={`absolute -left-[5px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full
        ${selected ? "bg-crimson" : "bg-paper"} border ${selected ? "border-crimson" : "border-ink/15"}`}
      />
      {group}
    </button>
  );
}

export default BloodBadge;