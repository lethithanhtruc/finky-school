import { createContext, useState } from "react"
export const StoreContext = createContext(null);

export default ({ children }) => {
    const [keySelectedSidebar, setKeySelectedSidebar] = useState(null);
    const [me, setMe] = useState(null);

    const store = {
        keySelectedSidebar: [keySelectedSidebar, setKeySelectedSidebar],
        me: [me, setMe],
    };

    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
};
