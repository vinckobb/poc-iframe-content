const guiDebug = process.env['GUI_DEBUG'];
const guiApiBaseUrl = process.env['GUI_API_BASE_URL'];
const guiTheme = process.env['GUI_THEME'];
const guiLanguage = process.env['GUI_LANGUAGE'];
const guiOauthServerUrl = process.env['GUI_OAUTH_SERVER_URL'];
const guiKeycloakRealm = process.env['GUI_KEYCLOAK_REALM'];
const guiKeycloakClient = process.env['GUI_KEYCLOAK_CLIENT'];
const guiRedirectUri = process.env['GUI_REDIRECT_URI'];

configOverride.configuration.debug = guiDebug ? guiDebug.toLowerCase() == 'true' : configOverride.configuration.debug;
configOverride.configuration.apiBaseUrl = guiApiBaseUrl ? guiApiBaseUrl : configOverride.configuration.apiBaseUrl;
configOverride.general.theme = guiTheme ? guiTheme : configOverride.general.theme;
configOverride.general.language = guiLanguage ? guiLanguage : configOverride.general.language;

configOverride.configuration.keycloak.oauthServerUrl = guiOauthServerUrl ? guiOauthServerUrl : configOverride.configuration.keycloak.oauthServerUrl;
configOverride.configuration.keycloak.keycloakRealm = guiKeycloakRealm ? guiKeycloakRealm : configOverride.configuration.keycloak.keycloakRealm;
configOverride.configuration.keycloak.keycloakClient = guiKeycloakClient ? guiKeycloakClient : configOverride.configuration.keycloak.keycloakClient;
configOverride.configuration.keycloak.redirectUri = guiRedirectUri ? guiRedirectUri : configOverride.configuration.keycloak.redirectUri;

(typeof window != 'undefined' && window || typeof self != 'undefined' && self || typeof global != 'undefined' && global).configOverride = configOverride;
