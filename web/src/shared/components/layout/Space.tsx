import { cn } from "../../lib";

export const Space :React.FC<{ h?: number, w?: number , className?: string}> = ({ h, w, className }) => {
  return <div className={cn("bg-transparent", className)} style={h ? { height: `${h}px` } : w ? { width: `${w}px` } : {}} />;
};