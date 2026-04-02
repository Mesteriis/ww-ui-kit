export type PlaygroundRoute =
  | {
      mode: 'home';
    }
  | {
      mode: 'testing';
    }
  | {
      mode: 'lab';
      surfaceId: string;
    };

function getBasePrefix(pathname: string) {
  return pathname === '/playground' || pathname.startsWith('/playground/') ? '/playground' : '';
}

export function parsePlaygroundRoute(pathname: string, defaultSurfaceId: string): PlaygroundRoute {
  const basePrefix = getBasePrefix(pathname);
  const normalizedPath = pathname.startsWith(basePrefix)
    ? pathname.slice(basePrefix.length) || '/'
    : pathname;
  const segments = normalizedPath.split('/').filter(Boolean);

  if (segments.length === 0) {
    return {
      mode: 'home',
    };
  }

  if (segments[0] === 'lab') {
    return {
      mode: 'lab',
      surfaceId: segments[1] ?? defaultSurfaceId,
    };
  }

  if (segments[0] === 'testing') {
    return {
      mode: 'testing',
    };
  }

  return {
    mode: 'testing',
  };
}

export function buildPlaygroundPath(route: PlaygroundRoute, pathname?: string) {
  const resolvedPathname =
    pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
  const basePrefix = getBasePrefix(resolvedPathname);

  if (route.mode === 'lab') {
    return `${basePrefix}/lab/${route.surfaceId}`;
  }

  if (route.mode === 'home') {
    return basePrefix ? `${basePrefix}/` : '/';
  }

  return `${basePrefix}/testing`;
}
