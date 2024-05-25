import notie from 'notie';
import { useState } from "react";

import { validadeAlter } from '../utils/validate';
import { changeButtonLayout, showAndHidePassword, showAndHideAccountInfo, enableChangeInfo } from "../utils/scripts";
import { alterUser } from '../utils/db';

const AccountInfo = (props) => {
    const userInfo = props.userInfo;
    const setLoggedUser = props.setLoggedUser;

    const [name, setName] = useState(userInfo.name);
    const [email, setEmail] = useState(userInfo.email);
    const [password, setPassword] = useState(userInfo.password);
    const [confirm, setConfirm] = useState(userInfo.password);

    const [errors, setErrors] = useState(null);

    const resetInputsAndHide = () => {
        document.getElementById('infoName').setAttribute('readOnly', true);
        document.getElementById('infoEmail').classList.remove('active');
        document.getElementById('infoPassword').setAttribute('readOnly', true);
        document.getElementById('infoConfirm').parentNode.parentNode.classList.add('hidden');

        document.getElementById('infoBtnAlter').classList.remove('hidden');
        document.getElementById('infoBtnClose').classList.remove('hidden');
        document.getElementById('infoBtnConfirm').classList.add('hidden');
        document.getElementById('infoBtnCancel').classList.add('hidden');
        
        setName(userInfo.name);
        setEmail(userInfo.email);
        setPassword(userInfo.password);
        setConfirm(userInfo.password);

        showAndHideAccountInfo('hide');
    }

    const handleAlterInfo = (e) => {
        e.preventDefault();

        setErrors(null);

        let data = {
            password, confirm
        }

        const validateErrors = validadeAlter(data);

        if(Object.keys(validateErrors).length > 0)
        {
            setErrors(validateErrors);
            return;
        }

        if(name === '' || name === userInfo.name) { setName(userInfo.name); }
        if(password === '' || password === userInfo.password) { setPassword(userInfo.password); }

        if(name === userInfo.name && password === userInfo.password)
        {
            resetInputsAndHide();
            return;
        }

        notie.confirm({
            text: 'Continuar fará com que os dados que você tenha inserido sejam gravados por cima dos antigos',
            submitText: 'Continuar',
            cancelText: 'Cancelar',
            submitCallback: () => {
                alterUser(userInfo.id, name, password)
                    .then(data => {
                        setLoggedUser(data);
                        resetInputsAndHide();

                        notie.force({
                            type: 'success',
                            text: 'Os dados foram alterados com sucesso! Recarregue a página para visualizar as mudanças',
                            buttonText: 'Recarregar',
                            callback: () => {
                                window.location.reload();
                            }
                        });
                    })
                    .catch(error => {
                        notie.alert({
                            type: 'error', text: error.text
                        });
                        resetInputsAndHide();

                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                    });
            },
            cancelCallback: resetInputsAndHide
        });
    }

    return (
        <>
            <div onClick={resetInputsAndHide} className="fixed  w-full  h-full  bg-white  bg-opacity-50  z-10"></div>

            <div className="w-96  bg-slate-900  border  border-slate-400  px-4  py-5  rounded-lg  text-white  z-20">
                <form onSubmit={handleAlterInfo} className="flex  flex-col  gap-3">
                    <div className="flex  flex-col">
                        <label htmlFor="infoName" className="text-sm">Nome</label>
                        <input type="text" name="name" id="infoName" placeholder="Digite seu novo nome" value={name} onChange={(e) => setName(e.target.value)} readOnly className="rounded-lg  px-2  py-2  text-sm  text-black  placeholder:text-sm  placeholder:text-stone-400"/>
                    </div>

                    <div className="flex  flex-col">
                        <label htmlFor="infoEmail" className="text-sm">E-mail</label>
                        <input type="text" name="email" id="infoEmail" placeholder="Digite seu novo e-mail" value={email} onChange={(e) => setEmail(e.target.value)} readOnly className="rounded-lg  px-2  py-2  text-sm  text-black  placeholder:text-sm  placeholder:text-stone-400"/>
                    </div>

                    <div className="flex  flex-col">
                        <label htmlFor="infoPassword" className="text-sm">Senha</label>
                        <div className="flex">
                            <input type="password" name="password" id="infoPassword" placeholder="Digite sua nova senha" value={password} onChange={(e) => setPassword(e.target.value)} readOnly className="w-10/12  text-stone-900  rounded-l-lg  px-2  py-2  text-sm  border-r  border-stone-700  placeholder:text-sm  placeholder: text-stone-400"/>
                            <button type="button" onMouseOver={(e) => changeButtonLayout('mouse over', e.target)} onMouseOut={(e) => changeButtonLayout('mouse out', e.target)} onClick={(e) => showAndHidePassword(e.target)} className="bi bi-eye-slash  w-2/12  rounded-r-lg  text-stone-800  bg-stone-300  border-l  border-stone-700  px-2  cursor-pointer  transition  duration-150  ease-in"></button>
                        </div>
                    </div>

                    <div className="hidden  flex  flex-col">
                        <label htmlFor="infoConfirm" className="text-sm">Confirmar Senha</label>
                        <div className="flex">
                            <input type="password" name="password" id="infoConfirm" placeholder="Confirme sua nova senha" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-10/12  text-stone-900  rounded-l-lg  px-2  py-2  text-sm  border-r  border-stone-700  placeholder:text-sm  placeholder: text-stone-400"/>
                            <button type="button" onMouseOver={(e) => changeButtonLayout('mouse over', e.target)} onMouseOut={(e) => changeButtonLayout('mouse out', e.target)} onClick={(e) => showAndHidePassword(e.target)} className="bi bi-eye-slash  w-2/12  rounded-r-lg  text-stone-800  bg-stone-300  border-l  border-stone-700  px-2  cursor-pointer  transition  duration-150  ease-in"></button>
                        </div>
                        {errors?.confirm && <small className="text-xs  text-red-500  mt-1">{errors.confirm}</small>}
                    </div>

                    <div className="flex  w-full  gap-2  mt-2">
                        <button type="button" id="infoBtnAlter" onClick={enableChangeInfo} className="w-full  bg-slate-500  font-medium  px-4  py-2  rounded-lg  text-white  transition  duration-200  ease-in  hover:bg-slate-400  hover:text-black">Alterar</button>
                        <button type="button" id="infoBtnClose" onClick={() => showAndHideAccountInfo('hide')} className="w-full  bg-slate-500  font-medium  px-4  py-2  rounded-lg  text-white  transition  duration-200  ease-in  hover:bg-slate-400  hover:text-black">Fechar</button>
                        
                        <button type="submit" id="infoBtnConfirm" className="hidden  w-full  bg-slate-500  font-medium  px-4  py-2  rounded-lg  text-white  transition  duration-200  ease-in  hover:bg-slate-400  hover:text-black">Confirmar</button>
                        <button type="button" id="infoBtnCancel" onClick={resetInputsAndHide} className="hidden  w-full  bg-slate-500  font-medium  px-4  py-2  rounded-lg  text-white  transition  duration-200  ease-in  hover:bg-slate-400  hover:text-black">Cancelar</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AccountInfo;