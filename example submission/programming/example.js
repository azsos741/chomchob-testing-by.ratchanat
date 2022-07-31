// solution

var express = require('express')
var cors = require('cors')
var app = express()

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

app.use(cors())

const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'mytest'
  });
  

  app.get('/wallet', function (req, res, next) {
    connection.query(
        'SELECT id_user,user_name,amount,exchange_name FROM wallet INNER JOIN exchange on wallet.id_exchange = exchange.id INNER JOIN user on wallet.id_user = user.user_id',
        function(err, result, fields) {
        if(result){
            res.json({result})
        }
    });
});


app.post('/wallet/addcoin', jsonParser , (req, res, next) => {
    connection.query(
        'INSERT INTO exchange(exchange_name, rate) VALUES (?,?)',
        [req.body.exchange_name,req.body.rate],
        function(err, results) {
            res.json(results);
            if(err){
                res.json({status: "error",message:"Cant add a new coin"});
            }
    });
});

app.put('/wallet/change/:id', jsonParser , (req, res, next) => {
    const iduser = req.params.id;
    connection.query(
        'SELECT * FROM user WHERE user_id=?', [iduser] ,
        function(err, results) {
            if(results == 0){
                return res.json({status:"error",message:"Not found a user"});
            }
            connection.query(
                'SELECT * FROM exchange WHERE id=?', [req.body.id_exchange],
                function(err, results) {
                    if(results == 0){
                        return res.json({status: "error",message:"Not found id of this coin"}); 
                    }
                    connection.query(
                        'UPDATE wallet SET amount=? , id_exchange=? WHERE id_user=?',
                        [req.body.amount, req.body.id_exchange , iduser],
                        function(err, results) {
                            res.json(results);
                            if(err){
                                res.json({status: "error",message:"Cant change a new data"});
                            }
                    });
                });
        });
});

app.put('/wallet/exchange/:id', jsonParser , (req, res, next) => {
    const iduser = req.params.id;
    connection.query(
        'SELECT * FROM wallet INNER JOIN exchange on wallet.id_exchange = exchange.id INNER JOIN user on wallet.id_user = user.user_id WHERE id_user = ?', [iduser] ,
        function(err, results) {
            if(results == 0){
                return res.json({status:"error",message:"Not found a user"})
            }
            for(let i = 0; i < results.length; i++){
                const namecoin = results[i].exchange_name;
                const id_coin =  results[i].id_exchange;
                const rate = results[i].rate;
                const amount = results[i].amount;
                const new_id_exchange = req.body.new_id_exchange;
                if(new_id_exchange == id_coin){
                    return res.json({status: "error",message:"Cant exchange bacause this is the same coin"});
                }
                connection.query(
                    'SELECT * FROM exchange WHERE id = ?',[new_id_exchange],
                    function(err , results){
                            if(results == 0){
                                return res.json({status: "error",message:"Not found id of this coin"});
                            }
                            for(let u = 0; u < results.length; u++){
                                const new_namecoin = results[u].exchange_name;
                                const new_id_coin =  results[u].id;
                                const new_rate =  results[u].rate;
                                //[(มูลค่าเหรียญเดิม*จำนวนของเหรียญเดิม)/มูลค่าเหรียญที่จะเปลี่ยน]
                                const new_amount_exchange = (rate*amount)/new_rate;
                                if(amount == 0){
                                    return res.json({status: "error",message:"You dont have a wallet for exchange"});
                                }
                                connection.query(
                                    'UPDATE wallet SET amount=? , id_exchange=? WHERE id_user=?',
                                    [new_amount_exchange, new_id_coin , iduser],
                                        function(err, results) {
                                            if(results){
                                                console.log("You exchange from",namecoin,"Amount",amount,"to",new_namecoin,"Amount",new_amount_exchange);
                                                res.json(results);
                                            }else{
                                                res.json({status: "error",message:"Cant update a new data"});
                                            }
                                        });  
                            } 
                    });
            }
        });
});

app.put('/wallet/transfer/:id', jsonParser , (req, res, next) => {
    const iduser = req.params.id;
    connection.query(
        'SELECT * FROM wallet INNER JOIN exchange on wallet.id_exchange = exchange.id INNER JOIN user on wallet.id_user = user.user_id WHERE id_user = ?', [iduser] ,
        function(err, results) {
            if(results == 0){
                return res.json({status: "error",message:"Not found a user",iduser})
            }
            for(let i = 0; i < results.length; i++){
                const id_user = results[i].id_user;
                const namecoin = results[i].exchange_name;
                const id_coin =  results[i].id_exchange;
                const amount = results[i].amount;
                const new_transfer_iduser = req.body.new_transfer_iduser;
                if(id_user == new_transfer_iduser){
                    return res.json({status: "error",message:"Cant transfer bacause this is the same person"});
                }
                connection.query(
                    'SELECT * FROM wallet INNER JOIN exchange on wallet.id_exchange = exchange.id INNER JOIN user on wallet.id_user = user.user_id WHERE id_user = ?', [new_transfer_iduser] ,
                    function(err , results){
                        if(results == 0){
                            return res.json({status: "error",message:"Not found a user for transfer"});
                        }
                        for(let u = 0; u < results.length; u++){
                            const new_user_amount = results[u].amount;
                            const give_amount = req.body.give_amount;
                            const tranfser_odduser = amount - give_amount;
                            const tranfser_newuser = new_user_amount + give_amount;
                            if(tranfser_odduser < 0){ 
                                  return  res.json({status: "error",message:"You dont have enough coin"});
                            }
                            connection.query(
                                'UPDATE wallet SET amount=? , id_exchange=? WHERE id_user=?',
                                [tranfser_newuser, id_coin , new_transfer_iduser],
                                function(err, results) {
                                    console.log("You have transferred from id:",id_user,"Coin:",namecoin,"Total Amount:",amount,"Give Amount:",give_amount,"to id:",new_transfer_iduser,"// id",new_transfer_iduser, "Coin:",namecoin,"Total:",tranfser_newuser);
                                    connection.query(
                                        'UPDATE wallet SET amount=? , id_exchange=? WHERE id_user=?',
                                        [tranfser_odduser, id_coin , id_user],
                                        function(err, results) {
                                            if(results){
                                                console.log("You are id:",id_user,"Your Wallet:",tranfser_odduser,namecoin);
                                                res.json(results);
                                            }else{
                                                res.json({status: "error",message:"Cant update a new data"});
                                            }
                                        });
                                });
                        }
                });
            }
        });
});

app.listen(3006, function () {
  console.log('CORS-enabled web server listening on port 3006');
});






