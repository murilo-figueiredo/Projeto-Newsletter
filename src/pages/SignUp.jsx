import notie from 'notie';
import { useState } from 'react';

import { validateSignUp } from '../utils/validate';
import { changeButtonLayout, showAndHidePassword, validatePassword } from '../utils/scripts';
import { insertUser } from '../utils/db';

const SignUp = (props) => {
    const setStateIndex = props.setStateIndex;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [agree, setAgree] = useState(false);

    const [errors, setErrors] = useState(null);

    const goToLogin = () => {
        setName('');
        setEmail('');
        setPassword('');
        setConfirm('');
        setAgree(false);

        setStateIndex(0);
    };

    const alertMessage = (message) => {
        return (
            <small className="text-xs  text-red-500  mt-1">{message}</small>
        );
    };

    const showTheTerms = () => {
        notie.force({
            type: 'neutral',
            text: 'Os Termos :D',
            buttonText: 'Pronto'
        });
    };

    const handleSignUpSubmit = (e) => {
        e.preventDefault();

        setErrors(null);

        let data = {
            name, email, password, confirm, agree
        };

        let validateErrors = validateSignUp(data);

        if(Object.keys(validateErrors).length > 0)
        {
            setErrors(validateErrors);
            return;
        }
        
        insertUser(name, email, password)
            .then(result => {
                notie.force({
                    type: 'success',
                    text: `${result}, ${name}`,
                    buttonText: 'Continuar',
                    callback: goToLogin
                });
            })
            .catch(error => {
                switch(error.type)
                {
                    case 'connection-error' || 'email-verify-error' || 'insert-error': {
                        notie.alert({
                            type: 'error', text: error.text
                        });

                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                        break;
                    }

                    case 'email-unique': {
                        notie.confirm({
                            text: error.text,
                            submitText: 'Fazer login',
                            cancelText: 'Cadastrar-se com outro e-mail',
                            submitCallback: goToLogin,
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
            <h1 className="font-bold  text-[2rem]  text-white">Cadastre-se</h1>
            <p className="text-white">Assine nossa Newsletter e mantenha-se informado</p>

            <div className="w-96  mt-4  bg-stone-200  px-4  py-5  rounded-lg">
                <form onSubmit={handleSignUpSubmit} className="flex  flex-col  gap-3">
                    <div className="flex  flex-col">
                        <label htmlFor="signUpName" className="text-sm">Nome <span title="Campo Obrigatório" className="text-red-500">*</span></label>
                        <input type="text" name="name" id="signUpName" placeholder="Digite o seu nome" value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg  px-2  py-2  text-sm  placeholder:text-sm  placeholder:text-stone-400"/>
                        { errors?.name && alertMessage(errors.name) }
                    </div>

                    <div className="flex  flex-col">
                        <label htmlFor="signUpEmail" className="text-sm">E-mail <span title="Campo Obrigatório" className="text-red-500">*</span></label>
                        <input type="text" name="email" id="signUpEmail" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Digite o seu melhor e-mail" className="rounded-lg  px-2  py-2  text-sm  placeholder:text-sm  placeholder:text-stone-400"/>
                        { errors?.email && alertMessage(errors.email) }
                    </div>

                    <div className="flex  flex-col">
                        <label htmlFor="signUpPassword" className="text-sm">Senha <span title="Campo Obrigatório" className="text-red-500">*</span></label>
                        <div className="flex">
                            <input type="password" name="password" id="signUpPassword" placeholder="Crie uma senha" value={password} onInput={() => validatePassword()} onChange={(e) => setPassword(e.target.value)} className="w-10/12  text-stone-900  rounded-l-lg  px-2  py-2  text-sm  border-r  border-stone-700  placeholder:text-sm  placeholder: text-stone-400"/>
                            <button type="button" onMouseOver={(e) => changeButtonLayout('mouse over', e.target)} onMouseOut={(e) => changeButtonLayout('mouse out', e.target)} onClick={(e) => showAndHidePassword(e.target)} className="bi bi-eye-slash  w-2/12  rounded-r-lg  bg-stone-300  border-l  border-stone-700  px-2  cursor-pointer  transition  duration-150  ease-in"></button>
                        </div>
                        { errors?.password && alertMessage(errors.password) }
                    </div>

                    <div className="flex  flex-col">
                        <label htmlFor="signUpConfirm" className="text-sm">Confirmar Senha <span title="Campo Obrigatório" className="text-red-500">*</span></label>
                        <div className="flex">
                            <input type="password" name="password" id="signUpConfirm" placeholder="Confirme sua senha" value={confirm} onInput={() => validatePassword()} onChange={(e) => setConfirm(e.target.value)} className="w-10/12  text-stone-900  rounded-l-lg  px-2  py-2  text-sm  border-r  border-stone-700  placeholder:text-sm  placeholder: text-stone-400"/>
                            <button type="button" onMouseOver={(e) => changeButtonLayout('mouse over', e.target)} onMouseOut={(e) => changeButtonLayout('mouse out', e.target)} onClick={(e) => showAndHidePassword(e.target)} className="bi bi-eye-slash  w-2/12  rounded-r-lg  bg-stone-300  border-l  border-stone-700  px-2  cursor-pointer  transition  duration-150  ease-in"></button>
                        </div>
                        <small className="text-xs  text-red-500  mt-1">{errors?.confirm && errors.confirm}</small>
                    </div>

                    <div className="flex  flex-col">
                    <p className="text-xs  mb-2"><button type="button" onClick={showTheTerms} className="underline  text-blue-600  transition  duration-150  ease-in  hover:text-blue-800">Leia os termos</button></p>
                        <div className="flex  gap-2  items-center">
                            <input type="checkbox" name="agree" id="ckbTerms" checked={agree} onChange={(e) => setAgree(e.target.checked)}/>
                            <label htmlFor="ckbTerms" className="text-sm">Concordo com os termos <span title="Campo Obrigatório" className="text-red-500">*</span></label>
                        </div>
                        { errors?.agree && alertMessage(errors.agree) }
                    </div>

                    <button type="submit" className="bg-slate-600  hover:bg-slate-500  font-medium  px-4  py-2  rounded-lg  text-white  transition  duration-200  ease-in">Cadastrar</button>
                    <p className="text-xs">Já possui uma conta? <button type="button" onClick={goToLogin} className="underline  text-blue-600  transition  duration-150  ease-in  hover:text-blue-800">Entrar</button></p>
                </form>
            </div>
        </>
    );
};

export default SignUp;