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

export const getNightCount = (
  checkIn: Date | null,
  checkOut: Date | null,
): number => {
  if (!checkIn || !checkOut) return 0;

  const inUtc = Date.UTC(
    checkIn.getFullYear(),
    checkIn.getMonth(),
    checkIn.getDate(),
  );
  const outUtc = Date.UTC(
    checkOut.getFullYear(),
    checkOut.getMonth(),
    checkOut.getDate(),
  );
  const nights = Math.ceil((outUtc - inUtc) / (1000 * 60 * 60 * 24));

  return nights > 0 ? nights : 1;
};
