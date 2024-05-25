import { useState, useEffect, useRef } from "react";

import { getTopRecentNews, searchNews } from "../utils/api";
import { showSearchInfo, removeSearchFilters, formatDateTime, showAndHideAccountInfo, showAndHidePreferences } from "../utils/scripts";
import { deleteAccount } from "../utils/db.js";
import avatar from '/avatar.svg';

import Loading from "../components/Loading.jsx";
import Articles from "../components/Articles.jsx";
import AccountInfo from "../components/AccountInfo.jsx";
import Preferences from "../components/Preferences.jsx";

const News = (props) => {
    const setStateIndex = props.setStateIndex;
    const userInfo = props.loggedUser;
    const setLoggedUser = props.setLoggedUser;

    const [articles, setArticles] = useState([]);
    const [topic, setTopic] = useState('');
    const [language, setLanguage] = useState('pt');
    const [criterion, setCriterion] = useState('publishedAt');
    
    const refCount = useRef(0);
    const refTimeout = useRef(null);
    const refSubtitle = useRef(`Olá ${userInfo.name}, essas são as notícias mais interessantes do momento`);

    const updateArticles = (data) => {
        const fetchedArticles = [];
        let limit = 5;
        let rawDateTime;
        
        for(let i = 0; i <= limit && i < data.articles.length; i++)
        {
            if(data.articles[i].title === '[Removed]' || data.articles[i].title === '' || data.articles[i].title === null)
            {
                limit += 1;
                continue;
            }

            rawDateTime = data.articles[i].publishedAt.split('T');
            data.articles[i].publishedAt = formatDateTime(rawDateTime);
            fetchedArticles.push(data.articles[i]);
        }

        if(fetchedArticles.length === 0)
        {
            fetchedArticles.push('no-info');
        }

        setArticles(fetchedArticles);
    };

    const askPasswordToDeleteAccount = () => {
        notie.input({
            text: 'Para confirmar, digite sua senha:',
            submitText: 'Deletar',
            cancelText: 'Cancelar',
            submitCallback: (value) => {
                if(value === userInfo.password)
                {
                    deleteAccount(userInfo.id)
                        .then(() => {
                            notie.alert({
                                type: 'success', text: 'Sua conta foi deletada com sucesso'
                            });
                            
                            setLoggedUser({});
                            setStateIndex(0);
                        })
                        .catch(error => {
                            notie.alert({
                                type: 'error', text: error.text
                            });

                            setTimeout(() => {
                                window.location.reload();
                            }, 3000);
                        });
                }
                else
                {
                    notie.alert({
                        type: 'error', text: 'A senha informada está incorreta', time: 1.5
                    });
                    setTimeout(() => {
                        askPasswordToDeleteAccount();
                    }, 1500);
                }
            },
            type: 'password',
            allowed: new RegExp('/[\w!@#$%^&*()?/+-=<>,.:;]/g')
        });
    }

    const showAccountOptions = () => {
        notie.select({
            text: 'Selecione o que você deseja fazer',
            cancelText: 'Cancelar',
            choices: [
                {
                    type: 'success',
                    text: 'Ver/Alterar Informações Pessoais',
                    handler: () => showAndHideAccountInfo('show')
                },
                {
                    type: 'neutral',
                    text: 'Ver/Alterar Preferências',
                    handler: () => showAndHidePreferences('show')
                },
                {
                    type: 'warning',
                    text: 'Sair da Conta',
                    handler: () => {
                        setArticles([]);
                        setTopic('');
                        setLanguage('pt');
                        setCriterion('publishedAt');

                        setLoggedUser({});
                        setStateIndex(0);

                        notie.alert({
                            type: 'success', text: 'Você saiu da sua conta', time: 2
                        });
                    }
                },
                {
                    type: 'error',
                    text: 'Deletar Conta',
                    handler: () => {
                        notie.confirm({
                            text: `Você está prestes a excluir a sua conta em nossa Newsletter. Você tem certeza que deseja 
                                continuar? (Esta ação é irreversível)`,
                            submitText: 'Continuar e Deletar Conta',
                            cancelText: 'Cancelar e Continuar Visualizando Suas Notícias',
                            submitCallback: askPasswordToDeleteAccount
                        });
                    }
                }
            ]
        });
    }

    useEffect(() => {
        getTopRecentNews(userInfo.preference, userInfo.country)
            .then(data => {
                updateArticles(data);
            })
            .catch(() => {
                notie.force({
                    type: 'error',
                    text: 'Ocorreu um erro, verifique a sua conexão com a internet e tente novamente',
                    buttonText: 'Recarregar',
                    callback: () => {
                        window.location.reload();
                    }
                });
            });
    }, []);

    useEffect(() => {
        refCount.current += 1;

        if(refCount.current > 2)
        {
            if(refTimeout.current) { clearTimeout(refTimeout.current); }

            const timeout = setTimeout(() => {
                searchNews(topic, language, criterion)
                    .then(data => {
                        updateArticles(data);
                        let criterionAdjective;
                        let languageAdjective;

                        switch(criterion)
                        {
                            case 'relevancy': {
                                criterionAdjective = 'relevantes';
                                break;
                            }
                            case 'popularity': {
                                criterionAdjective = 'populares';
                                break;
                            }
                            default: { criterionAdjective = 'recentes'; }
                        }

                        switch(language)
                        {
                            case 'ar': {
                                languageAdjective = 'árabe';
                                break;
                            }
                            case 'de': {
                                languageAdjective = 'alemão';
                                break;
                            }
                            case 'en': {
                                languageAdjective = 'inglês';
                                break;
                            }
                            case 'es': {
                                languageAdjective = 'espanhol';
                                break;
                            }
                            case 'fr': {
                                languageAdjective = 'francês';
                                break;
                            }
                            case 'he': {
                                languageAdjective = 'hebraico';
                                break;
                            }
                            case 'it': {
                                languageAdjective = 'italiano';
                                break;
                            }
                            case 'nl': {
                                languageAdjective = 'holandês';
                                break;
                            }
                            case 'no': {
                                languageAdjective = 'norueguês';
                                break;
                            }
                            case 'ru': {
                                languageAdjective = 'russo';
                                break;
                            }
                            case 'sv': {
                                languageAdjective = 'sueco';
                                break;
                            }
                            case 'zh': {
                                languageAdjective = 'chinês';
                                break;
                            }
                            default: { languageAdjective = 'português'; }
                        }

                        refSubtitle.current = `Olá ${userInfo.name}, essas são as notícias mais ${criterionAdjective} sobre "${topic}" em ${languageAdjective}`;
                    });
            }, 5000);

            refTimeout.current = timeout;
        }
    }, [topic, language, criterion]);
    
    return (
        <>
            <header className="flex  absolute  top-0  left-0  w-full  h-20  items-center  justify-between  px-12  bg-slate-600  text-white  z-20">
                <div className="flex  items-center  w-3/12  gap-3  font-semibold  text-2xl  cursor-default  select-none">
                    <i className="bi bi-newspaper"></i>
                    <hr className="border  border-white  transform  h-8"/>
                    <p>YourNews</p>
                </div>

                <div className="flex  items-center  justify-between  gap-4  w-8/12  font-medium">
                    <div className="flex  gap-1.5  w-5/12">
                        <label htmlFor="inputTopic">Tópico:</label>
                        <input type="text" name="topic" id="inputTopic" value={topic} onChange={(e) => setTopic(e.target.value)} className="text-black  rounded-md  w-full  pl-1"/>
                    </div>

                    <div className="flex  gap-1.5  w-3/12">
                        <label htmlFor="sltLanguage">Idioma:</label>
                        <select name="language" id="sltLanguage" value={language} onChange={(e) => setLanguage(e.target.value)} className="text-black  rounded-md  w-full">
                            <option value="ar">عربي</option>
                            <option value="de">Deutsch</option>
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="he">עִברִית</option>
                            <option value="it">Italiano</option>
                            <option value="nl">Nederlands</option>
                            <option value="no">Norsk</option>
                            <option value="pt" defaultChecked>Português</option>
                            <option value="ru">Русский</option>
                            <option value="sv">Svenska</option>
                            <option value="zh">中国人</option>
                        </select>
                    </div>

                    <div className="flex  gap-1.5  w-4/12">
                        <label htmlFor="sltCriterion">Ordenar:</label>
                        <select name="criterion" id="sltCriterion" value={criterion} onChange={(e) => setCriterion(e.target.value)} className="text-black  rounded-md  w-full">
                            <option value="publishedAt" defaultChecked>Por Mais Recentes</option>
                            <option value="relevancy">Por Relevância</option>
                            <option value="popularity">Por Popularidade</option>
                        </select>
                    </div>

                    <button title="Como Pesquisar" onClick={showSearchInfo} className="transition  duration-200  ease-in  hover:scale-125">
                        <i className="bi bi-info-circle"></i>
                    </button>

                    <button title="Remover Filtros de Pesquisa" onClick={removeSearchFilters} className="transition  duration-200  ease-in  hover:scale-125  hover:rotate-180">
                        <i className="bi bi-arrow-repeat"></i>
                    </button>
                </div>
            </header>

            <main className="flex  flex-col  absolute  top-[5rem]  left-0  w-full  items-center  justify-center  py-12">
                {
                    articles[0] !== 'no-info' && articles.length > 0
                    ? (
                        <Articles articles={articles} subtitle={refSubtitle.current}/>
                    )
                    : (
                        <Loading articles={articles}/>
                    )
                }

                <article className="flex  fixed  bottom-0  right-0  w-[7rem]  h-[7rem]  justify-center  items-center">
                    <button title="Ver Opções da Conta" onClick={showAccountOptions} className="w-6/12  h-6/12  rounded-full  transition  duration-150  ease-in  hover:scale-110">
                        <img src={avatar} alt="Informações da Conta" className="w-full  h-full  object-cover  rounded-full"/>
                    </button>
                </article>

                <article id="accountInfo" className="hidden  flex  fixed  top-0  left-0  w-full  h-full  justify-center  items-center">
                    <AccountInfo userInfo={userInfo} setLoggedUser={setLoggedUser}/>
                </article>

                <article id="preferences" className="hidden  flex  fixed  top-0  left-0  w-full  h-full  justify-center  items-center">
                    <Preferences userInfo={userInfo} setLoggedUser={setLoggedUser}/>
                </article>
            </main>
        </>
    );
};

export default News;