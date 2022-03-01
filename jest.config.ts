import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
};
export default config;

// pathMappings:
// https://github.com/kulshekhar/ts-jest/issues/364#issuecomment-647506833
