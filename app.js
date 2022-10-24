(function () {
  var socket = document.createElement('script')
  var script = document.createElement('script')
  socket.setAttribute('src', 'http://127.0.0.1:1337/socket.io/socket.io.js')
  script.type = 'text/javascript'

  socket.onload = function () {
    document.head.appendChild(script)
  }
  script.text = ['window.socket = io("http://127.0.0.1:1337");',
  'socket.on("bundle", function() {',
  'console.log("livereaload triggered")',
  'window.location.reload();});'].join('\n')
  document.head.appendChild(socket)
}());
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const setup = require('./setup-v3');
const { options, createObjects,  } = require('./objects');
const texts = require('./texts');
//const {intro} = require('./intro');
//const {footer} = require('./footer');


//MAIN
(function main() {
    setup(options, (app, resources) => {
        /* MAIN TIMELINE */
        const mainTimeline = () => {
            const timeline = gsap.timeline();
            // timeline.add(intro(app, resources));
            // timeline.add(footer(app, resources, texts));
            timeline.add(initialPosition());

            return timeline;
        };

        /* CREATE ITEMS SCOPE */
        const allObjects = createObjects(app, resources);

        // initial position, first timeline.
        function initialPosition() {
            const initial = gsap.timeline({
                delay: 1,
            });

            /* initial position code */

            return initial;
        }

        // calling mainTimeline
        mainTimeline();
    });
})();

},{"./objects":3,"./setup-v3":4,"./texts":5}],2:[function(require,module,exports){
//generates random numbers
const randomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min) + min);

const randomFloatNumber = (min, max) =>
    (Math.random() * (max - min) + min).toFixed(2);

const size = (app, obj, width, height) => {
    if (typeof obj == "object") {
        obj.pivot.set(obj.width / 2, obj.height / 2);
        obj.width = width;
        obj.height = height;
    } else if (typeof obj == "array") {
        obj = width;
        obj = height;
    }
    app.stage.addChild(obj);
};

const position = (app, obj, x, y) => {
    if (typeof obj == "object") {
        obj.pivot.set(obj.width / 2, obj.height / 2);
        obj.x = x;
        obj.y = y;
    } else if (typeof obj == "array") {
        obj = x;
        obj = y;
    }
    app.stage.addChild(obj);
};

const configureObject = ( app, object, width, height, x, y, moveItem = false, visible = true) => {
    position(app, object, x, y);
    size(app, object, width, height);
    if (moveItem) {
        object.interactive = true;
        object.buttonMode = true;
    }
    object.visible = visible
    
    app.stage.addChild(object);
};
const configureObject2 = ( app, object, scale, x, y, moveItem = false, visible = true) => {
    position(app, object, x, y);
    object.scale.set(scale);
    if (moveItem) {
        object.interactive = true;
        object.buttonMode = true;
    }
    object.visible = visible

    app.stage.addChild(object);
};

class ConfigureText extends PIXI.Text{
    constructor(app,text, x, y, visible = true){
        super(text);
        this.x = x;
        this.y = y
        this.visible = visible;
        this.anchor.set(0.5)
        this.style = {fontFamily: "Tahoma", fontSize: 14, lineHeight: 17, fill: 0xffffff,align: "left"}

        app.stage.addChild(this)

        
    }
}

module.exports = {
    randomNumber,
    randomFloatNumber,
    configureObject,
    ConfigureText,
    configureObject2
}
},{}],3:[function(require,module,exports){
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
},{"./functions":2,"./texts":5}],4:[function(require,module,exports){
const setup = (options, onReady) => {
    const settings = {
        width: options.width,
        height: options.height,
        backgroundColor: options.backgroundColor,
        antialias: true
    }

    let app;
    PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = false;

    // WebGL support condition
    if(PIXI.utils.isWebGLSupported()){
        app = new PIXI.Application(settings);
    }else{
        settings.forceCanvas = true;
        app = new PIXI.Application(settings);
    }


    const fontsToLoad = [];
    options.fontFamilies.forEach(fontFamily => {
        const font = new FontFaceObserver(fontFamily);
        fontsToLoad.push(font);
    });


    document.querySelector(options.targetSelector).appendChild(app.view);
    
    PixiPlugin.registerPIXI(PIXI);

    const pixiLoader = new PIXI.Loader();
    Object.keys(options.resources).forEach(id => {
        pixiLoader.add(id, options.resources[id]);
    })

    Promise.all(
        fontsToLoad.map(font => font.load())
    ).then(() => {
        pixiLoader.load((_,pixiResources)=>{
            onReady(app,pixiResources)
        });
    });
}

module.exports = setup;
},{}],5:[function(require,module,exports){
module.exports={
    "footer" : {
        "credits": "\n\nIury Sousa, Jailson Junior, Maurício Alves, Emerson José, Thiago Nascimento, Angélica Martiniano, Ana Carolina, Heloisa Pimentel, Adilson Da Silva\n\nCopyright ©\n\nDesenvolvido pelo Laboratório de Inovações acadêmicas - Grupo Ser Educacional. Todos os direitos reservados."
    }
}
},{}]},{},[1]);
