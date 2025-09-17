import React from 'react';

interface LoadingBookIndicatorProps {
  selectedGroup?: string;
}

const LoadingBookIndicator: React.FC<LoadingBookIndicatorProps> = ({
  selectedGroup = 'Loading...',
}) => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="book flex justify-center items-center w-36 h-48 text-white font-bold text-lg rounded-lg shadow-lg">
        <span className="page animate" />
        <span className="page animate" />
        <span className="page animate" />
        <span className="page animate" />
        <span className="page animate" />
        <span className="page animate" />
        <span className="cover animate">{selectedGroup}</span>
        <span className="page animate" />
        <span className="cover animate">{selectedGroup}</span>
      </div>
    </div>
  );
};

export default LoadingBookIndicator;
