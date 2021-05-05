//TODO: rename these interfaces as the naming is confusing (e.g. JiraStatus vs JiraApiStatus)

// █▀▀ ▀▄▀ █▀█ █▀▀ █▀▀ ▀█▀ █▀▀ █▀▄
// ██▄ █░█ █▀▀ ██▄ █▄▄ ░█░ ██▄ █▄▀

export interface JiraWorkflowTransition {
  name: string;
  from?: string[];
  to?: string;
  type?: string;
  rules?: {
    conditions?: any[];
    validators?: { type: string; configuration: { permissionKey: string } }[];
    postFunctions?: (
      | { type: string; configuration?: undefined }
      | { type: string; configuration: { event: { id: string; name: string } } }
    )[];
  };
}

export interface JiraStatus {
  name: string;
  transitionTo?: string[];
  transitionFrom?: string[];
  properties?: any; //I don't know the type of this one yet
}


// ▄▀█ █▀▀ ▀█▀ █░█ ▄▀█ █░░   ▄▀█ █▀█ █   █▀█ █▀▀ █▀ █▀█ █▀█ █▄░█ █▀ █▀▀ █▀
// █▀█ █▄▄ ░█░ █▄█ █▀█ █▄▄   █▀█ █▀▀ █   █▀▄ ██▄ ▄█ █▀▀ █▄█ █░▀█ ▄█ ██▄ ▄█

export interface JiraApiStatus {
  id: string;
  name: string;
  properties?: any; //I don't know the type of this one yet
}

export interface JiraApiResponse {
    id: Object;
    transitions: [];
    statuses: [];
    isDefault: boolean;
  }