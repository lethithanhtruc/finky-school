import React, { useContext, useMemo } from 'react';
import { useQuery } from "@apollo/client";

import { GET_RELEVANT_DATA_FOR_STUDENT } from "./gql";

export const FacilityContext = React.createContext();

export const FacilityProvider = ({ children }) => {
  const { loading, data, refetch } = useQuery(GET_RELEVANT_DATA_FOR_STUDENT, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
});
  const valueMemoized = useMemo(() => {
    if (data?.campuses?.data) {
      return {
        loading,
        facilities: data?.campuses?.data,
        refetch,
      };
    }
    return {
      loading,
      facilities: [],
      refetch,
    };
  }, [loading, data, refetch]);

  return (
    <FacilityContext.Provider
      value={valueMemoized}
    >
      {children}
    </FacilityContext.Provider>
  )
}

export const useFactilityContext = () => {
  const { loading, facilities, refetch } = useContext(FacilityContext);

  return { loading, facilities, refetch };
}