import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Printer } from '@main/modules/printers/types';
import PrinterStatus from '@app/components/PrinterStatus';
import { Card, CardHeader, CardTitle } from '@app/components/ui/card';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

// Extract API calls into separate functions
const getAllPrinters = () => window.api.printers.getAll();
const startPrinterStreams = (printers: Printer[]) =>
  window.api.printers.startPrinterStreams(printers);

// Extract video player setup into a separate function
const setupVideoPlayer = (printer: Printer) => {
  const playerOptions = {
    controls: true,
    autoplay: true,
    fluid: true,
    preload: 'auto',
  };

  const player = videojs(`video-${printer.serial_number}`, playerOptions);

  player.src({
    src: `app://bundle/temp/printer_streams/printer_${printer.serial_number}_stream.m3u8`,
    type: 'application/x-mpegURL',
  });

  player.on('error', function () {
    console.log(player.error());
  });

  return () => {
    if (player) {
      player.dispose();
    }
  };
};

// Use a custom hook for state and effects
const usePrinters = () => {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [printerStatus, setPrinterStatus] = useState<{
    [key: number]: string;
  }>({});

  useEffect(() => {
    const getAndStartPrinters = async () => {
      const printerResults = await getAllPrinters();
      setPrinters(printerResults);
      setIsLoading(false);

      const handlePrinterConnectionStatus = ({
        printer,
        status,
      }: {
        printer: Printer;
        status: string;
      }) => {
        setPrinterStatus((prevStatus) => ({
          ...prevStatus,
          [printer.id]: status,
        }));
      };

      window.api.printers.onPrinterConnectionStatus(
        handlePrinterConnectionStatus,
      );

      startPrinterStreams(printerResults);

      return () => {
        // Clean up
        window.api.printers.removePrinterConnectionStatusListener(
          handlePrinterConnectionStatus,
        );
      };
    };

    getAndStartPrinters();
  }, []);

  useEffect(() => {
    printers.forEach(setupVideoPlayer);
  }, [printers]);

  return { printers, isLoading, printerStatus };
};

export const Route = createFileRoute('/_layout/')({
  component: () => {
    const { printers, isLoading, printerStatus } = usePrinters();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {printers.map((printer) => (
          <Card key={printer.id}>
            <div data-vjs-player>
              <video
                id={`video-${printer.serial_number}`}
                className="video-js vjs-default-skin"
                playsInline
              ></video>
            </div>
            <CardHeader>
              <div className="flex items-center">
                <PrinterStatus
                  status={printerStatus[printer.id] || 'Unknown'}
                />
                <CardTitle className="ml-1.5">{printer.name}</CardTitle>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  },
});
