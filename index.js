const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const port = 3001; // You can choose any available port
const crypto = require('crypto');
// const secretKey = crypto.randomBytes(16).toString('hex'); 
const secretKey = 'dd907758de5b1d3317f2fdce899ffa18'

app.use(session({
    secret: secretKey, // Change this to a secure random key
    resave: false,
    saveUninitialized: true
}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jkuat'
});

app.use(bodyParser.urlencoded({ extended: true }));

console.log(secretKey)
// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set the views directory
app.set('views', __dirname + '/view');
app.get('/', (req, res) => {
    res.render('login', { title: 'Register and login' });
});


// Function to handle login
async function handleLogin(req, res, loginData) {
    const reg = loginData.reg;
    const password = loginData.pass;

    // Check if the email exists in the database
    connection.query('SELECT * FROM register WHERE reg = ?', [reg], (queryError, results, fields) => {

        console.log(results)
        if (queryError) throw queryError;


        if (results.length === 0) {
            // Email not found, send a response indicating the issue
            console.log('reg not found.');

           // Redirect to sign-in page      

           res.redirect('/'); 

           return false
        } else {
            // Compare the entered password with the hashed password in the database
            const hashedPassword = results[0].pass;

            bcrypt.compare(password, hashedPassword, (compareError, match) => {
                if (compareError) throw compareError;

                if (match) {
                    // Passwords match, login successful
                    console.log('Login successful!');
                    req.session.user = { id: reg, role: password };

                    res.redirect('/menu'); // Redirect to sign-in page

                    // res.send("login success")
                } else {
                    // Passwords do not match, send a response indicating the issue
                    console.log('Incorrect password.');
                    return false
                }
            });
        }
    });
}


// Define a route that renders an EJS template
app.post('/login',async (req, res) => {
    const loginData = req.body;
    const id = req.body.reg;
    const pass = req.body.pass;

    // // Authenticate the user (replace this with your authentication logic)
    // // For example, if authentication is successful:
    // const authenticationResult = await 
    handleLogin(req, res, loginData);

    // console.log(authenticationResult)
    // if (authenticationResult) {
    //     // Authentication successful, set session and render the template
    //     req.session.user = { id: id, role: pass };

    //     res.render('login', { title: 'Register and login' });
    // } else {
    //     // Authentication failed, handle accordingly
        // res.send('login-in failed!');
    // }

});
// Define a route that renders an EJS template
app.get('/registra', (req, res) => {
    if (req.session.user ) {

        if(req.session.user.id === "registra2023"){

        // User is signed in
        // res.send(`Welcome, ${req.session.user.username}!`);
        res.render('registra', { title: 'Registra Dashbord ' });
        }
        else{
            res.redirect('/menu'); // Redirect to sign-in page
        }
    } else {
        // User is not signed in
        res.redirect('/'); // Redirect to sign-in page
    }

});
// Define a route that renders an EJS template
app.get('/finance', (req, res) => {
    if (req.session.user ) {
        if(req.session.user.id === "finance2023"){

            // User is signed in
            // res.send(`Welcome, ${req.session.user.username}!`);
            res.render('finance', { title: 'finance dashbord' });
            }
            else{
                res.redirect('/menu'); // Redirect to sign-in page
            }
       
    } else {
        // User is not signed in
        res.redirect('/'); // Redirect to sign-in page
    }
  
});
// Define a route that renders an EJS template
app.get('/hostel', (req, res) => {
    if (req.session.user) {
        if(req.session.user.id === "hostel2023"){

            // User is signed in
            // res.send(`Welcome, ${req.session.user.username}!`);
            res.render('hostel', { title: 'Registra Dashbord ' });
            }
            else{
                res.redirect('/menu'); // Redirect to sign-in page
            }
    } else {
        // User is not signed in
        res.redirect('/'); // Redirect to sign-in page
    }
   
});
// Define a route that renders an EJS template
app.get('/library', (req, res) => {
    const value =req.session.user 
    console.log(value)
    if (value && value !== undefined && value !== null) {
        if(req.session.user.id === "library2023"){

            // User is signed in
            // res.send(`Welcome, ${req.session.user.username}!`);
            res.render('library', { title: 'library Dashbord ' });
            }
            else{
                res.redirect('/menu'); // Redirect to sign-in page
            }
    } else {
        // User is not signed in
        res.redirect('/'); // Redirect to sign-in page
    }
  
});
// Define a route that renders an EJS template
app.get('/itdept', (req, res) => {
    if (req.session.user) {
        if(req.session.user.id === "itdept2023"){

            // User is signed in
            // res.send(`Welcome, ${req.session.user.username}!`);
            res.render('itchair', { title: 'Chair It Dashbord' ,
                               result: `ACTIVATE YOUR STUDENTS `});
            }
            else{
                res.redirect('/menu'); // Redirect to sign-in page
            }
      
    } else {
        // User is not signed in
        res.redirect('/'); // Redirect to sign-in page
    }

});
// Define a route that renders an EJS template
app.get('/student', async (req, res) => {
   
   
    if (req.session.user) {
        const x = req.session.user.id;
     // Check if the email already exists in the database
     connection.query('SELECT * FROM itdeptissues ', (queryError, results, fields) => {
        if (queryError) throw queryError;

        if (results.length > 0) {
     results.forEach(resullt => {
    const decryptedObject = decryptToObject(resullt.encryptedData, secretKey, resullt.iv);
    
y = decryptedObject['Reg no']
    if( y === x){
        console.log('Decrypted:', y);

        res.render('students', { 
            title: `students ${y} Dashbord`,                       
            result: x
    
    });
    }else{

        console.log(x)
            // Email already exists, send a response indicating the duplicate
            // console.log('reg already exists in the database.');
            //  res.send('reg already exists in the database.');
    }

})
           

        } else {

        }})
    
    } else {
        // User is not signed in
        res.redirect('/'); // Redirect to sign-in page
    }

  
});
// Define a route that renders an EJS template
app.get('/chem', (req, res) => {

    if (req.session.user) {
        if(req.session.user.id === "chemdept2023"){

            res.render('chemchair', { title: 'Chair chemistry Dashbord',
                                      result :` Clear your student`
        });
            }
            else{
                res.redirect('/menu'); // Redirect to sign-in page
            }
     

    } else {
        // User is not signed in
        res.redirect('/'); // Redirect to sign-in page
    }
  
});

// Function to handle database connection, table creation, and data insertion
function handleDatabase(req, res, data) {

          // Check if the table exists; if not, create it
        connection.query("SHOW TABLES LIKE 'register'", (error, results, fields) => {
            if (error) throw error;

            if (results.length === 0) {
                // Table does not exist, so create it
                const createTableQuery = `
                    CREATE TABLE register (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        role VARCHAR(255),
                        reg VARCHAR(255),
                        name VARCHAR(255),
                        pass TEXT(255)
                        -- Add other columns as needed
                    )
                `;

                connection.query(createTableQuery, (createError, createResults, createFields) => {
                    if (createError) throw createError;
                    console.log('Table created successfully!');
  // Check if the email already exists in the database
  connection.query('SELECT * FROM register WHERE reg = ?', [data.reg], (queryError, results, fields) => {
    if (queryError) throw queryError;

    if (results.length > 0) {

   
        // Email already exists, send a response indicating the duplicate
        console.log('reg already exists in the database.');
        res.send('reg already exists in the database.');
    } else {

// Hash the password before storing it
bcrypt.hash(data.pass, 10, (hashError, hashedPassword) => {
    if (hashError) throw hashError;

    // Modify the data object to use the hashed password
    const hashedData = {
        ...data,
    pass : hashedPassword
    };
    console.log(hashedData)
    insertData(hashedData);
    res.redirect('/'); // Redirect to sign-in page

});
}})

                    insertData(hashedData);
                });
            } else {
                // Table exists, directly insert data




      // Check if the email already exists in the database
      connection.query('SELECT * FROM register WHERE reg = ?', [data.reg], (queryError, results, fields) => {
        if (queryError) throw queryError;

        if (results.length > 0) {

       
            // Email already exists, send a response indicating the duplicate
            console.log('reg already exists in the database.');
            res.send('reg already exists in the database.');
        } else {

    // Hash the password before storing it
    bcrypt.hash(data.pass, 10, (hashError, hashedPassword) => {
        if (hashError) throw hashError;

        // Modify the data object to use the hashed password
        const hashedData = {
            ...data,
        pass : hashedPassword
        };
        console.log(hashedData)
        insertData(hashedData);
        res.redirect('/'); // Redirect to sign-in page
  
    });
}})



                
              
            }
        });

}

// Function to insert data into the database
function insertData(data) {
    connection.query('INSERT INTO register SET ?', data, (insertError, insertResults, insertFields) => {
        if (insertError) throw insertError;
        console.log('Data inserted successfully!');
       
    });
}
// Function to insert data into the database
function insertData2(data) {
    connection.query('INSERT INTO itdeptissues SET ?', data, (insertError, insertResults, insertFields) => {
        if (insertError) throw insertError;
        console.log('Data inserted successfully!');
       
    });
}// Function to insert data into the database
function insertDatachem(data) {
    connection.query('INSERT INTO chemdeptissues SET ?', data, (insertError, insertResults, insertFields) => {
        if (insertError) throw insertError;
        console.log('Data inserted successfully!');
       
    });
}// Function to insert data into the database
function insertDatahostel(data) {
    connection.query('INSERT INTO hostelissues SET ?', data, (insertError, insertResults, insertFields) => {
        if (insertError) throw insertError;
        console.log('Data inserted successfully!');
       
    });
}
// Function to insert data into the database
function insertDatalibrary(data) {
    connection.query('INSERT INTO libraryissues SET ?', data, (insertError, insertResults, insertFields) => {
        if (insertError) throw insertError;
        console.log('Data inserted successfully!');
       
    });
}

function insertDatafinance(data) {
    connection.query('INSERT INTO libraryissues SET ?', data, (insertError, insertResults, insertFields) => {
        if (insertError) throw insertError;
        console.log('Data inserted successfully!');
       
    });
}


// Define a route that renders an EJS template
app.post('/register', (req, res) => {

console.log(req.body)
const data = req.body;
   
    // Call the function to handle database operations
    handleDatabase(req, res, data);
});

// Define a route that renders an EJS template
app.get('/menu', (req, res) => {
  res.render('menu', { title: 'select your Dashbord' });
  
    });




    // const crypto = require('crypto');

    // Encryption
    function encryptObject(obj, secretKey) {
      const jsonString = JSON.stringify(obj);
      const iv = crypto.randomBytes(16); // Initialization vector
    // const iv = cab9beda3d2dd1f04f0e6b236417df19
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
      let encrypted = cipher.update(jsonString, 'utf-8', 'hex');
      encrypted += cipher.final('hex');
      return { iv: iv.toString('hex'), encryptedData: encrypted };
    }
    
    // Decryption
    function decryptToObject(encryptedData, secretKey, iv) {
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), Buffer.from(iv, 'hex'));
      let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
      decrypted += decipher.final('utf-8');
      return JSON.parse(decrypted);
    }
    
    // Example
    // const secretKeEy = 'a_secret_key'; // Should be kept secure
    const dataObject = { message: 'I love you', count: 42 };
    
    const encryptedResult = encryptObject(dataObject, secretKey);
    console.log('Encrypted:', encryptedResult);
    
    const decryptedObject = decryptToObject(encryptedResult.encryptedData, secretKey, encryptedResult.iv);
    console.log('Decrypted:', decryptedObject);
    




///POST SQL QUERRIES
// Define a route that renders an EJS template
app.post('/itdept', (req, res) => {
    if (req.session.user) {
        if(req.session.user.id === "itdept2023"){


            const qq = `
            SELECT
            \`Reg no\`,
            \`probability and statistic exam\`,
            \`probability and statistic cat\`,
            \`probability and statistic assignment\`,
            \`Mobile application exam\`,
            \`Mobile application cat\`,
            \`Mobile application assignment\`,
            \`Cloud computing exam\`,
            \`Cloud computing cat\`,
            \`Cloud computing assignment\`
            FROM
            \`it department\`
            WHERE
            \`probability and statistic exam\` = 0 OR
            \`probability and statistic cat\` = 0 OR
            \`probability and statistic assignment\` = 0 OR
            \`Mobile application exam\` = 0 OR
            \`Mobile application cat\` = 0 OR
            \`Mobile application assignment\` = 0 OR
            \`Cloud computing exam\` = 0 OR
            \`Cloud computing cat\` = 0 OR
            \`Cloud computing assignment\` = 0;
            `;

   // Check if the email already exists in the database
   connection.query(qq, (queryError, results, fields) => {
    if (queryError) throw queryError;

    if (results.length > 0) {
results.forEach((resul) => {

const encryptedResult2 = encryptObject(resul, secretKey);
console.log('Encrypted:', encryptedResult2);


// Check if the table exists; if not, create it
connection.query("SHOW TABLES LIKE 'itdeptissues'", (error, results, fields) => {
    if (error) throw error;

    if (results.length === 0) {
        // Table does not exist, so create it
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS itdeptissues ( 
                iv VARCHAR(255),
                encryptedData VARCHAR(2550)                          
            )
        `;

        connection.query(createTableQuery, (createError, createResults, createFields) => {
            if (createError) throw createError;
            console.log('Table created successfully!');
            insertData2(encryptedResult2);
        });
    } else {
        // Table exists, directly insert data
        // console.log(hashedData)
        insertData2(encryptedResult2);
        // res.redirect('/'); // Redirect to sign-in page
    }
});

})


        // Email already exists, send a response indicating the duplicate
        console.log(results);
        console.log('reg already exists in the database.');
        // res.send('reg already exists in the database.');
    } else {
        console.log(results);

        if (results.length == 0) {
            res.render('itchair', { title: 'Chair It Dashbord' ,
                                  result: `ALL YOUR STUDENTS ARE APPROVED`
    
    });
    
        }else{
    
            // User is signed in
    // res.send(`Welcome, ${req.session.user.username}!`);
    res.render('itchair', { title: 'Chair It Dashbord' ,
                            result: results
    
    });
        }



    }})

   

}
else{
    res.redirect('/menu'); // Redirect to sign-in page
           }

    } else {
        // User is not signed in
        res.redirect('/'); // Redirect to sign-in page
    }


})





app.post('/chemdept', (req, res) => {
    if (req.session.user) {
        if(req.session.user.id === "chemdept2023"){


            // const qq = ` SELECT * FROM \` \`;      `
          
            const qq = `
            SELECT
            \`Reg no\`,
            \`probability and statistic exam\`,
            \`probability and statistic cat\`,
            \`probability and statistic assignment\`,
            \`Mobile application exam\`,
            \`Mobile application cat\`,
            \`Mobile application assignment\`,
            \`Cloud computing exam\`,
            \`Cloud computing cat\`,
            \`Cloud computing assignment\`
            FROM
            \`chemistry department\`
            WHERE
            \`probability and statistic exam\` = 0 OR
            \`probability and statistic cat\` = 0 OR
            \`probability and statistic assignment\` = 0 OR
            \`Mobile application exam\` = 0 OR
            \`Mobile application cat\` = 0 OR
            \`Mobile application assignment\` = 0 OR
            \`Cloud computing exam\` = 0 OR
            \`Cloud computing cat\` = 0 OR
            \`Cloud computing assignment\` = 0;
            `;
          

   // Check if the email already exists in the database
   connection.query(qq, (queryError, results, fields) => {
    if (queryError) throw queryError;

    if (results.length > 0) {
results.forEach((resul) => {

const encryptedResult2 = encryptObject(resul, secretKey);
console.log('Encrypted:', encryptedResult2);


// Check if the table exists; if not, create it
connection.query("SHOW TABLES LIKE 'chemdeptissues'", (error, results, fields) => {
    if (error) throw error;

    if (results.length === 0) {
        // Table does not exist, so create it
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS chemdeptissues ( 
                iv VARCHAR(255),
                encryptedData VARCHAR(2550)                          
            )
        `;

        connection.query(createTableQuery, (createError, createResults, createFields) => {
            if (createError) throw createError;
            console.log('Table created successfully!');
            insertDatachem(encryptedResult2);
        });
    } else {
        // Table exists, directly insert data
        // console.log(hashedData)
        insertDatachem(encryptedResult2);
        // res.redirect('/'); // Redirect to sign-in page
    }
});

})


        // Email already exists, send a response indicating the duplicate
        console.log(results);
        if (results.length === 0) {
            res.render('chem', { title: 'chair chemistry Dashbord' ,
                                  result: `ALL YOUR STUDENTS ARE APPROVED`
    
    });
    
        }else{
            // Extract registration numbers

            const result =[]


    for (let i = 0; i < results.length; i++) {

        const regNumbers = results.map(student => student['Reg no']);

        result.push(regNumbers);
        // console.log(numbers[i]);
      }

     
            // User is signed in
    // res.send(`Welcome, ${req.session.user.username}!`);
    res.render('chemchair', { title: 'finance Dashbord uncleared students below' ,
                            result: result
    
    });
        }
        // console.log('reg already exists in the database.');
        // res.send('reg already exists in the database.');
    } else {
        console.log(results);
  
    }})



}
else{
    res.redirect('/menu'); // Redirect to sign-in page
           }

    } else {
        // User is not signed in
        res.redirect('/'); // Redirect to sign-in page
    }


})











app.post('/library', (req, res) => {
    if (req.session.user) {
        if(req.session.user.id === "library2023"){


            // const qq = ` SELECT * FROM \` \`;      `
            const qq = ` SELECT * FROM \`library \`;      `
          

   // Check if the email already exists in the database
   connection.query(qq, (queryError, results, fields) => {
    if (queryError) throw queryError;

    if (results.length > 0) {
results.forEach((resul) => {

const encryptedResult2 = encryptObject(resul, secretKey);
console.log('Encrypted:', encryptedResult2);


// Check if the table exists; if not, create it
connection.query("SHOW TABLES LIKE 'libraryissues'", (error, results, fields) => {
    if (error) throw error;

    if (results.length === 0) {
        // Table does not exist, so create it
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS libraryissues ( 
                iv VARCHAR(255),
                encryptedData VARCHAR(2550)                          
            )
        `;

        connection.query(createTableQuery, (createError, createResults, createFields) => {
            if (createError) throw createError;
            console.log('Table created successfully!');
            insertDatalibrary(encryptedResult2);
        });
    } else {
        // Table exists, directly insert data
        // console.log(hashedData)
        insertDatalibrary(encryptedResult2);
        // res.redirect('/'); // Redirect to sign-in page
    }
});

})


        // Email already exists, send a response indicating the duplicate
        console.log(results);
        console.log('reg already exists in the database.');
        // res.send('reg already exists in the database.');
    } else {
        console.log(results);
    }})


// User is signed in
// res.send(`Welcome, ${req.session.user.username}!`);
res.render('chemchair', { title: 'Activated Chair It Dashbord' });
}
else{
    res.redirect('/menu'); // Redirect to sign-in page
           }

    } else {
        // User is not signed in
        res.redirect('/'); // Redirect to sign-in page
    }


})














app.post('/sports', (req, res) => {
    if (req.session.user) {
        if(req.session.user.id === "sports2023"){


            // const qq = ` SELECT * FROM \` \`;      `
            const qq = ` SELECT * FROM \`sports \`;      `
          

   // Check if the email already exists in the database
   connection.query(qq, (queryError, results, fields) => {
    if (queryError) throw queryError;

    if (results.length > 0) {
results.forEach((resul) => {

const encryptedResult2 = encryptObject(resul, secretKey);
console.log('Encrypted:', encryptedResult2);


// Check if the table exists; if not, create it
connection.query("SHOW TABLES LIKE 'sportsissues'", (error, results, fields) => {
    if (error) throw error;

    if (results.length === 0) {
        // Table does not exist, so create it
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS sportsissues ( 
                iv VARCHAR(255),
                encryptedData VARCHAR(2550)                          
            )
        `;

        connection.query(createTableQuery, (createError, createResults, createFields) => {
            if (createError) throw createError;
            console.log('Table created successfully!');
            insertDatasport(encryptedResult2);
        });
    } else {
        // Table exists, directly insert data
        // console.log(hashedData)
        insertDatasport(encryptedResult2);
        // res.redirect('/'); // Redirect to sign-in page
    }
});

})


        // Email already exists, send a response indicating the duplicate
        console.log(results);
        console.log('reg already exists in the database.');
        // res.send('reg already exists in the database.');
    } else {
        console.log(results);
    }})


// User is signed in
// res.send(`Welcome, ${req.session.user.username}!`);
res.render('chemchair', { title: 'Activated Chair It Dashbord' });
}
else{
    res.redirect('/menu'); // Redirect to sign-in page
           }

    } else {
        // User is not signed in
        res.redirect('/'); // Redirect to sign-in page
    }


})












app.post('/finance', (req, res) => {
    if (req.session.user) {
        if(req.session.user.id === "finance2023"){


            // const qq = ` SELECT * FROM \` \`;      `
            const qq = `SELECT * FROM finance WHERE balance > 1; `
          

   // Check if the email already exists in the database
   connection.query(qq, (queryError, results, fields) => {
    if (queryError) throw queryError;

    if (results.length > 0) {
results.forEach((resul) => {

const encryptedResult2 = encryptObject(resul, secretKey);
console.log('Encrypted:', encryptedResult2);


// Check if the table exists; if not, create it
connection.query("SHOW TABLES LIKE 'financeissues'", (error, results, fields) => {
    if (error) throw error;

    if (results.length === 0) {
        // Table does not exist, so create it
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS financeissues ( 
                iv VARCHAR(255),
                encryptedData VARCHAR(2550)                          
            )
        `;

        connection.query(createTableQuery, (createError, createResults, createFields) => {
            if (createError) throw createError;
            console.log('Table created successfully!');
            insertDatafinance(encryptedResult2);
        });
    } else {
        // Table exists, directly insert data
        // console.log(hashedData)
        insertDatafinance(encryptedResult2);
        // res.redirect('/'); // Redirect to sign-in page
    }
});

})


        // Email already exists, send a response indicating the duplicate
        console.log(results);
        if (results.length === 0) {
            res.render('finance', { title: 'finance Dashbord' ,
                                  result: `ALL YOUR STUDENTS ARE APPROVED`
    
    });
    
        }else{
            // Extract registration numbers

            const result =[]
results.forEach( resssult =>{

     result.push(resssult.map(student => student['Reg no']));
}) 


     
            // User is signed in
    // res.send(`Welcome, ${req.session.user.username}!`);
    res.render('chemchair', { title: 'finance Dashbord uncleared students below' ,
                            result: result
    
    });
        }
    } else {
        console.log(results);
    }})


// User is signed in
// res.send(`Welcome, ${req.session.user.username}!`);
// res.render('finance', { title: 'Activated Chair It Dashbord' });
}
else{
    res.redirect('/menu'); // Redirect to sign-in page
           }

    } else {
        // User is not signed in
        res.redirect('/'); // Redirect to sign-in page
    }


})













//post req for hostels done

app.post('/hostel', (req, res) => {
    if (req.session.user) {
        if(req.session.user.id === "hostel2023"){


            // const qq = ` SELECT * FROM \` \`;      `
            const qq = ` SELECT * FROM \`hostel \`;      `
          

   // Check if the email already exists in the database
   connection.query(qq, (queryError, results, fields) => {
    if (queryError) throw queryError;

    if (results.length > 0) {
results.forEach((resul) => {

const encryptedResult2 = encryptObject(resul, secretKey);
console.log('Encrypted:', encryptedResult2);


// Check if the table exists; if not, create it
connection.query("SHOW TABLES LIKE 'hostelissues'", (error, results, fields) => {
    if (error) throw error;

    if (results.length === 0) {
        // Table does not exist, so create it
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS hostelissues ( 
                iv VARCHAR(255),
                encryptedData VARCHAR(2550)                          
            )
        `;

        connection.query(createTableQuery, (createError, createResults, createFields) => {
            if (createError) throw createError;
            console.log('Table created successfully!');
            insertDatahostel(encryptedResult2);
        });
    } else {
        // Table exists, directly insert data
        // console.log(hashedData)
        insertDatahostel(encryptedResult2);
        // res.redirect('/'); // Redirect to sign-in page
    }
});

})


        // Email already exists, send a response indicating the duplicate
        console.log(results);
        console.log('reg already exists in the database.');
        // res.send('reg already exists in the database.');
    } else {
        console.log(results);
    }})


// User is signed in
// res.send(`Welcome, ${req.session.user.username}!`);
res.render('hostel', { title: 'Activated Hostel It Dashbord' });
}
else{
    res.redirect('/menu'); // Redirect to sign-in page
           }

    } else {
        // User is not signed in
        res.redirect('/'); // Redirect to sign-in page
    }


})



























// Function to generate a key pair
async function generateKeyPair() {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
        hash: { name: "SHA-256" },
      },
      true,
      ["sign", "verify"]
    );
    return keyPair;
  }
  
  // Function to sign a message
  async function signMessage(privateKey, message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const signature = await crypto.subtle.sign(
      { name: "RSASSA-PKCS1-v1_5" },
      privateKey,
      data
    );
    return signature;
  }
  
  // Function to create an approval object with a digital signature
  async function createApproval(privateKey, message) {
    const signature = await signMessage(privateKey, message);
  
    // Create an approval object with the message and signature
    const approval = {
      message: message,
      signature: new Uint8Array(signature),
    };
  
    return approval;
  }
  
  // Function to verify an approval object
  async function verifyApproval(publicKey, approval) {
    const encoder = new TextEncoder();
    const data = encoder.encode(approval.message);
    const isVerified = await crypto.subtle.verify(
      { name: "RSASSA-PKCS1-v1_5" },
      publicKey,
      approval.signature,
      data
    );
    return isVerified;
  }
  
  // Example usage:
  (async () => {
    // Generate key pair
    const keyPair = await generateKeyPair();
  
    // Extract public and private keys
    const publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
    const privateKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  
    // Create an approval object
    const message = "Approval for a task";
    const approval = await createApproval(keyPair.privateKey, message);
  
    // Log and display the approval object
    console.log("Approval:", approval);
  
    // Verify the approval
    const isVerified = await verifyApproval(keyPair.publicKey, approval);
    console.log("Approval verification result:", isVerified);
  })();
  
  





// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
