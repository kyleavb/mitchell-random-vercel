import Link from "next/link";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps {
  variant?: ButtonVariant;
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-br from-secondary to-secondary-dark text-white border-none hover:brightness-110 active:scale-[0.97]",
  secondary:
    "bg-primary-light text-on-primary border-none hover:brightness-110 active:scale-[0.97]",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 px-10 py-4 rounded-md font-headline font-bold text-sm tracking-widest no-underline cursor-pointer transition-all whitespace-nowrap";

export default function Button({
  variant = "primary",
  href,
  children,
  className = "",
  onClick,
}: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    if (href.startsWith("#")) {
      return (
        <a href={href} className={classes} onClick={onClick}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
