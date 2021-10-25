import OfflineScheduler from './scheduler';

export class ServelessOfflineSchedulerPlugin {
  private readonly serverless: Serverless.Instance;

  public readonly options: Serverless.Options;
  public readonly hooks: { [key: string]: Function };
  public readonly commands: Serverless.Commands;

  public constructor(serverless: Serverless.Instance, options: Serverless.Options) {
    this.serverless = serverless;
    this.options = options;
    this.commands = {
      schedule: {
        usage: 'Run scheduled lambdas locally',
        lifecycleEvents: ['run'],
      },
    };

    const offlineScheduler = new OfflineScheduler({
      log: message => serverless.cli.log(message),
      functionProvider: () => this.serverless.service.functions,
      configOptions: this.serverless.service.custom?.serverlessOfflineSchedule,
    });

    this.hooks = {
      'schedule:run': offlineScheduler.scheduleEventsStandalone,
      'before:offline:start': offlineScheduler.scheduleEvents,
      'before:offline:start:init': offlineScheduler.scheduleEvents,
    };
  }
}

module.exports = ServelessOfflineSchedulerPlugin;
