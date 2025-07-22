const snapshot = await db
  .collection(SPEAKING_COLLECTION)
  .where('committeeId', '==', 'committee123')
  .where('delegateId', '==', 'delegate456')
  .get();

const total = snapshot.docs.reduce((sum, doc) => {
  return sum + (doc.data().totalDuration || 0);
}, 0);

console.log(`Total time spoken: ${Math.round(total / 1000)} seconds`);
