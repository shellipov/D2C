export const DebugVars = !__DEV__ ? undefined : {
  showScreenNames: false,
  // изменение темы пока не работает
  enableToggleThemeButton: false,
};

if (DebugVars) {
  DebugVars.showScreenNames = true;
  // DebugVars.enableToggleThemeButton = true;
}
