import { ipcMain, webContents } from 'electron';
import { Printer } from '@main/modules/printers/types';
import { formatPrinterStatus } from '@main/modules/printers/utils';
import type { MqttClient } from 'mqtt';

const INIT = [
  { info: { sequence_id: '0', command: 'get_version' } },
  { pushing: { sequence_id: '0', command: 'pushall' } },
];

const MAX_RETRIES = 3; // Set your maximum retry limit

export const attachMqttHandlers = (client: MqttClient, printer: Printer) => {
  let retryCount = 0;

  webContents.getAllWebContents().forEach((wc) => {
    wc.send('printer-connection-status', { printer, status: 'connecting' });
  });

  client.on('connect', () => {
    console.log(
      `Connected to MQTT broker for printer ${printer.serial_number}`,
    );

    webContents.getAllWebContents().forEach((wc) => {
      wc.send('printer-connection-status', { printer, status: 'idle' });
    });

    retryCount = 0;

    INIT.forEach((i) => {
      client.publish(
        `device/${printer.serial_number}/request`,
        JSON.stringify(i),
      );
    });

    client.subscribe(`device/${printer.serial_number}/report`, (err) => {
      if (err) {
        console.error(
          `Error subscribing to topic for printer ${printer.id}`,
          err,
        );
      }
    });
  });

  client.on('error', (err) => {
    console.error(`MQTT error for printer ${printer.serial_number}: ${err}`);
    webContents.getAllWebContents().forEach((wc) => {
      wc.send('printer-connection-status', {
        printer,
        status: 'error',
        error: err,
      });
    });

    retryCount++;
  });

  client.on('reconnect', () => {
    if (retryCount > MAX_RETRIES) {
      console.error(
        `Failed to reconnect to MQTT broker for printer ${printer.serial_number} after ${MAX_RETRIES} attempts`,
      );
      webContents.getAllWebContents().forEach((wc) => {
        wc.send('printer-connection-status', {
          printer,
          status: 'error',
        });
      });

      client.end();
    } else {
      console.log(
        `Reconnecting to MQTT broker for printer ${printer.serial_number}`,
      );
      webContents.getAllWebContents().forEach((wc) => {
        wc.send('printer-connection-status', {
          printer,
          status: 'reconnecting',
        });
      });
    }
  });

  client.on('message', (topic, message) => {
    try {
      const parsedMessage = JSON.parse(message.toString());
      // const formattedMessage = formatPrinterStatus(parsedMessage);

      // webContents.getAllWebContents().forEach((wc) => {
      //   wc.send('printer-status-update', {
      //     printer,
      //     status: formattedMessage,
      //   });
      // });
    } catch (err) {
      console.error(`Error parsing message from topic ${topic}`, err);
    }
  });
};
