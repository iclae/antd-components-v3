import { useEffect, useRef } from 'react';

export default (fn, deps) => {
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      fn();
    } else {
      didMountRef.current = true;
    }
  }, deps);
};
