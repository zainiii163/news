"use client";

interface SectionHeaderProps {
  title: string;
  accentColor?: "red" | "black" | "blue" | "green" | "purple" | "gray";
  className?: string;
}

export function SectionHeader({ 
  title, 
  accentColor = "black",
  className = ""
}: SectionHeaderProps) {
  const accentColors = {
    red: "border-red-600",
    black: "border-black", 
    blue: "border-blue-600",
    green: "border-green-600",
    purple: "border-purple-600",
    gray: "border-gray-600"
  };

  return (
    <div className={`flex items-center gap-3 mb-6 ${className}`}>
      <div className={`w-1 h-8 ${accentColors[accentColor]} border-l-4`}></div>
      <h2 className="text-2xl font-black text-gray-900 uppercase tracking-wide">
        {title}
      </h2>
    </div>
  );
}
