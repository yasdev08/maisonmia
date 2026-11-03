/** Inline <head> script: parks the early install offer on window.__mmInstall and registers the service worker. */
export const INSTALL_BOOT_SCRIPT = `(function(){
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__mmInstall=e;window.dispatchEvent(new Event('mm:install'))});
window.addEventListener('appinstalled',function(){window.__mmInstall=null;window.__mmInstalled=true;window.dispatchEvent(new Event('mm:install'))});
if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})})}
})();`;
