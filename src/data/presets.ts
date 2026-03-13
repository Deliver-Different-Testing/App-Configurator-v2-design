import type { PresetWorkflow } from '../types';

export const PRESETS: Record<string, PresetWorkflow> = {
  standard: {
    name: 'Standard',
    stages: {
      'Pickup': [
        { taskId: 'barcode', required: true, config: { mustMatch: true } },
        { taskId: 'photo', required: true, config: { minPhotos: 1, maxPhotos: 2, label: 'Pickup Photo' } },
      ],
      'Delivery': [
        { taskId: 'photo', required: true, config: { minPhotos: 1, maxPhotos: 3, label: 'Proof of Delivery' } },
        { taskId: 'signature', required: true, config: { signerNameReq: true, label: 'Recipient Signature' } },
      ],
    },
  },
  alcohol: {
    name: 'Alcohol',
    stages: {
      'Pickup': [
        { taskId: 'barcode', required: true, config: { mustMatch: true } },
        { taskId: 'photo', required: true, config: { minPhotos: 1, maxPhotos: 2, label: 'Pickup Photo' } },
      ],
      'Delivery': [
        { taskId: 'age', required: true, config: { minAge: 18, idTypes: ['Drivers Licence', 'Passport', 'Proof of Age Card'] } },
        { taskId: 'photo', required: true, config: { minPhotos: 1, maxPhotos: 3, label: 'Proof of Delivery' } },
        { taskId: 'signature', required: true, config: { signerNameReq: true, label: 'Recipient Signature' } },
      ],
    },
  },
  medical: {
    name: 'Medical',
    stages: {
      'Pickup': [
        { taskId: 'idverify', required: true, config: { matchField: 'Sender Name', idTypes: ['Drivers Licence', 'Passport', 'Company ID'] } },
        { taskId: 'barcode', required: true, config: { mustMatch: true } },
        { taskId: 'photo', required: true, config: { minPhotos: 1, maxPhotos: 2, label: 'Pickup Photo' } },
      ],
      'Enroute to Delivery': [
        { taskId: 'coldchain', required: true, config: { minTemp: 2, maxTemp: 8, requirePhoto: true } },
      ],
      'Delivery': [
        { taskId: 'photo', required: true, config: { minPhotos: 2, maxPhotos: 5, label: 'Delivery Photo + Temp Display' } },
        { taskId: 'prompt', required: true, config: { message: 'Collect the temperature logger from the client before leaving', acknowledge: true } },
        { taskId: 'templogger', required: true, config: { action: 'collect', scanRequired: true } },
        { taskId: 'signature', required: true, config: { signerNameReq: true, label: 'Recipient Signature' } },
      ],
    },
  },
  minimal: {
    name: 'Minimal',
    stages: {
      'Delivery': [
        { taskId: 'checkbox', required: true, config: { label: 'Delivery completed' } },
      ],
    },
  },
};
