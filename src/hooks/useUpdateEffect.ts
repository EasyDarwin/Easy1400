import { useEffect, useRef } from 'react';

function useUpdateEffect(callback: () => void, dependencies: any[]) {
  const prevDependencies = useRef<any[]>(dependencies);

  useEffect(() => {
    if (prevDependencies.current !== dependencies) {
      prevDependencies.current = dependencies;
      callback();
    }
  }, dependencies);
}

export default useUpdateEffect;