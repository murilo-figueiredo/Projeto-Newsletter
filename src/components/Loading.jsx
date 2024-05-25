import LoadingOverlay from "react-loading-overlay-nextgen";

const Loading = (props) => {
    const articles = props.articles;
    const loadText = 'Carregando as notícias... Caso esse processo demore demais, recarregue a página';

    if(articles[0] === 'no-info')
    {
        return (
            <div className="flex  flex-col  fixed  top-0  left-0  w-full  h-full  justify-center  items-center  text-red-500  font-bold  z-10">
                <p>Não foram encontradas notícias com os dados fornecidos.</p>
                <p>
                    Tente alterar suas preferências padrões no ícone do canto inferior direito da tela ou altere os filtros de 
                    pesquisa.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="flex  fixed  top-0  left-0  w-full  h-full  justify-center  items-center  bg-white  bg-opacity-20  cursor-wait  z-30">
                <LoadingOverlay active={true} text={loadText} spinner className="w-full  h-full"></LoadingOverlay>
            </div>
        </>
    );
};

export default Loading;