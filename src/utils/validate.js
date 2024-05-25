export const validateSignUp = (data) => {
    let errors = {};
    
    if(!data.name)
    {
        errors['name'] = 'O nome é obrigatório';
    }

    if(!data.email)
    {
        errors['email'] = 'O e-mail é obrigatório';
    }

    if(!data.password)
    {
        errors['password'] = 'A senha é obrigatória';
    }

    if(!data.confirm)
    {
        errors['confirm'] = 'Você precisa confirmar sua senha';
    }
    else if(data.password && data.confirm)
    {
        if(data.password !== data.confirm)
        {
            errors['confirm'] = 'As senhas não correspondem';
        }
    }
    
    if(!data.agree)
    {
        errors['agree'] = 'Você precisa concordar com os termos';
    }

    return errors;
};

export const validadeLogin = (data) => {
    let errors = {};

    if(!data.email)
    {
        errors['email'] = 'O e-mail é obrigatório';
    }

    if(!data.password)
    {
        errors['password'] = 'A senha é obrigatória';
    }

    return errors;
}

export const validadeAlter = (data) => {
    let errors = {};

    if(data.password && data.confirm)
    {
        if(data.password !== data.confirm)
        {
            errors['confirm'] = 'As senhas não correspondem';
        }
    }
    
    return errors;
}