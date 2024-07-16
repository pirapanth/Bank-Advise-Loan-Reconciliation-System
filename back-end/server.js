const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;
app.use(cors()); 

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cimflexdb'
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected');
});

app.use(bodyParser.json());

app.post('/saveFormData', (req, res) => {
  const formData = req.body;
  const currentDate = new Date().toISOString().split('T')[0];
  const issuedOnDate = new Date(formData.issuedOn).toISOString().split('T')[0];

  const sql = `INSERT INTO lcopeningadvice 
              (lcReferenceNo, forField, tolerance, issuedOn, usdRate, commission, favorof, amount, equivalentInLkr,lcoDate) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,NOW())`;
  const values = [
    formData.lcReferenceNo,
    formData.forField,
    formData.tolerance,
    issuedOnDate.split(' ')[0],
    formData.usdRate,
    formData.commission,
    formData.favorof,
    formData.amount,
    formData.equivalentInLkr,
    currentDate.split(' ')[0]
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error saving form data:', err);
      res.status(500).send('Error saving form data');
    } else {
      console.log('Form data saved successfully');
      res.status(200).send('Form data saved successfully');
    }
  });
});


app.get('/getLastData/:RefNo', (req, res) => {
  const RefNo = req.params.RefNo;
  db.query('SELECT * FROM lcopeningadvice WHERE lcReferenceNo = ?', RefNo, (err, result) => {
      if (err) {
          console.log(err);
          res.status(500).send('Error fetching data');
      } else {
          if (result.length > 0) {
              res.json(result[0]);
          } else {
              res.status(404).send('Data not found');
          }
      }
  });
});

app.get('/searchByLCReferenceNo/:lcReferenceNo', (req, res) => {
  const lcReferenceNo = req.params.lcReferenceNo;
  db.query('SELECT * FROM lcopeningadvice WHERE lcReferenceNo = ?', lcReferenceNo, (err, result) => {
      if (err) {
          console.log(err);
          res.status(500).send('Error searching data');
      } else {
          if (result.length > 0) {
              res.json(result[0]);
          } else {
              res.status(404).send('Data not found');
          }
      }
  });
});

app.get('/searchBylcoDate/:lcoDate', (req, res) => {
  const lcoDate = req.params.lcoDate;
  db.query('SELECT * FROM lcopeningadvice WHERE DATE(lcoDate) = ?', lcoDate, (err, result) => {
      if (err) {
          console.log(err);
          res.status(500).send('Error searching data');
      } else {
          if (result.length > 0) {
              res.json(result[0]);
          } else {
              res.status(404).send('Data not found');
          }
      }
  });
});

app.get('/searchByissuedOn/:issuedOn', (req, res) => {
  const issuedOn = req.params.issuedOn;
  db.query('SELECT * FROM lcopeningadvice WHERE DATE(issuedOn) = ?', issuedOn, (err, result) => {
      if (err) {
          console.log(err);
          res.status(500).send('Error searching data');
      } else {
          if (result.length > 0) {
              res.json(result[0]);
          } else {
              res.status(404).send('Data not found');
          }
      }
  });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
