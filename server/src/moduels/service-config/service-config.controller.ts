import { AsyncHandler } from "@/utils/AsyncHandler.js";
import type { AuthUser } from "../auth/auth.payload.js";
import { errorHandler } from "@/utils/errorHandler.util.js";
import { ServiceConfigModel } from "./service-config.model.js";
import { successHandler } from "@/utils/successHandler.util.js";
import redisClient from "@/config/redis.config.js";
import { ProviderConfigModel } from "./provider-config.model.js";
import { TimeoutError } from "redis";

// create the service

export const createServiceConfig = AsyncHandler(async (req, res, next) => {
  try {
    const adminId = (req.user as AuthUser).id;
    const {
      service,
      enabled,
      fallbackEnabled,
      cacheEnabled,
      providers,
      rateLimitPerMinute,
    } = req.body;

    if (!adminId) {
      return errorHandler(res, 401, false, "User Not Found", next);
    }

    const isServiceConfigExist = await ServiceConfigModel.findOne({
      service: service.toLowerCase(),
    });

    if (isServiceConfigExist) {
      return errorHandler(
        res,
        400,
        false,
        "Service Config Already Exists",
        next,
      );
    }

    if (!providers || !Array.isArray(providers) || providers.length === 0) {
      return errorHandler(
        res,
        400,
        false,
        "At least one provider is required",
        next,
      );
    }

    const priorities = providers.map((provider: any) => provider.priority);

    console.log("priorities :", priorities);

    const uniquePriorities = new Set(priorities);

    console.log("uniquePriorities :", uniquePriorities);

    if (priorities.length !== uniquePriorities.size) {
      return errorHandler(
        res,
        400,
        false,
        "Duplicate provider priorities are not allowed",
        next,
      );
    }

    const enabledProviders = providers.filter(
      (provider: any) => provider.enabled !== false,
    );

    if (enabled === true && enabledProviders.length === 0) {
      return errorHandler(
        res,
        400,
        false,
        "At least one enabled provider is required",
        next,
      );
    }

    providers.sort((a: any, b: any) => a.priority - b.priority);

    console.log("sorted providers", providers);

    const createService = await ServiceConfigModel.create({
      service,
      enabled,
      fallbackEnabled,
      cacheEnabled,
      providers,
      rateLimitPerMinute,
    });

    const getAllServices = await ServiceConfigModel.find();

    await redisClient.set("service:list", JSON.stringify(getAllServices));

    console.log("createService :", createService);

    return successHandler(res, 201, true, "service Created successfully", {
      createService,
    });
  } catch (error) {
    console.log("create service error :", error);
    next(error);
  }
});

// update the service

export const updateServiceConfig = AsyncHandler(async (req, res, next) => {
  try {
    const adminId = (req.user as AuthUser).id;

    if (!adminId) {
      return errorHandler(res, 401, false, "User not found", next);
    }

    const serviceId = req.params.serviceId;

    if (!serviceId) {
      return errorHandler(res, 400, false, "Service ID not found", next);
    }

    const { serviceData } = req.body;

    const updateService = await ServiceConfigModel.findByIdAndUpdate(
      serviceId,
      serviceData,
      { new: true, runValidators: true },
    );

    console.log("update Service :", updateService);

    if (updateService) {
      const checkRedis = await redisClient.get("service:list");

      if (checkRedis) {
        console.log("checkRedis :", checkRedis);

        await redisClient.del("service:list");

        console.log("service:list deleted from redis");
      }

      const getAllServices = await ServiceConfigModel.find();

      await redisClient.set("service:list", JSON.stringify(getAllServices));

      console.log("service:list added to redis");
    } else {
      return errorHandler(res, 404, false, "Service Not Found", next);
    }

    return successHandler(res, 200, true, "Service Updated Successfully", {
      updateService,
    });
  } catch (error) {
    console.log("update service error :", error);
    next(error);
  }
});

// get the List of services

export const getListOfServices = AsyncHandler(async (req, res, next) => {
  try {
    const adminId = (req.user as AuthUser).id;

    if (!adminId) {
      return errorHandler(res, 401, false, "User not found", next);
    }

    const serviceLists = await ServiceConfigModel.find();

    console.log("service Lists :", serviceLists);

    if (!serviceLists) {
      return errorHandler(res, 404, false, "Service List Not Found", next);
    }

    return successHandler(res, 200, true, "Service List Fetched Successfully", {
      serviceLists,
    });
  } catch (error) {
    console.log("get List of service Error :", error);
    next(error);
  }
});

// get single service by id

export const getSingleService = AsyncHandler(async (req, res, next) => {
  try {
    const adminId = (req.user as AuthUser).id;

    if (!adminId) {
      return errorHandler(res, 401, false, "User not found", next);
    }

    const serviceId = req.params.serviceId;

    if (!serviceId) {
      return errorHandler(res, 400, false, "Service ID not found", next);
    }

    const getService = await ServiceConfigModel.findById(serviceId);

    console.log("get Service :", getService);

    if (!getService) {
      return errorHandler(res, 404, false, "Service Not Found", next);
    }

    return successHandler(res, 200, true, "Service Fetched Successfully", {
      getService,
    });
  } catch (error) {
    console.log("get Single service error :", error);
    next(error);
  }
});

// export const fallback

export const fallbackEnabled = AsyncHandler(async (req, res, next) => {
  try {
    const adminId = (req.user as AuthUser).id;

    if (!adminId) {
      return errorHandler(res, 401, false, "User not found", next);
    }

    const { serviceId, fallbackEnabled } = req.body;

    if (!serviceId) {
      return errorHandler(res, 400, false, "Service ID not found", next);
    }

    const toggleFallback = await ServiceConfigModel.findByIdAndUpdate(
      {
        service: serviceId,
      },
      {
        fallbackEnabled: fallbackEnabled,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    console.log("toggleFallback", toggleFallback);

    return successHandler(res, 200, true, "Fallback Enabled Successfully", {
      toggleFallback,
    });
  } catch (error) {
    console.log("Fallback Enabled error :", error);
    next(error);
  }
});

// rate limit

export const rateLimit = AsyncHandler(async (req, res, next) => {
  try {
    const adminId = (req.user as AuthUser).id;

    if (!adminId) {
      return errorHandler(res, 401, false, "User not found", next);
    }

    const { serviceId, rateLimitPerMinute } = req.body;

    if (!serviceId || !rateLimitPerMinute) {
      return errorHandler(
        res,
        400,
        false,
        "Service ID and Rate Limit not found",
        next,
      );
    }

    const toggleRateLimit = await ServiceConfigModel.findByIdAndUpdate(
      {
        service: serviceId,
      },
      {
        rateLimitPerMinute: rateLimitPerMinute,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    console.log("toggle Rate Limit :", toggleRateLimit);

    return successHandler(res, 200, true, "Rate Limit Updated Successfully", {
      toggleRateLimit,
    });
  } catch (error) {
    console.log("rate limit error :", error);
    next(error);
  }
});

// delte service

export const deleteService = AsyncHandler(async (req, res, next) => {
  try {
    const adminId = (req.user as AuthUser).id;

    if (!adminId) {
      return errorHandler(res, 401, false, "User not found", next);
    }

    const serviceId = req.params.serviceId;

    if (!serviceId) {
      return errorHandler(res, 400, false, "Service ID not found", next);
    }

    const deleteService = await ServiceConfigModel.findByIdAndDelete(serviceId);

    console.log("delete Service :", deleteService);

    if (!deleteService) {
      return errorHandler(res, 404, false, "Service Not Found", next);
    }

    return successHandler(res, 200, true, "Service Deleted Successfully", {
      deleteService,
    });
  } catch (error) {
    console.log("delete service error :", error);
    next(error);
  }
});

// toggle service by provider

export const toggleService = AsyncHandler(async (req, res, next) => {
  try {
    const adminId = (req.user as AuthUser).id;

    if (!adminId) {
      return errorHandler(res, 401, false, "User not found", next);
    }

    const { serviceId, enabled } = req.body;

    if (!serviceId) {
      return errorHandler(res, 400, false, "Service ID not found", next);
    }

    const toggleService = await ServiceConfigModel.findByIdAndUpdate(
      serviceId,
      { enabled },
      { new: true, runValidators: true },
    );

    console.log("toggle Service :", toggleService);

    if (!toggleService) {
      return errorHandler(res, 404, false, "Service Not Found", next);
    }

    return successHandler(res, 200, true, "Service Toggled Successfully", {
      toggleService,
    });
  } catch (error) {
    console.log("toggle service error :", error);
    next(error);
  }
});

// Provider toggle status

export const toggleProvider = AsyncHandler(async (req, res, next) => {
  try {
    const adminId = (req.user as AuthUser).id;

    if (!adminId) {
      return errorHandler(res, 401, false, "User not found", next);
    }

    const { serviceId, providerId, enabled } = req.body;

    if (!serviceId || !providerId) {
      return errorHandler(
        res,
        400,
        false,
        "Service ID and Provider ID are required",
        next,
      );
    }

    const toggleProviderStatus = await ServiceConfigModel.findOneAndUpdate(
      {
        serviceId: serviceId,
        provider: providerId,
      },
      {
        enabled: enabled,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    console.log("toggle Provider Status :", toggleProviderStatus);

    if (!toggleProviderStatus) {
      return errorHandler(res, 404, false, "Provider Not Found", next);
    }

    return successHandler(
      res,
      200,
      true,
      "Provider Status Toggled Successfully",
      {
        toggleProviderStatus,
      },
    );
  } catch (error) {
    console.log("toggle provider error :", error);
    next(error);
  }
});

// update provider priority

export const updateProviderPriority = AsyncHandler(async (req, res, next) => {
  try {
    const adminId = (req.user as AuthUser).id;

    if (!adminId) {
      return errorHandler(res, 401, false, "User not found", next);
    }

    const { serviceId, providerId, priority } = req.body;

    if (!serviceId || !providerId || !priority) {
      return errorHandler(
        res,
        400,
        false,
        "Service ID, Provider ID and Priority are required",
        next,
      );
    }

    const priorityRegex = /^[0-9]*$/;

    if (!priorityRegex.test(priority)) {
      return errorHandler(res, 400, false, "Priority must be a number", next);
    }

    const getService = await ServiceConfigModel.findById(serviceId);

    // console.log("ger service :", getService)

    if (!getService) {
      return errorHandler(res, 404, false, "Service Not Found", next);
    }

    const getProvider = getService.providers.find(
      (provider: any) => provider.providerId === providerId,
    );

    // console.log("getProvider :", getProvider)

    if (!getProvider) {
      return errorHandler(res, 404, false, "Provider Not Found", next);
    }

    getProvider.priority = priority;

    console.log("getProvider :", getProvider);

    await getService.save();

    console.log("getService :", getService);

    return successHandler(
      res,
      200,
      true,
      "Provider Priority Updated Successfully",
      {
        getService,
      },
    );
  } catch (error) {
    console.log("get provider error :", error);
    next(error);
  }
});

// provider model

export const providerModel = AsyncHandler(async (req, res, next) => {
  try {
    const adminId = (req.user as AuthUser).id;

    if (!adminId) {
      return errorHandler(res, 401, false, "User not found", next);
    }

    const { providerId, model } = req.body;

    if (!providerId || !model) {
      return errorHandler(
        res,
        400,
        false,
        "Provider ID and Model are required",
        next,
      );
    }

    const providerModel = await ServiceConfigModel.findOneAndUpdate(
      {
        provider: providerId,
      },
      {
        model: model,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    console.log("provider Model :", providerModel);

    return successHandler(
      res,
      200,
      true,
      "Provider Model Updated Successfully",
      {
        providerModel,
      },
    );
  } catch (error) {
    console.log("provider model error :", error);
    next(error);
  }
});

// provider timeOut

export const providerTimeOut = AsyncHandler(async (req, res, next) => {
  try {
    const adminId = (req.user as AuthUser).id;

    if (!adminId) {
      return errorHandler(res, 401, false, "User not found", next);
    }

    const {providerId, timeout} = req.body

    if (!providerId || !timeout) {
      return errorHandler(res, 400, false, "Provider Id and Timeout is Required", next)
    }

    const timeoutRegex = /^[0-9]*$/

    if (!timeoutRegex.test(timeout)) {
      return errorHandler(res, 400, false, "Timeout is Invalid", next)
    }

    const getProvider = await ServiceConfigModel.findOne(
      {
        "providers.providerId": providerId,
      },
      {
        "providers.$": 1,
      },
    );

    console.log("get provider : ", getProvider)

    if (!getProvider) {
      return errorHandler(res, 404, false, "Provider Not Found", next);
    }

  } catch (error) {
    console.log("provider TimeOut Error :", error);
    next(error);
  }
});

// Provider Max Retries

export const providerMaxRetries = AsyncHandler(async(req, res, next) =>{
  try {

    const adminId = (req.user as AuthUser).id;

    if (!adminId) {
      return errorHandler(res, 401, false, "User not found", next);
    }

    const { ProviderId, maxRetries} = req.body;

    if (!ProviderId || !maxRetries) {
      return errorHandler(res, 400, false, "Provider Id and max retries are required", next)
    }

    const maxRetriesRegex = /^[0-9]*$/

    if (!maxRetriesRegex.test(maxRetries)) {
      return errorHandler(res, 400, false, "Max retries is invalid", next)
    }

    const updateProviderMaxRetries = await ServiceConfigModel.findOneAndUpdate(
      {
        "providers.providerId": ProviderId,
      },
      {
        "providers.$.maxRetries": Number(maxRetries),
      },
      {
        new: true,
        runValidators: true,
      },
    )

    console.log("update Provider Max Retries : ", updateProviderMaxRetries)

    if (!updateProviderMaxRetries) {
      return errorHandler(res, 404, false, "Provider Not Found", next);
    }

    return successHandler(
      res,
      200,
      true,
      "Provider Max Retries Updated Successfully",
      {
        updateProviderMaxRetries,
      },
    );

  } catch (error) {
    console.log("Provider Max Retries Error :", error);
    next(error);
  }
})

// provider temperature controller 

export const providerTemperature = AsyncHandler(async(req, res, next) =>{
  try {

    const adminId = (req.user as AuthUser).id;

    if (!adminId) {
      return errorHandler(res, 401, false, "User not found", next);
    }

    const { providerId, temperature } = req.body;

    if (!providerId || !temperature) {
      return errorHandler(res, 400, false, "Provider Id and Temperature are required", next)
    }

    const temperatureRegex = /^[0-9]*$/

    if (!temperatureRegex.test(temperature)) {
      return errorHandler(res, 400, false, "Temperature is Invalid", next)
    }

    const updateProviderTemperature = await ServiceConfigModel.findOneAndUpdate(
      {
        "providers.providerId": providerId,
      },
      {
        "providers.$.temperature": Number(temperature),
      },
      {
        new: true,
        runValidators: true,
      },
    )

    console.log("update Provider Temperature : ", updateProviderTemperature)

    if (!updateProviderTemperature) {
      return errorHandler(res, 404, false, "Provider Not Found", next);
    }

    return successHandler(
      res,
      200,
      true,
      "Provider Temperature Updated Successfully",
      {
        updateProviderTemperature,
      },
    );

  } catch (error) {
    console.log("Provider Temperature Error :", error)
    next(error)
  }
})