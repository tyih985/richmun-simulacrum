### Getting data

- Use `firestoreSubscription` to **listen** to firebase documents for changes.
- Use `firestoreRequests` with `react-query` to fetch data once
  - use this pattern if data will be modified atomically, where real-time updates would ruin the UX

### Setting data

- Setting with `firestoreRequests` doesn't benefit from `react-query` `mutations` because the local Firebase instance will deal with things
- Firebase updates are additive, and fields generally won't be removed (unless you "re-create" with `createFirestoreDocument`)
- Use `firestoreRequests` with `batchUpdateDocuments` to update several fields at once
- Use `firestoreRequests` with `create` or `update` to modify a single document at a time
