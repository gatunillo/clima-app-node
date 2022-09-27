require('dotenv').config()

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");


const main = async() => {
    
    const busquedas = new Busquedas();
    let opt;


    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1: 
                //Mostrar mensaje
                const termino = await leerInput('Ciudad: ');
                
                //Buscar los lugares
                const lugares = await busquedas.ciudad(termino);

                //Seleccionar el lugar
                const id = await listarLugares(lugares);
                if ( id === 0 ) continue;
                
                const lugarSel = lugares.find( l => l.id === id);
                
                //Guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre);


                // Clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
                // console.log(clima);

                //Mostrar resultados
                console.log('\nInformación del lugar'.magenta);
                console.log('Ciudad: ', lugarSel.nombre.magenta );
                console.log('Temperatura: ', clima.temp, '°');
                console.log('Temperatura mínima: ', clima.min, '°');
                console.log('Temperatura máxima: ', clima.max, '°');
                console.log('Latitud: ', lugarSel.lat );
                console.log('Longitud: ', lugarSel.lng );
                console.log('Como está el clima: ', clima.desc.magenta);

                break;

            case 2:
                //historial
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${i + 1}`.magenta;
                    console.log(`${idx} ${lugar}`);
                })
            break;
        
            default:
                break;
        }
        
        if (opt!==0) await pausa();
    } while (opt !== 0)
    
}

main();