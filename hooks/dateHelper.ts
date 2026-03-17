export const syncCheckoutWithCheckin = (
  newCheckIn: Date | null,
  currentCheckOut: Date | null,
  minNights = 1,
): Date | null => {
  if (!newCheckIn) return currentCheckOut;

  // If checkout is missing or invalid → auto-set
  if (!currentCheckOut || currentCheckOut <= newCheckIn) {
    const next = new Date(newCheckIn);
    next.setDate(next.getDate() + minNights);
    return next;
  }

  return currentCheckOut;
};
