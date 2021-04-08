const jwt = require("jsonwebtoken");
const connection = require('../../config/config');
const config = require('../../config/system_config.json');
const Joi = require("joi");
const validateRequest = require('../helper/validate_request');
const path = require('path');
const fs = require('fs');

const csv = require('csvtojson')
module.exports.signupSchema = function (req, res, next) {
    console.log('hai1');
    const schema = Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.number().required(),
        email: Joi.string().required(),
        age: Joi.number().required(),
    });
    validateRequest(req, res, next, schema);

}

module.exports.signup = function (req, res) {

    let str_sql = 'call usp_user_signup(?)';
    let params = [
        req.body.firstname,
        req.body.lastname,
        req.body.email,
        req.body.age
    ]

    connection.query(str_sql, [params], function (err, result) {
        if (!err) {

            res.status(200).json({
                status: true,
                message: 'user added'
            })

        } else {
            res.status(500).json({
                status: false,
                message: err
            })
        }

    })
}



module.exports.newsletter = function (req, res) {

    mailQueue();
    res.status(200).json({

        status: true,
        message: 'mail starts trigger'
    })


}


function mailQueue() {


    try {

        console.log('mail');

        // dummy file is uploaded in the below path
        let file_url = path.join(__dirname, '../../news.csv');;

        //  function will convert the file into json data 
        const errArray = [];
        let file = csv()
            .fromFile(file_url)
            .then((arrayData) => {



                arrayData.forEach(emp => {

                    let record = 0;
                    let temp_params = [

                        emp['email'] //email



                    ];



                    // check email is exisiting or not
                    if (emp['email'] != '') {} else {
                        // break_counter = 0;
                        record = 1;
                        errArray.push({
                            "err_msg": 'email address is required',
                            "err_filed": 'email'
                        })
                    }
                    //  check content is exisiting or not
                    if (emp['conent'] != '') {} else {
                        record = 1;
                        errArray.push({
                            "err_msg": 'newsletter content is required',
                            "err_filed": 'newsletter content'
                        })
                    }
                    //  check name is exisiting or not
                    if (emp['name'] != '') {} else {
                        record = 1;
                        errArray.push({
                            "err_msg": 'newsletter name is required',
                            "err_filed": 'newsletter name'
                        })
                    }


                    // console.log(emp, 'emp');


                    // throw error and save in db logs for reference


                    if (record == 1) {
                        errDetails(errArray);
                    } else {
                        successDetails(emp)
                    }



                    // connection.query(sql_temp_str, [temp_params], function (jerr, jresult) {
                    //console.log(temp_params, 'temp');


                });



                // })


            })



        // errArray is declared to store the failure response in the db

        // check the sheet is present & record count is greater than 0









    } catch (e) {
        console.log(e, 'e');
    }
}


function errDetails(err_obj) {
    console.log(err_obj, "err_objerr_objerr_objerr_obj");


}

function successDetails(emp) {
    console.log(emp, "sucess");


}