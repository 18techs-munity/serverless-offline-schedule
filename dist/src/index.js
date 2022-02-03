'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const scheduler_1 = __importDefault(require('./scheduler'));
class ServelessOfflineSchedulerPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.commands = {
      schedule: {
        usage: 'Run scheduled lambdas locally',
        lifecycleEvents: ['run'],
      },
    };
    const offlineScheduler = new scheduler_1.default({
      log: message => serverless.cli.log(message),
      functionProvider: () => this.serverless.service.functions,
    });
    this.hooks = {
      'schedule:run': offlineScheduler.scheduleEventsStandalone,
      'before:offline:start': offlineScheduler.scheduleEvents,
      'before:offline:start:init': offlineScheduler.scheduleEvents,
    };
  }
}
exports.ServelessOfflineSchedulerPlugin = ServelessOfflineSchedulerPlugin;
module.exports = ServelessOfflineSchedulerPlugin;
