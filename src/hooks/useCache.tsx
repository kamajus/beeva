import { useContext } from 'react';

import { CacheContext } from '../contexts/CacheProvider';

export const useCache = () => useContext(CacheContext);
