import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  title, 
  subtitle,
  actions 
}) => {
  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {(title || actions) && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              {title && <h1 className="text-3xl font-bold text-gray-900">{title}</h1>}
              {subtitle && <p className="text-gray-600 mt-2 text-sm">{subtitle}</p>}
            </div>
            {actions && <div className="flex gap-3">{actions}</div>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default PageContainer;
