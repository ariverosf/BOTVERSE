"use client"

import { LucideProps } from "lucide-react";
import { redirect } from "next/navigation";

type QuickAccessCardProps = {
  label: string;
  description: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  to: string;
};

export default function QuickAccessCard({ icon, label, description, to }: QuickAccessCardProps) {
  const IconComponent = icon;

  const handleRoute = () => {
    redirect(`/${to}`);
  }

  return(
    <article className="border border-border p-4 rounded-lg hover:border-primary transition hover:[&>div>:first-child]:scale-110" onClick={handleRoute}>
      <div className="rounded p-4 aspect-square w-fit transition">
        <IconComponent />
      </div>
      <h4 className="font-semibold text-foreground">{ label }</h4>
      <p className="text-muted-foreground text-sm">{ description }</p>
    </article>
  );
}