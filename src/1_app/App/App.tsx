import { RouterProvider } from '@app/App/RouterProvider';
import { EntryProvider } from '@shared/provides/EntryProvider';
import { BrowserRouter } from 'react-router-dom';

export const App = () => {
    return (
        <EntryProvider>
            <BrowserRouter>
                <RouterProvider />
            </BrowserRouter>
        </EntryProvider>
    );
};
