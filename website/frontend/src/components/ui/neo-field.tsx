import { cn } from "@/lib/utils";

interface NeoFieldProps {
    label: string;
    error?: string;
    children: React.ReactNode;
    className?: string;
}

export function NeoField({ label, error, children, className }: NeoFieldProps) {
    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-800">{label}</label>
                {error && <span className="text-xs font-bold text-red-500 animate-pulse">{error}</span>}
            </div>
            {children}
        </div>
    );
}
