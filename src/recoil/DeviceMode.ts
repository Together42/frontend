import { atom, selector } from 'recoil';

const DeviceMode = atom<string>({
  key: 'DeviceMode',
  default: window.innerHeight > 700 ? 'desktop' : 'mobile',
});

const getDeviceMode = selector({
  key: 'getDeviceMode',
  get: () => window.innerWidth,
  set: ({ set }, newValue) => {
    if (newValue > 700) set(DeviceMode, 'desktop');
    else set(DeviceMode, 'mobile');
  },
});

export { DeviceMode, getDeviceMode };
export default DeviceMode;
