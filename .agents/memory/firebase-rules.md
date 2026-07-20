---
name: Firebase Rules Required for New Paths
description: Two new Firebase Realtime Database paths need rules added in Firebase Console before they work.
---

## New paths needing rules

`activities` — user activity tracking (every click, page visit, download, login)
`subscriptionPlans` — admin-managed subscription plans shown in SubscribeModal

## Rules to add in Firebase Console → Realtime Database → Rules

```json
"activities": {
  ".write": "auth != null",
  ".read": "auth != null && auth.token.email == 'okotstephen57@gmail.com'"
},
"subscriptionPlans": {
  ".read": true,
  ".write": "auth != null && auth.token.email == 'okotstephen57@gmail.com'"
}
```

**Why:** Firebase Realtime Database requires explicit rules for every path. New paths default to denied. 

**How to apply:** Go to https://console.firebase.google.com → Project vj-pilesug → Realtime Database → Rules tab → merge these rules into the existing JSON → Publish.

**Until rules are updated:** Activity tracking silently fails for all users. Subscription plan writes also fail silently. The admin banner in the Activities tab shows exactly what to add.
