import express from 'express';
const router = express.Router();
import auth from '../../middleware/auth';
import authAdmin from '../../middleware/authAdmin';

// Models
const DataTable = require('../../models/DataTable');

// Errors
import dataTablesMessages from '../../messages/data-tables';
import findClosestDates from '../../utils/datesService';

const {
  DataTableSuccessDelete,
  ThresholdSuccessDelete,
  InvalidThreshType,
  InvalidRejectValue,
  InvalidAcceptValue,
  DataTableNotExist,
  ThresholdNotExist
} = dataTablesMessages;

/**
 * Make validation errors safe (avoid 500 when err.status/msg missing)
 */
const sendValidationError = (res, err) => {
  const status = err?.status || 400;
  const msg = err?.msg || err?.message || 'Validation error';
  return res.status(status).send(msg);
};

const validateDateValues = (closestDates, thresholds, threshType, value) => {
  const v = Number(value);

  if (closestDates.later) {
    const laterThresh = thresholds.find(
      (thresh) => new Date(thresh.date).getTime() === closestDates.later.getTime()
    );

    const laterVal = Number(laterThresh?.value);

    if (
      threshType === 'accept' &&
      laterThresh &&
      !Number.isNaN(laterVal) &&
      laterVal > v
    ) {
      throw InvalidAcceptValue;
    } else if (
      threshType === 'reject' &&
      laterThresh &&
      !Number.isNaN(laterVal) &&
      laterVal < v
    ) {
      throw InvalidRejectValue;
    }
  }

  if (closestDates.earlier) {
    const earlierThresh = thresholds.find(
      (thresh) => new Date(thresh.date).getTime() === closestDates.earlier.getTime()
    );

    const earlierVal = Number(earlierThresh?.value);

    if (
      threshType === 'accept' &&
      earlierThresh &&
      !Number.isNaN(earlierVal) &&
      earlierVal < v
    ) {
      throw InvalidAcceptValue;
    } else if (
      threshType === 'reject' &&
      earlierThresh &&
      !Number.isNaN(earlierVal) &&
      earlierVal > v
    ) {
      throw InvalidRejectValue;
    }
  }
};

// @route   GET api/datatables/:id
// @desc    Get data table by id
// @access  Private
router.get('/:id', auth, (req, res, next) => {
  DataTable.findById(req.params.id)
    .then((table) => {
      if (!table)
        return res.status(DataTableNotExist.status).send(DataTableNotExist.msg);

      return res.send(table);
    })
    .catch(next);
});

// @route   GET api/datatables
// @desc    Get all data tables
// @access  Private
router.get('/', auth, (req, res, next) => {
  DataTable.find()
    .sort({ date_created: -1 })
    .then((table) => res.send(table))
    .catch(next);
});

// @route   POST api/datatables
// @desc    Create new data table
// @access  Admin
router.post('/', [auth, authAdmin], (req, res, next) => {
  const { name, tableUrl } = req.body;

  const newTable = new DataTable({
    name: name,
    url: tableUrl
  });

  newTable
    .save()
    .then((table) => res.send(table))
    .catch(next);
});

// @route   PUT api/datatables/:id/rename
// @desc    Edit data table
// @access  Admin
router.put('/:id', [auth, authAdmin], (req, res, next) => {
  const { name, tableUrl } = req.body;
  const tableId = req.params.id;

  DataTable.findById(tableId)
    .then((table) => {
      if (!table)
        return res.status(DataTableNotExist.status).send(DataTableNotExist.msg);

      table.name = name;
      table.url = tableUrl;
      if (tableUrl) {
        table.enabled = false;
      }

      table
        .save()
        .then((saved) => res.send(saved))
        .catch(next);
    })
    .catch(next);
});

// @route   PUT api/datatables/:id/toggleEnabled
// @desc    Toggle enabled status
// @access  Admin
router.put('/:id/toggleEnabled', [auth, authAdmin], (req, res, next) => {
  const tableId = req.params.id;

  DataTable.findById(tableId)
    .populate('thresholds.field')
    .then((table) => {
      if (!table)
        return res.status(DataTableNotExist.status).send(DataTableNotExist.msg);

      if (!table.enabled) {
        DataTable.findOne({ $and: [{ enabled: true }, { _id: { $ne: tableId } }] })
          .populate('thresholds.field')
          .then((disabledTable) => {
            if (disabledTable) {
              disabledTable.enabled = false;

              disabledTable
                .save()
                .then((disabledSaved) => {
                  table.enabled = true;
                  table
                    .save()
                    .then((enabledSaved) => {
                      return res.status(200).send([disabledSaved, enabledSaved]);
                    })
                    .catch(next);
                })
                .catch(next);
            } else {
              table.enabled = true;
              table
                .save()
                .then((enabledSaved) => res.send([enabledSaved]))
                .catch(next);
            }
          })
          .catch(next);
      } else {
        table.enabled = false;
        table
          .save()
          .then((saved) => res.send(saved))
          .catch(next);
      }
    })
    .catch(next);
});

// @route   PUT api/datatables/:id/addThreshold
// @desc    Add threshold
// @access  Admin
router.put('/:id/addThreshold', [auth, authAdmin], (req, res, next) => {
  const { threshType, date, isFinal, fieldId, value } = req.body;

  if (threshType !== 'reject' && threshType !== 'accept') {
    return res.status(InvalidThreshType.status).send(InvalidThreshType.msg);
  }

  const numValue = Number(value);
  if (Number.isNaN(numValue)) {
    return res.status(400).send('Invalid value');
  }

  const tableId = req.params.id;

  DataTable.findById(tableId)
    .then((table) => {
      if (!table)
        return res.status(DataTableNotExist.status).send(DataTableNotExist.msg);

      const thresholds = table.thresholds;
      const fieldThresholds = thresholds.filter(
        (thresh) => String(thresh.field) === String(fieldId) && thresh.threshType === threshType
      );

      // NOTE: השארתי את הלוגיקה שלך (length !== 1) כמו שהיא, רק עם numValue
      if (fieldThresholds.length !== 1) {
        const closestDates = findClosestDates(
          date,
          fieldThresholds.map((thresh) => thresh.date)
        );

        try {
          validateDateValues(closestDates, fieldThresholds, threshType, numValue);
        } catch (err) {
          return sendValidationError(res, err);
        }

        if (isFinal) {
          const formerFinal = fieldThresholds.find(
            (thresh) => thresh.isFinal && thresh.threshType === threshType
          );
          if (formerFinal) formerFinal.isFinal = false;
        }
      }

      const newThreshold = {
        threshType,
        date,
        isFinal,
        field: fieldId,
        value: numValue
      };

      thresholds.push(newThreshold);

      table
        .save()
        .then(() => res.send(table.thresholds))
        .catch(next);
    })
    .catch(next);
});

// @route   PUT api/datatables/:id/:threshId
// @desc    Edit threshold
// @access  Admin
router.put('/:id/:threshId', [auth, authAdmin], (req, res, next) => {
  const { threshType, date, isFinal, value } = req.body;

  if (threshType !== 'reject' && threshType !== 'accept') {
    return res.status(InvalidThreshType.status).send(InvalidThreshType.msg);
  }

  const numValue = Number(value);
  if (Number.isNaN(numValue)) {
    return res.status(400).send('Invalid value');
  }

  const tableId = req.params.id;
  const threshId = req.params.threshId;

  DataTable.findById(tableId)
    .then((table) => {
      if (!table)
        return res.status(DataTableNotExist.status).send(DataTableNotExist.msg);

      const thresholds = table.thresholds;
      const editThresh = thresholds.id(threshId);

      if (!editThresh) {
        return res.status(ThresholdNotExist.status).send(ThresholdNotExist.msg);
      }

      const fieldThresholds = thresholds.filter(
        (thresh) =>
          String(thresh.field) === String(editThresh.field) &&
          String(thresh._id) !== String(threshId)
      );

      if (fieldThresholds.length > 0) {
        const dateChanged =
          new Date(date).getTime() !== new Date(editThresh.date).getTime();

        // editThresh.value יכול להיות מספר או מחרוזת בנתונים ישנים
        const valueChanged = Number(editThresh.value) !== numValue;

        if (dateChanged || valueChanged) {
          const closestDates = findClosestDates(
            date,
            fieldThresholds.map((thresh) => thresh.date)
          );

          try {
            validateDateValues(closestDates, fieldThresholds, threshType, numValue);
          } catch (err) {
            return sendValidationError(res, err);
          }
        }

        if (isFinal) {
          const formerFinal = fieldThresholds.find(
            (thresh) =>
              thresh.isFinal &&
              String(thresh.threshType) === String(threshType)
          );
          if (formerFinal) formerFinal.isFinal = false;
        }
      }

      // Update safely (no spreading subdoc)
      editThresh.threshType = threshType;
      editThresh.date = date;
      editThresh.isFinal = isFinal;
      editThresh.value = numValue;

      table
        .save()
        .then(() => res.send(table.thresholds))
        .catch(next);
    })
    .catch(next);
});

// @route   PUT api/datatables/:id/:threshId/remove
// @desc    Remove threshold
// @access  Admin
router.put('/:id/:threshId/remove', [auth, authAdmin], (req, res, next) => {
  const tableId = req.params.id;
  const threshId = req.params.threshId;

  DataTable.findById(tableId)
    .then((table) => {
      if (!table)
        return res.status(DataTableNotExist.status).send(DataTableNotExist.msg);

      const delThresh = table.thresholds.id(threshId);

      if (!delThresh)
        return res.status(ThresholdNotExist.status).send(ThresholdNotExist.msg);

      delThresh.remove();

      table
        .save()
        .then(() => res.status(ThresholdSuccessDelete.status).send(ThresholdSuccessDelete.msg))
        .catch(next);
    })
    .catch(next);
});

// @route   DELETE api/datatables/:id
// @desc    Delete data table
// @access  Admin
router.delete('/:id', [auth, authAdmin], (req, res, next) => {
  const tableId = req.params.id;

  DataTable.findById(tableId)
    .then((table) => {
      if (!table)
        return res.status(DataTableNotExist.status).send(DataTableNotExist.msg);

      table
        .remove()
        .then(() => res.send(DataTableSuccessDelete.msg))
        .catch(next);
    })
    .catch(next);
});

module.exports = router;
