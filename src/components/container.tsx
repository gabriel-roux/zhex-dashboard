import clsx from "clsx";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div
      className={clsx(
        "ml-[calc(12px+50%)] -translate-x-1/2 w-full md:max-w-screen-lg 2xl:max-w-screen-xl 3xl:max-w-screen-2xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
