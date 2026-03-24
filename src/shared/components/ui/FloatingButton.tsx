import { cn } from "@/shared/lib";

type FloatingButtonProps = {
    innerElement: React.ReactNode;
    ariaLabel: string;
    onClick: () => void;
    className?: string;
};

export function FloatingButton({
    innerElement,
    ariaLabel,
    onClick,
    className,
}: FloatingButtonProps) {
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            className={cn(
                "pointer-events-auto flex size-9 items-center justify-center rounded-full border border-1 border-grey-300 bg-background p-2 shadow-md",
                className
            )}
            onClick={onClick}
        >
            {innerElement}
        </button>
    );
}