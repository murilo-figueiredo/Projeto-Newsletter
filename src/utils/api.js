const getApiKey = async () => {
    try
    {
        const response = await fetch('keys/api-key.txt', {
            mode: 'same-origin'
        });
        const key = await response.text();

        return key;
    }
    catch(error)
    {
        console.error(`Ocorreu um erro: ${error}`);
    }
};

export const getTopRecentNews = async (category, country) => {
    const getUserCountry = async (latitude, longitude) => {
        try
        {
            const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`;
            
            const response = await fetch(url);
            const data = await response.json();
    
            return data.countryCode;
        }
        catch(error)
        {
            console.error(`Ocorreu um erro: ${error}`);
        }
    }

    try
    {
        if(country === 'ds')
        {
            if('geolocation' in navigator)
            {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
    
                country = await getUserCountry(latitude, longitude);
            }
            else { country = 'br'; }
        }

        const key = await getApiKey();
        const url = `https://newsapi.org/v2/top-headlines?category=${category}&country=${country}&apiKey=${key}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        return data;
    }
    catch(error)
    {
        console.error(`Erro ao recuperar notícias: ${error}`);
    }
};

export const searchNews = async (topic, language, criterion) => {
    if(topic === '' || language === '') { return; }

    try
    {
        const key = await getApiKey();
        const url = `https://newsapi.org/v2/everything?q=${topic}&language=${language}&sortBy=${criterion}&apiKey=${key}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        return data;
    }
    catch(error)
    {
        console.error(`Ocorreu um erro: ${error}`);
    }
};