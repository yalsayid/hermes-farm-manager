import mqtt, { type MqttClient } from 'mqtt';
import { Printer } from '@main/modules/printers/types';

const connectToPrinter = (printer: Printer): MqttClient => {
  const printerUrl = `mqtts://${printer.ip_address}:8883`;

  return mqtt.connect(printerUrl, {
    username: 'bblp',
    password: printer.access_code,
    rejectUnauthorized: false,
  });
};

export const connectToPrinters = async (printers: Printer[]) => {
  try {
    return printers.map(connectToPrinter);
  } catch (err) {
    console.error('Error connecting to printers', err);
  }
};
