var messagebird = require('messagebird')('h2Z5kQzyS7mXDkYke8jpl2aKP');

messagebird.messages.create({
    originator: 'SDKDEMO',
    recipients: ['+212655348167'],
    body: "Hello Najlae this is Saad and i love you ♥"
}, function(err, response)
{
    if (err)
    {
        console.log('ERROR: ');
        console.log(err);
    }
    else {
        console.log('SUCCES: ');
        console.log(response);
    }
});