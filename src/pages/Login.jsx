import notie from 'notie';
import { useState } from 'react';

import { validadeLogin } from '../utils/validate.js';
import { changeButtonLayout, showAndHidePassword } from '../utils/scripts.js';
import { findUser } from '../utils/db.js';

const Login = (props) => {
    const setStateIndex = props.setStateIndex;
    const setLoggedUser = props.setLoggedUser;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState(null);

    const goToSignUp = () => {
        setEmail('');
        setPassword('');

        setStateIndex(1);
    }

    const alertMessage = (message) => {
        return (
            <small className="text-xs  text-red-500  mt-1">{message}</small>
        );
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();

        setErrors(null);

        let data = {
            email, password
        };

        const validateErrors = validadeLogin(data);

        if(Object.keys(validateErrors).length > 0)
        {
            setErrors(validateErrors);
            return;
        }
        
        findUser(email, password)
            .then(userInfo => {
                notie.alert({
                    type: 'success',
                    text: 'Entrando em sua conta, por favor aguarde',
                    time: 1.5
                });

                setLoggedUser(userInfo);
                
                setTimeout(() => {
                    setStateIndex(2);
                }, 2000);
            })
            .catch(error => {
                switch(error.type)
                {
                    case 'connection-error' || 'select-error': {
                        notie.alert({
                            type: 'error', text: error.text
                        });
                        
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                        break;
                    }

                    case 'user-not-found': {
                        notie.confirm({
                            text: error.text,
                            submitText: 'Cadastrar-se',
                            cancelText: 'Recarregar',
                            submitCallback: goToSignUp,
                            cancelCallback: () => {
                                window.location.reload();
                            }
                        });
                        break;
                    }

                    default: {
                        notie.alert({
                            type: 'error',
                            text: 'Ocorreu um erro, verifique a sua conexão com a internet e tente novamente'
                        });
                    }
                }
            });
    };

    return (
        <>
            <h1 className="font-bold  text-[2rem]  text-white">Entre em sua conta</h1>
            <p className="text-white">Faça login para ficar por dentro das últimas notícias</p>

            <div className="w-96  mt-4  bg-stone-200  px-4  py-5  rounded-lg">
                <form onSubmit={handleLoginSubmit} className="flex  flex-col  gap-3">
                    <div className="flex  flex-col">
                        <label htmlFor="loginEmail" className="text-sm">E-mail</label>
                        <input type="text" name="email" id="loginEmail" placeholder="Digite o seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-lg  px-2  py-2  text-sm  placeholder:text-sm  placeholder:text-stone-400"/>
                        { errors?.email && alertMessage(errors.email) }
                    </div>

                    <div className="flex  flex-col">
                        <label htmlFor="loginPassword" className="text-sm">Senha</label>
                        <div className="flex">
                            <input type="password" name="password" id="loginPassword" placeholder="Digite sua senha" value={password} onChange={(e) => setPassword(e.target.value)} className="w-10/12  text-stone-900  rounded-l-lg  px-2  py-2  text-sm  border-r  border-stone-700  placeholder:text-sm  placeholder: text-stone-400"/>
                            <button type="button" onMouseOver={(e) => changeButtonLayout('mouse over', e.target)} onMouseOut={(e) => changeButtonLayout('mouse out', e.target)} onClick={(e) => showAndHidePassword(e.target)} className="bi bi-eye-slash  w-2/12  rounded-r-lg  bg-stone-300  border-l  border-stone-700  px-2  cursor-pointer  transition  duration-150  ease-in"></button>
                        </div>
                        { errors?.password && alertMessage(errors.password) }
                    </div>

                    <div className="flex  align-center  text-xs  mb-2">
                        <button type="button" onClick={goToSignUp} className="underline  text-blue-600  cursor-pointer  transition  duration-150  ease-in  hover:text-blue-800">Não possuo uma conta</button>
                    </div>

                    <button type="submit" className="bg-slate-600  hover:bg-slate-500  font-medium  px-4  py-2  rounded-lg  text-white  transition  duration-200  ease-in">Entrar</button>
                </form>
            </div>
        </>
    );
};

export default Login;