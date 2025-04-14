export const DebugVars = !__DEV__ ? undefined : {
  showScreenNames: false,
  enableToggleThemeButton: false,
};

if (DebugVars) {
  DebugVars.showScreenNames = true;
  // DebugVars.enableToggleThemeButton = true;
}
