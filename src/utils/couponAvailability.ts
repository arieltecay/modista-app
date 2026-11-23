/** Whether the form of a course should offer the coupon field; any failure or doubtful answer hides it. */
export const isCouponFieldAvailable = async (
  courseId: string,
  ask: (courseId: string) => Promise<unknown>
): Promise<boolean> => {
  try {
    const answer = await ask(courseId);
    return (answer as { available?: unknown } | null | undefined)?.available === true;
  } catch {
    return false;
  }
};
