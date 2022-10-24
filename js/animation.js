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
