import CryptoJS from "crypto-js";

let database, transaction, objectStore, request, loggedUser;

const getHashKey = async () => {
    try
    {
        const response = await fetch('keys/hash-key.txt', {
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

const encryptPassword = async (password) => {
    const key = await getHashKey();
    let encryptedPassword = CryptoJS.AES.encrypt(password, key).toString();

    return encryptedPassword;
};

const decryptPassword = async (password) => {
    const key = await getHashKey();
    let bytes = CryptoJS.AES.decrypt(password, key);
    let decryptedPassword = JSON.stringify(bytes.toString(CryptoJS.enc.Utf8));

    return decryptedPassword;
}

const constructError = (type, text) => {
    let error = { type, text };
    return error;
}

const isThisEmailAlreadyRegistered = (email) => {
    return new Promise((resolve, reject) => {
        try
        {
            transaction = database.transaction(['users'], 'readonly');
            objectStore = transaction.objectStore('users');
            request = objectStore.getAll();
            
            request.onsuccess = (event) => {
                let users = event.target.result;

                let emailIsRegistered = users.find(user => user.email === email);
    
                if(!emailIsRegistered) { resolve(true); }
                else { resolve(false); }
            }
    
            request.onerror = (event) => {
                reject(
                    constructError('email-verify-error', `Erro ao verificar e-mail: ${event.target.error}`)
                );
            }
        }
        catch(error)
        {
            console.error('Ocorreu um erro: ', error);
        }
    });
};

const openDb = () => {
    return new Promise((resolve, reject) => {
        try
        {
            request = indexedDB.open('dbNewsletter', 1);
            
            request.onerror = (event) => {
                reject(
                    constructError('connection-error', `Erro ao abrir o banco de dados: ${event.target.error}`)
                );
            }
            
            request.onupgradeneeded = (event) => {
                let db = event.target.result;
                
                objectStore = db.createObjectStore('users', {
                    keyPath: 'id',
                    autoIncrement: true
                });
    
                openDb();
            }
            
            request.onsuccess = (event) => {
                let db = event.target.result;
                console.log('Banco aberto com sucesso');
                
                resolve(db);
            }
        }
        catch(error)
        {
            console.error('Ocorreu um erro: ', error);
        }
    });
};

export const insertUser = async (name, email, password) => {
    let emailIsRegistered;
    password = await encryptPassword(password);

    return new Promise(async (resolve, reject) => {
        try
        {
            await openDb()
                .then(db => { database = db; })
                .catch(error => { reject(error); });
            
            await isThisEmailAlreadyRegistered(email)
                .then(result => { emailIsRegistered = result; })
                .catch(error => { reject(error); });
            
            if(!emailIsRegistered)
            {
                reject(
                    constructError('email-unique', 'O e-mail digitado já foi cadastrado')
                );
                return;
            }
            
            let userData = {
                name, email, password,
                preference: 'general',
                country: 'ds' /*  'ds' = default-system  */
            };

            transaction = database.transaction(['users'], 'readwrite');
            objectStore = transaction.objectStore('users');
            request = objectStore.add(userData);
    
            request.onsuccess = () => {
                resolve('Obrigado por se cadastrar');
            }
            
            request.onerror = (event) => {
                reject(
                    constructError('insert-error', `Erro ao inserir dados: ${event.target.error}`)
                );
            }
        }
        catch(error)
        {
            console.error('Ocorreu um erro: ', error);
        }
        finally
        {
            database.close();
            console.log('Conexão encerrada com sucesso');
        }
    });
};

export const findUser = async (email, password) => {
    return new Promise(async (resolve, reject) => {
        try
        {
            await openDb()
                .then(db => { database = db; })
                .catch(error => { reject(error); });
            
            transaction = database.transaction(['users'], 'readonly');
            objectStore = transaction.objectStore('users');
            request = objectStore.getAll();

            request.onsuccess = async (event) => {
                let users = event.target.result;
                let userExists = false;
                
                for(let i = 0; i <= (users.length - 1); i++)
                {
                    let tempPassword = await decryptPassword(users[i].password);
                    tempPassword = tempPassword.substring(1, tempPassword.length - 1);

                    if(users[i].email === email && tempPassword === password)
                    {
                        userExists = true;
                        loggedUser = {
                            id: users[i].id,
                            name: users[i].name,
                            email: users[i].email,
                            password: tempPassword,
                            preference: users[i].preference,
                            country: users[i].country
                        };
                        break;
                    }
                }

                if(userExists)
                {
                    resolve(loggedUser);
                }
                else
                {
                    reject(
                        constructError('user-not-found', `Não foi possível encontrar o usuário. Cadastre-se se ainda não tiver uma 
                            conta ou verifique sua conexão com a internet.`)
                    );
                }
            };

            request.onerror = (event) => {
                reject(
                    constructError('select-error', `Erro ao recuperar dados: ${event.target.error}`)
                );
            };
        }
        catch(error)
        {
            console.error('Ocorreu um erro: ', error);
        }
        finally
        {
            database.close();
            console.log('Conexão encerrada com sucesso');
        }
    });
};

export const alterUser = async (id, newName, newPassword) => {
    let hashedNewPassword = await encryptPassword(newPassword);

    return new Promise(async (resolve, reject) => {
        try
        {
            await openDb()
                .then(db => { database = db; })
                .catch(error => { reject(error); });
            
            transaction = database.transaction(['users'], 'readwrite');
            objectStore = transaction.objectStore('users');
            request = objectStore.get(id);

            request.onsuccess = (event) => {
                let user = event.target.result;

                user.name = newName;
                user.password = hashedNewPassword;

                let alterRequest = objectStore.put(user);

                alterRequest.onsuccess = () => {
                    loggedUser = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        password: newPassword,
                        preference: user.preference,
                        country: user.country
                    };
                    resolve(loggedUser);
                }

                alterRequest.onerror = (event) => {
                    reject(
                        constructError('alter-error', `Erro ao alterar dados: ${event.target.error}`)
                    );
                }
            }

            request.onerror = (event) => {
                reject(
                    constructError('select-error', `Erro ao recuperar dados: ${event.target.error}`)
                );
            }
        }
        catch(error)
        {
            console.error('Ocorreu um erro: ', error);
        }
        finally
        {
            database.close();
            console.log('Conexão encerrada com sucesso');
        }
    });
};

export const alterPreference = (id, password, preference, country) => {
    return new Promise(async (resolve, reject) => {
        try
        {
            await openDb()
                .then(db => { database = db; })
                .catch(error => { reject(error); });
            
            transaction = database.transaction(['users'], 'readwrite');
            objectStore = transaction.objectStore('users');
            request = objectStore.get(id);

            request.onsuccess = (event) => {
                let user = event.target.result;

                user.preference = preference;
                user.country = country;

                let alterRequest = objectStore.put(user);

                alterRequest.onsuccess = () => {
                    loggedUser = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        password: password,
                        preference: user.preference,
                        country: user.country
                    };
                    resolve(loggedUser);
                }

                alterRequest.onerror = (event) => {
                    reject(
                        constructError('alter-error', `Erro ao alterar dados: ${event.target.error}`)
                    );
                }
            }

            request.onerror = (event) => {
                reject(
                    constructError('select-error', `Erro ao recuperar dados: ${event.target.error}`)
                );
            }
        }
        catch(error)
        {
            console.error('Ocorreu um erro: ', error);
        }
        finally
        {
            database.close();
            console.log('Conexão encerrada com sucesso');
        }
    });
};

export const deleteAccount = (id) => {
    return new Promise(async (resolve, reject) => {
        try
        {
            await openDb()
                .then(db => { database = db; })
                .catch(error => { reject(error); });
            
            transaction = database.transaction(['users'], 'readwrite');
            objectStore = transaction.objectStore('users');
            request = objectStore.delete(id);

            request.onsuccess = () => {
                resolve();
            }

            request.onerror = (event) => {
                reject(
                    constructError('delete-error', `Erro ao recuperar dados: ${event.target.error}`)
                );
            }
        }
        catch(error)
        {
            console.error('Ocorreu um erro: ', error);
        }
        finally
        {
            database.close();
            console.log('Conexão encerrada com sucesso');
        }
    });
};