import React from 'react';

type PrinterStatusProps = {
  status:
    | 'idle'
    | 'printing'
    | 'error'
    | 'connecting'
    | 'reconnecting'
    | string;
};

const PrinterStatus: React.FC<PrinterStatusProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'connecting':
        return 'bg-yellow-500';
      case 'reconnecting':
        return 'bg-yellow-500';
      case 'idle':
        return 'bg-green-500';
      case 'printing':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return <div className={`rounded-full h-2 w-2 ${getStatusColor()}`}></div>;
};

export default PrinterStatus;
