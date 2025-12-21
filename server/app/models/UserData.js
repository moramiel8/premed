const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
import * as staticMethods from '../src/api/components/stats/userData/db/methods'
import { ConstructStaticMethods } from '../src/api/db/plugins';

// Create schema
const UserDataSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: 'User'
    },
    tables: [
      {
        table: {
          type: ObjectId,
          ref: 'DataTable'
        },

        paths: [String],

        enabled: {
          type: Boolean,
          default: false
        },

        dataVals: [
          {
            field: String,
            cusGroupParent: String,
            isCalc: Boolean,
            value: Mixed,
            otherValue: {
              value: Number,
              year: Number
            },
            suggestValue: String,
            suggestedAccepted: Boolean,
            payload: Mixed
          }
        ],

        groupVals: [
          {
            field: String,
            group: String,
            cusGroupParent: String,
            isType: Boolean,
            value: String
          }
        ],

        customGroups: [
          {
            name: String,
            cusGroupParent: String
          }
        ],

        last_updated: {
          type: Date,
          default: Date.now
        }
      }
    ],

    transfer_suggested: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true   
  }
);


UserDataSchema.plugin(
    ConstructStaticMethods, 
    { customStaticMethods: staticMethods })

module.exports = mongoose.model('UserData', UserDataSchema);