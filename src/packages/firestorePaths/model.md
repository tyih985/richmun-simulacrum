# Concept

- /users/{uid}
  The canonical list of all user information, like event history, emergency contact information, etc.

- /simulation/
- /simulation/{sid}
- /simulation/{sid}/users/{uid}

```
{
  role: "staff" | "delegate",
  committee_id: string,
  delegate_id: string,
  ...etc.
}
```

- /simulation/{sid}/committees/{cid}
- ...{cid}/delegates/{delid}

The delegate ID should map the user id with the delegate information, such that the delegate ID should be used within the committee, and never the actual user ID. This separation should facilitate adding and removing users from roles on the committee.

This will require a series of firebase trigger functions to ensure consistency in the batch. The canonical permission data should always be on the /simulation/ routes, whereas the users/ record acts as a reference of a foreign key for the sake of quick access.

- ...{cid}/directives/{dirid}

The directives should all be stashed within each committee, with each directive allowing for any number of editors by tracking the authors and signatory's delegate id.
