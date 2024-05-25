export const changeButtonLayout = (event, element) => {
    let imgButton = 'bi-eye-slash';

    if(element.classList.contains('bi-eye') || element.classList.contains('bi-eye-fill')) 
    {
        imgButton = 'bi-eye';
    }
    
    if(event === 'mouse over')
    {
        element.classList.add('text-stone-200');
        element.classList.remove(imgButton);
        element.classList.add(`${imgButton}-fill`);
        element.classList.remove('bg-stone-300');
        element.classList.add('bg-stone-500');
    }
    else if(event === 'mouse out')
    {
        element.classList.remove('text-stone-200');
        element.classList.remove(`${imgButton}-fill`);
        element.classList.add(imgButton);
        element.classList.remove('bg-stone-500');
        element.classList.add('bg-stone-300');
    }
};

export const showAndHidePassword = (element) => {
    const input = element.parentNode.firstElementChild;
    
    if(input.type === 'password')
    {
        input.type = 'text';
        input.classList.add('text-stone-900');
        element.classList.remove('bi-eye-slash');
        element.classList.remove('bi-eye-slash-fill');
        element.classList.add('bi-eye-fill');
        return;
    }

    input.type = 'password';
    input.classList.add('text-stone-900');
    element.classList.remove('bi-eye');
    element.classList.remove('bi-eye-fill');
    element.classList.add('bi-eye-slash-fill');
};

export const showSearchInfo = () => {
    notie.force({
        type: 'neutral',
        text: `Para pesquisar, digite um tópico e selecione o idioma (opcional) e o critério de ordenação (opcional), então, 
            aguarde um intervalo de 5 segundos até as notícias atualizarem`,
        buttonText: 'Entendi',
        position: 'bottom'
    });
};

export const removeSearchFilters = () => {
    window.location.reload();
}

export const validatePassword = () => {
    const $inputPassword = document.getElementById('inputPassword');
    const $inputConfirm = document.getElementById('inputConfirm');
    const $containerConfirm = $inputConfirm.parentNode.parentNode;
    const $message = $containerConfirm.lastElementChild;
    
    if($inputPassword.value && $inputConfirm.value)
    {
        if($inputPassword.value === $inputConfirm.value)
        {
            $message.textContent = 'As senhas correspondem';
            $message.classList.remove('text-red-500');
            $message.classList.add('text-green-500');
            return;
        }
        
        $message.textContent = 'As senhas não correspondem';
        $message.classList.remove('text-green-500');
        $message.classList.add('text-red-500');
    }
};

export const formatDateTime = (rawDateTime) => {
    let date;
    let time;
    let result;
    
    date = rawDateTime[0];
    date = date.split('-');
    date = date.reverse();
    let itsALeapYear = parseInt(date[2]) % 4 === 0 && parseInt(date[2]) % 100 !== 0;
    
    time = rawDateTime[1];
    time = time.split(':');
    
    if(parseInt(time[1]) >= 30 && parseInt(time[0]) === 23)
    {
        time = '00';
        date[0] = (parseInt(date[0]) + 1).toString();

        if(date[0] === '30' && [4, 6, 9, 11].includes(parseInt(date[1])))
        {
            date[0] = '01';
            date[1] = (parseInt(date[1]) + 1).toString();
        }
        else if(date[0] === '31' && [1, 3, 5, 7, 8, 10].includes(parseInt(date[1])))
        {
            date[0] = '01';
            date[1] = (parseInt(date[1]) + 1).toString();
        }
        else if(parseInt(date[1]) === 2)
        {
            if(itsALeapYear && date[0] === '29')
            {
                date[0] = '01';
                date[1] = (parseInt(date[1]) + 1).toString();
            }
            else if(!itsALeapYear && date[0] === '28')
            {
                date[0] = '01';
                date[1] = (parseInt(date[1]) + 1).toString();
            }
        }

        if(date[0] === '31' && date[1] === '12')
        {
            date[0] = '01';
            date[1] = '01';
            date[2] = (parseInt(date[2]) + 1).toString();
        }
    }
    else if(parseInt(time[1]) >= 30) { time = (parseInt(time[0]) + 1).toString(); }
    else { time = time[0]; }
    
    if(time.length === 1) { time = `0${time}`; }
    if(date[0].length === 1) { date[0] = `0${date[0]}`; }
    if(date[1].length === 1) { date[1] = `0${date[1]}`; }
    
    date = date.join('/');
    time = `${time}h`;
    
    result = [date, time];
    result = result.join(', ');

    return result;
};

export const showAndHideAccountInfo = (situation) => {
    const accountInfo = document.getElementById('accountInfo');

    if(situation === 'show') { accountInfo.classList.remove('hidden'); }
    else { accountInfo.classList.add('hidden'); }
};

export const enableChangeInfo = () => {
    const infoName = document.getElementById('infoName');
    const infoEmail = document.getElementById('infoEmail');
    const infoPassword = document.getElementById('infoPassword');
    const infoConfirm = document.getElementById('infoConfirm');
    
    const btnAlter = document.getElementById('infoBtnAlter');
    const btnClose = document.getElementById('infoBtnClose');
    const btnConfirm = document.getElementById('infoBtnConfirm');
    const btnCancel = document.getElementById('infoBtnCancel');
    
    infoName.removeAttribute('readOnly');
    infoEmail.classList.add('active');
    infoEmail.addEventListener('keydown', function() {
        if(this.classList.contains('active'))
        {
            notie.alert({
                type: 'warning',
                text: 'Não é possível alterar o e-mail'
            });
        }
    });
    infoPassword.removeAttribute('readOnly');
    infoConfirm.parentNode.parentNode.classList.remove('hidden');

    btnAlter.classList.add('hidden');
    btnClose.classList.add('hidden');
    btnConfirm.classList.remove('hidden');
    btnCancel.classList.remove('hidden');
}

export const showAndHidePreferences = (situation) => {
    const preferences = document.getElementById('preferences');

    if(situation === 'show') { preferences.classList.remove('hidden'); }
    else { preferences.classList.add('hidden'); }
};