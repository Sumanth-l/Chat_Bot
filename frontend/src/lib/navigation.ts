import { useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('popstate', notify);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('popstate', notify);
  };
}

function getPathname() {
  return window.location.pathname;
}

export function navigate(path: string, replace = false) {
  if (replace) window.history.replaceState({}, '', path);
  else window.history.pushState({}, '', path);
  notify();
}

export function usePathname() {
  return useSyncExternalStore(subscribe, getPathname, () => '/');
}
