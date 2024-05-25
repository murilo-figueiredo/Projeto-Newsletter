import notie from 'notie';
import { useState } from "react";

import { showAndHidePreferences } from "../utils/scripts";
import { alterPreference } from '../utils/db';

const Preferences = (props) => {
    const userInfo = props.userInfo;
    const setLoggedUser = props.setLoggedUser;

    const [preference, setPreference] = useState(userInfo.preference);
    const [country, setCountry] = useState(userInfo.country);

    const resetInputsAndHide = () => {
        setPreference(userInfo.preference);
        setCountry(userInfo.country);

        showAndHidePreferences();
    };

    const handleAlterPref = (e) => {
        e.preventDefault();

        if(preference === userInfo.preference && country === userInfo.country)
        {
            resetInputsAndHide();
            return;
        }

        notie.confirm({
            text: 'Continuar fará com que as preferências que você tenha inserido sejam gravadas por cima das antigas',
            submitText: 'Continuar',
            cancelText: 'Cancelar',
            submitCallback: () => {
                alterPreference(userInfo.id, userInfo.password, preference, country)
                    .then(data => {
                        setLoggedUser(data);
                        resetInputsAndHide();

                        notie.force({
                            type: 'success',
                            text: 'As preferências foram alteradas com sucesso! Recarregue a página para visualizar as mudanças',
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
    };

    return (
        <>
            <div onClick={resetInputsAndHide} className="fixed  w-full  h-full  bg-white  bg-opacity-50  z-10"></div>

            <div className="w-96  bg-slate-900  border  border-slate-400  px-4  py-5  rounded-lg  text-white  z-20">
                <form onSubmit={handleAlterPref} className="flex  flex-col  gap-3">
                    <div className="flex  flex-col">
                        <label htmlFor="sltPreference" className="text-sm">Assunto Preferido</label>
                        <select name="preference" id="sltPreference" value={preference} onChange={(e) => setPreference(e.target.value)} className="text-black  font-medium  rounded-md  w-full">
                            <option value="general">Geral (Padrão)</option>
                            <option value="business">Finanças</option>
                            <option value="entertainment">Entretenimento</option>
                            <option value="health">Saúde</option>
                            <option value="science">Ciência</option>
                            <option value="sports">Esportes</option>
                            <option value="technology">Tecnologia</option>
                        </select>
                    </div>

                    <div className="flex  flex-col">
                        <label htmlFor="sltCountry" className="text-sm">País</label>
                        <select name="country" id="sltCountry" value={country} onChange={(e) => setCountry(e.target.value)} className="text-black  font-medium  rounded-md  w-full">
                            <option value="ds">Localização do Sistema (Padrão)</option>
                            <option value="za">África do Sul</option>
                            <option value="de">Alemanha</option>
                            <option value="sa">Arábia Saudita</option>
                            <option value="ar">Argentina</option>
                            <option value="au">Austrália</option>
                            <option value="at">Áustria</option>
                            <option value="be">Bélgica</option>
                            <option value="br">Brasil</option>
                            <option value="bg">Bulgária</option>
                            <option value="ca">Canadá</option>
                            <option value="cn">China</option>
                            <option value="co">Colômbia</option>
                            <option value="cu">Cuba</option>
                            <option value="eg">Egito</option>
                            <option value="ae">Emirados Árabes Unidos</option>
                            <option value="sk">Eslováquia</option>
                            <option value="si">Eslovenia</option>
                            <option value="us">Estados Unidos da América</option>
                            <option value="ph">Filipinas</option>
                            <option value="fr">França</option>
                            <option value="gr">Grécia</option>
                            <option value="nl">Holanda</option>
                            <option value="hk">Hong Kong</option>
                            <option value="hu">Hungria</option>
                            <option value="id">Indonésia</option>
                            <option value="in">Índia</option>
                            <option value="ie">Irlanda</option>
                            <option value="il">Israel</option>
                            <option value="it">Itália</option>
                            <option value="jp">Japão</option>
                            <option value="lv">Letônia</option>
                            <option value="lt">Lituânia</option>
                            <option value="my">Malásia</option>
                            <option value="ma">Marrocos</option>
                            <option value="mx">México</option>
                            <option value="ng">Nigéria</option>
                            <option value="no">Noruega</option>
                            <option value="nz">Nova Zelândia</option>
                            <option value="pl">Polônia</option>
                            <option value="pt">Portugal</option>
                            <option value="gb">Reino Unido</option>
                            <option value="kr">República da Coréia</option>
                            <option value="cz">República Tcheca</option>
                            <option value="ro">Romênia</option>
                            <option value="ru">Rússia</option>
                            <option value="rs">Sérvia</option>
                            <option value="sg">Singapura</option>
                            <option value="se">Suécia</option>
                            <option value="ch">Suíça</option>
                            <option value="th">Tailândia</option>
                            <option value="tw">Taiwan</option>
                            <option value="tr">Turquia</option>
                            <option value="ua">Ucrânia</option>
                            <option value="ve">Venezuela</option>
                        </select>
                    </div>

                    <div className="flex  w-full  gap-2  mt-2">
                        <button type="submit" id="prefBtnConfirm" className="w-full  bg-slate-500  font-medium  px-4  py-2  rounded-lg  text-white  transition  duration-200  ease-in  hover:bg-slate-400  hover:text-black">Confirmar</button>
                        <button type="button" id="prefBtnCancel" onClick={resetInputsAndHide} className="w-full  bg-slate-500  font-medium  px-4  py-2  rounded-lg  text-white  transition  duration-200  ease-in  hover:bg-slate-400  hover:text-black">Cancelar</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Preferences;