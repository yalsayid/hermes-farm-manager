interface PrinterStatus {
  bedTemperature: number;
  bedTargetTemperature: number;
  nozzleTemperature: number;
  nozzleTargetTemperature: number;
  coolingFan: {
    isOn: boolean;
    speedPercentage: number;
  };
}

export function formatPrinterStatus(jsonData: any): PrinterStatus {
  const {
    bed_temper,
    bed_target_temper,
    nozzle_temper,
    nozzle_target_temper,
    cooling_fan_speed,
  } = jsonData.print;

  const coolingFan = {
    isOn: cooling_fan_speed !== '0',
    speedPercentage: parseInt(cooling_fan_speed),
  };

  return {
    bedTemperature: bed_temper,
    bedTargetTemperature: bed_target_temper,
    nozzleTemperature: nozzle_temper,
    nozzleTargetTemperature: nozzle_target_temper,
    coolingFan: coolingFan,
  };
}
