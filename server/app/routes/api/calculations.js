const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const authAdmin = require('../../middleware/authAdmin');

// Models
const Calculation = require('../../models/Calculation');
const DataField = require('../../models/DataField');
const UserData = require('../../models/UserData');
const Path = require('../../models/Path');
const University = require('../../models/University');
const modelName = 'calculation';

// Utilities
const allowedTypes = require('../../utils/allowedTypes');
const types = allowedTypes.types

// Errors
const calcMessages = require('../../messages/calculations');
const dataFieldMessages = require('../../messages/data-fields');
const pathsMessages = require('../../messages/paths');
const uniMessages = require('../../messages/universities');


const { CalcNotExist, SuggestionRequired,
    StoredCalcNotExist, CalcSuccessDelete } = calcMessages;
const { DataFieldNotExist } = dataFieldMessages;
const { PathNotExist } = pathsMessages;
const { UniNotExist } = uniMessages;

import storedCalcs from '../../utils/calcs/calcsIndex';

// @route   GET api/calculations/storedCalcs
// @desc    Get stored calculations
// @access  Private
router.get('/storedCalcs', auth, (req, res, next) => {
    return res.send(storedCalcs);
})

// @route   GET api/calculations/:pathIds
// @desc    Get calcs by pathId
// @access  Public
router.get('/:pathIds', (req, res, next) => {
    const pathIds = JSON.parse(req.params.pathIds)

    Calculation.find({ $or: [{ path: { $in: pathIds}}, { path: undefined }]})
            .then(initCalcs => {
                let calcs = [...initCalcs.map(calc => {
                    if(calc.calc) {
                        let storCalc = storedCalcs.find(storCalc => 
                            calc.calc === storCalc.id) 

                        if(storCalc) {
                            calc.calc = storCalc
                        }
                    }

                    return calc
                })]

                return res.send(calcs);
            })
            .catch(next)
})

// @route   GET api/calculations
// @desc    Get all calculations
// @access  Private
router.get('/', auth, (req, res, next) => { 
    Calculation.find()
               .then(calc => res.send(calc))
               .catch(next);
})
 
// @route   POST api/calculations
// @desc    Create new calculation
// @access  Admin
router.post('/', [auth, authAdmin], (req, res, next) => {
    const { 
        name, 
        pathId,
        uniId,
        isSuggestion,
        storedCalcId
    } = req.body;

    res.locals.model = modelName;

    Path.findById(pathId)
        .then(path => {
            // Check that assigned path exists
            if(!path && pathId) 
                return res.status(PathNotExist.status).send(PathNotExist.msg)

            University.findById(uniId)
                .then(uni => {
                    if(!uni && uniId)
                        return res.status(UniNotExist.status)
                                    .send(UniNotExist.msg)
            
                    const storedCalc = storedCalcs.find(calc => calc.id == storedCalcId)

                    // Check that assigned calc is a stored procedure
                    if(!storedCalc)
                        return res.status(StoredCalcNotExist.status)
                                    .send(StoredCalcNotExist.msg)

                    // Create new calculation
                    const newCalc = new Calculation({
                        name: name,
                        path: pathId,
                        university: uniId,
                        outputField: isSuggestion,
                        calc: storedCalcId
                    })

                    newCalc.save()
                        .then(calc => {
                            const dataObj = types.dataTypes.find(type =>
                                type.value === 'num')

                            const newOutputField = new DataField({
                                name: name,
                                path: pathId,
                                university: uniId,
                                dataType: 'num',
                                fieldType: 'textbox',
                                validators: {
                                    validType: dataObj.defVal
                                },
                                calcOutput: calc._id
                            })

                            newOutputField.save()
                                .then(() => {
                                    return res.send(calc)
                                })         
                            .catch(next); // Save outputField
                    })
                    .catch(next); // Save calc
                })
                .catch(next); // Find parent university
        })
        .catch(next) // Find path
})

// @route   PUT api/calculations/:id
// @desc    Update calculation
// @access  Admin
router.put('/:id', [auth, authAdmin], (req, res, next) => {
    const { 
        name, 
        isSuggestion,
        storedCalcId
    } = req.body;

    res.locals.model = modelName;

    const calcId = req.params.id;

    Calculation.findById(calcId)
            .then(calc => {
            // Check that calculation exists
                if(!calc) 
                    return res.status(CalcNotExist.status)
                              .send(CalcNotExist.msg)
                         
                // Check that assigned calc is a stored procedure
                if(!storedCalcs.find(calc => calc.id === storedCalcId))
                    return res.status(StoredCalcNotExist.status)
                            .then(StoredCalcNotExist.msg)
                
                calc.name = name;
                calc.isSuggestion = isSuggestion;
                calc.calc = storedCalcId;

                calc.save()
                    .then(calc => {
                        return res.send(calc)              
                    })
                    .catch(next); // Save calc    
            })
            .catch(next); // Find data group
});


// @route   PUT api/calculations/:id/assignRole
// @desc    Assign role to calculation
// @access  Admin
router.put('/:id/assignRole', [auth, authAdmin], (req, res, next) => {
    const role = req.body.role
    const calcId = req.params.id

    DataField.findOne({ outputField: calcId })
               .then(field => {
                   if(!field && calcId)
                        return res.status(CalcNotExist.status)
                                  .send(CalcNotExist.msg)

                   field.role = role

                   field.save()
                       .then(field => {  
    // Find if there is field with the same role and unassign it
                            field.find({ $and: 
                            [{_id: { $ne: field._id}}, 
                                {role: { $ne: undefined} }]})
                            .then(prevField => {
                                if(prevField) {
                                    prevField.role = undefined
                                    prevField.save()
                                        .then(() => {
                                            const returnArr = [
                                                prevField,
                                                field
                                            ]
                                            return res.send(returnArr)
                                        })
                                        .catch(next); // Save prev calc
                                }
                                
                                return res.send(calc)
                            })
                            .catch(next); // Find calc
                       })
                       .catch(next); // Save clac
               })
               .catch(next); // Find calc
})


// @route   DELETE api/calculations/:id
// @desc    Delete calculation
// @access  Admin
router.delete('/:id', [auth, authAdmin], (req, res, next) => {

    const calcId = req.params.id;

    Calculation.findById(calcId)
              .then(calc => {
                if(!calc) 
                    return res.status(CalcNotExist.status)
                              .send(CalcNotExist.msg);

                // TODO: Do not allow deleting calc or fields if use in calc                            
                calc.remove()
                     .then(() => {
                        return res.send(CalcSuccessDelete.msg)
                     })
                     .catch(next);
            })
            .catch(next);
})


module.exports = router;
