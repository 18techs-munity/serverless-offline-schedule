'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const node_schedule_1 = __importDefault(require('node-schedule'));
const lodash_flatten_1 = __importDefault(require('lodash.flatten'));
const utils_1 = require('./utils');
class OfflineScheduler {
  constructor(config) {
    this.scheduleEventsStandalone = () => {
      this.log('Starting serverless-offline-schedule in standalone process. Press CTRL+C to stop.');
      return Promise.resolve(this.scheduleEvents()).then(this.listenForTermination);
    };
    this.scheduleEvents = () => {
      const configurations = this.getFunctionConfigurations();
      configurations.forEach(functionConfiguration => {
        const { functionName, cron, input } = functionConfiguration;
        this.log(`Scheduling [${functionName}] cron: [${cron}] input: ${JSON.stringify(input)}`);
        node_schedule_1.default.scheduleJob(cron, () => {
          try {
            utils_1.slsInvokeFunction(functionName, input);
            this.log(`Succesfully invoked scheduled function: [${functionName}]`);
          } catch (err) {
            this.log(`Failed to execute scheduled function: [${functionName}] Error: ${err}`);
          }
        });
      });
    };
    this.getFunctionConfigurations = () => {
      const functions = this.functionProvider();
      const scheduleConfigurations = Object.keys(functions).map(functionName => {
        const functionConfig = functions[functionName];
        const { events } = functionConfig;
        const scheduleEvents = events.filter(event => event.hasOwnProperty('schedule'));
        return scheduleEvents.map(event => {
          return {
            functionName,
            cron: utils_1.convertExpressionToCron(event['schedule'].rate),
            input: event['schedule'].input || {},
          };
        });
      });
      return lodash_flatten_1.default(scheduleConfigurations);
    };
    this.listenForTermination = () => {
      // SIGINT: usually sent when user presses CTRL+C
      const waitForSigInt = new Promise(resolve => {
        process.on('SIGINT', () => resolve('SIGINT'));
      });
      // SIGTERM: default termination signal in many cases
      const waitForSigTerm = new Promise(resolve => {
        process.on('SIGTERM', () => resolve('SIGTERM'));
      });
      return Promise.race([waitForSigInt, waitForSigTerm]).then(command => {
        this.log(`Got ${command} signal. Stopping serverless-offline-scheduleer...`);
        process.exit(0);
      });
    };
    const { log = console.log, functionProvider } = config;
    this.log = log;
    this.functionProvider = functionProvider;
  }
}
exports.default = OfflineScheduler;
