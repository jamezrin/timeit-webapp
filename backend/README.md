# Backend

[Running typeorm CLI](https://typeorm.io/#/using-cli/if-entities-files-are-in-typescript)

## Running migrations

```bash
npm run typeorm migration:run
```

## Generating migrations

```bash
npm run typeorm migration:generate -- -n migrationNameHere
```

```
POST /authenticate
POST /deauthenticate
POST /create-account
POST /confirm-account
POST /request-password-reset
POST /perform-password-reset
GET /current-user
PATCH /update-user

GET /projects
POST /projects
GET /projects/:projectId
PATCH /projects/:projectId
DELETE /projects/:projectId
* POST /projects/:projectId/invite

GET /projects/:projectId/sessions
POST /projects/:projectId/sessions
GET /sessions/:sessionId
PATCH /sessions/:sessionId
DELETE /sessions/:sessionId
* POST /sessions/:sessionId/end

GET /sessions/:sessionId/notes
POST /sessions/:sessionId/notes
GET /session_notes/:noteId
PATCH /session_notes/:noteId
DELETE /session_notes/:noteId

GET /sessions/:sessionId/app_events
POST /sessions/:sessionId/app_events
GET /session_app_events/:appEventId
PATCH /session_app_events/:appEventId
DELETE /session_app_events/:appEventId

GET /projects/:projectId/members
POST /projects/:projectId/members
GET /members/:memberId
PATCH /members/:memberId
DELETE /members/:memberId
```