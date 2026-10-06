export { cn } from "cn"

export const getInitials = (name: string) => {
  if (!name) return "NA";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "N";
  // const second = parts[1]?.[0] || parts[0]?.[1] || "A";
  return (first).toUpperCase();
};