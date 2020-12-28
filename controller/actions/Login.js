const dbconnection = require('../../database/mysqlConnection');
const jwt = require('jsonwebtoken');

module.exports.Login_Validation = async (req,res)=>{
    console.log(req.body);
    const user_id = req.body.user_id;
    const password = req.body.password; 
    dbconnection.query(`SELECT password, user_role, doc.doctor_name as user_name,user_id from wound.users u
    left outer join wound.doctor doc on doc.doctor_id = u.user_id
    where doc.login_id =?`,[user_id],  function (err, data, field){
        if(err){
            res.json({ success : false , msg: 'error occured'});
            return;
        } else{
           if(data.length === 0){
            res.status(401)
            res.json({ success : false , msg: 'incorrect user_name'});
                   return;
           }
        if(data){
            if(data[0].password == password){
                res.status(200)
                const token = jwt.sign({
                    id: user_id,
                },'token_key');
                res.json({ success : true , msg: 'login',token,user_name: data[0].user_name , user_id: data[0].user_id  });
            return;
            }
            else{
                res.status(404)
                res.json({ success : false , msg: 'password in correct'});
                return;
            }

        }
    }
    } )    
    return; 
   
}

