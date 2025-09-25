// components/ThemeToggle.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

type Props = {
  mode: "light" | "dark";
  onToggle: () => void;
};

const ThemeToggle = ({ mode, onToggle }: Props) => {
  return (
    <Button
      size="icon"
      onClick={onToggle}
      className="rounded-full hover:text-gray-600 cursor-pointer text-gray-800 dark:border border-gray-500 bg-white hover:bg-gray-200"
    >
      {mode === "light" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5 text-orange-600" />
      )}
    </Button>
  );
};

export default ThemeToggle;
