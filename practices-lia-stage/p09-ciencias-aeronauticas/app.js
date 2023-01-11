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

            return timeline;
        };

        /* CREATE ITEMS SCOPE */
        const allObjects = createObjects(app, resources);

        //Desestrutura os objetos/sprites que estão vindo do object.js
        const {
            // Avião e utilitarios
            fundo_painel,
            hitbox,
            mapa_aereo,
            airplane,
            bandeira,
            ponto,
            painel,
            containerPainelPrimario,
            containerPainelSecundario,
            rastro_airplane,

            // temporizador
            temporizador_sprites,
            temp_min_left1,
            temp_min_left2,
            temp_min_right1,
            temp_min_right2,
            temporizador_container,

            // ADF
            fundo_adf,
            giroscopio_adf,
            contorno_adf,
            ponteiro_adf,
            containerADF,

            // Altimetro
            painel_altimetro,
            pmenor_altimetro,
            pmedio_altimetro,
            pmaior_altimetro,
            contorno_altimetro,
            containerAltimetro,

            //Climbl
            climb_board,
            climb_ponteiro,
            containerClimb,

            // Giro direcional 
            giroDirecionalFundo,
            giroDirecionalMeio,
            giroDirecionalTopo,
            containerGiroDirecional,

            // Horizonte artificial
            horizonteArtfFundo,
            horizonteArtfMeio,
            horizonteArtfSuperior,
            horizonteArtfTampa,
            containerHorizontArt,

            // ILS
            ilsFundo,
            ilsMeio,
            ilsSuperior1,
            ilsSuperior2,
            ilsTampa,
            containerILS,
            ponteiro_ils,

            // Velocimetro
            velocimetro,
            ponteiroVelocimetro,
            containerVelocimetro,

            // VOR
            vorFundo,
            vorMeio,
            vorSuperior,
            vorTampa,
            containerVOR,
            // olho
            olho,
            visibilidade,
            //manche
            controle_manche,
            cabo_manche,
            // radio
            radio,
            //pista para pouso
        } = allObjects
        
        //função para checar se dois objetos estão na mesma área (pixel)
        function checkArea(object1, object2) {
            const bounds1 = object1.getBounds();
            const bounds2 = object2.getBounds();

            return (
                bounds1.x < bounds2.x + bounds2.width &&
                bounds1.x + bounds1.width > bounds2.x &&
                bounds1.y < bounds2.y + bounds2.height &&
                bounds1.y + bounds1.height > bounds2.y
            );
        }

    // o sinal indica constantemente a posição da coordenada em relação a aeronave
    let sinal = 0;
    // radial indica a velocidade que o ponteiro deve girar para captar a coordenada
    let radial = 0;
    // Movimentação estática do avião
    let airplane_speed = 0.004; //Velocidade do avião
    let movimento = 'ativado'; // indica se o avião está em movimento
    // valor do giro 
    let rotationcounter = 0.0005;
    // horizonte
    let horizontecounter = 0.05;
    let horizonte_speed = 0.005;
    //orient
    let visibilidade_orient = false;
    // altimetro
    pmenor_altimetro.angle = 40;
    pmaior_altimetro.angle = 140;
    pmedio_altimetro.angle = 5;
    let crono = 10;
    let ajuste = 10;
    let segundos_unidades = 0;
    let segundos_dezenas = 5;
    let minutos_unidades = 9;
    let minutos_dezenas = 0;
    let pratica_encerrada = false;
    setInterval(()=>{ajuste -= 0.1}, 10)
    app.ticker.add((delta) => {    
        //temporizador
        // conta até 10 para segundos enquanto na casa unidade e depois repassa para dezena
        if (pratica_encerrada == false)
            {
            segundos_unidades = Math.trunc(ajuste);
            if (ajuste <= 0.1)
                {
                    ajuste = 10;
                    segundos_dezenas -= 1;
                }
            if(segundos_dezenas <= - 0.2)
            {
                minutos_unidades -= 1;
                segundos_dezenas = 5;
                    }
            
            
            temp_min_left2.texture = temporizador_sprites[minutos_dezenas];
            temp_min_left1.texture = temporizador_sprites[minutos_unidades];
            temp_min_right2.texture = temporizador_sprites[segundos_unidades];
            temp_min_right1.texture = temporizador_sprites[segundos_dezenas];
        }
        if(minutos_unidades < 0){
            movimento = 'desativado';
            pratica_encerrada = true;
            painel.alpha = 0;
            temp_min_left2.texture = temporizador_sprites[0];
            temp_min_left1.texture = temporizador_sprites[0];
            temp_min_right2.texture = temporizador_sprites[0];
            temp_min_right1.texture = temporizador_sprites[0];
        }
        // manche
        if(controle_manche.angle > 0)
        {
            controle_manche.angle -= 0.1;
        }
        if(controle_manche.angle < 0)
        {
            controle_manche.angle += 0.1;
        }
    // olho aberto
            if(olho.texture == visibilidade[1]){
            olho.on('pointertap', () => {
                if(pratica_encerrada == false)
                {painel.alpha = 0;
                fundo_painel.alpha = 0;
                olho.texture = visibilidade[0];
                movimento = 'desativado';
                }
                });
            }   
            // olho fechado
            if(olho.texture == visibilidade[0]){
                olho.on('pointertap', () => {
                    if(pratica_encerrada == false)
                    {
                    painel.alpha = 1;
                    fundo_painel.alpha = 1;
                    olho.texture = visibilidade[1];
                    movimento = 'ativado';
                    }
                    });
                }   
        //horizonte artificial

        if (movimento == 'ativado'){
            // ajuste do horizonte
            if (horizonteArtfMeio.rotation > 0){
                horizonteArtfMeio.rotation -= 0.002;
                horizonteArtfSuperior.rotation -= 0.002;
            }
            if (horizonteArtfMeio.rotation < 0){
                horizonteArtfMeio.rotation += 0.002;
                horizonteArtfSuperior.rotation += 0.002;
            }
        }
        //ils     
        if (airplane.x < bandeira.x){// quando a pista/bandeira fica no lado direito
            // limite 20 e -20 no x
            ponteiro_ils.x = (bandeira.x-airplane.x)/20;
        }
        if (airplane.x > bandeira.x){
            // limite 20 e -20 no x
            ponteiro_ils.x = (bandeira.x-airplane.x)/20;
        }
        ponteiro_adf.rotation = radial;
        //VOR
        if(bandeira.y < airplane.y){
            vorSuperior.y = -20;
            vorSuperior.rotation = 0;
        }
        if(bandeira.y > airplane.y){
            vorSuperior.y = 15;
            vorSuperior.rotation = 3.1; 
        }

        // altimetro E CLIMB
        let climb_x = (airplane.x - bandeira.x)* Math.sin(180)
        let climb_y = (airplane.y - bandeira.y)* Math.cos(180)
        // calculo para ajustar o climb e o altimetro no pouso
        if(climb_x > -100 && climb_x < 100)
            {   if(climb_y > -100 && climb_y < 100)
                    {
                        if(climb_ponteiro.angle > - 160)
                            {
                                climb_ponteiro.angle -= 2;
                            }
                        if(pmaior_altimetro.angle > 10)
                            {
                                pmaior_altimetro.angle -= 0.5;
                            }
                        if(pmedio_altimetro.angle > 0)
                            {
                                pmedio_altimetro.angle -= 0.05
                            }
                        if (pmenor_altimetro.angle > 20)
                            {
                                pmenor_altimetro.angle -= 0.2;
                            }
                    }
                else
                {
                    if(climb_ponteiro.angle < 0)
                        {
                            climb_ponteiro.angle += 2;
                        }
                    if(pmaior_altimetro.angle < 140)
                        {
                            pmaior_altimetro.angle += 0.5;
                        }
                    if(pmedio_altimetro.angle < 5)
                        {
                            pmedio_altimetro.angle += 0.05
                        }
                    if (pmenor_altimetro.angle < 40)
                        {
                            pmenor_altimetro.angle += 0.2;
                        }
                }
            }
        // climb saindo da zona de pouso
        else
            {
                if(climb_ponteiro.angle < 0)
                    {
                        climb_ponteiro.angle += 2;
                    }
                if(pmaior_altimetro.angle < 140)
                    {
                        pmaior_altimetro.angle += 0.5;
                    }
                if(pmedio_altimetro.angle < 5)
                    {
                        pmedio_altimetro.angle += 0.05
                    }
                if (pmenor_altimetro.angle < 40)
                    {
                        pmenor_altimetro.angle += 0.2;
                    }
            }
        //velocimetro
        if(airplane_speed <= 0.032){
            if (airplane_speed * 165.625 > ponteiroVelocimetro.rotation){
                ponteiroVelocimetro.rotation += 0.016;
            }
            if (airplane_speed * 165.625 < ponteiroVelocimetro.rotation){
                ponteiroVelocimetro.rotation -= 0.016;
            }
        }
        if (airplane.y > 10 && airplane.y < 540 && airplane.x > 0 && airplane.x < 780){
            if(ponteiro_adf.rotation != sinal){
                if (radial < sinal){
                    radial += 0.04;
                }
                if (radial > sinal){
                    radial -= 0.04;
                    }}
            
            //bandeira em cima
            if(airplane.x >= bandeira.x && airplane.y >= bandeira.y){
                sinal = 0;
            }
            // quadrante esquerdo inferior
            if(airplane.y > bandeira.y && airplane.x < bandeira.x){
                px = bandeira.x / 4;
                // primeira parcela
                if (airplane.x <= px){
                    sinal = 1.4;
                    }
                // segunda parcela
                if (airplane.x >= px && airplane.x <= px * 2){
                    sinal = 1;
                    }
                // terceira parcela
                if (airplane.x >= px*2 && airplane.x <= px * 3){
                    sinal = 0.6;
                    }
                //quarta parcela
                if (airplane.x >= px*3 && airplane.x < px * 4){
                    sinal = 0.2;
                    }
                }
            // quadrante esquerdo superior
            if(airplane.y < bandeira.y && airplane.x < bandeira.x){
                px = bandeira.x / 4;
                // primeira parcela
                if (airplane.x <= px){
                    sinal = 1.8;
                    }
                // segunda parcela
                if (airplane.x >= px && airplane.x < px*2){
                    sinal = 2.2;
                    }
                // terceira parcela
                if (airplane.x >= px*2 && airplane.x < px*3){
                    sinal = 2.6;
                    }
                // quarta parcela
                if (airplane.x >= px*3 && airplane.x < px*4){
                    sinal = 3;
                    }
            }
            //quadrante direito inferior
            if(airplane.y > bandeira.y && airplane.x > bandeira.x){
                px = (780 - bandeira.x) / 4;
                // primeira parcela
                if (airplane.x <= px+bandeira.x && airplane.x > bandeira.x){
                    sinal = -0.2;
                    }
                // segunda parcela
                if (airplane.x <= (px*2)+bandeira.x && airplane.x >= px + bandeira.x){
                    sinal = -0.6;
                    }
                // terceira parcela
                if (airplane.x <= (px*3)+bandeira.x && airplane.x >= (px*2) + bandeira.x){
                    sinal = -1;
                    }
                // quarta parcela
                if (airplane.x <= (px*4)+bandeira.x && airplane.x >= (px*3) + bandeira.x){
                    sinal = -1.4;
                    }
            }
            // quadrante direito superior
            if(airplane.y < bandeira.y && airplane.x > bandeira.x){
                px = bandeira.x / 4;
                // primeira parcela
                if (airplane.x <= px+bandeira.x){
                    sinal = -1.8;
                    }
                // segunda parcela
                if (airplane.x >= px+bandeira.x && airplane.x < px*2 + bandeira.x){
                    sinal = -2.2;
                    }
                // terceira parcela
                if (airplane.x >= px*2 + bandeira.x && airplane.x < px*3 + bandeira.x){
                    sinal = -2.6;
                    }
                // quarta parcela
                if (airplane.x >= px*3 + bandeira.x && airplane.x < px*4 + bandeira.x){
                    sinal = -3;
                    }
                    }
            // hitbox parede esquerda
            if (airplane.x < 28){
                airplane.angle = 90;
            }
            //hitbox parede direita
            if (airplane.x > 770){
                airplane.angle = 270
            }
            // hitbox baixo
            if (airplane.y > 520){
                airplane.angle = 0;
            }
            if(airplane.y < 28){
                airplane.angle = 180;
            }
            //MOVIMENTACAO ANGULAR           
            if (movimento == 'ativado'){
            airplane.x += airplane_speed * Math.sin((Math.PI*airplane.angle)/180);
            airplane.y -= airplane_speed * Math.cos((Math.PI*airplane.angle)/180);}

            // confere se o avião encostou na bandeira
            if(checkArea(airplane, ponto)){
                climb_ponteiro.angle = 0;
                pmaior_altimetro.angle = 0;
                pmedio_altimetro.angle = 0;
                pmenor_altimetro.angle = 0;
                horizonteArtfMeio.y = -10;
                horizonteArtfSuperior.angle = 0;
                horizonteArtfMeio.angle = 0;
                painel.alpha = 0,
                fundo_painel.alpha = 0,
                temporizador_container.alpha = 0,
                pratica_encerrada = true;
                movimento = 'desativado';}
            if (painel.alpha == 0){
                containerADF.alpha = 0;
                containerADF.alpha = 0;
                containerAltimetro.alpha = 0;
                containerClimb.alpha = 0;
                containerGiroDirecional.alpha = 0;
                containerHorizontArt.alpha = 0;
                containerILS.alpha = 0;
                containerVelocimetro.alpha = 0;
                containerVOR.alpha = 0;
                temporizador_container.alpha = 0;
                controle_manche.alpha = 0;
                cabo_manche.alpha = 0;
                radio.alpha = 0;

            }
            if (painel.alpha == 1){
                containerADF.alpha = 1;
                containerAltimetro.alpha = 1;
                containerClimb.alpha = 1;
                containerGiroDirecional.alpha = 1;
                containerHorizontArt.alpha = 1;
                containerILS.alpha = 1;
                containerVelocimetro.alpha = 1;
                containerVOR.alpha = 1;
                containerVOR.alpha = 1;
                temporizador_container.alpha = 1;
                controle_manche.alpha = 1;
                cabo_manche.alpha = 1;
                radio.alpha = 1;
                
            }
        }
            
    });
    
    // correção do sprite do giro
    giroDirecionalMeio.rotation = -1.05;
    // TECLADO
    document.onkeydown = checkKey;
    function checkKey(e) {
        
        e = e || window.event;
        
        // aumenta a velocidade do avião e instrumentos
        if (e.keyCode == '38') {
            if(airplane_speed < 0.032)
                airplane_speed += 0.004;
                rotationcounter += 0.0035;
                horizonte_speed += horizonte_speed/1.5;}
        // diminui a velocidade do avião e instrumentos
        else if (e.keyCode == '40') {
            if(airplane_speed > 0.004){
                airplane_speed -= 0.004;
                horizonte_speed -= horizonte_speed/1.5;
            }       
        }
        // diminuição do angulo e rotação de instrumentos para esquerda
        else if (e.keyCode == '37') {
            if (movimento == 'ativado')
               {
                if(controle_manche.angle > -5)
                    {
                        controle_manche.angle -= 1;
                    }
                if(horizonteArtfMeio.rotation > - 0.50)
                    {   
                        horizonteArtfMeio.rotation -= 0.01;
                        horizonteArtfSuperior.rotation -= 0.01;
                    }
                airplane.angle -= 1;
                giroDirecionalMeio.angle += 1;}
        }

        else if (e.keyCode == '39') {
            if (movimento == 'ativado')
                {
                if(controle_manche.angle < 5)
                    {
                        controle_manche.angle += 1;
                    }
                airplane.angle += 1;
                if(horizonteArtfMeio.rotation < 0.50)
                {horizonteArtfMeio.rotation += 0.01;
                horizonteArtfSuperior.rotation += 0.01;}
                giroDirecionalMeio.angle -= 1;}
        }
    }

const trailTexture = PIXI.Texture.from('https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/trail.png');
gsap.ticker.add(() => {
    app.ticker.update();
});

const historyX = [];
const historyY = [];
// determina o quão longo o rastro pode ser
const historySize = 900000;
const ropeSize = 900000;
const points = [];
for (let i = 0; i < historySize; i++) {
    historyX.push(airplane.x);
    historyY.push(airplane.y);
}
for (let i = 0; i < ropeSize; i++) {
    points.push(new PIXI.Point(airplane.x, airplane.y));
}
const rope = new PIXI.SimpleRope(trailTexture, points);
rope.blendmode = PIXI.BLEND_MODES.ADD;

app.stage.addChild(rope);

app.ticker.add((delta) => {
    const mouseposition = airplane;

    historyX.unshift(mouseposition.x);
    historyY.unshift(mouseposition.y);

    for (let i = 0; i < ropeSize; i++) {
        const p = points[i];
        const ix = cubicInterpolation(historyX, i / ropeSize * historySize);
        const iy = cubicInterpolation(historyY, i / ropeSize * historySize);

        p.x = ix;
        p.y = iy;
    }
});
function clipInput(k, arr) {
    if (k < 0) k = 0;
    if (k > arr.length - 1) k = arr.length - 1;
    return arr[k];
}
function getTangent(k, factor, array) {
    return factor * (clipInput(k + 1, array) - clipInput(k - 1, array)) / 2;
}
function cubicInterpolation(array, t, tangentFactor) {
    if (tangentFactor == null) tangentFactor = 1;

    const k = Math.floor(t);
    const m = [getTangent(k, tangentFactor, array), getTangent(k + 1, tangentFactor, array)];
    const p = [clipInput(k, array), clipInput(k + 1, array)];
    t -= k;
    const t2 = t * t;
    const t3 = t * t2;
    return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + (-2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
}
 
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
    configureObject2,
    ConfigureText
}
},{}],3:[function(require,module,exports){
//const {introOptions} = require('./intro');
//const {footerOptions} = require('./footer');
const { 
    configureObject,
    configureObject2,
    ConfigureText,
    randomNumber,
} = require('./functions');
const texts = require('./texts');

const options = {
    //tamanho da tela de exibição
    width: 1050,
    height: 630,
    backgroundColor: 0x828181,
    targetSelector: "#animation",
    fontFamilies: ["Roboto", "DS-DIGI"],

    // Texturas que estão na AWS
    resources: {
        // temporizador texturas
        temp_0: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/temporizador/av_0.png",
        temp_1: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/temporizador/av_1.png",
        temp_2: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/temporizador/av_2.png",
        temp_3: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/temporizador/av_3.png",
        temp_4: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/temporizador/av_4.png",
        temp_5: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/temporizador/av_5.png",
        temp_6: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/temporizador/av_6.png",
        temp_7: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/temporizador/av_7.png",
        temp_8: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/temporizador/av_8.png",
        temp_9: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/temporizador/av_9.png",
        temp_min_right1: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/temporizador/av_0.png",
        temp_min_right2: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/temporizador/av_0.png",
        temp_min_left1: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/temporizador/av_0.png",
        temp_min_left2: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/temporizador/av_0.png",
        temp_fundo: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/temporizador/relogio_digital.png",
        // rastro do avião
        rastro_airplane: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/trail.png",
        //fundo do painel
        fundo_painel: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/sky.jpg",
        //mapa aereo
        mapa_aereo: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/1-8.png",
        // Imagens ADF
        fundo_adf: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/ADF/fundo_adf.png",
        giroscopio_adf: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/ADF/giroscopio_adf.png",
        contorno_adf: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/ADF/contorno_adf.png",
        ponteiro_adf: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/ADF/ponteiro_adf.png",
        // Imagens das posições do avião
        airplane: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/airplane/airplane_up.png",       
        // imagens Altimetro
        painel_altimetro: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/Alt%C3%ADmetro/painel_altimetro.png",
        pmenor_altimetro: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/Alt%C3%ADmetro/pmenor_altimetro.png",
        pmedio_altimetro: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/Alt%C3%ADmetro/pmedio_altimetro.png",
        pmaior_altimetro: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/Alt%C3%ADmetro/pmaior_altimetro.png",
        contorno_altimetro: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/Alt%C3%ADmetro/contorno_altimetro.png",
        

        // Bandeira e hitbox
        bandeira: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/pouso.png",
        hitbox: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/hitbox.png",

        // Imagens climb
        climb_ponteiro: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/Climb/climb_ponteiro.png",
        climb_board: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/Climb/climb_board.png",

        //Fundo transparente
        banckgroudTranslu: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/Fundo+transparente+1900x1900.png",

        // Imagem giro direcional
        giroDirecionalFundo: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/Giro+direcional/01-8.png",
        giroDirecionalMeio: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/Giro+direcional/02.png",
        giroDirecionalTopo: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/Giro+direcional/03.png",

        // Imagens Horizonte artificial
        horizonteArtfFundo: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/Horizonte+artificial/01.png",
        horizonteArtfMeio: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/Horizonte+artificial/02-8.png",
        horizonteArtfSuperior: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/Horizonte+artificial/03-8.png",
        horizonteArtfTampa: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/Horizonte+artificial/00002-8.png",
    
        // Imagens ILS 
        ilsFundo: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/ILS/1-8.png",
        ilsMeio: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/ILS/2-8.png",
        ilsSuperior1: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/ILS/3-8.png",
        ilsSuperior2: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/ILS/5-8.png",
        ilsTampa: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/ILS/6.png",
        ponteiro_ils: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/VOR/3-8.png",

        //Painel
        painel: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/painel.png",
        ponto: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/ponto.png",
        tabela: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/tabela.png",

        // Imagens Velocimentro
        velocimetro: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/Velocimetro/velocimetro_board.png",
        ponteiroVelocimetro: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/Velocimetro/ponteiro_velocimetro.png", 

        // Imagens VOR
        vorFundo: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/VOR/1-8.png",
        vorMeio: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/VOR/2-8.png",
        vorSuperior: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/VOR/vor_triangle.png",
        vorTampa: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/VOR/4-8.png",
        //rastro
        trailTexture: 'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/trail.png',
        //OLHOS
        olho_aberto: 'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/Olho%2BAberto%2B-8.png',
        olho_fechado: 'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/Olho%2Bfechado-8.png',
        //pista
        pista: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/pista.png",
        // instrumentos
        radio: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/dispositivos/r%C3%A1dio+.png",
        cabo_manche: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/dispositivos/S-8.png",
        controle_manche: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p09-avia%C3%A7%C3%A3o/imagem+p09/dispositivos/M-8.png",
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

    //exemplo de criação de objeto ----->
    // const exemplo_object = new PIXI.Sprite(resources.exemplo_object.texture)
    // configureObject2(app, exemplo_object, tamanho, x, y);
    // exemplo_object.zIndex = indica a camada que vai estar na apliacação
    // allObjects.exemplo_object = exemplo_object;
    
    //exemplo container
    // const exemplo_container = new PIXI.Container();
    // configureObject(app, exemplo_container, w, h, x, y, buttonable, alpha);
    // exemplo_container.addChild(
    //     exemplo_imagem,
    //     exemplo_imagem2,
    // );
    // allObjects.exemplo_container = exemplo_container;

    let visibilidade = [
        resources.olho_aberto.texture, 
        resources.olho_fechado.texture,
    ]
    allObjects.visibilidade = visibilidade;
    
    // temporizador
    let temporizador_sprites = [
        resources.temp_0.texture,
        resources.temp_1.texture,
        resources.temp_2.texture,
        resources.temp_3.texture,
        resources.temp_4.texture,
        resources.temp_5.texture,
        resources.temp_6.texture,
        resources.temp_7.texture,
        resources.temp_8.texture,
        resources.temp_9.texture,
    ]
    allObjects.temporizador_sprites = temporizador_sprites;

    //manche

    const cabo_manche = new PIXI.Sprite(resources.cabo_manche.texture)
    configureObject2(app, cabo_manche, 0.8, 600, 900);
    cabo_manche.zIndex = 4
    allObjects.cabo_manche = cabo_manche;

    const controle_manche = new PIXI.Sprite(resources.controle_manche.texture)
    configureObject2(app, controle_manche, 0.8, 600, 480);
    controle_manche.zIndex = 4
    allObjects.controle_manche = controle_manche;

    // const manche_container = new PIXI.Container();
    // configureObject(app, manche_container, 0, 0, 400, 500, buttonable, alpha);
    // manche_container.addChild(
    //     cabo_manche,
    //     controle_manche,
    // );
    // allObjects.manche_container = manche_container;

    // radio

    const radio = new PIXI.Sprite(resources.radio.texture)
    configureObject2(app, radio, 0.4, 395, 425);
    radio.zIndex = 3
    allObjects.radio = radio;

    // const temp_min_left
    const temp_min_left1 = new PIXI.Sprite(resources.temp_min_left1.texture)
    configureObject2(app, temp_min_left1, 0.3, -30, -12);
    temp_min_left1.zIndex = 4
    allObjects.temp_min_left1 = temp_min_left1;

    const temp_min_left2 = new PIXI.Sprite(resources.temp_min_left2.texture)
    configureObject2(app, temp_min_left2, 0.3, -65, -12);
    temp_min_left2.zIndex = 4
    allObjects.temp_min_left2 = temp_min_left2;

    const temp_min_right1 = new PIXI.Sprite(resources.temp_min_right1.texture)
    configureObject2(app, temp_min_right1, 0.3, 25, -12);
    temp_min_right1.zIndex = 4
    allObjects.temp_min_right1 = temp_min_right1;

    const temp_min_right2 = new PIXI.Sprite(resources.temp_min_right2.texture)
    configureObject2(app, temp_min_right2, 0.3, 60, -12);
    temp_min_right2.zIndex = 4
    allObjects.temp_min_right2 = temp_min_right2;

    const temp_fundo = new PIXI.Sprite(resources.temp_fundo.texture)
    configureObject2(app, temp_fundo, 0.35, 0, 0);
    temp_fundo.zIndex = 4
    allObjects.temp_fundo = temp_fundo;

    const temporizador_container = new PIXI.Container();
    configureObject(app, temporizador_container, 0, 0, 410, 320, 0, 7);
    temporizador_container.addChild(
        temp_fundo,
        temp_min_left1,
        temp_min_left2,
        temp_min_right1,
        temp_min_right2,
    );
    temporizador_container.zIndex = 3;
    allObjects.temporizador_container = temporizador_container;

    // olho
    const olho = new PIXI.Sprite(resources.olho_fechado.texture)
    configureObject2(app, olho, 0.2, 60, 80, true, true);
    olho.zIndex = 3
    allObjects.olho = olho;

    // rastro
    const trailTexture = new PIXI.Sprite(resources.trailTexture.texture)
    configureObject2(app, trailTexture, 0.2);
    trailTexture.zIndex = -1
    allObjects.trailTexture = trailTexture;
    
    // //criando mapa aereo
    const mapa_aereo = new PIXI.Sprite(resources.mapa_aereo.texture)
    configureObject2(app, mapa_aereo, 1.4, 500, 400, false, true);
    mapa_aereo.zIndex = -3
    allObjects.mapa_aereo = mapa_aereo;
    
    // Criando Avião em miniatura
    const airplane = new PIXI.Sprite(resources.airplane.texture)
    configureObject2(app, airplane, 0.15, 500, 500);
    airplane.zIndex = 0.2
    allObjects.airplane = airplane;

    // Criando Bandeira
    const bandeira = new PIXI.Sprite(resources.bandeira.texture)
    configureObject2(app, bandeira, 0.4, randomNumber(300, 700), randomNumber(250, 350));
    bandeira.zIndex = 0.1
    allObjects.bandeira = bandeira;

    // hitbox
    const hitbox = new PIXI.Sprite(resources.hitbox.texture)
    configureObject2(app, hitbox, 0.3, bandeira.x, bandeira.y);
    hitbox.zIndex = -1
    
    // Criando ponto
    const ponto = new PIXI.Sprite(resources.ponto.texture)
    configureObject2(app, ponto, 0.001, bandeira.x, bandeira.y);
    ponto.zIndex = -1
    allObjects.ponto = ponto;

    // Criando imagens ADF
    const painel = new PIXI.Sprite(resources.painel.texture);
    configureObject2(app, painel, 1.60, 500, 320);
    painel.zIndex = 1
    allObjects.painel = painel;

    // fundo do painel para esconder o mapa
    const fundo_painel = new PIXI.Sprite(resources.fundo_painel.texture);
    configureObject2(app, fundo_painel, 4, painel.x, painel.y);
    fundo_painel.zIndex = 0.2
    allObjects.fundo_painel = fundo_painel;


    // Criando imagens ADF
    const fundo_adf = new PIXI.Sprite(resources.fundo_adf.texture);
    configureObject2(app, fundo_adf, 0.8, 0, 0);
    allObjects.fundo_adf = fundo_adf;
    
    const giroscopio_adf = new PIXI.Sprite(resources.giroscopio_adf.texture);
    configureObject2(app, giroscopio_adf, 0.8, 0, 0);
    allObjects.giroscopio_adf = giroscopio_adf;
    
    const contorno_adf = new PIXI.Sprite(resources.contorno_adf.texture);
    configureObject2(app, contorno_adf, 0.8, 0, 0);
    allObjects.contorno_adf = contorno_adf;
    
    const ponteiro_adf = new PIXI.Sprite(resources.ponteiro_adf.texture);
    configureObject2(app, ponteiro_adf, 0.8, 0, 0);
    allObjects.ponteiro_adf = ponteiro_adf;
     
    const containerADF = new PIXI.Container();
    configureObject(app, containerADF, 0, 0, 1075, 610, false, true);
    containerADF.addChild(
        fundo_adf,
        giroscopio_adf,
        contorno_adf,
        ponteiro_adf,
    );
    allObjects.containerADF = containerADF;
    
    
    // Criando imagens Altimetro
    const painel_altimetro = new PIXI.Sprite(resources.painel_altimetro.texture);
    configureObject2(app, painel_altimetro, 0.8, 0, 0);
    allObjects.painel_altimetro = painel_altimetro;
    
    const pmenor_altimetro = new PIXI.Sprite(resources.pmenor_altimetro.texture);
    configureObject2(app, pmenor_altimetro, 0.8, -4, -4);
    allObjects.pmenor_altimetro = pmenor_altimetro;
    
    const pmedio_altimetro = new PIXI.Sprite(resources.pmedio_altimetro.texture);
    configureObject2(app, pmedio_altimetro, 0.8, -4, -30);
    allObjects.pmedio_altimetro = pmedio_altimetro;
    
    const pmaior_altimetro = new PIXI.Sprite(resources.pmaior_altimetro.texture);
    configureObject2(app, pmaior_altimetro, 0.8, -4, 1);
    allObjects.pmaior_altimetro = pmaior_altimetro;

    const contorno_altimetro = new PIXI.Sprite(resources.contorno_altimetro.texture);
    configureObject2(app, contorno_altimetro, 0.8, -5, -2.5);
    allObjects.contorno_altimetro = contorno_altimetro;

    const containerAltimetro = new PIXI.Container();
    configureObject(app, containerAltimetro, 0, 0, 890, 100, false, true);
    containerAltimetro.addChild(
        painel_altimetro,
        pmenor_altimetro,    
        pmaior_altimetro,
        pmedio_altimetro,
        contorno_altimetro,
    );
    allObjects.containerAltimetro = containerAltimetro;
    

    // Criando imagens Climbl
    const climb_board = new PIXI.Sprite(resources.climb_board.texture);
    configureObject2(app, climb_board, 0.8, 0, 0);
    allObjects.climb_board = climb_board;

    const climb_ponteiro = new PIXI.Sprite(resources.climb_ponteiro.texture);
    configureObject2(app, climb_ponteiro, 0.8, 0, 0);
    allObjects.climb_ponteiro = climb_ponteiro;

    const containerClimb = new PIXI.Container();
    configureObject(app, containerClimb, 0, 0, 890, 270, false, true);
    containerClimb.addChild(
        climb_board,
        climb_ponteiro,
    );
    allObjects.containerClimb = containerClimb;

    

    // Criando imagens Giro direcional
    const giroDirecionalFundo = new PIXI.Sprite(resources.giroDirecionalFundo.texture);
    configureObject2(app, giroDirecionalFundo, 0.8, 0, 0);
    allObjects.giroDirecionalFundo = giroDirecionalFundo;

    const giroDirecionalMeio = new PIXI.Sprite(resources.giroDirecionalMeio.texture);
    configureObject2(app, giroDirecionalMeio, 0.8, 0, 0);
    allObjects.giroDirecionalMeio = giroDirecionalMeio;

    const giroDirecionalTopo = new PIXI.Sprite(resources.giroDirecionalTopo.texture);
    configureObject2(app, giroDirecionalTopo, 0.8, 0, 0);
    allObjects.giroDirecionalTopo = giroDirecionalTopo;

    const containerGiroDirecional = new PIXI.Container();
    configureObject(app, containerGiroDirecional, 0, 0, 710, 270, false, true);
    containerGiroDirecional.addChild(
        giroDirecionalFundo,
        giroDirecionalMeio,
        giroDirecionalTopo,
    );
    allObjects.containerGiroDirecional = containerGiroDirecional;



    // Criando imagens Horizonte artificial
    const horizonteArtfFundo = new PIXI.Sprite(resources.horizonteArtfFundo.texture);
    configureObject2(app, horizonteArtfFundo, 0.8, 0, 0);
    allObjects.horizonteArtfFundo = horizonteArtfFundo;

    const horizonteArtfMeio = new PIXI.Sprite(resources.horizonteArtfMeio.texture);
    configureObject2(app, horizonteArtfMeio, 0.8, 0, 0);
    allObjects.horizonteArtfMeio = horizonteArtfMeio;

    const horizonteArtfSuperior = new PIXI.Sprite(resources.horizonteArtfSuperior.texture);
    configureObject2(app, horizonteArtfSuperior, 0.8, 0, 0);
    allObjects.horizonteArtfSuperior = horizonteArtfSuperior;

    const horizonteArtfTampa = new PIXI.Sprite(resources.horizonteArtfTampa.texture);
    configureObject2(app, horizonteArtfTampa, 0.8, 0, 0);
    allObjects.horizonteArtfTampa = horizonteArtfTampa;

    const containerHorizontArt = new PIXI.Container();
    configureObject(app, containerHorizontArt, 0, 0, 710, 100, false, true);
    containerHorizontArt.addChild(
        horizonteArtfFundo,
        horizonteArtfMeio,
        horizonteArtfSuperior,
        horizonteArtfTampa,
    );
    allObjects.containerHorizontArt = containerHorizontArt;
    
    // Criando imagens ILS
    const ilsFundo = new PIXI.Sprite(resources.ilsFundo.texture);
    configureObject2(app, ilsFundo, 0.8, 0, 0);
    allObjects.ilsFundo = ilsFundo;

    const ilsMeio = new PIXI.Sprite(resources.ilsMeio.texture);
    configureObject2(app, ilsMeio, 0.8, 0, 0);
    allObjects.ilsMeio = ilsMeio;

    const ilsSuperior1 = new PIXI.Sprite(resources.ilsSuperior1.texture);
    configureObject2(app, ilsSuperior1, 0.8, 0, 0);
    allObjects.ilsSuperior1 = ilsSuperior1;

    const ilsSuperior2 = new PIXI.Sprite(resources.ilsSuperior2.texture);
    configureObject2(app, ilsSuperior2, 0.8, 0, 0);
    allObjects.ilsSuperior2 = ilsSuperior2;

    const ilsTampa = new PIXI.Sprite(resources.ilsTampa.texture);
    configureObject2(app, ilsTampa, 0.8, 0, 0);
    allObjects.ilsTampa = ilsTampa;

    const ponteiro_ils = new PIXI.Sprite(resources.ponteiro_ils.texture)
    configureObject2(app, ponteiro_ils, 0.8, 0, 0);
    ponteiro_ils.angle = 90;
    allObjects.ponteiro_ils = ponteiro_ils;

    const containerILS = new PIXI.Container();
    configureObject(app, containerILS, 0, 0, 1075, 270, false, true);
    containerILS.addChild(
        ilsFundo,
        ilsMeio,
        ilsSuperior1,
        ilsSuperior2,
        ilsTampa,
        ponteiro_ils,
    );
    allObjects.containerILS = containerILS;


    // Criando imagens Velocimetro
    const velocimetro = new PIXI.Sprite(resources.velocimetro.texture);
    configureObject2(app, velocimetro, 0.8, 0, 0);
    allObjects.velocimetro = velocimetro;

    const ponteiroVelocimetro = new PIXI.Sprite(resources.ponteiroVelocimetro.texture);
    configureObject2(app, ponteiroVelocimetro, 0.8, -3, -10);
    allObjects.ponteiroVelocimetro = ponteiroVelocimetro;

    const containerVelocimetro = new PIXI.Container();
    configureObject(app, containerVelocimetro, 0, 0, 530, 100, false, true);
    containerVelocimetro.addChild(
        velocimetro,
        ponteiroVelocimetro,
    );
    allObjects.containerVelocimetro = containerVelocimetro;

    
    
    
    // Criando imagens VRO
    const vorFundo = new PIXI.Sprite(resources.vorFundo.texture);
    configureObject2(app, vorFundo, 0.8, 0, 0);
    allObjects.vorFundo = vorFundo;

    const vorMeio = new PIXI.Sprite(resources.vorMeio.texture);
    configureObject2(app, vorMeio, 0.8, 0, 0);
    allObjects.vorMeio = vorMeio;

    const vorSuperior = new PIXI.Sprite(resources.vorSuperior.texture);
    configureObject2(app, vorSuperior, 0.8, 15, -20);
    allObjects.vorSuperior = vorSuperior;

    const vorTampa = new PIXI.Sprite(resources.vorTampa.texture);
    configureObject2(app, vorTampa, 0.8, 0, 0);
    allObjects.vorTampa = vorTampa;

    const containerVOR = new PIXI.Container();
    configureObject(app, containerVOR, 0, 0, 1075, 440, false, true);
    containerVOR.addChild(
        vorFundo,
        vorMeio,
        vorSuperior,
        vorTampa,
    );
    allObjects.containerVOR = containerVOR;

    // Container com todos os instrumentos para ajuste de tela e scale
    const containerPainelSecundario = new PIXI.Container();
    configureObject(app, containerPainelSecundario, 0, 0, -100, -100);
    containerPainelSecundario.addChild(
        
        containerVOR,
        containerILS,
        containerADF,
     );
     containerPainelSecundario.zIndex = 2;

    // Container com todos os instrumentos para ajuste de tela e scale
    const containerPainelPrimario = new PIXI.Container();
    configureObject(app, containerPainelPrimario, 0, 0, -90, 70);
    containerPainelPrimario.addChild(
        containerVelocimetro,
        containerHorizontArt,
        containerAltimetro,
        containerGiroDirecional,
        containerClimb,
        
    );
    containerPainelPrimario.zIndex = 2
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

    // teste de zIndex atenção caso tenha que remover esse atributo
    app.stage.sortableChildren = true;
}

module.exports = setup;
},{}],5:[function(require,module,exports){
module.exports={
    "footer" : {
        "title": "Finura do cimento", 
        "version": 1.0,
        "year": 2022,
        "collaborators": {
            "Desenvolvedores": "Jailson Junior, Maurício Alves, Emerson José, Thiago Nascimento, Angélica Martiniano, David Mateus, Mateus Sobrenome, Alexandre Sobrenome",
            "Professor conteudista": "Iury Sousa",
            "Ilustradores": "Ana Carolina",
            "Gerente": "Heloisa Pimentel, Adilson Da Silva",
            "afsdhjk": "dfahsjgfhasdj"
        }
    }
}
},{}]},{},[1]);
