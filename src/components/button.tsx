import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant: 'primary' | 'secondary' | 'ghost';
    size?: 'small' | 'medium' | 'large' | 'full';
    loading?: boolean
    children: ReactNode
}

export function Button({
    variant,
    size = 'medium',
    loading = false,
    children,
    className,
    ...props
}: ButtonProps) {
    const baseStyles = "font-araboto font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantStyles = {
        primary: "bg-zhex-base-500 text-white hover:bg-zhex-base-600 disabled:bg-zhex-base-400/70 disabled:cursor-not-allowed",
        secondary: "bg-zhex-base-500/20 text-zhex-base-500 hover:bg-zhex-base-500/40 disabled:bg-zhex-base-400/70 disabled:text-neutral-400 disabled:cursor-not-allowed",
        ghost: "bg-transparent text-zhex-base-500 enabled:hover:bg-zhex-base-500 enabled:hover:text-white border border-zhex-base-500 hover:border-transparent disabled:border-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
    };

    const sizeStyles = {
        small: "px-4 py-2 text-sm",
        medium: "px-6 py-3 text-base",
        large: "px-8 py-3.5 text-lg",
        full: "w-full px-6 py-3.5 text-lg font-medium"
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            disabled={loading}
            {...props}
        >
            {loading ? <span>Loading...</span> : children}
        </button>
    );
}