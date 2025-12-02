import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AIGenerateButtonProps {
  label?: string;
  onClick?: () => Promise<void> | void;
  disabled?: boolean;
  className?: string;
  size?: "default" | "sm" | "lg";
}

export default function AIGenerateButton({
  label = "Generate with AI",
  onClick,
  disabled = false,
  className,
  size = "default",
}: AIGenerateButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading) return;
    setIsLoading(true);
    try {
      await onClick?.();
    } finally {
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isLoading}
      size={size}
      className={cn(
        "relative overflow-hidden gap-2",
        "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600",
        "hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500",
        "text-white border-0",
        "shadow-lg shadow-purple-500/25",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      data-testid="button-ai-generate"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={isLoading ? { x: ["100%", "-100%"] } : { x: "-100%" }}
        transition={{
          duration: 1.5,
          repeat: isLoading ? Infinity : 0,
          ease: "linear",
        }}
      />
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      <span className="relative z-10">{isLoading ? "Generating..." : label}</span>
    </Button>
  );
}
