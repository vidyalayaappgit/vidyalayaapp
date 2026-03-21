"use client";

type CardProps = {
  children: React.ReactNode;
  title?: string;
};

export default function Card({ children, title }: CardProps) {
  return (
    <div className="card">
      {title && <div className="card-title">{title}</div>}

      <div className="card-body">
        {children}
      </div>
    </div>
  );
}