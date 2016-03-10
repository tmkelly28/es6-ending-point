'use strict';

import prompt from './prompt';
import search from './search';
import Schedule from './schedule';

function bootstrap () {
  console.log("Welcome to ConcertGoer!");
  Schedule.load()
    .then(events => {
      const schedule = new Schedule(events);
      schedule.log();
      main(schedule);
    })
    .catch(error => {
      console.log('No schedule.json found - one will be created upon adding an event!');
      main(new Schedule());
    });
}

function main (schedule) {
  prompt('What would you like to do > ')
    .then(command => {
      switch (command) {
        case 'search':
          search(schedule, main);
          break;
        case 'view schedule':
          schedule.log();
          main(schedule);
          break;
        case 'exit':
          console.log('Goodbye!');
          process.exit();
          break;
        default:
          console.log('Not a valid command');
          main(schedule);
      }
    })
    .catch(err => {
      console.log(err);
      main(schedule);
    });
}

bootstrap();
