import { model, Schema } from "mongoose";
import type { IProviderApiKey } from "./provider-api-key.interface.js";
import { ProviderName } from "../Provider/provider-config.types.js";
import { AdapterType } from "./provider-api-key.types.js";

const ProviderKeySchema = new Schema<IProviderApiKey>(
  {
    provider: {
      type: String,
      enum: Object.values(ProviderName),
      required: true,
      unique: true,
      index: true,
    },
    apiKey: {
      type: String,
      default: null,
      select: false,
    },
    baseUrl: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    adapterType: {
      type: String,
      enum: Object.values(AdapterType),
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true, // gateway filters by active: true
    },

    note: {
      type: String,
      default: null,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true },
);

export const ProviderApiKeyModel = model<IProviderApiKey>(
  "ProviderKey",
  ProviderKeySchema,
  "ProviderKeys",
);
