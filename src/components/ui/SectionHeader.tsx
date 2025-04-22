import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  icon: ReactNode;
}

export default function SectionHeader({ title, icon }: SectionHeaderProps) {
  return (
    <div className="flex items-center mb-8">
      <div className="p-3 bg-green-100 rounded-xl mr-4">
        <div className="h-8 w-8 text-green-600">
          {icon}
        </div>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-green-800">{title}</h2>
    </div>
  );
} 