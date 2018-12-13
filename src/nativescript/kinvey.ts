import { Promise } from 'es6-promise';
import * as url from 'url';
import { isDefined } from '../core/utils';
import { KinveyError } from '../core/errors';
import { RequestMethod } from '../core/request';
import { getDataFromPackageJson } from './utils';
import { Client } from './client';

const USERS_NAMESPACE = 'user';
const ACTIVE_USER_COLLECTION_NAME = 'kinvey_active_user';

export function init(config = <any>{}) {
  const configFromPackageJson = getDataFromPackageJson() || <any>{};

  config.appKey = config.appKey || configFromPackageJson.appKey;
  config.appSecret = config.appSecret || configFromPackageJson.appSecret;
  config.masterSecret = config.masterSecret || configFromPackageJson.masterSecret;
  config.instanceId = config.instanceId || configFromPackageJson.instanceId

  if (!isDefined(config.appKey)) {
    throw new KinveyError('No App Key was provided.'
      + ' Unable to create a new Client without an App Key.');
  }

  if (!isDefined(config.appSecret) && !isDefined(config.masterSecret)) {
    throw new KinveyError('No App Secret or Master Secret was provided.'
      + ' Unable to create a new Client without an App Secret.');
  }

  return Client.init(config);
}

export function initialize(config) {
  const client = init(config);
  return Promise.resolve(client.getActiveUser());
}
