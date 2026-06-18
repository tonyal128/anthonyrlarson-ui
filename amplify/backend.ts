import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';

/**
 * @see https://docs.amplify.aws/gen2/build-a-backend/
 */
const backend = defineBackend({
  auth,
});

const { cfnUserPool, cfnUserPoolClient } = backend.auth.resources.cfnResources;
cfnUserPool.adminCreateUserConfig = {
  allowAdminCreateUserOnly: true,
};

// Set login session timeout to 8 hours (typical workday)
cfnUserPoolClient.refreshTokenValidity = 8;
cfnUserPoolClient.tokenValidityUnits = {
  refreshToken: 'hours',
};

