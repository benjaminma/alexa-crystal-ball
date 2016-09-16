'use strict';
var Alexa = require('alexa-sdk');

var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var SKILL_NAME = 'Crystal Ball';

/**
 * Array containing preditions.
 */
var PREDICTIONS = {
    YES: [
        'As I see it... yes.',
        'Most likely.',
        'My sources say... yes.',
        'The outlook is... good.',
        'The signs point to... yes.',
        'Very likely.',
        'Yes, definitely.',
        'Yes, in due time.',
        'Yes.',
        'You can count on it.'
    ],
    NO: [
        'As I see it... no.',
        'Definitely... not.',
        'Don\'t bet on it.',
        'Don\'t count on it.',
        'I have my doubts.',
        'My sources say... no.',
        'Not a chance.',
        'The outlook is... not so good.',
        'The signs point to... no.'
    ],
    MAYBE: [
        'Concentrate and ask again.',
        'Perhaps... in your dreams!',
        'The outlook is... so so.',
        'Who knows?'
    ]
};

exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetPrediction');
    },
    'GetNewPredictionIntent': function () {
        this.emit('GetPrediction');
    },
    'GetPrediction': function () {
		// Get a random prediction
        var prediction = getRandomPrediction();
        var speechOutput = (rand(1, 100) >= 80) ? 'Hmm... ' : '';
        speechOutput += prediction.output;
        this.emit(':tellWithCard', speechOutput, SKILL_NAME, prediction.type);
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = 'I am a crystal ball. Ask me a yes or no question, or, you can say exit... What would you like to ask?';
        var reprompt = 'What would you like to ask?';
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    }
};

/**
 * Return a random integer between min and max (inclusive).
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
var rand = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Return a random item from array (or undefined if array is invalid).
 * @param {Array} arr
 * @return {*}
 */
var randFromArray = function(arr) {
    if (arr instanceof Array && arr.length > 0) {
        var l = arr.length;
        var idx = rand(0, l - 1);
        return arr[idx];
    } else {
        return undefined;
    }
};

/**
 * Return a random prediction object.
 * @return {{output: string, type: string}}
 */
var getRandomPrediction = function() {
    var prediction = {};
    var chance = rand(1, 100);
    if (chance >= 60) {
        prediction.type = 'Yes';
        prediction.output = randFromArray(PREDICTIONS.YES);
    } else if (chance >= 20) {
        prediction.type = 'No';
        prediction.output = randFromArray(PREDICTIONS.NO);
    } else {
        prediction.type = 'Maybe';
        prediction.output = randFromArray(PREDICTIONS.MAYBE);
    }
    return prediction;
};
