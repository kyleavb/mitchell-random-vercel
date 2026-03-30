interface KickerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Kicker({ children, className = "" }: KickerProps) {
  return (
    <span
      className={`font-body text-[0.6875rem] font-bold tracking-[0.3em] uppercase text-secondary ${className}`}
    >
      {children}
    </span>
  );
}
