/*
    Programado por Luis Cabrera Benito 
  ____          _____               _ _           _       
 |  _ \        |  __ \             (_) |         | |      
 | |_) |_   _  | |__) |_ _ _ __ _____| |__  _   _| |_ ___ 
 |  _ <| | | | |  ___/ _` | '__|_  / | '_ \| | | | __/ _ \
 | |_) | |_| | | |  | (_| | |   / /| | |_) | |_| | ||  __/
 |____/ \__, | |_|   \__,_|_|  /___|_|_.__/ \__, |\__\___|
         __/ |                               __/ |        
        |___/                               |___/         
    
    
    Blog:       https://parzibyte.me/blog
    Ayuda:      https://parzibyte.me/blog/contrataciones-ayuda/
    Contacto:   https://parzibyte.me/blog/contacto/
*/
const RUTA_SERVIDOR = "./webapi";
const HTTP = {
    "post": (ruta, datos) =>
        fetch(RUTA_SERVIDOR + ruta, {
            credentials: 'include',
            method: "POST",
            body: JSON.stringify(datos)
        })
            .then(r => r.json())
    ,
    "put": (ruta, datos) =>
        fetch(RUTA_SERVIDOR + ruta, {
            credentials: 'include',
            method: "PUT",
            body: JSON.stringify(datos)
        })
            .then(r => r.json())
    ,
    "get": (ruta) =>
        fetch(RUTA_SERVIDOR + ruta, {
            credentials: 'include',
        })
            .then(r => r.json())
    ,
    "delete": (ruta) =>
        fetch(RUTA_SERVIDOR + ruta, {
            credentials: 'include',
            method: "DELETE",
        })
            .then(r => r.json())
};