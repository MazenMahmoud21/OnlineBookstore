import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-indigo-600 text-white shadow-lg hover:shadow-xl hover:bg-indigo-700 hover:-translate-y-0.5",
        destructive:
          "bg-red-600 text-white shadow-lg hover:shadow-xl hover:bg-red-700 hover:-translate-y-0.5",
        outline:
          "border-2 border-indigo-600 bg-transparent text-indigo-700 shadow-sm hover:bg-indigo-50 hover:border-indigo-700 hover:shadow-md",
        secondary:
          "bg-orange-500 text-white shadow-lg hover:shadow-xl hover:bg-orange-600 hover:-translate-y-0.5",
        ghost: "hover:bg-indigo-50 hover:text-indigo-700 transition-colors",
        link: "text-indigo-700 underline-offset-4 hover:underline font-medium",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
