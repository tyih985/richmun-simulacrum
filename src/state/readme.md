This state folder is separated into four sub-folders:

- context: the context state
- providers: providers for context

And then separate folders for slightly different purposes:

- hooks: hooks for accessing separate data (context, firestore, etc.)
- mutations: mutations for external data
- store: hooks and mutations for managing smaller session/local data
