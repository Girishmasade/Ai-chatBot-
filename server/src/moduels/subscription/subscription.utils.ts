export const createEndDateForSubscription = ({
  startDate,
  plan,
  customEndDate,
}: {
  startDate: string;
  plan: string;
  customEndDate?: string;
}) => {
  const endDate = new Date(startDate);

  switch (plan) {
    case "free": // if plan is free then return null 
      return null;

    case "daily":
      endDate.setDate(endDate.getDate() + 1); // it's 24 hours expiry
      return endDate;

    case "monthly":
      endDate.setMonth(endDate.getMonth() + 1); // it's 30 days expiry
      return endDate;

    case "yearly":
      endDate.setFullYear(endDate.getFullYear() + 1); // it's 365 days expiry
      return endDate;

    case "custom":
      if (!customEndDate) return null; // if customEndDate is not provided return null
      return new Date(customEndDate);

    default:
      return null;
  }
};