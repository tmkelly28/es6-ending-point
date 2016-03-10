'use strict';

import fetch from './fetch';
import prompt, {promptForEvent} from './prompt';

function* generateEvents (events) {
  for (let event of events) {
    yield promptForEvent(event, `
      ${event.id}: ${new Date(event.datetime)}
      ${event.venue.name} ${event.venue.city}, ${event.venue.region}
      Do you want to attend this event? > `);
  }
}

function cycleEvents (it, schedule, done) {
  let result = it.next();
  if (result.done) schedule.save()
    .then(savedSchedule => done(savedSchedule))
    .catch(console.error);
  else result.value
    .then(response => {
      if (response.answer === 'y') schedule.add(response.event);
      cycleEvents(it, schedule, done);
    });
}

export default function search (schedule, done) {
  let _bandName;
  prompt('Enter an artist to search for > ')
    .then(bandName => {
      _bandName = bandName;
      return fetch(bandName);
    })
    .then(events => {
      events = events.filter(event => event.venue.city === 'New York');
      console.log(`\nUpcoming concerts for ${_bandName} in New York`);
      let it = generateEvents(events);
      cycleEvents(it, schedule, done);
    })
    .catch(error => {
      console.error(error);
      done(schedule);
    });
}