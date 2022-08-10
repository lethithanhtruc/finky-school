import { useState, useCallback, useEffect } from 'react';

import { useHistory } from 'react-router-dom';

import queryString from 'query-string';

export const useForceUpdate = () => {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    return {
        forceUpdate
    }
}

export const useQueryString = () => {
  const history = useHistory();
  const { location } = history;
  const [values] = useState(queryString.parse(location.search));
  return values;
}
