import { LOCAL_MODE } from './runtime.js';

// Dynamic import keeps server authentication and its storage out of local mode.
const client = LOCAL_MODE
  ? (await import('./local-client.js')).createLocalClient()
  : await import('./server-client.js');

export const state = client.state;
export const probe = (...args) => client.probe(...args);
export const redeem = (...args) => client.redeem(...args);
export const getProfile = (...args) => client.getProfile(...args);
export const updateProfile = (...args) => client.updateProfile(...args);
export const getTodayRoutine = (...args) => client.getTodayRoutine(...args);
export const saveCachedRoutine = (...args) => client.saveCachedRoutine(...args);
export const logWorkout = (...args) => client.logWorkout(...args);
export const getLogs = (...args) => client.getLogs(...args);
export const deleteLog = (...args) => client.deleteLog(...args);
export const answerProposal = (...args) => client.answerProposal(...args);
export const revertProgression = (...args) => client.revertProgression(...args);
export const updateDeviceLabel = (...args) => client.updateDeviceLabel(...args);
export const getActiveWorkout = () => client.getActiveWorkout?.() ?? Promise.resolve(null);
export const saveActiveWorkout = workout => client.saveActiveWorkout?.(workout) ?? Promise.resolve();
export const exportData = () => client.exportData();
export const importData = input => client.importData(input);
export const resetData = () => client.resetData();
