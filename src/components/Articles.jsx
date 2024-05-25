const Articles = (props) => {
    const articles = props.articles;
    const subtitle = props.subtitle;

    return (
        <>
            <h1 className="font-bold  text-[2rem]  text-white">Últimas Notícias</h1>
            <p className="text-white">{subtitle}</p>

            <div className="flex  flex-wrap  mt-4  w-full  h-100  gap-3  justify-center">
                {articles.map((article, index) => (
                    <div key={index} className="flex  flex-col  font-bold  text-center  p-2  bg-white  rounded-lg  w-5/12  min-h-20  items-center  justify-evenly  gap-1">
                        <h2>{article.title} ({article.publishedAt})</h2>
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="bg-slate-700  hover:bg-slate-600  text-white  rounded-lg  px-5  py-1  transition  duration-150  ease-in">Ver artigo</a>
                    </div>
                ))}
            </div>

            <p className="text-slate-100  text-xs  w-full  mt-3  text-center">
                Por padrão, este site exibe notícias do Brasil, caso queira visualizar notícias do seu país por padrão, permita 
                o acesso à sua localização no seu navegador, ou configure as preferências da sua conta pelo ícone ao lado.
            </p>
        </>
    );
};

export default Articles;