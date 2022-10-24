//const {introOptions} = require('./intro');
//const {footerOptions} = require('./footer');
const { configureObject,ConfigureText,configureObject2 } = require('./functions');
const texts = require('./texts');

const options = {
    width: 800,
    height: 600,
    backgroundColor: 0x7193bc,
    targetSelector: "#animation",
    fontFamilies: ["Roboto", "DS-DIGI"],
    resources: {
        lamina:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p11-lamina-de-ossos/t2-8.png",
      table:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p08-condu%C3%A7%C3%A3o-de-calor/mesa.png",
      microscope:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p11-lamina-de-ossos/1+miscroscopio-8.png",
      base:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p11-lamina-de-ossos/2+messa+m-8.png",
      clip:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p11-lamina-de-ossos/Grampo+da+l%C3%A1mina+-8.png",
      lens4:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p11-lamina-de-ossos/2+L+40-8.png",
      lens10:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p11-lamina-de-ossos/4+L+100-8.png",
      lens40:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p11-lamina-de-ossos/3+L+60-8.png",
      lens100:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p11-lamina-de-ossos/1+L+80-8.png",
      transition:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p11-lamina-de-ossos/4+L+100-8.png",
      boxOfBlades:
      "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p11-lamina-de-ossos/CAIXA+DE+LAMINAS-8.png",


    },
};


// load openning resources
if (introOptions) {
    Object.keys(introOptions.resources).forEach((id) => {
        options.resources[id] = introOptions.resources[id];
    });
}

// load footer resources
if (footerOptions) {
    Object.keys(footerOptions.resources).forEach((id) => {
        options.resources[id] = footerOptions.resources[id];
    });
}

const createObjects = (app, resources) => {
    let allObjects = {};

    const table = PIXI.Sprite.from(resources.table.texture);
    configureObject(app, table, 880, 213, 400, 540);
    allObjects.table = table;

    const microscope = PIXI.Sprite.from(resources.microscope.texture);
    configureObject2(app, microscope,1, 400, 350, false, true);
    allObjects.microscope = microscope;
    
    const base = PIXI.Sprite.from(resources.base.texture);
    configureObject2(app, base,1, 425, 420, false, true);
    allObjects.base = base;

    const clip = PIXI.Sprite.from(resources.clip.texture);
    configureObject2(app, clip,1, 390, 385, false, true);
    allObjects.clip = clip;

    const lens4 = PIXI.Sprite.from(resources.lens4.texture);
    configureObject2(app, lens4,1, 400, 310, false, true);
    allObjects.lens4 = lens4;
    
    const boxOfBlades = PIXI.Sprite.from(resources.boxOfBlades.texture);
    configureObject(app, boxOfBlades, 250, 150, 150, 300);
    allObjects.boxOfBlades = boxOfBlades;



    return allObjects
}

module.exports = {
    options, createObjects
}