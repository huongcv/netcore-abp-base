import {axios, basePath, CitizenIdentityCardDto, getConfigs, IRequestConfig, IRequestOptions} from './index.defs';

export class DeserializeCardService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static deserializeCitizenIdentity(
    params: {
      /**  */
      input?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CitizenIdentityCardDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/deserialize-card/deserialize-citizen-identity';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { input: params['input'] };

      axios(configs, resolve, reject);
    });
  }
}
