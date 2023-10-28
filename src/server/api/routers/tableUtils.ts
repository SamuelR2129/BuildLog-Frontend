export const subtractDaysFromWeek = (currentDay: Date) => {
  const currentDayOfWeek = currentDay.getDay();
  const daysToSubtract = (currentDayOfWeek + 6) % 7; // Calculate the number of days to subtract inside a 7 day modulo

  const previousDays = new Date(currentDay);
  previousDays.setDate(currentDay.getDate() - daysToSubtract);

  const previousDaysAndWeek = new Date(
    previousDays.getTime() - 7 * 24 * 60 * 60 * 1000,
  );

  return { previousDaysAndWeek, previousDays };
};
