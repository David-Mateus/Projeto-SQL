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
const setup = require("./setup-v3");
const { options, createObjects } = require("./objects");
const texts = require("./texts");
const { intro } = require("./intro");
const { footer } = require("./footer");
const {
    randomNumber,
    randomFloatNumber,
    configureObject,
    timelineControl,
    objectInteractivity,
    interactive,
    drawChart,
    checkArea,
    zoomIn,
    zoomOut,
} = require("./functions");

//MAIN
(function main() {
    setup(options, (app, resources) => {
        const mainTimeline = () => {
            const timeline = gsap.timeline();
            // >>>>>>>> DESCOMENTAR AO FINALIZAR <<<<<<<<<
            //timeline.add(intro(app, resources));
            timeline.add(footer(app, resources));
            timeline.add(initialPosition());
            timeline.add(objectChoice());

            return timeline;
        };

        /* CREATE ITEMS CONSTS */
        // objectItems return
        const allObjects = createObjects(app, resources);

        // create consts with objects
        const {
            dialogBox,
            character,
            machine,
            machineMovingPart,
            pachymeter,
            objects,
            chartBackground,
            nextButton,
            pachymeterButton,
            paper,
            endText,
            pachymeterContainer,
            suitcase,
            notebookScreen,
            notebook,
            meter,
            measuringPoints,
            finishPracticeButton,
        } = allObjects;

        const objectFloatingX = 400;
        const objectFloatingY = 250;
        /* REFERENCE TO LOCAL FUNCTIONS */
        nextButton.on("pointerdown", showCharts);

        pachymeter.part
            .on("pointerdown", onDragStartPachymeter)
            .on("pointerup", onDragEndPachymeter)
            .on("pointerupoutside", onDragEndPachymeter)
            .on("pointermove", onDragMovePachymeter);

        pachymeterContainer
            .on("pointerdown", onDragStart)
            .on("pointermove", onDragMove);

        // Initial position, first timeline.
        function initialPosition() {
            const durationAction = 0.4;
            const initial = gsap.timeline({
                delay: 1,
            });

            initial.to(
                character,
                {
                    pixi: {
                        angle: -25,
                    },
                    duration: durationAction,
                },
                0
            );
            /*
            initial.to(dialogBox, {
                visible: true,
            });
            */

            return initial;
        }

        // adds pointer events to the objects
        function objectChoice() {
            objects.forEach((object) => {
                object
                    .on("pointerover", () => (object.textOver.visible = true))
                    .on("pointerout", () => (object.textOver.visible = false))
                    .on("pointerdown", () => {
                        object.textOver.visible = true;
                        const move = gsap.timeline();
                        move.to(object, {
                            pixi: {
                                x: 400,
                                y: 250,
                            },
                        });
                        // show the measuring points

                        pachymeterContainer.interactive = true;
                        pachymeterContainer.buttonMode = true;
                        objectInteractivity(objects, false);
                        pachymeterContainer
                            .off("pointerup")
                            .off("pointerupoutside")
                            .on("pointerup", () =>
                                onDragEndPachymeterContainer(object)
                            )
                            .on("pointerupoutside", () =>
                                onDragEndPachymeterContainer(object)
                            );
                        return move;
                        //getSize(object, "x", false, true);
                    });
            });
        }

        // Function called when the object is dragged.
        function onDragStart(event) {
            this.data = event.data;
            this.alpha = 0.5;
            this.dragging = true;
        }

        // Function called when the pachymeter is dragged.
        function onDragStartPachymeter(event) {
            this.data = event.data;
            this.dragging = true;
        }

        // Function called when the object is dragging
        function onDragMove() {
            if (this.dragging) {
                const newPosition = this.data.getLocalPosition(this.parent);
                this.x = newPosition.x;
                this.y = newPosition.y;
            }
        }

        // function called when the pachymeter is dragging
        function onDragMovePachymeter() {
            pachymeter.measureBaseX = pachymeter.x - pachymeter.width * 0.294;
            pachymeter.measureBaseY = pachymeter.y - pachymeter.width * 0.294;
            const proportion = 1.17;

            const time = gsap.timeline();
            if (pachymeter.part.dragging) {
                const newPosition = pachymeter.part.data.getLocalPosition(
                    pachymeter.part.parent
                );

                // checks if the pachymeter is in horizontal position and if the position is valid
                if (
                    newPosition.x > pachymeter.x - pachymeter.width * 0.294 &&
                    newPosition.x < pachymeter.x + pachymeter.width * 0.294
                ) {
                    pachymeter.part.x = newPosition.x;
                    pachymeter.part.text.x = newPosition.x;
                    time.set(pachymeter.part.text, {
                        pixi: {
                            text: (
                                (newPosition.x - pachymeter.measureBaseX) *
                                proportion
                            ).toFixed(0),
                        },
                    });
                }
            }
        }

        //function called when the Meter is dropped
        function onDragEndMeter(meter, object, reverse = false) {
            meter.alpha = 1;
            meter.dragging = false;
            meter.data = null;

            objectInteractivity(machine.machineButton, false);

            //reverse means that the meter will do the opposite way (from the machine to the case)
            if (reverse) {
                meter.checkArea = checkArea(meter, suitcase);
                if (meter.checkArea) {
                    moveObjectToInitialPosition(meter);

                    machine.hitarea.visible = true;

                    objectInteractivity(machine.hitarea, true);
                    objectInteractivity(object, false);
                } else {
                    moveMeterToObject(meter);
                    objectInteractivity(machine.hitarea, false);
                }
            } else if (!reverse && !object.used) {
                objectInteractivity(machine.hitarea, false);
                meter.checkArea = checkArea(meter, machine);
                if (meter.checkArea && object.checkArea) {
                    moveMeterToObject(meter);

                    //turn on machine button
                    objectInteractivity(machine.machineButton, true);
                } else {
                    meter.x = meter.initialPositionX;
                    meter.y = meter.initialPositionY;
                }
            }
        }

        //function called when the object is dropped
        function onDragEndObject(object) {
            object.alpha = 1;
            object.dragging = false;
            object.data = null;
            object.checkArea = checkArea(object, machine);

            if (object.checkArea) {
                moveObjectToMachine(object);
                objectInteractivity(meter, true);
            } else {
                object.x = objectFloatingX;
                object.y = objectFloatingY;
            }
        }

        //function called when the pachymeter is dropped
        function onDragEndPachymeter() {
            pachymeter.part.dragging = false;
            pachymeter.part.data = null;
        }

        function moveMeterToObject(object) {
            //disable checkarea
            meter.checkArea = false;

            const move = gsap.timeline();
            move.to(object, {
                pixi: {
                    x: machine.objectPositionX + 40,
                    y: machine.objectPositionY,
                },
                duration: 1,
            });

            return move;
        }

        function moveObjectToInitialPosition(object) {
            const move = gsap.timeline();
            move.to(object, {
                pixi: {
                    x: object.initialPositionX,
                    y: object.initialPositionY,
                },
                duration: 1,
            });

            //disable interactivity
            object.checkArea = false;
            return move;
        }

        function onDragEndPachymeterContainer(object) {
            pachymeterContainer.alpha = 1;
            pachymeterContainer.dragging = false;
            pachymeterContainer.data = null;

            if (checkArea(pachymeterContainer, object)) {
                getSize(object, "x", false);
            } else {
                pachymeterContainer.x = pachymeterContainer.initialPositionX;
                pachymeterContainer.y = pachymeterContainer.initialPositionY;
            }
        }

        //function called when the object is dropped in the machine's area and call the useMachine function
        function moveObjectToMachine(object) {
            const move = gsap.timeline();
            move.set(nextButton, {
                pixi: {
                    interactive: false,
                    buttonMode: false,
                },
            });
            move.to(object.textOver, {
                pixi: {
                    x: 420,
                    y: 300,
                },
            });
            move.to(object, {
                pixi: {
                    x: machine.objectPositionX,
                    y: machine.objectPositionY,
                },
                duration: 1,
            });
            move.to(machineMovingPart, {
                pixi: {
                    y: 290,
                },
                duration: 5,
            });

            move.add(objectInteractivity(objects, false));

            return move;
        }

        // function to use the pachymeter on the object
        function getSize(object, direction = "x", broked = false) {
            objectInteractivity(objects, false);
            const initialXHorizontal = 474;
            const initialYHorizontal = 226;

            const initialXVertical = 425 + 14;
            const initialYVertical = 280 + 25;

            pachymeterContainer.interactive = false;

            //move object to center
            const move = gsap.timeline();

            // sets the pachymeter to the horizontal position
            if (direction == "x") {
                move.set(measuringPoints.line2, {
                    pixi: {
                        y: 0,
                    },
                });
                move.to(measuringPoints, {
                    pixi: {
                        x: measuringPoints.initialPositionX,
                        y: measuringPoints.initialPositionY,
                        visible: true,
                    },
                });

                move.add(zoomIn(app, 1.5, 1.5, -220, -50));
                move.to(pachymeterContainer, {
                    pixi: {
                        x: initialXHorizontal,
                        y: initialYHorizontal,
                    },
                });
                move.set(pachymeterButton, {
                    pixi: {
                        visible: true,
                    },
                });

                move.call(pachymeter.use());

                //change the pointerdown function in the button
                pachymeterButton.off("pointerdown");
                pachymeterButton.on("pointerdown", () => {
                    // saves the object's values
                    getSize(object, "y", broked);
                    if (broked) {
                        object.measuredDiameterBroked = (
                            (pachymeter.part.x - pachymeter.measureBaseX) *
                            1.17
                        ).toFixed(0);
                        object.text = object.text.replace(
                            "MEASUREDDIAMETERBROKED",
                            object.measuredDiameterBroked
                        );
                    } else {
                        object.measuredDiameter = (
                            (pachymeter.part.x - pachymeter.measureBaseX) *
                            1.17
                        ).toFixed(0);

                        if (object.measuredDiameter == -0)
                            object.measuredDiameter = 0;

                        object.text = object.text.replace(
                            "MEASUREDDIAMETER",
                            object.measuredDiameter
                        );
                    }
                });
            } else {
                // sets the pachymeter to the vertical position

                if (broked) {
                    move.add(zoomIn(app, 1.5, 1.5, -220, -50));
                    move.set(measuringPoints.line2, {
                        pixi: {
                            y:
                                object.broked[object.broked.length - 1].height *
                                    2 -
                                90,
                        },
                    });
                    move.to(measuringPoints, {
                        pixi: {
                            x: measuringPoints.initialPositionX,
                            y: measuringPoints.initialPositionY,
                            visible: true,
                        },
                    });

                    move.set(pachymeterButton, {
                        pixi: {
                            visible: true,
                        },
                    });

                    move.call(pachymeter.use());
                }

                move.to(pachymeterContainer, {
                    pixi: {
                        angle: 90,
                        x: initialXVertical,
                        y: initialYVertical,
                    },
                });

                // disable pachymeter button
                pachymeterButton.off("pointerdown");

                if (!broked) {
                    pachymeterButton.on("pointerdown", () => {
                        measuringPoints.visible = false;
                        zoomOut(app);

                        object.measuredHeight = (
                            (pachymeter.part.x - pachymeter.measureBaseX) *
                            1.17
                        ).toFixed(0);
                        console.log(object.measuredHeight);

                        if (object.measuredHeight == -0)
                            object.measuredHeight = 0;

                        console.log(object.measuredHeight);
                        object.text = object.text.replace(
                            "MEASUREDHEIGHT",
                            object.measuredHeight
                        );
                        pachymeterButton.visible = false;
                        pachymeter.part.interactive = false;
                        pachymeter.part.buttonMode = false;
                        pachymeter.part.x = pachymeter.x - 50;
                        pachymeter.part.text.x = pachymeter.part.x;
                        pachymeter.part.text.text = 0;
                        prepareObjectToMachine(object, meter);
                    });
                } else if (meter.x == meter.initialPositionX) {
                    objectInteractivity(meter, false);
                    pachymeterButton.on("pointerdown", () => {
                        objectInteractivity(objects, true);

                        measuringPoints.visible = false;
                        object.measuredHeightBroked = (
                            (pachymeter.part.x - pachymeter.measureBaseX) *
                            1.17
                        ).toFixed(0);

                        if (object.measuredHeightBroked == -0)
                            object.measuredHeightBroked = 0;

                        object.text = object.text.replace(
                            "MEASUREDHEIGHTBROKED",
                            object.measuredHeightBroked
                        );
                        pachymeterButton.visible = false;
                        pachymeter.part.interactive = false;
                        pachymeter.part.buttonMode = false;
                        pachymeter.part.x = pachymeter.x - 50;
                        pachymeter.part.text.x = pachymeter.part.x;
                        pachymeter.part.text.text = 0;

                        const time = gsap.timeline();
                        time.add(zoomOut(app));
                        time.to(
                            [
                                object.broked[object.broked.length - 1],
                                object.broked[object.broked.length - 2],
                            ],
                            {
                                pixi: { y: 700 },
                            }
                        );

                        time.to(pachymeterContainer, {
                            pixi: {
                                x: pachymeterContainer.initialPositionX,
                                y: pachymeterContainer.initialPositionY,
                                angle: 0,
                            },
                        });

                        time.add(organizeCharts());

                        time.set(nextButton, {
                            pixi: {
                                visible: true,
                                interactive: true,
                                buttonMode: true,
                            },
                        });
                        return time;
                    });
                }
            }

            return move;
        }

        // function called after the pachymeter is used, and prepares the object to be sent to the machine
        function prepareObjectToMachine(object, meter) {
            const move = gsap.timeline();

            move.to(pachymeterContainer, {
                pixi: {
                    x: pachymeterContainer.initialPositionX,
                    y: pachymeterContainer.initialPositionY,
                    angle: 0,
                },
            });

            objects
                .filter((obj) => obj != object)
                .forEach((obj) => {
                    obj.alpha = 0.5;
                });

            object.interactive = true;
            object.buttonMode = true;
            object
                .off("pointerdown")
                .on("pointerdown", onDragStart)
                .on("pointerup", () => onDragEndObject(object))
                .on("pointerupoutside", () => onDragEndObject(object))
                .on("pointermove", onDragMove);

            meter
                .off("pointerdown")
                .on("pointerdown", onDragStart)
                .on("pointerup", () => onDragEndMeter(meter, object))
                .on("pointerupoutside", () => onDragEndMeter(meter, object))
                .on("pointermove", onDragMove);

            machine.machineButton.off("pointerdown").on("pointerdown", () => {
                machine.machineButton.texture =
                    resources.machineButtonOn.texture;
                objectInteractivity(meter, false);
                useMachine(object);
            });

            return move;
        }

        // function that uses the machine
        function useMachine(object) {
            objectInteractivity(object.broked, false);
            objectInteractivity(machine.machineButton, false);
            // objectInteractivity(meter, false);

            const useMachine = gsap.timeline({
                delay: 2,
            });

            useMachine.to(
                [notebookScreen, object.chart],
                {
                    pixi: {
                        visible: true,
                    },
                },
                0
            );

            useMachine.add(useObject(object));

            // chart reveal
            useMachine.set(notebookScreen, {
                pixi: {
                    visible: false,
                },
                delay: 1,
            });

            useMachine.set(object.chart, {
                pixi: {
                    interactive: true,
                    buttonMode: true,
                },
            });

            /*
            useMachine.to(object.chart, {
                pixi: {
                    width: object.chart.width * 3,
                    height: object.chart.height * 3,
                    x: 500,
                    y: 370,
                },
            });
            */

            useMachine.add(zoomIn(app, 3.0, 3.0, -750, -1050));

            // click on chart
            object.chart.on("pointerdown", () => {
                objectInteractivity(object.chart, false);
                objectInteractivity(meter, true);

                const discart = gsap.timeline();

                object.used = true;

                discart.add(zoomOut(app));

                discart.set([object.textOver, object.chart], {
                    pixi: {
                        visible: false,
                    },
                });

                discart.set(notebookScreen, {
                    pixi: {
                        visible: false,
                        width: notebookScreen.initialWidth,
                    },
                });

                discart.set(machine.machineButton, {
                    texture: resources.machineButtonOff.texture,
                });

                meter
                    .off("pointerdown")
                    .off("pointerup")
                    .off("pointerupoutside")
                    .off("pointermove")
                    .on("pointerdown", onDragStart)
                    .on("pointerup", () => onDragEndMeter(meter, object, true))
                    .on("pointerupoutside", () =>
                        onDragEndMeter(meter, suitcase, true)
                    )
                    .on("pointermove", onDragMove);

                machine.hitarea.off("pointerdown");
                machine.hitarea.on("pointerdown", () => {
                    if (meter.x == meter.initialPositionX) {
                        // objectInteractivity(meter,false);
                        objectInteractivity(machine.hitarea, false);
                        machine.hitarea.visible = false;

                        const getFinalSize = gsap.timeline();

                        const objectAreaX = 400;
                        const objectAreaY = 250;

                        getFinalSize.to(
                            object.broked[object.broked.length - 1],
                            {
                                pixi: {
                                    x: objectAreaX,
                                    y: objectAreaY + 30,
                                },
                            },
                            0
                        );

                        getFinalSize.to(
                            object.broked[object.broked.length - 2],
                            {
                                pixi: {
                                    x: objectAreaX,
                                    y: objectAreaY - 20,
                                },
                            },
                            0
                        );

                        getFinalSize.to(machineMovingPart, {
                            pixi: {
                                y: machineMovingPart.initialPositionY,
                            },
                            duration: 2,
                        });
                        getFinalSize.add(getSize(object, "y", true));

                        return getFinalSize;
                    }
                });

                discart.add(organizeCharts());
                discart.call(checkObjects());

                objects.forEach((obj) => {
                    obj.alpha = 1;
                });

                return discart;
            });

            return useMachine;
        }

        // changes the object texture as time passes in the machine
        function useObject(object) {
            const useObject = gsap.timeline();

            console.log(machineMovingPart.y);

            if (object.broked.length <= 5) {
                // objetos frágeis range (C e D)
                object.broked[object.broked.length - 1].height = randomNumber(
                    50,
                    52
                );
                object.broked[object.broked.length - 2].height = randomNumber(
                    50,
                    52
                );

                useObject.to(
                    machineMovingPart,
                    {
                        pixi: {
                            y: 295,
                        },
                        duration: object.delay,
                    },
                    0
                );
            } else {
                // objetos não frágeis range (A e B)
                object.broked[object.broked.length - 1].height = randomNumber(
                    50,
                    55
                );
                object.broked[object.broked.length - 2].height = randomNumber(
                    50,
                    55
                );

                useObject.to(
                    machineMovingPart,
                    {
                        pixi: {
                            y: 300, //300
                        },
                        duration: object.delay,
                    },
                    0
                );
            }

            useObject.to(
                notebookScreen,
                {
                    pixi: {
                        //x: notebookScreen.x + 20,
                        width: 0,
                    },
                    duration:
                        object.delay +
                        object.delay / (object.broked.length - 2),
                },
                0
            );

            console.log(object.delay / (object.broked.length - 2));

            for (let i = 0; i < object.broked.length - 2; i++) {
                if (i !== object.broked.length - 3) {
                    useObject.to(
                        object.broked[i],
                        {
                            pixi: {
                                height: object.broked[i + 1].height,
                            },
                            duration:
                                (object.delay / (object.broked.length - 2)) *
                                (i + 1),
                        },
                        0
                    );
                }

                useObject.set(
                    object.broked[i],
                    {
                        pixi: {
                            visible: false,
                        },
                        delay:
                            (object.delay / (object.broked.length - 2)) *
                            (i + 1),
                    },
                    0
                );

                useObject.set(
                    object.broked[i + 1],
                    {
                        pixi: {
                            visible: true,
                        },
                        delay:
                            (object.delay / (object.broked.length - 2)) *
                            (i + 1),
                    },
                    0
                );

                if (i === object.broked.length - 3) {
                    useObject.set(
                        object.broked[i + 2],
                        {
                            pixi: {
                                visible: true,
                            },
                            delay:
                                (object.delay / (object.broked.length - 2)) *
                                (i + 1),
                        },
                        0
                    );
                }
            }

            return useObject;
        }

        // function called after all objects are used to end the animation
        function endAnimation() {
            const end = gsap.timeline({
                delay: 1,
            });

            end.to(
                paper,
                {
                    pixi: {
                        x: paper.x - 500,
                    },
                },
                0
            );

            end.to(
                endText,
                {
                    pixi: {
                        x: endText.x - 500,
                    },
                },
                0
            );

            return end;
        }

        // show all the charts of the objects useds
        function showCharts() {
            chartBackground.visible = true;
            const charts = objects.filter((object) => object.used);

            charts.forEach((object) => {
                if (object.used) {
                    object.chart.visible = true;
                    object.textOver.visible = true;
                }
            });

            nextButton.on("pointerdown", hideCharts);
        }

        // hide the charts
        function hideCharts() {
            chartBackground.visible = false;
            const charts = objects.filter((object) => object.used);

            charts.forEach((object) => {
                object.chart.visible = false;
                object.textOver.visible = false;
            });

            nextButton.on("pointerdown", showCharts);
        }

        //function that organizes the charts
        function organizeCharts() {
            const usedObjects = objects.filter((object) => object.used);
            const time = gsap.timeline();
            for (let i = 0; i < usedObjects.length; i++) {
                time.set(usedObjects[i].textOver, {
                    pixi: {
                        text: usedObjects[i].text,
                    },
                });
                time.set(usedObjects[i].chart, {
                    pixi: {
                        x: 130,
                        y: 90 + i * 140,
                        width: usedObjects[i].chart.width * 0.9,
                        height: usedObjects[i].chart.height * 0.9,
                    },
                });
                time.set(usedObjects[i].textOver, {
                    pixi: {
                        x: 500,
                        y: 90 + i * 140,
                    },
                });
                usedObjects[i].textOver.style.fontSize = 11;
            }

            return time;
        }

        // check if all objects are used to call endAnimation
        function checkObjects() {
            let aux = 0;
            objects.forEach((object) => {
                if (object.used) {
                    aux++;
                }
            });
            if (aux == 4) {
                //exibe butão. se botão for pescionado, encerra animação.
                finishPracticeButton.visible = true;
                finishPracticeButton.off().on("pointerdown", () => {
                    endAnimation();
                    objectInteractivity(finishPracticeButton, false);
                });
                return;
            } else {
                return;
            }
        }

        mainTimeline();
    });
})();

},{"./footer":2,"./functions":3,"./intro":4,"./objects":5,"./setup-v3":6,"./texts":7}],2:[function(require,module,exports){
const {configureObject} = require('./functions');
const texts = require('./texts');

const footerOptions = {
    resources: {
        infoButton:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/_general/infoWhite.png",
        footerButton:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p04-dimensao-tijolo/INFO.png",
        creditBox:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/_general/op%C3%A7%C3%A3o+de+caixa+de+texto.png",
        logo: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/_general/logoLia.png",
        esctButton:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/_general/bot%C3%A3o+vermelho+fechar.png",
        dialogBox:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/_general/caixa+de+texto.png",
    },
};

const footer = (app, resources) => {
    //Função criada para fazer aparecer o botão de info e a caixa de dialogo
    let logoFlag = true;
    // function onLogo() {
    //     if (logoFlag) {
    //         footerBox.visible = true;
    //         footerButton.visible = true;
    //         logoFlag = false;
    //     } else {
    //         footerBox.visible = false;
    //         footerButton.visible = false;
    //         logoFlag = true;
    //     }
    // }

    //Faz aparecer o card de credito e suas informações
    function credit() {
        creditBox.visible = true;
        logoLia.visible = true;
        creditDialogue.visible = true;
        escCredit.visible = true;
        footerBox.visible = false;
        footerButton.visible = false;
        creditBackground.visible = true;
    }
    // Faz com que a caixa de credito seja fechada
    function esc() {
        creditDialogue.visible = false;
        creditBox.visible = false;
        logoLia.visible = false;
        escCredit.visible = false;
        creditBackground.visible = false;
    }

    const textCharacter = new PIXI.TextStyle({
        fontFamily: "Roboto",
        wordWrap: true,
        wordWrapWidth: 230,
        fontSize: 16,
        fill: 0x000000,
        backgroundColor: 0xffffff,
    });

    //cria um "footer" na parte inferior da animação
    const footerBackground = new PIXI.Graphics();
    footerBackground.beginFill(0x192c4c);
    footerBackground.lineStyle(5, 0x192c4c);
    footerBackground.drawRect(0, 570, 800, 30);
    app.stage.addChild(footerBackground);
    footerBackground.visible = false;

    //cria a sprite da caixa de credito
    const creditBackground = new PIXI.Graphics();
    creditBackground.beginFill(0x050a30);
    creditBackground.lineStyle(5, 0x000000);
    creditBackground.drawRect(0, 0, 800, 600);
    app.stage.addChild(creditBackground);
    creditBackground.visible = false;

    const creditBox = new PIXI.Sprite(resources.creditBox.texture);
    configureObject(app, creditBox, 500, 500, 430, 300);
    creditBox.visible = false;

    //cria o botão da logo do lia no footer
    const logoFooter = new PIXI.Sprite(resources.infoButton.texture);
    configureObject(app, logoFooter, 28, 28, 770, 585);
    logoFooter.interactive = true;
    logoFooter.buttonMode = true;
    logoFooter.on("pointerdown", credit);
    logoFooter.visible = false;

    //cria caixa onde vai ficar o botão informações
    const footerBox = new PIXI.Sprite(resources.dialogBox.texture);
    configureObject(app, footerBox, 130, 70, 700, 530);
    footerBox.visible = false;

    //cria o botão de informações
    const footerButton = new PIXI.Sprite(resources.footerButton.texture);
    configureObject(app, footerButton, 60, 30, 700, 525);
    footerButton.interactive = true;
    footerButton.buttonMode = true;
    footerButton.visible = false;
    footerButton.on("pointerdown", credit);

    //Cria o botão de esc que fica dentro do card de creditos
    const escCredit = new PIXI.Sprite(resources.esctButton.texture);
    configureObject(app, escCredit, 28, 28, 220, 100);
    escCredit.interactive = true;
    escCredit.buttonMode = true;
    escCredit.on("pointerdown", esc);
    escCredit.visible = false;

    const logoLia = new PIXI.Sprite(resources.logo.texture);
    configureObject(app, logoLia, 70, 70, 600, 490);
    logoLia.visible = false;

    // insere o dialogo
    const creditDialogue = new PIXI.Text(texts.footer.credits, textCharacter);
    configureObject(app, creditDialogue, 400, 350, 400, 280);
    app.stage.addChild(creditDialogue);
    creditDialogue.visible = false;

    function showFooter() {
        const showFooter = gsap.timeline();

        showFooter.to([footerBackground, logoFooter], {
            visible: true,
        });

        return showFooter;
    }

    return showFooter;
};

module.exports = {
    footer,
    footerOptions
}
},{"./functions":3,"./texts":7}],3:[function(require,module,exports){
//generates random numbers
const randomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min) + min);

const randomFloatNumber = (min, max) =>
    (Math.random() * (max - min) + min).toFixed(2);

const timelineControl = () => timeline.paused(!timeline.paused());

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

const configureObject = (
    app,
    object,
    width,
    height,
    x,
    y,
    moveItem = false,
    visible = true
) => {
    position(app, object, x, y);
    size(app, object, width, height);
    if (moveItem) {
        object.interactive = true;
        object.buttonMode = true;
    }
    object.visible = visible;

    app.stage.addChild(object);
};

//sets or removes interactivity for all objects
function objectInteractivity(objects, bool) {
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

const interactive = (obj) => {
    if (typeof obj == "object") {
        obj.buttonMode ? (obj.buttonMode = false) : (obj.buttonMode = true);
        obj.interactive ? (obj.interactive = false) : (obj.interactive = true);
    }
};

const drawChart = (chart, screen, durationAction) => {
    chart.visible = true;
    const move = gsap.timeline();
    move.to(screen, {
        pixi: {
            x: screen.x + 20,
            width: 10,
        },
        duration: durationAction,
    });
};

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

function zoomOut(app) {
    const zoomOut = gsap.timeline();
    zoomOut.to(app.stage.scale, { x: 1, y: 1, duration: 1.5 }, 0);
    zoomOut.to(app.stage, { x: 0, y: 0, duration: 1.5 }, 0);
    return zoomOut;
}

// const insertDialogue = (text, pause = false) => {
//     const insert = gsap.timeline();
//     insert.to(
//         dialogBox,
//         {
//             pixi: {
//                 visible: true,
//             },
//         },
//         0
//     );
//     insert.set(
//         textDialogue,
//         {
//             pixi: {
//                 text: text,
//             },
//         },
//         0
//     );
//     //insert.addPause()

//     if (pause) {
//         insert.to(nextButton, {
//             pixi: {
//                 visible: true,
//             },
//         });

//         //insert.add(gsap.delayedCall(0, timelineControl, [true]) )
//         insert.call(timelineControl);
//         insert.to(nextButton, {
//             pixi: {
//                 visible: false,
//             },
//         });
//     }

//     //insert.call(timelineControl())

//     //insert.play()

//     return insert;
// };

// function blurObjects(object) {
//     const blur = gsap.timeline();

//     /*
//     allObjects.filter((obj) => obj !== object).forEach((obj) => {
//         obj.filters = [blurFilter1];
//     }
//     );
//     blur.to(blurFilter1, {
//         blur: 5,
//         duration: 0.5,
//     });
//     */

//     blurBg.visible = true;
//     blurBg.filters = [blurFilter1];
//     //object.blendMode = PIXI.BLEND_MODES['OVERLAY'];
//     object.zOrder = 1
//     blur.to(object, {
//         pixi: {
//             x: 50,
//             y: 40,
//         },
//         delay: 3,
//         duration: 1,
//     })

//     blur.to(object, {
//         pixi: {
//             x: 150,
//             y: 40,
//         },
//         delay: 3,
//         duration: 1,
//     })

//     blur.set(blurFilter1, {
//         blur: 0,
//         duration: 0.5,
//         delay: 5
//     })

//     return blur;
// }

/* FULL SCREEN TEST */

/*
function autoResize(app, px, scale) {
    const width = app.screen.width
    const height = app.screen.height

    if (width == 1200) {

        if (scale == "width" || scale == "x") return px/800 * width
        else if (scale == "height"|| scale == "y") return px/600 * height
    } else {
        if (scale == "width" || scale == "x") return px/1200 * width
        else if (scale == "height"|| scale == "y") return px/900 * height
    }

    //app.renderer.resize(1200, 800)
    //configureObject(app, table1, autoResize(450, "width"), autoResize(300, "height"), autoResize(580, "x"), autoResize(640, "y"));

}

function fullscreen() {
    if (app.screen.width == 1200) {
        app.renderer.resize(800, 600);
        resize = 1
    }
    else {
        app.renderer.resize(1200, 900);
        resize = app.screen.width / 800
    }
        allObjects.forEach((object) => {
        object.x = autoResize(app, object.x, "x");
        object.y = autoResize(app, object.y, "y");
        object.width = autoResize(app, object.width, "width");
        object.height = autoResize(app, object.height, "height");
    });
}
*/


module.exports = {
    randomNumber,
    randomFloatNumber,
    configureObject,
    timelineControl,
    objectInteractivity,
    interactive,
    drawChart,
    checkArea,
    zoomIn,
    zoomOut,
}

},{}],4:[function(require,module,exports){
const introOptions = {
    resources: {
        logoCircle:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/pratica-abertura/piscas+branco.png",
        logoLamp:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/pratica-abertura/lampada.png",
        logoLines:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/pratica-abertura/piscas.png",
        progressBar:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/pratica-abertura/Cinza+arredondado.png",
        progress:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/LIA/%C3%ADcones/pngtree-gaming-blue-technology-sense-progress-bar-png-image_2823080__1_-removebg-preview.png",
    },
};

//MAIN
const intro = (app, resources) => {
    /*logx-imagem, wx-width,hx-height ,x,y*/
    const configObject = (logx, wx, hx, x, y) => {
        logx.width = wx;
        logx.height = hx;
        logx.x = x;
        logx.y = y;
        logx.pivot.set = (logx.width / 2, logx.height / 2);
        app.stage.addChild(logx);
    };

    const introBackground = new PIXI.Graphics();
    introBackground.beginFill(0x050a30);
    introBackground.lineStyle(5, 0x000000);
    introBackground.drawRect(0, 0, 800, 600);
    app.stage.addChild(introBackground);

    //logo
    const logoCircle = new PIXI.Sprite(resources.logoCircle.texture);
    logoCircle.visible=false
    configObject(logoCircle, 180, 180, 400, 200);


    const logoLamp = new PIXI.Sprite(resources.logoLamp.texture);
    configObject(logoLamp, 150, 180, 325, 800);

    const logoLines = new PIXI.Sprite(resources.logoLines.texture);
    configObject(logoLines, 50, 50, 800, 75);

    //title
    const oppeningTextStyle = new PIXI.TextStyle({
        fill: 0xffffff,
    });

    const titleText = new PIXI.Text("Laboratório de Inovações Acadêmicas");
    titleText.x = 180;
    titleText.y = 400;
    titleText.style = oppeningTextStyle;
    app.stage.addChild(titleText);
    titleText.alpha = 0;

    const loadingText = new PIXI.Text('Carregando...');
    loadingText.style = oppeningTextStyle;
    loadingText.pivot.set = (loadingText.width / 2, loadingText.height / 2);
    loadingText.x = 325;
    loadingText.y = 440;
    app.stage.addChild(loadingText);
    loadingText.alpha = 0;


    //animation
    function animation() {
        const blocks = gsap.timeline({
            delay: 1,
        });
        blocks.to([titleText], {
            pixi: {
                alpha: 1,
            },
            duration: 1,
        });
        blocks.to([loadingText], {
            pixi: {
                alpha: 1,
            },
            duration: 1,
        });
        blocks.to(logoLamp, {
            pixi: {
                y: 120,
            },
            delay: 0.5,
            duration: 0.1,
            visible: true,
        });

        blocks.to(logoCircle, {
            delay: 0.3,
            duration: 0.1,
            visible: true,
        });
        blocks.to(logoCircle,{
            width:360,
            height:360,
            duration: 1

        })
        logoCircle.anchor.set(0.5);

        app.ticker.add(() => {
            // just for fun, let's rotate mr rabbit a little
            logoCircle.rotation += 0.01
            
        });
        blocks.to(
            [logoLamp, logoLines, logoCircle, titleText,  loadingText, introBackground],
            {
                pixi: {
                    alpha: 0,
                },
                delay: 6,
            }
        );
        

        return blocks;
    }

    return animation();
};

module.exports = {
    intro,
    introOptions
}

},{}],5:[function(require,module,exports){
const { introOptions } = require("./intro");
const { footerOptions } = require("./footer");
const { configureObject } = require("./functions");
const texts = require("./texts");

const options = {
    width: 800,
    height: 600,
    backgroundColor: 0x7193bc,
    targetSelector: "#animation",
    fontFamilies: ["Roboto", "DS-DIGI"],
    resources: {
        background:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p03-estufa/background.png",
        nextButton:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p03-estufa/nexButton.png",
        character:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/_general/nicolau.png",
        table1: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/mesa+perfil+.png",
        table2: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p03-estufa/table2.png",
        yesButton:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p03-estufa/yesButton.png",
        nextButton:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p03-estufa/nextButton.png",
        noButton:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p03-estufa/nextButton.png",
        dialogBox:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p03-estufa/dialogBox.png",
        objectA1:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-A1.png",
        objectA2:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-A2.png",
        objectA3:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-A3.png",
        objectA4:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-A4.png",
        objectA5:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-A5.png",
        objectA6:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-A6.png",
        objectB1:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-B1.png",
        objectB2:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-B2.png",
        objectB3:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-B3.png",
        objectB4:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-B4.png",
        objectB5:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-B5.png",
        objectB6:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-B6.png",
        objectC1:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-C1.png",
        objectC2:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-C2.png",
        objectC3:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-C3.png",
        objectC4:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-C4.png",
        objectC5:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-C5.png",
        objectC6:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-C6.png",
        objectD1:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-D1.png",
        objectD2:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-D2.png",
        objectD3:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-D3.png",
        objectD4:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-D4.png",
        objectD5:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-D5.png",
        objectD6:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Objeto-D6.png",

        pachymeter:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Paquimetro+parte+1.png",
        pachymeterMovable:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/paquimetro+parte+2.png",

        notebookScreen:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/tela+computador.png",
        //hitbox-area
        machine:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/maquina+de+tra%C3%A7%C3%A3o+1.png",

        machineMovingPart:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/ponte+m%C3%B3vel.png",
        bucket: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/bucket.png",

        //charts
        chart1: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/grafico001.png",
        chart2: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/grafico002.png",
        chart3: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/grafico003.png",
        chart4: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/grafico004.png",
        cartesianPlan:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/_general/plano-cartesiano.png",
        meter: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Extens%C3%B4metro.png",
        scale: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/R%C3%A9gua.png",
        pachymeter1:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Paquimetro+parte+1.png",
        pachymeter2:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/paquimetro+parte+2.png",
        paper: "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Folha+de+caderno.png",
        notebook:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Notebook+fundo+preto+.png",
        suitcase:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Suporte+.png",
        machineButtonOff:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Bot%C3%A3o+desligado+.png",
        machineButtonOn:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/Bot%C3%A3o+ligado+.png",
        hitarea:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/p05-tracao/hitbox-area.png",
        finishPracticeButton:
            "https://lia-labv.s3.sa-east-1.amazonaws.com/praticas/_general/bot%C3%A3o+vermelho+fechar.png",
    },
};

// load openning resources
if (typeof introOptions !== "undefined") {
    Object.keys(introOptions.resources).forEach((id) => {
        options.resources[id] = introOptions.resources[id];
    });
}

// load footer resources
if (typeof footerOptions !== "undefined") {
    Object.keys(footerOptions.resources).forEach((id) => {
        options.resources[id] = footerOptions.resources[id];
    });
}

const createObjects = (app, resources) => {
    /* CREATE ITEMS SCOPE */

    let allObjects = {};

    //create dialog box
    const dialogBox = PIXI.Sprite.from(resources.dialogBox.texture);
    configureObject(app, dialogBox, 270, 210, 600, 110);
    dialogBox.visible = false;
    allObjects.dialogBox = dialogBox;

    // create persona
    const character = new PIXI.Sprite(resources.character.texture);
    character.width = 200;
    character.height = 300;
    character.x = 854;
    character.y = 380;
    character.angle = 13;
    character.anchor.set(0.5, 0.8);
    character.visible = false;
    app.stage.addChild(character);
    allObjects.character = character;

    // create table1
    const table1 = PIXI.Sprite.from(resources.table1.texture);
    configureObject(app, table1, 590, 320, 540, 640);
    allObjects.table1 = table1;

    /*CREATE MACHINE*/
    const machine = PIXI.Sprite.from(resources.machine.texture);

    //default object position on machine
    machine.objectPositionX = 120;
    machine.objectPositionY = 180;
    configureObject(app, machine, 240, 700, 120, 350);

    //hitarea in object position to be clicked
    machine.hitarea = PIXI.Sprite.from(resources.hitarea.texture);

    configureObject(
        app,
        machine.hitarea,
        40,
        105,
        machine.objectPositionX,
        machine.objectPositionY
    );

    machine.hitarea.alpha = 0;
    machine.hitarea.visible = false;

    //machine button - to turn on/off machine
    machine.machineButton = PIXI.Sprite.from(
        resources.machineButtonOff.texture
    );
    configureObject(app, machine.machineButton, 40, 40, 185, 480);

    allObjects.machine = machine;

    const machineMovingPart = PIXI.Sprite.from(
        resources.machineMovingPart.texture
    );
    machineMovingPart.initialPositionX = 120;
    machineMovingPart.initialPositionY = 345;
    configureObject(
        app,
        machineMovingPart,
        220,
        150,
        machineMovingPart.initialPositionX,
        machineMovingPart.initialPositionY
    );
    allObjects.machineMovingPart = machineMovingPart;

    //create style for texts
    const style = new PIXI.TextStyle({
        fontFamily: "Tahoma",
        fontSize: 16,
        lineHeight: 28,
        letterSpacing: 0,
        fill: 0xffffff,
        align: "center",
    });

    const objectDescriptionStyle = new PIXI.TextStyle({
        fontFamily: "Tahoma",
        fontSize: 14,
        lineHeight: 17,
        fill: 0xffffff,
        align: "left",
    });

    const endStyle = new PIXI.TextStyle({
        fontFamily: "Tahoma",
        fontSize: 16,
        lineHeight: 29,
        fill: 0x000000,
        align: "left",
    });

    const pachymeterStyle = new PIXI.TextStyle({
        fontFamily: "DS-DIGI",
        fontSize: 16,
        fill: 0xffffff,
        align: "center",
    });

    //create suitcase
    const suitcase = new PIXI.Sprite.from(resources.suitcase.texture);
    configureObject(app, suitcase, 220, 270, 680, 400);
    allObjects.suitcase = suitcase;

    //create meter

    const meter = new PIXI.Sprite.from(resources.meter.texture);
    meter.initialPositionX = 700;
    meter.initialPositionY = 460;
    configureObject(
        app,
        meter,
        90,
        60,
        meter.initialPositionX,
        meter.initialPositionY
    );
    allObjects.meter = meter;

    //create pachymeter
    const pachymeter = new PIXI.Sprite.from(resources.pachymeter1.texture);
    pachymeter.initialPositionX = 0;
    pachymeter.initialPositionY = 0;
    configureObject(
        app,
        pachymeter,
        170,
        70,
        pachymeter.initialPositionX,
        pachymeter.initialPositionY
    );
    pachymeter.measureBaseX = 424;
    pachymeter.measureBaseY = 230.5 + 25;
    allObjects.pachymeter = pachymeter;

    //movel part:
    const pachymeterPart = new PIXI.Sprite.from(resources.pachymeter2.texture);
    configureObject(
        app,
        pachymeterPart,
        pachymeter.width * 0.295,
        pachymeter.height,
        pachymeter.x - 50,
        pachymeter.y
    );
    pachymeter.part = pachymeterPart;
    pachymeter.use = (interactivity = true) => {
        if (interactivity) {
            pachymeter.part.interactive = true;
            pachymeter.part.buttonMode = true;
        } else {
            pachymeter.part.interactive = false;
            pachymeter.part.buttonMode = false;
        }
    };
    allObjects.pachymeterPart = pachymeterPart;

    //create pachymeter display text
    const pachymeterDisplayText = new PIXI.Text(0, pachymeterStyle);
    pachymeterDisplayText.x = pachymeter.part.x;
    pachymeterDisplayText.y = pachymeter.part.y - 16;
    pachymeterDisplayText.anchor.set(0.5, 0.5);
    pachymeterDisplayText.visible = true;
    app.stage.addChild(pachymeterDisplayText);
    pachymeter.part.text = pachymeterDisplayText;
    allObjects.pachymeterDisplayText = pachymeterDisplayText;

    //create pachymeter container
    const pachymeterContainer = new PIXI.Container();
    pachymeterContainer.initialPositionX = 680;
    pachymeterContainer.initialPositionY = 420;
    configureObject(
        app,
        pachymeterContainer,
        pachymeter.width,
        pachymeter.height,
        680,
        420
    );
    pachymeterContainer.addChild(
        pachymeter,
        pachymeter.part,
        pachymeter.part.text
    );
    allObjects.pachymeterContainer = pachymeterContainer;
    //add pachymeterPart to pachymeter

    //create position objects coordinates
    const objectInitialPositionX = 619;
    const objectInitialPositionY = 332;

    //create objectA1
    const objectA1 = PIXI.Sprite.from(resources.objectA1.texture);
    objectA1.initialPositionX = objectInitialPositionX;
    objectA1.initialPositionY = objectInitialPositionY;
    configureObject(
        app,
        objectA1,
        10,
        90,
        objectA1.initialPositionX,
        objectA1.initialPositionY,
        true
    );
    objectA1.used = false;
    objectA1.delay = 12; //8
    objectA1.text = texts.objects.objectA1;
    objectA1.checkArea = false;

    //REMOVER APÓS CONCONSÃO DA ATIVIDADE 399
    objectA1.initialX = objectA1.x;
    objectA1.initialY = objectA1.y;

    allObjects.objectA1 = objectA1;

    //create objectB1
    const objectB1 = PIXI.Sprite.from(resources.objectB1.texture);
    objectB1.initialPositionX = objectInitialPositionX + 39;
    objectB1.initialPositionY = objectInitialPositionY;
    configureObject(
        app,
        objectB1,
        10,
        90,
        objectB1.initialPositionX,
        objectB1.initialPositionY,
        true
    );
    objectB1.used = false;
    objectB1.delay = 11; //8
    objectB1.text = texts.objects.objectB1;
    objectB1.checkArea = false;

    //REMOVER APÓS CONCONSÃO DA ATIVIDADE 399
    objectB1.initialX = objectB1.x;
    objectB1.initialY = objectB1.y;

    allObjects.objectB1 = objectB1;

    //create objectC1
    const objectC1 = PIXI.Sprite.from(resources.objectC1.texture);
    objectC1.initialPositionX = objectInitialPositionX + 78;
    objectC1.initialPositionY = objectInitialPositionY;
    configureObject(
        app,
        objectC1,
        10,
        90,
        objectC1.initialPositionX,
        objectC1.initialPositionY,
        true
    );
    objectC1.used = false;
    objectC1.delay = 2; // 7
    objectC1.text = texts.objects.objectC1;
    objectC1.checkArea = false;

    //REMOVER APÓS CONCONSÃO DA ATIVIDADE 399
    objectC1.initialX = objectC1.x;
    objectC1.initialY = objectC1.y;

    allObjects.objectC1 = objectC1;

    //create objectD1
    const objectD1 = PIXI.Sprite.from(resources.objectD1.texture);
    objectD1.initialPositionX = objectInitialPositionX + 117;
    objectD1.initialPositionY = objectInitialPositionY;
    configureObject(
        app,
        objectD1,
        10,
        90,
        objectD1.initialPositionX,
        objectD1.initialPositionY,
        true
    );
    objectD1.used = false;
    objectD1.delay = 2; // 3
    objectD1.text = texts.objects.objectD1;
    objectD1.checkArea = false;

    //REMOVER APÓS CONCONSÃO DA ATIVIDADE 399
    objectD1.initialX = objectD1.x;
    objectD1.initialY = objectD1.y;

    allObjects.objectD1 = objectD1;

    // create array of objects
    const objects = [objectA1, objectB1, objectC1, objectD1];
    allObjects.objects = objects;

    //create objectsA
    const objectA2 = PIXI.Sprite.from(resources.objectA2.texture);
    configureObject(
        app,
        objectA2,
        10,
        92.25,
        machine.objectPositionX,
        machine.objectPositionY + 2.25 / 2,
        false,
        false
    );

    const objectA3 = PIXI.Sprite.from(resources.objectA3.texture);
    configureObject(
        app,
        objectA3,
        10,
        94.5,
        machine.objectPositionX,
        machine.objectPositionY + 4.5 / 2,
        false,
        false
    );

    const objectA4 = PIXI.Sprite.from(resources.objectA4.texture);
    configureObject(
        app,
        objectA4,
        10,
        96.75,
        machine.objectPositionX,
        machine.objectPositionY + 6.75 / 2,
        false,
        false
    );

    const objectA5 = PIXI.Sprite.from(resources.objectA5.texture);
    configureObject(
        app,
        objectA5,
        10,
        100,
        machine.objectPositionX,
        machine.objectPositionY + 9 / 2,
        false,
        false
    );

    const objectBrokedA1 = PIXI.Sprite.from(resources.objectA6.texture);
    configureObject(
        app,
        objectBrokedA1,
        10,
        50,
        machine.objectPositionX,
        machine.objectPositionY - 25,
        false,
        false
    );
    objectBrokedA1.angle = 180;

    const objectBrokedA2 = PIXI.Sprite.from(resources.objectA6.texture);
    configureObject(
        app,
        objectBrokedA2,
        10,
        50,
        machine.objectPositionX,
        machine.objectPositionY + 30,
        false,
        false
    );

    objectA1.broked = [
        objectA1,
        objectA2,
        objectA3,
        objectA4,
        objectA5,
        objectBrokedA1,
        objectBrokedA2,
    ];

    //create objectsB
    const objectB2 = PIXI.Sprite.from(resources.objectB2.texture);
    configureObject(
        app,
        objectB2,
        10,
        92.25,
        machine.objectPositionX,
        machine.objectPositionY + 2.25 / 2,
        false,
        false
    );

    const objectB3 = PIXI.Sprite.from(resources.objectB3.texture);
    configureObject(
        app,
        objectB3,
        10,
        94.5,
        machine.objectPositionX,
        machine.objectPositionY + 4.5 / 2,
        false,
        false
    );

    const objectB4 = PIXI.Sprite.from(resources.objectB4.texture);
    configureObject(
        app,
        objectB4,
        10,
        96.75,
        machine.objectPositionX,
        machine.objectPositionY + 6.75 / 2,
        false,
        false
    );

    const objectB5 = PIXI.Sprite.from(resources.objectB5.texture);
    configureObject(
        app,
        objectB5,
        10,
        100,
        machine.objectPositionX,
        machine.objectPositionY + 9 / 2,
        false,
        false
    );

    const objectBrokedB1 = PIXI.Sprite.from(resources.objectB6.texture);
    configureObject(
        app,
        objectBrokedB1,
        10,
        50,
        machine.objectPositionX,
        machine.objectPositionY - 25,
        false,
        false
    );
    objectBrokedB1.angle = 180;
    (objectBrokedB1.visible = false), false;

    const objectBrokedB2 = PIXI.Sprite.from(resources.objectB6.texture);
    configureObject(
        app,
        objectBrokedB2,
        10,
        50,
        machine.objectPositionX,
        machine.objectPositionY + 30,
        false,
        false
    );

    objectB1.broked = [
        objectB1,
        objectB2,
        objectB3,
        objectB4,
        objectB5,
        objectBrokedB1,
        objectBrokedB2,
    ];

    //create objectsC
    const objectC2 = PIXI.Sprite.from(resources.objectC2.texture);
    configureObject(
        app,
        objectC2,
        10,
        92.25,
        machine.objectPositionX,
        machine.objectPositionY + 2.25 / 2,
        false,
        false
    );

    const objectC3 = PIXI.Sprite.from(resources.objectC3.texture);
    configureObject(
        app,
        objectC3,
        10,
        94.5,
        machine.objectPositionX,
        machine.objectPositionY + 4.5 / 2,
        false,
        false
    );

    const objectC4 = PIXI.Sprite.from(resources.objectC4.texture);
    configureObject(
        app,
        objectC4,
        10,
        96.75,
        machine.objectPositionX,
        machine.objectPositionY + 6.75 / 2,
        false,
        false
    );

    const objectC5 = PIXI.Sprite.from(resources.objectC5.texture);
    configureObject(
        app,
        objectC5,
        10,
        100,
        machine.objectPositionX,
        machine.objectPositionY + 9 / 2,
        false,
        false
    );

    const objectBrokedC1 = PIXI.Sprite.from(resources.objectC6.texture);
    configureObject(
        app,
        objectBrokedC1,
        10,
        50,
        machine.objectPositionX,
        machine.objectPositionY - 22.5,
        false,
        false
    );
    objectBrokedC1.angle = 180;

    const objectBrokedC2 = PIXI.Sprite.from(resources.objectC6.texture);
    configureObject(
        app,
        objectBrokedC2,
        10,
        50,
        machine.objectPositionX,
        machine.objectPositionY + 30,
        false,
        false
    );

    objectC1.broked = [
        objectC1,
        objectC3,
        objectC5,
        objectBrokedC1,
        objectBrokedC2,
    ];

    //create objectsD
    const objectD2 = PIXI.Sprite.from(resources.objectD2.texture);
    configureObject(
        app,
        objectD2,
        10,
        92.25,
        machine.objectPositionX,
        machine.objectPositionY + 2.25 / 2,
        false,
        false
    );

    const objectD3 = PIXI.Sprite.from(resources.objectD3.texture);
    configureObject(
        app,
        objectD3,
        10,
        94.5,
        machine.objectPositionX,
        machine.objectPositionY + 4.5 / 2,
        false,
        false
    );

    const objectD4 = PIXI.Sprite.from(resources.objectD4.texture);
    configureObject(
        app,
        objectD4,
        10,
        96.75,
        machine.objectPositionX,
        machine.objectPositionY + 6.75 / 2,
        false,
        false
    );

    const objectD5 = PIXI.Sprite.from(resources.objectD5.texture);
    configureObject(
        app,
        objectD5,
        10,
        100,
        machine.objectPositionX,
        machine.objectPositionY + 9 / 2,
        false,
        false
    );

    const objectBrokedD1 = PIXI.Sprite.from(resources.objectD6.texture);
    configureObject(
        app,
        objectBrokedD1,
        10,
        50,
        machine.objectPositionX,
        machine.objectPositionY - 25,
        false,
        false
    );
    objectBrokedD1.angle = 180;

    const objectBrokedD2 = PIXI.Sprite.from(resources.objectD6.texture);
    configureObject(
        app,
        objectBrokedD2,
        10,
        50,
        machine.objectPositionX,
        machine.objectPositionY + 30,
        false,
        false
    );

    objectD1.broked = [
        objectD1,
        objectD3,
        objectD5,
        objectBrokedD1,
        objectBrokedD2,
    ];

    // // create notebook and computer screen
    const notebook = PIXI.Sprite.from(resources.notebook.texture);
    configureObject(app, notebook, 210, 170, 380, 450);
    allObjects.notebook = notebook;

    // create bucket
    const bucket = PIXI.Sprite.from(resources.bucket.texture);
    configureObject(app, bucket, 100, 130, 120, 800);
    objectB1.bucket = bucket;

    //background
    const background = new PIXI.Sprite(resources.cartesianPlan.texture);
    configureObject(app, background, 800, 600, 400, 300);
    background.alpha = 0.5;
    background.visible = false;
    allObjects.background = background;

    //create paper
    const paper = PIXI.Sprite.from(resources.paper.texture);
    configureObject(app, paper, 400, 420, 1100, 300);
    allObjects.paper = paper;

    const endText = new PIXI.Text(texts.end, endStyle);
    endText.x = 985;
    endText.y = 115;
    app.stage.addChild(endText);
    allObjects.endText = endText;

    //create chart background
    const chartBackground = new PIXI.Graphics();
    chartBackground.beginFill(0x050a30);
    chartBackground.lineStyle(5, 0x000000);
    chartBackground.drawRect(0, 0, 800, 600);
    app.stage.addChild(chartBackground);
    chartBackground.visible = false;
    allObjects.chartBackground = chartBackground;

    //create next button
    const nextButton = PIXI.Sprite.from(resources.nextButton.texture);
    configureObject(app, nextButton, 60, 30, 50, 30, true);
    nextButton.visible = false;
    allObjects.nextButton = nextButton;

    //finish button
    const finishPracticeButton = PIXI.Sprite.from(
        resources.finishPracticeButton.texture
    );
    configureObject(app, finishPracticeButton, 50, 50, 700, 50, true, false);
    allObjects.finishPracticeButton = finishPracticeButton;

    const pachymeterButton = PIXI.Sprite.from(resources.yesButton.texture);
    configureObject(app, pachymeterButton, 60, 30, 330, 170, true, false);
    allObjects.pachymeterButton = pachymeterButton;

    //creating charts
    const chart1 = PIXI.Sprite.from(resources.chart1.texture);
    configureObject(
        app,
        chart1,
        165,
        105,
        notebook.x,
        notebook.y - 22,
        false,
        false
    );
    objectA1.chart = chart1;

    const chart2 = PIXI.Sprite.from(resources.chart2.texture);
    configureObject(
        app,
        chart2,
        165,
        105,
        notebook.x,
        notebook.y - 22,
        false,
        false
    );
    objectB1.chart = chart2;

    const chart3 = PIXI.Sprite.from(resources.chart3.texture);
    configureObject(
        app,
        chart3,
        165,
        105,
        notebook.x,
        notebook.y - 22,
        false,
        false
    );
    objectC1.chart = chart3;

    const chart4 = PIXI.Sprite.from(resources.chart4.texture);
    configureObject(
        app,
        chart4,
        165,
        105,
        notebook.x,
        notebook.y - 22,
        false,
        false
    );
    objectD1.chart = chart4;

    //create notebookScreen
    const notebookScreen = PIXI.Sprite.from(resources.notebookScreen.texture);
    configureObject(
        app,
        notebookScreen,
        126,
        80,
        notebook.x + 50,
        notebook.y - 27,
        false,
        false
    );
    notebookScreen.tint = 0x383938;
    notebookScreen.initialWidth = 119;
    notebookScreen.anchor.set(0.35, 0);
    allObjects.notebookScreen = notebookScreen;

    //create information texts
    const textOver1 = new PIXI.Text(
        texts.objects.objectA1.slice(0, texts.objects.objectA1.indexOf("\n")),
        objectDescriptionStyle
    );
    textOver1.anchor.set(0.5);
    textOver1.x = objectA1.x;
    textOver1.y = objectA1.y - 100;
    textOver1.visible = false;
    objectA1.textOver = textOver1;
    app.stage.addChild(textOver1);

    const textOver2 = new PIXI.Text(
        texts.objects.objectB1.slice(0, texts.objects.objectB1.indexOf("\n")),
        objectDescriptionStyle
    );
    textOver2.anchor.set(0.5);
    textOver2.x = objectB1.x;
    textOver2.y = objectB1.y - 100;
    textOver2.visible = false;
    objectB1.textOver = textOver2;
    app.stage.addChild(textOver2);

    const textOver3 = new PIXI.Text(
        texts.objects.objectC1.slice(0, texts.objects.objectC1.indexOf("\n")),
        objectDescriptionStyle
    );
    textOver3.anchor.set(0.5);
    textOver3.x = objectC1.x;
    textOver3.y = objectC1.y - 100;
    textOver3.visible = false;
    objectC1.textOver = textOver3;
    app.stage.addChild(textOver3);

    const textOver4 = new PIXI.Text(
        texts.objects.objectD1.slice(0, texts.objects.objectD1.indexOf("\n")),
        objectDescriptionStyle
    );
    textOver4.anchor.set(0.5);
    textOver4.x = objectD1.x;
    textOver4.y = objectD1.y - 100;
    textOver4.visible = false;
    objectD1.textOver = textOver4;
    app.stage.addChild(textOver4);

    const blurFilter1 = new PIXI.filters.BlurFilter();
    blurFilter1.blur = 2.0;
    //objectA1.filters = [blurFilter1];

    //create array with all objects

    const blurBg = new PIXI.Graphics();
    blurBg.beginFill(0x000000);
    blurBg.lineStyle(5, 0x000000);
    blurBg.drawRect(0, 0, 800, 600);
    app.stage.addChild(blurBg);
    blurBg.alpha = 0.8;
    blurBg.visible = false;

    const measuringPoints = new PIXI.Container();
    measuringPoints.initialPositionX = 396;
    measuringPoints.initialPositionY = 228;
    configureObject(
        app,
        measuringPoints,
        0,
        0,
        measuringPoints.initialPositionX,
        measuringPoints.initialPositionY,
        false,
        false
    );
    allObjects.measuringPoints = measuringPoints;

    const line1 = new PIXI.Graphics();
    const line2 = new PIXI.Graphics();
    line1.lineStyle(2, 0xff0000).moveTo(0, 0).lineTo(8, 0);
    line2.lineStyle(2, 0xff0000).moveTo(0, 42).lineTo(8, 42);

    measuringPoints.line1 = line1;
    measuringPoints.line2 = line2;

    measuringPoints.addChild(line1, line2);

    return allObjects;
};

module.exports = {
    options,
    createObjects,
};

},{"./footer":2,"./functions":3,"./intro":4,"./texts":7}],6:[function(require,module,exports){

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

},{}],7:[function(require,module,exports){
module.exports={
    "objects": {
        "objectA1": "Material A \n Força (Limite de proporcionalidade)(N):  490625\n Força Máxima (N): 785000 \n Comprimento no limite de proporcionalidade (mm): 50,0625 \n Comprimento Final(mm):65\n Altura (antes/após): (MEASUREDHEIGHT/ MEASUREDHEIGHTBROKED)\n Diâmetro antes: MEASUREDDIAMETER\n",
        "objectB1": "Material B \n Força (Limite de proporcionalidade)(N): 471000\n Força Máxima (N): 853687,5 \n Comprimento no limite de proporcionalidade (mm): 50,06 \n Comprimento Final(mm):61\n Altura (antes/após): (MEASUREDHEIGHT/ MEASUREDHEIGHTBROKED)\n Diâmetro antes: MEASUREDDIAMETER\n",
        "objectC1": "Material C \n Força (Limite de proporcionalidade)(N):  262975\n Força Máxima (N): 351287,5 \n Comprimento no limite de proporcionalidade (mm): 50,1 \n Comprimento Final(mm):50,25\n Altura (antes/após): (MEASUREDHEIGHT/ MEASUREDHEIGHTBROKED)\n Diâmetro antes: MEASUREDDIAMETER\n",
        "objectD1": "Material D \n Força (Limite de proporcionalidade)(N): 235500\n Força Máxima (N): 298300 \n Comprimento no limite de proporcionalidade (mm): 50,1 \n Comprimento Final(mm): 53\n Altura (antes/após): (MEASUREDHEIGHT/ MEASUREDHEIGHTBROKED)\n Diâmetro antes: MEASUREDDIAMETER\n"
    },

    "end": "A partir do gráfico gerado no ensaio de \ntração determine: \na) Determine o módulo de elasticidade\nb) A tensão de escoamento\nc) Tensão Máxima\nd) A tensão de ruptura do material \nCom as medidas feitas antes de depois \nda ruptura do corpo de prova, determine: \na) O percentual de alongamento \nb) Percentual da área de redução \nComo você classificaria esse material \na partir dos dados apresentados? ",

    "footer": {
        "credits": "\n\nIury Sousa, Jailson Junior, Maurício Alves, Emerson José, Thiago Nascimento, Angélica Martiniano, Ana Carolina, Heloisa Pimentel, Adilson Da Silva\n\nCopyright ©\n\nDesenvolvido pelo Laboratório de Inovações acadêmicas - Grupo Ser Educacional. Todos os direitos reservados."
    }
}
},{}]},{},[1]);
