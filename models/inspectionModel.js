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
  },
  drone_operator: {
    type: String,
    required: true,
  },
  Overview: {
    total_defects: {
      type: String,
    },
    construction_quality: {
      type: String,
    },
    energy_loss: {
      type: String,
    },
  },
  urgency: {
    urgent: {
      type: String,
    },
    medium: {
      type: String,
    },
    low: {
      type: String,
    },
  },

  title: {
    safety_value: {
      type: String,
    },
    utility_value: {
      type: String,
    },
    regulatory_value: {
      type: String,
    },
    asset_value: {
      type: String,
    },
    cost_value: {
      type: String,
    },
    option_value: {
      type: String,
    },
  },
});

const Inspections = mongoose.model("Inspections", inspectionSchema, "inspections");

module.exports = { Inspections };
