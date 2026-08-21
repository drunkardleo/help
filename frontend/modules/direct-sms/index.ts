import { requireOptionalNativeModule } from 'expo-modules-core';

interface DirectSmsModuleType {
  sendDirectSms(phoneNumbers: string[], message: string): Promise<boolean>;
  makeDirectCall(phoneNumber: string): Promise<boolean>;
}

const DirectSms = requireOptionalNativeModule<DirectSmsModuleType>('DirectSms');

export default DirectSms;

