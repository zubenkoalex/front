import { createRoot } from 'react-dom/client'
import { FC, useEffect } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import './index.scss';
import App from './App';
import { Provider } from 'react-redux';
import { setupStore } from './store';
import { useAppSelector } from './hooks/redux';

const store = setupStore();

const ThemeRuntimeSync: FC = () => {
    const { themeMode } = useAppSelector((state) => state.dashboardReducer);

    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");

        const applyTheme = () => {
            const resolvedTheme = themeMode === "system"
                ? (media.matches ? "dark" : "light")
                : themeMode;

            document.documentElement.setAttribute("data-theme", resolvedTheme);
        };

        applyTheme();

        media.addEventListener("change", applyTheme);
        return () => media.removeEventListener("change", applyTheme);
    }, [themeMode]);

    return null;
};

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <ThemeRuntimeSync />
        <Router>
            <App />
        </Router>
    </Provider>
)