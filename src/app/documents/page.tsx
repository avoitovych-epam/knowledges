'use client';

import React, { Suspense, lazy } from 'react';

import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingIndicator from '@/components/common/LoadingIndicator';

const Documents = lazy(() => import('@/components/Documents'));

const DocumentsPage: React.FC = () => {
  return (
    <ErrorBoundary
      fallback={
        <div className="text-red-500 font-bold text-center mt-5">
          Failed to load documents.
        </div>
      }
    >
      <Suspense fallback={<LoadingIndicator />}>
        <Documents />
      </Suspense>
    </ErrorBoundary>
  );
};

export default DocumentsPage;
