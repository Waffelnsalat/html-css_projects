const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const parse = require('csv-parse');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Erstellen eines Streams zur Verarbeitung der CSV-Datei
    const parser = fs.createReadStream('logindata.csv').pipe(parse({
      columns: true,
      skip_empty_lines: true
    }));

    let userExists = false;

    // Ereignis-Handler für lesbare Daten
    parser.on('readable', function() {
      let record;
      while ((record = parser.read())) {
        if (record.username === username && record.password === password) {
          userExists = true;
          break;
        }
      }
    });

    // Ereignis-Handler für das Ende der Daten
    parser.on('end', function() {
      if (userExists) {
        res.send('Login erfolgreich.');
      } else {
        res.send('Login nicht erfolgreich.');
      }
    });

    // Ereignis-Handler für Fehler
    parser.on('error', function(err) {
      console.error(err);
      res.send('Ein Fehler ist aufgetreten.');
    });
});

app.listen(3000, () => {
    console.log('Server läuft auf Port 3000');
});
