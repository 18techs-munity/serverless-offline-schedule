declare namespace Serverless {
  interface Command {
    usage: string;
    lifecycleEvents: string[];
  }

  type Commands = { [key: string]: Command };

  interface ScheduleConfigOptions {
    skipFunctions: string[];
    runImmediately: boolean;
  }

  interface Instance {
    cli: {
      log(str: string): void;
    };

    config: {
      servicePath: string;
    };

    service: {
      provider: {
        name: string;
      };
      functions: {
        [key: string]: Serverless.Function;
      };
      package: Serverless.Package;
      custom: {
        serverlessOfflineSchedule: ScheduleConfigOptions;
      };
      getAllFunctions(): string[];
    };

    pluginManager: PluginManager;
  }

  interface Options {
    function?: string;
    watch?: boolean;
    extraServicePath?: string;
  }

  type Event = { [type: string]: { rate: string; input?: object } };

  interface Function {
    handler: string;
    events: Event[];
  }

  interface Package {
    include: string[];
    exclude: string[];
    artifact?: string;
    individually?: boolean;
  }

  interface PluginManager {
    spawn(command: string): Promise<void>;
  }
}
