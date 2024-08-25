const clientPromise = require('./src/client'); // clientPromise is a promise

const { gemini } = require('./src/ai');
const qrcode = require('qrcode-terminal');

clientPromise.then(client => {

  client.on('ready', () => {
    console.log('Client is ready!');
  });

  // client.on('qr', qr => {
  //   qrcode.generate(qr, { small: true });
  // });

  client.on('message_create', async (message) => {

    if (message.body === 'Hi') {
      
      await client.sendMessage(message.from, 'Hi, How can I assist you today :)');
    
    } else {

      const regex = /(\/\w+)\s*(.*)/;
      const [command, prompt] = message.body.match(regex) ? [message.body.match(regex)[1], message.body.match(regex)[2]] : [null, null];

      if (command === '/askai') {

        const resp = await gemini(prompt);
        await client.sendMessage(message.from, resp);

      } else if (command === '/schedule') {

        const regex2 = /(\/\w+)\s+([\w\s]+),?\s*(\d{1,2}\.\d{1,2}\.?\d{0,4})?,?\s*(\d{1,2}\.\d{2}\s*[APMapm]*)?/;
        const [task, inputDate, inputTime] = message.body.match(regex2) ? [message.body.match(regex2)[2].trim(), message.body.match(regex2)[3], message.body.match(regex2)[4]] : [null, null, null];

        const moment = require('moment-timezone');
        const schedule = require('node-schedule');

        // Parse the date
        const [day, month, year] = inputDate.split('.').map(Number);
        const fullYear = year >= 100 ? year : 2000 + year;
        const formattedDate = `${fullYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // Parse the time
        const time12HourFormat = moment(inputTime, 'h.mm a');
        const formattedTime = time12HourFormat.format('HH:mm'); 

        // Combine date and time
        const dateTimeString = `${formattedDate} ${formattedTime}`;

        const scheduledTimeIST = moment.tz(dateTimeString, 'Asia/Kolkata');
        const scheduledTimeUTC = scheduledTimeIST.utc().toDate();

        schedule.scheduleJob(scheduledTimeUTC, async function() {
          await client.sendMessage(message.from, task);
        });

      }
    }

  });

  client.initialize();

}).catch(err => {
  console.error('Failed to initialize the client:', err);
});
