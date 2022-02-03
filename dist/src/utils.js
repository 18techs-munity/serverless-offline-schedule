'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const child_process_1 = __importDefault(require('child_process'));
const convertRateToCron = rate => {
  const parts = rate.split(' ');
  if (!parts[1]) {
    throw new Error(`Invalid rate format: '${rate}'`);
  }
  if (parts[1].startsWith('minute')) {
    return `*/${parts[0]} * * * *`;
  }
  if (parts[1].startsWith('hour')) {
    return `0 */${parts[0]} * * *`;
  }
  if (parts[1].startsWith('day')) {
    return `0 0 */${parts[0]} * *`;
  }
  throw new Error(`Invalid rate format: '${rate}'`);
};
exports.convertExpressionToCron = scheduleRate => {
  if (scheduleRate.startsWith('cron(')) {
    return scheduleRate.replace('cron(', '').replace(')', '');
  }
  if (scheduleRate.startsWith('rate(')) {
    const params = scheduleRate.replace('rate(', '').replace(')', '');
    return convertRateToCron(params);
  }
  throw new Error(`Invalid schedule rate: '${scheduleRate}'`);
};
exports.slsInvokeFunction = (name, input) => {
  return child_process_1.default.execSync(
    `serverless invoke local --function ${name} --data '${JSON.stringify(input)}'`,
    { cwd: './', stdio: 'inherit' }
  );
};
