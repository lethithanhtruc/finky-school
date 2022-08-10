import './App.scss';
import loadable from "@loadable/component";
import SpinPage from "./components/Layout/SpinPage";

const App = () => {
    if(!localStorage.token){
        const LayoutGuest = loadable(() => import("./components/Layout/LayoutGuest"), {
            fallback: <SpinPage />
        });

        return (
            <LayoutGuest />
        );
    }else{
        const LayoutAuth = loadable(() => import("./components/Layout/LayoutAuth"), {
            fallback: <SpinPage />
        });

        return (
            <LayoutAuth />
        );
    }
}

export default App;
