import React from 'react';

/**
 * Skeleton para la página de tarifario.
 * Replica la estructura visual de TariffPage para reducir percepción de espera.
 */
export const TariffSkeleton: React.FC = () => {
  return (
    <div className="bg-background py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:p-8">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="h-10 bg-muted rounded w-80 mx-auto animate-pulse" />
          <div className="h-4 bg-muted rounded w-60 mx-auto mt-4 animate-pulse" />
        </header>

        {/* Search bar */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="h-10 bg-muted rounded-md animate-pulse" />
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-border">
          <nav className="-mb-px flex space-x-8">
            <div className="h-10 bg-muted rounded w-24 animate-pulse" />
            <div className="h-10 bg-muted rounded w-24 animate-pulse" />
            <div className="h-10 bg-muted rounded w-24 animate-pulse" />
          </nav>
        </div>

        {/* Period selector */}
        <div className="mb-8 flex justify-end">
          <div className="h-9 bg-muted rounded-md w-48 animate-pulse" />
        </div>

        {/* Content area */}
        <div className="bg-card shadow overflow-hidden sm:rounded-lg border border-border">
          <div className="p-4 sm:p-6 space-y-6">
            {/* Section heading */}
            <div className="h-7 bg-muted rounded w-1/3 animate-pulse" />

            {/* Table rows */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                <div className="h-4 bg-muted rounded w-24 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TariffSkeleton;
