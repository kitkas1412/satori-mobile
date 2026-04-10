const { withEntitlementsPlist } = require("expo/config-plugins");

/**
 * Remove aps-environment entitlement from iOS to disable push notifications on iOS.
 * Push notifications remain enabled on Android via expo-notifications.
 */
const withoutIosPushNotifications = (config) => {
  return withEntitlementsPlist(config, (config) => {
    delete config.modResults["aps-environment"];
    return config;
  });
};

module.exports = withoutIosPushNotifications;
