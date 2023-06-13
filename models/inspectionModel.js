const mongoose = require("mongoose");
var validator = require("validator");
const inspectionSchema = new mongoose.Schema({
  project_name: {
    type: String,
    required: [true, "Project name required"],
    validate(value) {
      if (!validator.isLength(value, { min: 3, max: 64 })) {
        throw Error("Length of the project name should be between 3-64");
      }
    },
    trim: true,
  },
  inspection_id: {
    type: String,
    required: true,
    unique: true,
  },
  drone_operator: {
    type: String,
    required: true,
  },
  model_url_3D: {
    type: String,
    required: true,
  },
  Overview: {
    total_defects: {
      type: String,
      required: true
    },
    construction_quality: {
      type: String,
      required: true
    },
    energy_loss: {
      type: String,
      required: true
    },
  },
  urgency: {
    urgent: {
      type: String,
      required: true
    },
    medium: {
      type: String,
      required: true
    },
    low: {
      type: String,
      required: true
    },
  },

  title: {
    safety_value: {
      type: String,
      required: true
    },
    utility_value: {
      type: String,
      required: true
    },
    regulatory_value: {
      type: String,
      required: true
    },
    asset_value: {
      type: String,
      required: true
    },
    cost_value: {
      type: String,
      required: true
    },
    option_value: {
      type: String,
      required: true
    },
  },
  n_Deleted: { type: Number, default: 1 },
  dt_CreatedOn: { type: Date, default: Date.now },
},{strict: false,versionKey: false});

const Inspections = mongoose.model("Inspections", inspectionSchema, "inspections");

module.exports = { Inspections };
