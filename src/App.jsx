import { useState, useEffect } from "react";

import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import News from "./pages/News.jsx";

const App = () => {
    const STATES = ['login', 'sign-up', 'news'];
    const [stateIndex, setStateIndex] = useState(() => {
        const storedState = localStorage.getItem('currentState');
        return storedState ? storedState : 0;
    });
    const [loggedUser, setLoggedUser] = useState(() => {
        const storedUser = localStorage.getItem('loggedUser');
        return storedUser ? JSON.parse(storedUser) : {};
    });

    useEffect(() => {
        localStorage.setItem('currentState', stateIndex);
    }, [stateIndex]);

    useEffect(() => {
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
    }, [loggedUser]);

    return (
        <div className="  min-h-screen  w-full  flex  flex-col  items-center  justify-center">
            { STATES[stateIndex] === 'login' && <Login setStateIndex={setStateIndex} setLoggedUser={setLoggedUser}/> }
            { STATES[stateIndex] === 'sign-up' && <SignUp setStateIndex={setStateIndex}/> }
            { STATES[stateIndex] === 'news' && <News setStateIndex={setStateIndex} loggedUser={loggedUser} setLoggedUser={setLoggedUser}/> }
        </div>
    );
};

export default App;