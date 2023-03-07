interface Props {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function PageTitle({ title, subtitle, children }: Props) {
  return (
    <div className="flex flex-col md:flex-row justify-between mb-4 pb-2 border-b items-center gap-2">
      <div className="title">
        <h1 className="text-3xl">{title}</h1>
        {subtitle && <h2 className="text-base pt-2 text-gray-500 max-w-2xl">{subtitle}</h2>}
      </div>
      <div className="actions">{children}</div>
    </div>
  );
}
