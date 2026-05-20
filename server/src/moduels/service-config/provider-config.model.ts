import mongoose, { Schema } from "mongoose";
import { ProviderName } from "./service-config.types.js";

export const ProviderConfigSchema = new Schema(
  {
    provider: {
      type: String,
      enum: Object.values(ProviderName),
      required: true,
    },

    model: {
      type: String, 
      required: true,
      trim: true,
    },

    priority: {
      type: Number,
      required: true,
      min: 1,
    },

    enabled: {
      type: Boolean,
      default: true,
    },

    timeout: {
      type: Number,
      default: 10000,
      min: 1000,
    },

    maxRetries: {
      type: Number,
      default: 1,
      min: 0,
    },

    temperature: {
      type: Number,
      min: 0,
      max: 2,
    },

    maxTokens: {
      type: Number,
      min: 1,
    },
  },
  {
    _id: false,
  }
);