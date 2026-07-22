function Spinner({ size = "md", label }) {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };
  return (
    <div className="flex items-center gap-2 text-slate">
      <div
        className={`${sizes[size]} border-2 border-crimson/20 border-t-crimson rounded-full animate-spin`}
      />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

export default Spinner;