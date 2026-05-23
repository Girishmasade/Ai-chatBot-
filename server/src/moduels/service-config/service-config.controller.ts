import { AsyncHandler } from "@/utils/AsyncHandler.js";
import type { AuthUser } from "../auth/auth.payload.js";
import { errorHandler } from "@/utils/errorHandler.util.js";
import { ServiceConfigModel } from "./service-config.model.js";
import { successHandler } from "@/utils/successHandler.util.js";
import redisClient from "@/config/redis.config.js";

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
    )

    console.log("update Service :", updateService)

   if(updateService){

    const checkRedis = await redisClient.get("service:list")

    if(checkRedis){
      console.log("checkRedis :", checkRedis);

      await redisClient.del("service:list" );

      console.log("service:list deleted from redis")
    }

      const getAllServices = await ServiceConfigModel.find();

      await redisClient.set("service:list", JSON.stringify(getAllServices));

      console.log("service:list added to redis")

   } else {
    return errorHandler(res, 404, false, "Service Not Found", next)
   }

    return successHandler(res, 200, true, "Service Updated Successfully", {
      updateService,
    })

  } catch (error) {
    console.log("update service error :", error);
    next(error);
  }
});


// get the List of services

export const getListOfServices = AsyncHandler(async(req, res, next) => {
  try {
       const adminId = (req.user as AuthUser).id;

    if (!adminId) {
      return errorHandler(res, 401, false, "User not found", next);
    }
    
    const serviceLists = await ServiceConfigModel.find()

    console.log("service Lists :", serviceLists)


    if (!serviceLists) {
      return errorHandler(res, 404, false, "Service List Not Found", next)
    }

    return successHandler(res, 200, true, "Service List Fetched Successfully", {
      serviceLists,
    })

  } catch (error) {
    console.log("get List of service Error :", error);
    next(error)
  }
})

// get single service by id

export const getSingleService = AsyncHandler(async(req, res, next) => {
try {
  const adminId = (req.user as AuthUser).id;

    if (!adminId) {
      return errorHandler(res, 401, false, "User not found", next);
    }
    
    const serviceId = req.params.serviceId;

    if (!serviceId) {
      return errorHandler(res, 400, false, "Service ID not found", next);
    }

    const getService = await ServiceConfigModel.findById(serviceId)

    console.log("get Service :", getService)

    if (!getService) {
      return errorHandler(res, 404, false, "Service Not Found", next)
    }

    return successHandler(res, 200, true, "Service Fetched Successfully", {
      getService,
    })

} catch (error) {
  console.log("get Single service error :", error);
  next(error)
}
})

// delte service

export const deleteService = AsyncHandler(async(req, res, next) => {
try {
  const adminId = (req.user as AuthUser).id;

    if (!adminId) {
      return errorHandler(res, 401, false, "User not found", next);
    }
    
    const serviceId = req.params.serviceId;

    if (!serviceId) {
      return errorHandler(res, 400, false, "Service ID not found", next);
    }

    const deleteService = await ServiceConfigModel.findByIdAndDelete(serviceId)

    console.log("delete Service :", deleteService)

    if (!deleteService) {
      return errorHandler(res, 404, false, "Service Not Found", next)
    }

    return successHandler(res, 200, true, "Service Deleted Successfully", {
      deleteService,
    })

} catch (error) {
  console.log("delete service error :", error);
  next(error)
}

})

// toggle service by provider

export const toggleService = AsyncHandler(async(req, res, next) =>{
try {
  const adminId = (req.user as AuthUser).id;

    if (!adminId) {
      return errorHandler(res, 401, false, "User not found", next);
    }
    
    const { serviceId, enabled } = req.body;

    if (!serviceId) {
      return errorHandler(res, 400, false, "Service ID not found", next);
    }

    const toggleService = await ServiceConfigModel.findByIdAndUpdate(serviceId, { enabled }, { new: true, runValidators: true })

    console.log("toggle Service :", toggleService)

    if (!toggleService) {
      return errorHandler(res, 404, false, "Service Not Found", next)
    }

    return successHandler(res, 200, true, "Service Toggled Successfully", {
      toggleService,
    })

} catch (error) {
   console.log("toggle service error :", error);
  next(error)
}
})