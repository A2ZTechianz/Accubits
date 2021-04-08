const jwt = require("jsonwebtoken");
const connection = require('../../config/config');
const config = require('../../config/system_config.json');
const Joi = require("joi");
const validateRequest = require('../helper/validate_request');
const path = require('path');
const fs = require('fs');
let mail = require('../helper/mail');

const csv = require('csvtojson')
module.exports.signupSchema = function (req, res, next) {
    console.log('hai1');
    const schema = Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().required(),
        age: Joi.number().required(),
    });
    validateRequest(req, res, next, schema);

}

module.exports.signup = function (req, res) {

    try {
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
                    message: result[0][0]['msg']
                })

            } else {
                res.status(500).json({
                    status: false,
                    message: err
                })
            }

        })
    } catch (e) {
        res.status(500).json({

            status: false,
            message: e
        })
    }
}



module.exports.newsletter = function (req, res) {

    try {
        mailQueue();
        res.status(200).json({

            status: true,
            message: 'mail starts trigger'
        })
    } catch (e) {
        res.status(500).json({

            status: false,
            message: e
        })
    }



}


function mailQueue() {


    try {

        const errArray = [];
        // dummy file is uploaded in the below path
        let file_url = path.join(__dirname, '../../news.csv');;

        //  function will convert the file data into json data 

        let file = csv()
            .fromFile(file_url)
            .then((arrayData) => {



                arrayData.forEach(emp => {

                    let record = 0;

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



                    // if record is 1 then it will call the failure response else success
                    if (record == 1) {
                        errDetails(errArray);
                    } else {
                        successDetails(emp)
                    }





                });






            })













    } catch (e) {
        console.log(e, 'e');
    }
}


function errDetails(err_obj) {

    try {
        let sql_temp_str = 'call usp_store_log(?)';
        let temp_params = [
            JSON.stringify(err_obj),
            null,
            null,
            'FAILURE'
        ]
        connection.query(sql_temp_str, [temp_params], function (jerr, jresult) {

            if (jerr) {

                console.log(jerr);
            }



        });

    } catch (e) {
        console.log(e);
    }



}

function successDetails(emp) {

    try {
        // console.log(emp, "sucess");

        let sql_temp_str = 'call usp_store_log(?)';
        let temp_params = [

            JSON.stringify(emp),
            emp.email,
            emp.name,
            'SUCCESS'
        ]
        connection.query(sql_temp_str, [temp_params], function (jerr, jresult) {

            //console.log(jresult, jerr, 'jresult');
            if (!jerr) {
                let name = jresult[0][0]['user_name'];
                let sendEmail = mail.send_mail(emp.email, emp.name, emp.content, '');

            }



        });
    } catch (e) {
        console.log(e);
    }



}