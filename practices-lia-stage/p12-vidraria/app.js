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
const { options, createObjects  } = require('./objects');
const texts = require('./texts');

const { objectInteractivity, onDragMove, onDragStart, checkArea, getObjectName, onDragStartObject, onDragEndObject, randomNumber, zoomIn, zoomOut } = require('./functions');
// const {intro} = require('./intro');
// const {footer} = require('./footer');


//MAIN
(function main() {
    setup(options, (app, resources) => {
        /* MAIN TIMELINE */
        const mainTimeline = () => {
            const timeline = gsap.timeline();
            // timeline.add(intro(app, resources));
            // timeline.add(footer(app, resources, texts));
            timeline.add(initialPosition());
            timeline.add(openDoor())
            timeline.add(game())
          
            return timeline;
        };

        /* CREATE ITEMS SCOPE */
        const allObjects = createObjects(app, resources);

        //itens inteiros 
    const {persona,materials,porta,mesa, reloadButton,hearts, balaoFundoChato,balaoFundoRedondo,balaoVolumetrico,beque,funilComum,erlenmeyer,armario,kitassato,bastaoVidroBaque,vidroRelogio,condesador,dissecador,funilSeparacaoDecantacao,papetaGraduada,papetaVolumetrica,placaPetri,proveta,tuboEnsaio,bureta, nextButton, nextButton2, displayScore, displayHint}=allObjects
        
        //IMAGENS ROTACIONADAS
        funilSeparacaoDecantacao.angle=70;
        funilComum.angle=180;
        bastaoVidroBaque.angle=90;
        papetaGraduada.angle=90;
        papetaVolumetrica.angle=90;
        proveta.angle=90;
        condesador.angle=90;
        tuboEnsaio.angle=90;
        bureta.angle=90;
        balaoVolumetrico.angle=0;


       
        let currentObject;
        let score = 0;
        let chance = 3;
        let hit = 0;
        let reverse = false;

        /*********** FUNÇÕES AUXILIARES ************/
         //quiz
        function quiz(){
            const available = materials.filter((item)=> item.selected == false)
            if (available.length){
                const id = randomNumber(0, available.length-1)
                return available[id];
            }
            return false;
            // return materials[5]

        }


        function scoreCount(){
            hit += 1;
            hit >= 3 ? score += 10 * hit : score += 10
            const scoreAnimation = gsap.timeline()
            scoreAnimation.set(displayScore,{
                pixi:{
                    text:score
                }
            })
            scoreAnimation.set(displayHint,{
                pixi:{
                    text:hit
                }
            })
           return scoreAnimation;
        }
    

        //abrir a porta ao clicar
        function openDoor(){
            porta.on("pointerup", ()=> {
                persona.removeDialog()
                const move = gsap.timeline();
                move.to(porta, {
                    pixi: {
                        y: porta.open,
                        interactive: false,
                    },
                });
                currentObject = quiz()
                persona.addDialog(`Coloque na mesa o material descrito abaixo: \n\n ${currentObject.name._text}`)
                return move
            })
        }
        function removeHeart(index){
            hearts[index].visible=false
            hit = 0
            const scoreAnimation = gsap.timeline()
            scoreAnimation.set(displayHint,{
                pixi:{
                    text:hit
                }
            })
            return scoreAnimation
            
        }

       
        function reload(secondFase = false){
            if(chance == 0){
                score = 0
                chance = 3
                persona.removeDialog();
                persona.addDialog(`Chances esgotadas. \n\nClique no botão para reiniciar o quiz. ${secondFase ? "Você continuará na fase 2, mas sua pontuação será zerada." : ""}`)
                reloadButton.visible = true
                reloadButton
                .off()
                .on("pointerup",()=>{
                    persona.removeDialog();
                    reloadButton.visible = false
                    materials.forEach((item) =>{
                        item.selected = false
                        objectInteractivity(item,true)
                        const reloadAnimation = gsap.timeline()
                        reloadAnimation.to(item,{
                            pixi:{
                                x:item.initialPositionX,
                                y:item.initialPositionY
                            }
                        })
                        return reloadAnimation
                    })
                    hearts.forEach(item => item.visible = true)
                    currentObject = quiz()
                    persona.addDialog(`Coloque na mesa o material descrito: \n\n ${secondFase ? currentObject.name._text :  currentObject.name._text}`)
                    const scoreAnimation = gsap.timeline()
                        scoreAnimation.set(displayScore,{
                            pixi:{
                                text:score
                            }
                        })
                        scoreAnimation.set(displayHint,{
                            pixi:{
                                text:hit
                            }
                        })
                    return scoreAnimation;
                })
            }
            if(chance != 0 && secondFase){               
                materials.forEach((item) =>{
                    item.selected = false
                    objectInteractivity(item,true)
                    
                    const reloadAnimation = gsap.timeline()
                    reloadAnimation.to(item,{
                        pixi:{
                            x:item.initialPositionX,
                            y:item.initialPositionY
                        }
                    })
                    return reloadAnimation
                   
                })
                hearts.forEach(item => item.visible = true)
            }
           
        }

        function showDescription({ zoomX, zoomY, card}){
            const show =  gsap.timeline()
           
            show.add(zoomIn(app, 4.5, 4.5, zoomX, zoomY))
            card.visible = true
            return show
        }

        function hideDescription(item){
            item.card.visible = false
            zoomOut(app)
        }
      
        /*********** FUNÇÕES PRINCIPAIS ************/


         function initialPosition() {
            const initial = gsap.timeline({
                delay: 1,
            });
            persona.addText([
                texts.presentation,
                'PRIMEIRA ETAPA: \n\n Você precisa trazer para mesa os materiais solicitados, e só poderá errar até 3 vezes.',
                'Caso suas tentativas esgotem, você terá que começar do zero. \n\nCaso o material esteja correto, você verá uma breve descrição sobre ele. \n\nAbra o armário para continuar '
            ])
            objectInteractivity(porta,true)
            return initial;
        }

       
        
        function game(){
            
            materials.forEach((item)=>{
                item
                // .on('pointerover', () => item.name.visible = true)
                // .on('pointerout', () => item.name.visible = false)
                .off('pointerdown')
                .on('pointerdown', onDragStart)
                .on('pointermove', onDragMove)
                .on("pointerupoutside", () => onDragEndObject(item, mesa))
                .on("pointerup",()=>{
                    item.name.visible = false
                    if(currentObject.name._text !== item.name._text && (onDragEndObject(item, mesa))){
                        chance--;
                        removeHeart(chance);
                      
                        if(chance == 0){
                            reload(reverse)
                        }else{
                            const moveItem = gsap.timeline()
                            moveItem.to(
                                item,{
                                    pixi:{
                                        x: item.initialPositionX,
                                        y: item.initialPositionY
                                    }
                                }
                            )
                            
                            currentObject = quiz()
                            persona.addDialog(`Objeto incorreto, você perdeu uma chance. Vamos tentar novamente.\n\n Selecione o material descrito: \n ${ reverse ? currentObject.description : currentObject.name._text}`)
                            return moveItem;
                        }
                        
                    }
                    else if(reverse && onDragEndObject(item, mesa) && currentObject.name._text == item.name._text){
                        persona.removeDialog()
                        item.selected = true
                        currentObject = quiz()
                        scoreCount();
                        objectInteractivity(item, false)

                        const moveToTable = gsap.timeline();
                        moveToTable.to(
                            item,{
                                pixi:{
                                    x: item.tablePositionX,
                                    y: item.tablePositionY
                                }
                            }
                        )
                        // currentObject = false
                        
                        if(currentObject){
                            persona.addDialog([
                                `Selecione o material descrito: \n\n ${currentObject.description}`])
                        }else{
                            persona.addDialog("Parabéns, você finalizou o quiz! \nSua pontuação foi: \nCom isso, você pode utilizar seus conhecimentos em vidraria para avançar para as próximas aulas práticas. \n  ")
                        }
                        


                        return moveToTable

                      

                    }else if (!reverse && onDragEndObject(item, mesa) && currentObject.name._text == item.name._text){
                        persona.removeDialog();
                        item.selected = true
                        scoreCount();
                        objectInteractivity(item, false)

                        const moveToTable = gsap.timeline();
                        moveToTable.to(
                            item,{
                                pixi:{
                                    x: item.tablePositionX,
                                    y: item.tablePositionY
                                }
                            }
                        )
                        showDescription(item)

                        item.card.on("pointerdown",()=>{
                            hideDescription(item)
                            currentObject = quiz()
                            // currentObject = false
                            if(currentObject){
                                persona.addDialog(`Coloque na mesa o material selecionado abaixo: \n\n ${currentObject.name._text}`)
                            }else{
                                reload(true)
                                currentObject = quiz()
                                persona.addText([
                                    'Parabéns, você avançou para a segunda fase!\n\n',
                                    'Agora, faremos o processo inverso: você deve arrastar para mesa os materiais com base na descrição. ',
                                    'Suas chances foram reabastecidas. O quiz acaba quando você acertar todos os objetos ou suas chances esgotarem. Boa sorte!',
                                    `SEGUNDA ETAPA \n\n Selecione o material descrito: \n\n ${currentObject.description}`], true)
                                reverse = true
                            }
                           
                        })
                        
                        
                        return moveToTable;

                    }
                    
                })
            })
        }

      

        
        mainTimeline();
    });
})();

},{"./functions":2,"./objects":3,"./setup-v3":4,"./texts":5}],2:[function(require,module,exports){
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

const objectInteractivity = (objects, bool) =>{
    if(objects.length){
        objects.forEach((object) => {
            object.interactive = bool;
            object.buttonMode = bool;
        });
    }else{
        objects.interactive = bool;
        objects.buttonMode = bool;
    }
}


//draggin object
function onDragStart(event) {
    this.data = event.data;
   // this.alpha = 0.7;
    this.dragging = true;
}
function onDragStartObject(event) {
    this.data = event.data;
    this.alpha = 0.7;
    this.dragging = true;
    this.name.visible = false; 
    this.icon.visible = false
}


function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}



class ConfigureText extends PIXI.Text{
    constructor(app,text, x, y, visible = true){
        super(text);
        this.x = x;
        this.y = y
        this.visible = visible;
        this.anchor.set(0.5)
        this.style = {fontFamily: "Tahoma", fontSize: 14, lineHeight: 17, fill: 0x000000,align: "left"}

        app.stage.addChild(this)

        
    }
}


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


//verifica se um objeto está colidindo com outro

function onDragEndObject(object1, object2) {
    object1.alpha = 1;
    object1.dragging = false;
    object1.data = null;
    object1.checkArea = checkArea(object1, object2)

    if (object1.checkArea) return true;

    object1.x = object1.initialPositionX;
    object1.y = object1.initialPositionY;

}


function zoomIn(app, zoomScaleX, zoomScaleY, x, y) {
    const zoomIn = gsap.timeline();

    zoomIn.to(app.stage.scale, {
        x: zoomScaleX,
        y: zoomScaleY, 
        duration: 1.5 
    }, 0);

    zoomIn.to(app.stage, {
        x: x, 
        y: y, 
        duration: 1.5 
    }, 0);
    return zoomIn;
}

function changeObjectTexture(object){
    if(object.texture == object.initialTexture){
        object.texture = object.tiltedTexture
        object.height = 60
        object.y = object.y + 30
    }else{
        object.texture = object.initialTexture
        object.height = 90
        object.y = object.y - 30
    }
 

}

function zoomOut(app) {
    const zoomOut = gsap.timeline();
    zoomOut.to(app.stage.scale, { x: 1, y: 1, duration: 1.5 }, 0);
    zoomOut.to(app.stage, { x: 0, y: 0, duration: 1.5 }, 0);
    return zoomOut;
}



const getObjectName = (object) => object.objectName || object._texture.baseTexture.textureCacheIds[0] ;



module.exports = {
    randomNumber,
    randomFloatNumber,
    configureObject,
    objectInteractivity,
    onDragStartObject,
    onDragStart,
    checkArea,
    getObjectName,
    ConfigureText,
    onDragMove,
    randomNumber,
    onDragEndObject,
    zoomIn,
    zoomOut
}
},{}],3:[function(require,module,exports){
//const {introOptions} = require('./intro');
//const {footerOptions} = require('./footer');
const { configureObject } = require('./functions');
const { objects } = require('./texts');
// const { CreatePersona } = require('./personas.js');

const options = {
    width: 800,
    height: 600,
    backgroundColor: 0xe0f3f7,
    targetSelector: "#animation",
    fontFamilies: ["Roboto", "DS-DIGI"],
    resources: {
        
        //MESA
        table: 'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/mesa+perfil+.png',
        //botao

        nextButton: 'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/botao-proximo.png',

        //armário
        armario: 'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/Vidraria-imagens/Armario+-8+(2020).jpg',
        //mesa
        mesa: 'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/vidraria-imagens-atualizadas-12-22/mesa+-8.png',
        porta: 'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/Vidraria-imagens/porta+do+armario+-8.png',
        
        //BALAO DE FUNDO CHATO OK
        balaoFundoChato:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/vidraria-imagens-atualizadas-12-22/bal%C3%A3o+fundo+chato+-8.png',
        balaoFundoChatoCard:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/cards-itens/card-balao-fundo-chato.jpg',
        //BALAO DE FUNDO REDONDO OK
        balaoFundoRedondo:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/vidraria-imagens-atualizadas-12-22/bal%C3%A3o+fundo+redondo-8.png',
        balaoFundoRedondoCard:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/cards-itens/card-balao-fundo-redondo.jpg',
        //BALAO VOLUMETRICO OK
        balaoVolumetrico:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/vidraria-imagens-atualizadas-12-22/bal%C3%A3o+volumetrico-8.png',
        balaoVolumetricoCard:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/cards-itens/card-balao-volumetrico.jpg',
        //bequer OK
        bequer:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/vidraria-imagens-atualizadas-12-22/Becker-8.png',
        bequerCard:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/cards-itens/card-bequer.jpg',
        //ERLENMEYER OK
        erlenmeyer:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/vidraria-imagens-atualizadas-12-22/Eelenmeyer-8.png',
        erlenmeyerCard: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/ErlenmeyerCard.png",
      
        //FUNIL COMUM OK
        funilComum:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/vidraria-imagens-atualizadas+/vidro/funil/funil-8.png',
        funilComumCard:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/cards-itens/card-funil-comum.jpg',
         //kitassato1 falta ok
         kitassato:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/vidraria-imagens-atualizadas-12-22/Kitassato+.png',
         kitassatoCard:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/vidraria-imagens-atualizadas-12-22/cardKitassato.png',
         //BASTAO DE VIDRO BAQUETA avaliar  falta ok
         bastaoVidroBaque:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/vidraria-imagens-atualizadas-12-22/bast%C3%A3o+de+vidro-8.png',
         bastaoVidroBaqueCard:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/vidraria-imagens-atualizadas-12-22/card+Bast%C3%A3o+Vidro+Baqueta.png',
         //VIDRO RELOGIO OK
         vidroRelogio:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/vidraria-imagens-atualizadas+/vidro/vidro+de+relogio/vidro+de+relogio-8.png',
         vidroRelogioCard:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/cards-itens/card-vidro-relogio.jpg',
         //CONDENSADOR  falta ok
         condesador:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/vidraria-imagens-atualizadas+/vidro/condensador/condensador-8.png',
         condesadorCard:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/vidraria-imagens-atualizadas-12-22/card+Condensador.png',
         //DISSECADOR ok

         dissecador:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/vidraria-imagens-atualizadas+/vidro/dessecador/dessecador-8.png',
         dissecadorCard:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/cards-itens/card-exsicador.jpg',
         //FUNIL DE SEPARACAO E DECANTACAO
        funilSeparacaoDecantacao: 'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/vidraria-imagens-atualizadas+/vidro/funil+de+separa%C3%A7%C3%A3o+ou+decapta%C3%A7%C3%A3o/funil+de+separa%C3%A7%C3%A3o+ou+decapta%C3%A7%C3%A3o+1-8.png',
        funilSeparacaoDecantacaoCard:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/cards-itens/card-funil-separacao-torneira.jpg',
         //PAPETA GRADUADA OK
         papetaGraduada:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/vidraria-imagens-atualizadas+/vidro/pipeta+graduada/pipeta+graduada-8.png',
         papetaGraduadaCard:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/cards-itens/card-pipeta-graduada.jpg',
         //PAPETA VOLUMETRICA falta ok
         papetaVolumetrica:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/vidraria-imagens-atualizadas+/vidro/pipeta+volum%C3%A9trica/pipeta+volum%C3%A9trica-8.png',
         papetaVolumetricaCard:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/vidraria-imagens-atualizadas-12-22/card+Pipeta+Volumetrica.png',
         //PLACA DE PETRI ok
         placaPetri:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/vidraria-imagens-atualizadas+/vidro/plaqueta+de+petri/plaqueta+de+petri-8.png',
         placaPetriCard:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/cards-itens/card-placa-petri.jpg',
         //PROVETA OK
         proveta:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/vidraria-imagens-atualizadas+/vidro/Proveta/proveta-8.png',
         provetaCard:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/cards-itens/card-proveta.jpg',
         //TUBO DE ENSAIO OK
         tuboEnsaio:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/vidraria-imagens-atualizadas+/vidro/tubo+de+ensaio/tubo+de+ensaio-8.png',
         tuboEnsaioCard:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/cards-itens/card-tubo-ensaio.jpg',
         //BURETA
         bureta:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/vidraria-imagens-atualizadas+/vidro/bureta/bureta-8.png',
         buretaCard:'https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/cards-itens/card-bureta.jpg',
         //BOTÃO REINICIAR
         reloadButton: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p01-granulometria-v2/hitboxes/hitbox-reload-icon.png",
        
         //redHeart
         redHeart: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/readHeart.png",
         grayHeart: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/grayHeart.png",
        
         cardTemplate: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/cardTemplate.png",
         panel: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p12-vidraria/Placa-8+(3).png"
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

//load persona
if (typeof personaOptions !== "undefined") {
    Object.keys(personaOptions.resources).forEach((id) => {
        options.resources[id] = personaOptions.resources[id];
    });
}


const createObjects = (app, resources) => {
    const allObjects = new Object();
    const materials = new Array();


    const optionsCharacter = {
        width: 600,
        height: 500,
        x: 720,
        y: 520,
        zIndex: -0, 
        persona: 'teacher', 
        direction: 'standing', 
        headDirection: 'ahead',
        texture: 0 ,    
        showDialogBox: false
       
    }
    const persona = new CreatePersona(app, resources, optionsCharacter)
    persona.configureDialogues({ x: 450, y:350 })

    allObjects.persona = persona;

    
    const panel = PIXI.Sprite.from(resources.panel.texture); 
    configureObject(app, panel, 300, 90, 150, 330); 

  const fontScore = new PIXI.TextStyle({
    forntFamily: "roboto",
    wordWrap: false,
    wirdWrapWidth: 180,
    fontSize: 20,
    fill: 0x000000,
    align: 'left',
    backgroundColor: 0xffffff,
  });

    const displayScore = new PIXI.Text("0", fontScore);
    displayScore.x = panel.x - 25
    displayScore.y = panel.y - 10
    displayScore.visible = true;
    app.stage.addChild(displayScore);
    allObjects.displayScore = displayScore;

    const displayHint = new PIXI.Text("0", fontScore);
    displayHint.x = panel.x + 100
    displayHint.y = panel.y - 10
    displayHint.visible = true;
    app.stage.addChild(displayHint);
    allObjects.displayHint = displayHint;

    

    //nextButton
    const nextButton = PIXI.Sprite.from(resources.nextButton.texture); 
    configureObject(app, nextButton, 50, 50, 750, 400, true, false); 
    allObjects.nextButton = nextButton

    const nextButton2 = PIXI.Sprite.from(resources.nextButton.texture); 
    configureObject(app, nextButton2, 50, 50, 750, 500, true, false); 
    allObjects.nextButton2 = nextButton2
    
    //botão reiniciar
    const reloadButton = PIXI.Sprite.from(resources.reloadButton.texture);
    configureObject(app, reloadButton, 50, 50, 620, 310, true, false)
    allObjects.reloadButton = reloadButton;

    //hearts
    const hearts = []

    for(let i=0; i<=2; i++){
        const heart = PIXI.Sprite.from(resources.redHeart.texture);
        heart.red = resources.redHeart
        heart.gray = resources.grayHeart
        configureObject(app, heart, 20, 20, panel.x-120 + (i*25), panel.y+10)
        hearts.push(heart)
  
    }
    allObjects.hearts = hearts;
    


    //mesa
    const mesa = PIXI.Sprite.from(resources.mesa.texture);
    configureObject(app, mesa, 900, 460, 400, 720); 
    allObjects.mesa = mesa

    const armario = PIXI.Sprite.from(resources.armario.texture);
    configureObject(app, armario, 750, 230, 410, 120); 

 //bastaoVidroBaque1 ok

 const bastaoVidroBaque = PIXI.Sprite.from(resources.bastaoVidroBaque.texture);
 //posição no HUD
 bastaoVidroBaque.initialPositionX=370;
 bastaoVidroBaque.initialPositionY=135;
//posição na mesa
bastaoVidroBaque.tablePositionX=300;
bastaoVidroBaque.tablePositionY=525;
 //posição do zoom
 bastaoVidroBaque.zoomX= -940;
 bastaoVidroBaque.zoomY= -1900;

 const bastaoVidroBaqueCard = PIXI.Sprite.from(resources.bastaoVidroBaqueCard.texture)
 configureObject(app, bastaoVidroBaqueCard, 100, 50, bastaoVidroBaque.tablePositionX, bastaoVidroBaque.tablePositionY-57, true, false);
 bastaoVidroBaqueCard.zIndex = 1
bastaoVidroBaque.card = bastaoVidroBaqueCard


 configureObject(app, bastaoVidroBaque, 30,114, bastaoVidroBaque.initialPositionX,bastaoVidroBaque.initialPositionY,true,true);
 bastaoVidroBaque.name = new ConfigureText(app,objects.bastaoVidroBaque.name , {x:bastaoVidroBaque.initialPositionX ,y: bastaoVidroBaque.initialPositionY, visible:false});
 bastaoVidroBaque.description = objects.bastaoVidroBaque.description

 bastaoVidroBaque.selected = false
 allObjects.bastaoVidroBaque=bastaoVidroBaque;
 materials.push(bastaoVidroBaque)



 //vidroRelogio1 ok
 const vidroRelogio = PIXI.Sprite.from(resources.vidroRelogio.texture);
 //posição no HUD
 vidroRelogio.initialPositionX=200;
 vidroRelogio.initialPositionY=64;
 //posição na mesa
 vidroRelogio.tablePositionX=200;
 vidroRelogio.tablePositionY=490;
 //posição do zoom
 vidroRelogio.zoomX= -400;
 vidroRelogio.zoomY= -1700;


 const vidroRelogioCard = PIXI.Sprite.from(resources.vidroRelogioCard.texture)
 configureObject(app, vidroRelogioCard, 100, 50, vidroRelogio.tablePositionX-57, vidroRelogio.tablePositionY-57, true, false);
 vidroRelogioCard.zIndex = 1
vidroRelogio.card = vidroRelogioCard
 configureObject(app, vidroRelogio,  80, 35, vidroRelogio.initialPositionX,vidroRelogio.initialPositionY,true,true);
 vidroRelogio.name = new ConfigureText(app,objects.vidroRelogio.name , {x:vidroRelogio.initialPositionX ,y: vidroRelogio.initialPositionY, visible:false});
 
 vidroRelogio.description = objects.vidroRelogio.description
 vidroRelogio.selected = false
 allObjects.vidroRelogio=vidroRelogio;
 materials.push(vidroRelogio)

 //papetaGraduada1 ok
 const papetaGraduada = PIXI.Sprite.from(resources.papetaGraduada.texture);
 //posição no HUD
 papetaGraduada.initialPositionX=645;
 papetaGraduada.initialPositionY=200;
 //posição na mesa
 papetaGraduada.tablePositionX=400;
 papetaGraduada.tablePositionY=525;
 //posição do zoom
 papetaGraduada.zoomX= -1300;
 papetaGraduada.zoomY= -1900;


 const papetaGraduadaCard = PIXI.Sprite.from(resources.papetaGraduadaCard.texture)
 configureObject(app, papetaGraduadaCard, 100, 50, papetaGraduada.tablePositionX-57, papetaGraduada.tablePositionY-57, true, false);
 papetaGraduadaCard.zIndex = 1
papetaGraduada.card = papetaGraduadaCard

 configureObject(app, papetaGraduada,  30,185, papetaGraduada.initialPositionX,papetaGraduada.initialPositionY,true,true);
 papetaGraduada.name = new ConfigureText(app,objects.papetaGraduada.name , {x:papetaGraduada.initialPositionX ,y: papetaGraduada.initialPositionY, visible:false});
 
 papetaGraduada.description = objects.papetaGraduada.description
 papetaGraduada.selected = false
 allObjects.papetaGraduada=papetaGraduada;
 materials.push(papetaGraduada)

 //papetaVolumetrica1 ok
 const papetaVolumetrica = PIXI.Sprite.from(resources.papetaVolumetrica.texture);
 //posição no HUD
 papetaVolumetrica.initialPositionX=680;
 papetaVolumetrica.initialPositionY=70;
 //posição na mesa
 papetaVolumetrica.tablePositionX=100;
 papetaVolumetrica.tablePositionY=550;
 //posição do zoom
 papetaVolumetrica.zoomX= 70;
 papetaVolumetrica.zoomY= -2000;

 const papetaVolumetricaCard = PIXI.Sprite.from(resources.papetaVolumetricaCard.texture)
 configureObject(app, papetaVolumetricaCard, 100, 50, papetaVolumetrica.tablePositionX-57, papetaVolumetrica.tablePositionY-57, true, false);
 papetaVolumetricaCard.zIndex = 1
papetaVolumetrica.card = papetaVolumetricaCard

 configureObject(app, papetaVolumetrica, 25, 150, papetaVolumetrica.initialPositionX,papetaVolumetrica.initialPositionY,true,true);
 papetaVolumetrica.name = new ConfigureText(app,objects.papetaVolumetrica.name , {x:papetaVolumetrica.initialPositionX ,y: papetaVolumetrica.initialPositionY, visible:false});
 
 papetaVolumetrica.description = objects.papetaVolumetrica.description
 papetaVolumetrica.selected = false
 allObjects.papetaVolumetrica=papetaVolumetrica;
 materials.push(papetaVolumetrica)


//bequer
 const bequer = PIXI.Sprite.from(resources.bequer.texture);
 //posição no HUD
 bequer.initialPositionX=492;
 bequer.initialPositionY=55;
 //posição na mesa
 bequer.tablePositionX=450;
 bequer.tablePositionY=480;
//posição do zoom
 bequer.zoomX= -1700;
 bequer.zoomY= -1700;
 
 configureObject(app, bequer,  50, 60, bequer.initialPositionX,bequer.initialPositionY,true,true);
 bequer.name = new ConfigureText(app, objects.bequer.name , {x:bequer.initialPositionX ,y: bequer.initialPositionY, visible:false});
 

 const bequerCard = PIXI.Sprite.from(resources.bequerCard.texture)
 configureObject(app, bequerCard, 100, 50, bequer.tablePositionX-10, bequer.tablePositionY-57, true, false);
 bequerCard.zIndex = 1
 bequer.card = bequerCard
 bequer.description = objects.bequer.description
 bequer.selected = false
 allObjects.bequer=bequer;
 materials.push(bequer)

 //erlenmeyer1
 const erlenmeyer = PIXI.Sprite.from(resources.erlenmeyer.texture);
 //posição no HUD
 erlenmeyer.initialPositionX=570;
 erlenmeyer.initialPositionY=53;
 //posição na mesa
 erlenmeyer.tablePositionX=550;
 erlenmeyer.tablePositionY=505;
 //posição do zoom
 erlenmeyer.zoomX= -2100;
 erlenmeyer.zoomY= -1900;

 configureObject(app, erlenmeyer, 60, 60, erlenmeyer.initialPositionX,erlenmeyer.initialPositionY,true,true);
 
 erlenmeyer.name = new ConfigureText(app,objects.erlenmeyer.name , {x:erlenmeyer.initialPositionX ,y: erlenmeyer.initialPositionY, visible:false});
 
 erlenmeyer.description = objects.erlenmeyer.description


 const erlenmeyerCard = PIXI.Sprite.from(resources.erlenmeyerCard.texture)
 configureObject(app, erlenmeyerCard, 100, 50, erlenmeyer.tablePositionX, erlenmeyer.tablePositionY-57, true, false);
 erlenmeyerCard.zIndex = 1
 erlenmeyer.card = erlenmeyerCard
 erlenmeyer.selected = false
 allObjects.erlenmeyer=erlenmeyer;
 materials.push(erlenmeyer)

 //funilComum1
 const funilComum = PIXI.Sprite.from(resources.funilComum.texture);
 //posição no HUD
 funilComum.initialPositionX=90;
 funilComum.initialPositionY=190;
 //posição na mesa
 funilComum.tablePositionX=700;
 funilComum.tablePositionY=480;
 //posição do zoom
 funilComum.zoomX= -2600;
 funilComum.zoomY= -1750;
 


 configureObject(app, funilComum,  60, 60, funilComum.initialPositionX,funilComum.initialPositionY,true,true);
 funilComum.name = new ConfigureText(app,objects.funilComum.name , {x:funilComum.initialPositionX ,y: funilComum.initialPositionY, visible:false});
 
 funilComum.description = objects.funilComum.description
 
 const funilComumCard = PIXI.Sprite.from(resources.funilComumCard.texture)
 configureObject(app, funilComumCard, 100, 50, funilComum.tablePositionX-57, funilComum.tablePositionY-57, true, false);
 funilComumCard.zIndex = 1
 funilComum.card = funilComumCard
 
 funilComum.selected = false
 allObjects.funilComum=funilComum;
 materials.push(funilComum)

 //proveta1
 const proveta = PIXI.Sprite.from(resources.proveta.texture);
 //posição no HUD
 proveta.initialPositionX=500;
 proveta.initialPositionY=135;
 //posição na mesa
 proveta.tablePositionX=100;
 proveta.tablePositionY=525;
//posição do zoom
 proveta.zoomX= 45;
 proveta.zoomY= -1900;


 const provetaCard = PIXI.Sprite.from(resources.provetaCard.texture)
 configureObject(app, provetaCard, 100, 50, proveta.tablePositionX-57, proveta.tablePositionY-57, true, false);
 provetaCard.zIndex = 1
proveta.card = provetaCard

 configureObject(app, proveta,30, 110, proveta.initialPositionX,proveta.initialPositionY,true,true);
 proveta.name = new ConfigureText(app,objects.proveta.name , {x:proveta.initialPositionX ,y: proveta.initialPositionY, visible:false});
 
 proveta.description = objects.proveta.description
 proveta.selected = false
 allObjects.proveta=proveta;
 materials.push(proveta)

 //tuboEnsaio1
 const tuboEnsaio = PIXI.Sprite.from(resources.tuboEnsaio.texture);
 //posição no HUD
 tuboEnsaio.initialPositionX=250;
 tuboEnsaio.initialPositionY=140;
 //posição na mesa
 tuboEnsaio.tablePositionX=200;
 tuboEnsaio.tablePositionY=525;
 //posição do zoom
 tuboEnsaio.zoomX = -410;
 tuboEnsaio.zoomY= -1900;

 const tuboEnsaioCard = PIXI.Sprite.from(resources.tuboEnsaioCard.texture)
 configureObject(app, tuboEnsaioCard, 100, 50, tuboEnsaio.tablePositionX-57, tuboEnsaio.tablePositionY-57, true, false);
 tuboEnsaioCard.zIndex = 1
tuboEnsaio.card = tuboEnsaioCard

 configureObject(app, tuboEnsaio,  30, 120, tuboEnsaio.initialPositionX,tuboEnsaio.initialPositionY,true,true);
 tuboEnsaio.name = new ConfigureText(app,objects.tuboEnsaio.name , {x:tuboEnsaio.initialPositionX ,y: tuboEnsaio.initialPositionY, visible:false});
 
 tuboEnsaio.description = objects.tuboEnsaio.description
 tuboEnsaio.selected = false
 allObjects.tuboEnsaio=tuboEnsaio;
 materials.push(tuboEnsaio)

 //balaoFundoChato1
 const balaoFundoChato = PIXI.Sprite.from(resources.balaoFundoChato.texture);
 //posição no HUD
 balaoFundoChato.initialPositionX=100;
 balaoFundoChato.initialPositionY=47;
//posição na mesa
balaoFundoChato.tablePositionX=100;
balaoFundoChato.tablePositionY=480;
 //posição do zoom
 balaoFundoChato.zoomX= 50;
 balaoFundoChato.zoomY= -1760;
 
 

 const balaoFundoChatoCard = PIXI.Sprite.from(resources.balaoFundoChatoCard.texture)
 configureObject(app, balaoFundoChatoCard, 100, 50, balaoFundoChato.tablePositionX-57, balaoFundoChato.tablePositionY-57, true, false);
 balaoFundoChato.card = balaoFundoChatoCard
 balaoFundoChatoCard.zIndex = 1
 configureObject(app, balaoFundoChato,  60, 60, balaoFundoChato.initialPositionX,balaoFundoChato.initialPositionY,true,true);
 balaoFundoChato.name = new ConfigureText(app,objects.balaoFundoChato.name , {x:balaoFundoChato.initialPositionX ,y: balaoFundoChato.initialPositionY, visible:false});
 balaoFundoChato.description = objects.balaoFundoChato.description
 balaoFundoChato.selected = false
 allObjects.balaoFundoChato=balaoFundoChato;
 materials.push(balaoFundoChato)
 

 //balaoFundoRedondo1
 const balaoFundoRedondo = PIXI.Sprite.from(resources.balaoFundoRedondo.texture);
//posição no HUD
 balaoFundoRedondo.initialPositionX=300;
 balaoFundoRedondo.initialPositionY=50;
//posição na mesa
balaoFundoRedondo.tablePositionX=300;
balaoFundoRedondo.tablePositionY=480;
 //posição do zoom
 balaoFundoRedondo.zoomX= -700;
 balaoFundoRedondo.zoomY= -1750;

 const balaoFundoRedondoCard = PIXI.Sprite.from(resources.balaoFundoRedondoCard.texture)
 configureObject(app, balaoFundoRedondoCard, 100, 50, balaoFundoRedondo.tablePositionX-57, balaoFundoRedondo.tablePositionY-57, true, false);
 balaoFundoRedondo.card = balaoFundoRedondoCard
 balaoFundoRedondoCard.zIndex = 1
 configureObject(app, balaoFundoRedondo,  60, 60, balaoFundoRedondo.initialPositionX,balaoFundoRedondo.initialPositionY,true,true);
 balaoFundoRedondo.name = new ConfigureText(app,objects.balaoFundoRedondo.name , {x:balaoFundoRedondo.initialPositionX ,y: balaoFundoRedondo.initialPositionY, visible:false});
 
 balaoFundoRedondo.description = objects.balaoFundoRedondo.description
 balaoFundoRedondo.selected = false
 allObjects.balaoFundoRedondo=balaoFundoRedondo;
 materials.push(balaoFundoRedondo)

 //balaoVolumetrico1

 const balaoVolumetrico = PIXI.Sprite.from(resources.balaoVolumetrico.texture);
//posição no HUD
 balaoVolumetrico.initialPositionX=150;
 balaoVolumetrico.initialPositionY=155;
//posição na mesa
balaoVolumetrico.tablePositionX= 530;
balaoVolumetrico.tablePositionY= 445;
//posição do zoom
 balaoVolumetrico.zoomX= -1760;
 balaoVolumetrico.zoomY= -1700;


 configureObject(app, balaoVolumetrico,  50, 130, balaoVolumetrico.initialPositionX,balaoVolumetrico.initialPositionY,true,true);

 const balaoVolumetricoCard = PIXI.Sprite.from(resources.balaoVolumetricoCard.texture)
 configureObject(app, balaoVolumetricoCard, 100, 50, balaoVolumetrico.tablePositionX-75, balaoVolumetrico.tablePositionY-20, true, false);
 balaoVolumetricoCard.zIndex = 1
balaoVolumetrico.card = balaoVolumetricoCard

 balaoVolumetrico.name = new ConfigureText(app,objects.balaoVolumetrico.name , {x:balaoVolumetrico.initialPositionX ,y: balaoVolumetrico.initialPositionY, visible:false});
 
 balaoVolumetrico.description = objects.balaoVolumetrico.description
 balaoVolumetrico.selected = false
 allObjects.balaoVolumetrico=balaoVolumetrico;
 materials.push(balaoVolumetrico)

 //kitassato1

 const kitassato = PIXI.Sprite.from(resources.kitassato.texture);
 //posição no HUD
 kitassato.initialPositionX=600;
 kitassato.initialPositionY=120;
//posição na mesa
kitassato.tablePositionX=600;
 kitassato.tablePositionY=525;
//posição do zoom
 kitassato.zoomX= -2100;
 kitassato.zoomY= -1900;
 
 const kitassatoCard = PIXI.Sprite.from(resources.kitassatoCard.texture)
 configureObject(app, kitassatoCard, 100, 50, kitassato.tablePositionX-57, kitassato.tablePositionY-57, true, false);
 kitassatoCard.zIndex = 1
kitassato.card = kitassatoCard

 configureObject(app, kitassato,  60, 60, kitassato.initialPositionX,kitassato.initialPositionY,true,true);
 kitassato.name = new ConfigureText(app,objects.kitassato.name , {x:kitassato.initialPositionX ,y: kitassato.initialPositionY, visible:false});
 
 kitassato.description = objects.kitassato.description
 kitassato.selected = false
 allObjects.kitassato=kitassato;
 materials.push(kitassato)



 //condesador1

 const condesador = PIXI.Sprite.from(resources.condesador.texture);
  //posição no HUD
 condesador.initialPositionX=690;
 condesador.initialPositionY=130;
 //posição na mesa
 condesador.tablePositionX=700;
 condesador.tablePositionY=525;
 //posição do zoom
 condesador.zoomX= -2650;
 condesador.zoomY= -1900;

 const condesadorCard = PIXI.Sprite.from(resources.condesadorCard.texture)
 configureObject(app, condesadorCard, 100, 50, condesador.tablePositionX-57, condesador.tablePositionY-57, true, false);
 condesadorCard.zIndex = 1
condesador.card = condesadorCard

 configureObject(app, condesador,  40, 110, condesador.initialPositionX,condesador.initialPositionY,true,true);
 condesador.name = new ConfigureText(app,objects.condesador.name , {x:condesador.initialPositionX ,y: condesador.initialPositionY, visible:false});
 
 condesador.description = objects.condesador.description
 condesador.selected = false
 allObjects.condesador=condesador;
 materials.push(condesador)



 //dissecador1

 const dissecador = PIXI.Sprite.from(resources.dissecador.texture);
 //posição no HUD
 dissecador.initialPositionX=400;
 dissecador.initialPositionY=50;
//posição na mesa
dissecador.tablePositionX=400;
dissecador.tablePositionY=480;
//posição do zoom
 dissecador.zoomX= -1300;
 dissecador.zoomY= -1750;
 

 const dissecadorCard = PIXI.Sprite.from(resources.dissecadorCard.texture)
 configureObject(app, dissecadorCard, 100, 50, dissecador.tablePositionX-57, dissecador.tablePositionY-57, true, false);
 dissecadorCard.zIndex = 1
dissecador.card = dissecadorCard
 
 configureObject(app, dissecador,  60, 60, dissecador.initialPositionX,dissecador.initialPositionY,true,true);
 dissecador.name = new ConfigureText(app,objects.dissecador.name , {x:dissecador.initialPositionX ,y: dissecador.initialPositionY, visible:false});
 
 dissecador.description = objects.dissecador.description
 dissecador.selected = false
 allObjects.dissecador=dissecador;
 materials.push(dissecador)



 //placaPetri1
 const placaPetri = PIXI.Sprite.from(resources.placaPetri.texture);
//posição no HUD
 placaPetri.initialPositionX=260;
 placaPetri.initialPositionY=200;
 //posição na mesa
 placaPetri.tablePositionX=200;
 placaPetri.tablePositionY=550;
 //posição do zoom
 placaPetri.zoomX= -390;
 placaPetri.zoomY= -2000;

 const placaPetriCard = PIXI.Sprite.from(resources.placaPetriCard.texture)
 configureObject(app, placaPetriCard, 100, 50, placaPetri.tablePositionX-57, placaPetri.tablePositionY-57, true, false);
 placaPetriCard.zIndex = 1
placaPetri.card = placaPetriCard

 configureObject(app, placaPetri,  80, 30, placaPetri.initialPositionX,placaPetri.initialPositionY,true,true);
 placaPetri.name = new ConfigureText(app,objects.placaPetri.name , {x:placaPetri.initialPositionX ,y: placaPetri.initialPositionY, visible:false});
 
 placaPetri.description = objects.placaPetri.description
 placaPetri.selected = false
 allObjects.placaPetri=placaPetri;
 materials.push(placaPetri)

 //separatingDecantingFunnelLayer
 const funilSeparacaoDecantacao = PIXI.Sprite.from(resources.funilSeparacaoDecantacao.texture);
 //posição no HUD
 funilSeparacaoDecantacao.initialPositionX=360;
 funilSeparacaoDecantacao.initialPositionY=200;
//posição na mesa
funilSeparacaoDecantacao.tablePositionX=300;
funilSeparacaoDecantacao.tablePositionY=550;
//posição do zoom
 funilSeparacaoDecantacao.zoomX= -760;
 funilSeparacaoDecantacao.zoomY= -2050;

 const funilSeparacaoDecantacaoCard = PIXI.Sprite.from(resources.funilSeparacaoDecantacaoCard.texture)
 configureObject(app, funilSeparacaoDecantacaoCard, 100, 50, funilSeparacaoDecantacao.tablePositionX-57, funilSeparacaoDecantacao.tablePositionY-57, true, false);
 funilSeparacaoDecantacaoCard.zIndex = 1
funilSeparacaoDecantacao.card = funilSeparacaoDecantacaoCard

  configureObject(app,funilSeparacaoDecantacao,  90,80,funilSeparacaoDecantacao.initialPositionX,funilSeparacaoDecantacao.initialPositionY,true,true);
  funilSeparacaoDecantacao.name = new ConfigureText(app,objects.funilSeparacaoDecantacao.name , {x:funilSeparacaoDecantacao.initialPositionX ,y: funilSeparacaoDecantacao.initialPositionY, visible:false});
  
  funilSeparacaoDecantacao.description = objects.funilSeparacaoDecantacao.description
  funilSeparacaoDecantacao.selected = false
  allObjects.funilSeparacaoDecantacao=funilSeparacaoDecantacao;
  materials.push(funilSeparacaoDecantacao)

 //BURETA
 const bureta = PIXI.Sprite.from(resources.bureta.texture);
 //posição no HUD
 bureta.initialPositionX=490;
 bureta.initialPositionY=200;
 //posição na mesa
 bureta.tablePositionX=400;
 bureta.tablePositionY=550;
 //posição do zoom
 bureta.zoomX= -1300;
 bureta.zoomY= -2000;

 const buretaCard = PIXI.Sprite.from(resources.buretaCard.texture)
 configureObject(app, buretaCard, 100, 50, bureta.tablePositionX-57, bureta.tablePositionY-57, true, false);
 buretaCard.zIndex = 1
bureta.card = buretaCard

 configureObject(app,bureta,  50, 140,bureta.initialPositionX,bureta.initialPositionY,true,true);
 bureta.name = new ConfigureText(app,objects.bureta.name , {x:bureta.initialPositionX ,y: bureta.initialPositionY, visible:false});
 
 bureta.description = objects.bureta.description
 bureta.selected = false
 allObjects.bureta=bureta;
 materials.push(bureta)
 


//porta
const porta = PIXI.Sprite.from(resources.porta.texture);
porta.close = 115;
porta.open = -110;
configureObject(app, porta, 750, 250, 410, porta.close); 
allObjects.porta = porta;

    allObjects.materials = materials

    return allObjects;
}

module.exports = {
    options,
     createObjects,
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

    app.stage.sortableChildren = true
}

module.exports = setup;
},{}],5:[function(require,module,exports){
module.exports={
  "objects": {
    "balaoFundoChato":{
      "id": "0",
      "name": "Balão de Fundo Chato",
      "description": "Utilizado para aquecer líquidos em sistemas de destilação. ",
      "selected": false
    },
    "balaoFundoRedondo":{
      "id": "1",
      "name": "Balão de fundo redondo",
      "description": "Utilizado em sistemas de destilação, refluxo e evaporação à vácuo. ",
      "selected": false
    },
    "balaoVolumetrico":{
      "id": "2",
      "name": "Balão Volumetrico",
      "description": "Utilizado  para preparação de líquidos em volumes muito precisos e exatos.",
      "selected": false
    },
    "bequer":{
      "id": "3",
      "name": "Béquer",
      "description": "Utilizado para preparo de misturas líquidas. Pode ser utilizado para dissolver sólidos ou aquecer líquidos.  ",
      "selected": false
    },
    "funilComum":{
      "id": "4",
      "name": "Funil Comum",
      "description": "Utilizado para filtração simples e transferência de líquidos. ",
      "selected": false
    },
    "erlenmeyer":{
      "id": "5",
      "name": "Erlenmeyer",
      "description": " Utilizado na dissolução de substâncias, manipulação de soluções e aquecimento de líquidos. ",
      "selected": false
    },
    "kitassato":{
      "id": "6",
      "name": "Kitassato",
      "description": "Kitassato - É usado para filtrar a vácuo ou sob pressão.",
      "selected": false
    },
    "bastaoVidroBaque":{
      "id": "7",
      "name": "Bastão Vidro Baqueta",
      "description": "É um instrumento de vidro utilizado para agitar soluções bem como para evitar que líquidos respinguem fora do  recipiente para o qual serao transportados. ",
      "selected": false
    },
    "vidroRelogio":{
      "id": "8",
      "name": "Vidro Relógio",
      "description": "Utilizado para pesar pequenas quantidades de substâncias, evaporar pequenas quantidades de soluções ou cobrir béquer e outros recipientes",
      "selected": false
    },
    "condesador":{
      "id": "9",
      "name": "Condensador",
      "description": "Utilizado para condensação de gases a partir de um sistema de resfriamento.",
      "selected": false
    },
    "dissecador":{
      "id": "10",
      "name": "Dissecador",
      "description": "Instrumento que permite extrair o excesso de água numa amostra de uma substância. É utilizado para manter uma amostra num ambiente o menos húmido possível. ",
      "selected": false
    },
    "funilSeparacaoDecantacao":{
      "id": "11",
      "name": "Funil de Separação e Decantação",
      "description": "Utilizado para separação e extração líquido-líquido ",
      "selected": false
    },
    "papetaGraduada":{
      "id": "12",
      "name": "Pipeta Graduada",
      "description": "Utilizada para medir volumes de líquidos com boa precisão. Existem em várias capacidades de volume. 1ml, 5 ml, 10ml são alguns exemplos. ",
      "selected": false
    },
    "papetaVolumetrica":{
      "id": "13",
      "name": "Pipeta Volumetrica",
      "description": "É um instrumento tubular usado para medir e transferir volumes de líquidos rigorosamente. ",
      "selected": false
    },
    "placaPetri":{
      "id": "14",
      "name": "placa de Petri",
      "description": "Utilizada para secagem de substâncias e cultura de microrganismos ",
      "selected": false
    },
    "proveta":{
      "id": "15",
      "name": "Proveta",
      "description": "Utilizada para medir volumes de líquidos sem grande precisão.",
      "selected": false
    },
    "tuboEnsaio":{
      "id": "16",
      "name": "Tubo de Ensaio",
      "description": "Utilizados para armazenar, misturar, coletar amostras e até executar reações químicas em pequena escala. ",
      "selected": false
    },
    "bureta":{
      "id": "17",
      "name": "Bureta",
      "description": "Utilizada em titulações na medida precisa de volume de líquidos por escoamento controlado do líquido. ",
      "selected": false
    }
},

  "resultMessager": {
    "error": ["erro1", "erro2", "erro3", "erro4", "erro5", "erro6"],
    "hit": [
      "hit1",
      "hit2",
      "hit3",
      "hit4",
      "hit5",
      "hit6",
      "hit7",
      "hit8",
      "hit9",
      "hit10"
    ]
  },

  "presentation": "Olá! Vamos avaliar seus conhecimentos sobre as vidrarias. \n\n A dinâmica será dividia em duas fases.\n\n Clique em próximo para continuar.",

  "footer": {
    "credits": "\n\nIury Sousa, Jailson Junior, Maurício Alves, Emerson José, Thiago Nascimento, Angélica Martiniano, Ana Carolina, Heloisa Pimentel, Adilson Da Silva\n\nCopyright ©\n\nDesenvolvido pelo Laboratório de Inovações acadêmicas - Grupo Ser Educacional. Todos os direitos reservados."
  }
}

},{}]},{},[1]);
