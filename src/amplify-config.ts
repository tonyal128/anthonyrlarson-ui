export const amplifyConfig = {
  "auth": {
    "user_pool_id": "us-east-2_iOlhSaEld",
    "aws_region": "us-east-2",
    "user_pool_client_id": "45r12o9mthhb3nprbrac1jt728",
    "identity_pool_id": "us-east-2:ad3d7434-c186-4914-8d54-16a36336595b",
    "mfa_methods": [],
    "standard_required_attributes": [
      "email"
    ],
    "username_attributes": [
      "email"
    ],
    "user_verification_types": [
      "email"
    ],
    "groups": [],
    "mfa_configuration": "NONE",
    "password_policy": {
      "min_length": 8,
      "require_lowercase": true,
      "require_numbers": true,
      "require_symbols": true,
      "require_uppercase": true
    },
    "unauthenticated_identities_enabled": true
  },
  "version": "1.4"
};
