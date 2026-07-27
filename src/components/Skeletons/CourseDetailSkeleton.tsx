import React from 'react';

/**
 * Skeleton para la página de detalle de curso.
 * Replica la estructura visual de CourseDetailPage para reducir percepción de espera.
 */
export const CourseDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Breadcrumb placeholder */}
      <div className="mb-4">
        <div className="h-4 bg-muted rounded w-48 animate-pulse" />
      </div>

      {/* Card container */}
      <div className="bg-card shadow-lg rounded-lg overflow-hidden">
        {/* Image placeholder */}
        <div className="w-full aspect-[3/2] bg-muted animate-pulse" />

        <div className="p-6 space-y-6">
          {/* Title */}
          <div className="h-8 bg-muted rounded w-3/4 animate-pulse" />

          {/* Video placeholder */}
          <div className="aspect-video bg-muted rounded-lg animate-pulse" />

          {/* Description blocks */}
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-full animate-pulse" />
            <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-muted rounded w-4/6 animate-pulse" />
            <div className="h-4 bg-muted rounded w-full animate-pulse" />
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
          </div>

          {/* Section heading */}
          <div className="h-6 bg-muted rounded w-1/2 animate-pulse mt-6" />

          {/* More description */}
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-full animate-pulse" />
            <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Inscription form placeholder */}
      <div className="mt-8 bg-card shadow-lg rounded-lg p-6 space-y-4">
        <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-10 bg-muted rounded animate-pulse" />
          <div className="h-10 bg-muted rounded animate-pulse" />
          <div className="h-10 bg-muted rounded animate-pulse" />
          <div className="h-10 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-12 bg-muted rounded w-48 animate-pulse mt-4" />
      </div>
    </div>
  );
};

export default CourseDetailSkeleton;
