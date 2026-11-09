# Android — development and builds

For installing, checksums, signing and test instructions, see
[Android release](android-release.md).

The Android app bundles the existing UI in Capacitor. Routine selection, rotation,
feedback and progression run from `web/engine/`, shared with the PWA server.
`web/client.js` chooses the local IndexedDB client only in packaged assets; the
PWA keeps using its existing server and authentication.

Implemented:

- Full adaptive routines, equipment and limitation filters, consent-based
  progression, undo, and local calendar dates.
- Atomic profile/journal writes, UUIDs for retry-safe completion, recomputed
  totals, and an uncapped journal.
- Guided-session checkpoints. Reopening restores the session paused, including
  its rest step or unsaved feedback. Background time does not count as exercise.
- Twelve bundled locales and the complete exercise media catalogue. Plural
  forms follow each language's rules (`tn()` in `web/i18n.js`).
- A light or dark theme that follows the phone or is chosen in Settings
  (`web/theme.js`); the native `systemBars` call keeps the status and
  navigation bar icons readable in both.
- Versioned JSON export/import through Android's system document picker. Import
  replaces existing data after confirmation. Exports are ordinary JSON files
  containing personal workout and profile data; store them appropriately.
- Delete-all-data, Android Back handling, and screen-on behavior.
- No service worker, remote activation, automatic backup, or Internet permission
  in Android. App updates deliver executable assets.

The first Android install creates a new profile. It does **not** automatically
import a browser/PWA profile or its server-side history. Android JSON import
currently accepts only this local schema, not a server database or arbitrary PWA
export. The hosted PWA and its existing data remain separate.

## Prepare and validate

```sh
npm ci
npm run android:sync
npm test
npm run i18n:check
npm run test:browser
```

Browser tests need Chromium (`npx playwright install chromium`, or set
`CHROMIUM_PATH` to an installed compatible executable). Tests serve bundled assets
and a PWA on loopback with a temporary synthetic database. They cover resume,
journal mutations, progression, all locale selections, backup/restore, deletion,
absence of API/network dependencies in the local build, and PWA startup.
`npm run i18n:check` also fails when on-screen text in `web/` is not a key in
`web/i18n/ro.json`, so untranslated Romanian cannot reach another language.

Build from `android/` with JDK 21 and the Android SDK:

```sh
./gradlew assembleDebug lintDebug
```

For a signed release, configure ignored `android/keystore.properties` with
`storeFile`, `storePassword`, `keyAlias`, and `keyPassword`, then run
`./gradlew assembleRelease lintRelease`. Never commit signing material.
`npm run android:sync` must run before building after web changes. Generated
assets, native plugin integration and output APKs are intentionally ignored.

The app is in production on Google Play. Play bundles (`bundleRelease`) are
signed with the Play upload key and uploaded by hand; the scripts here publish
nothing. Each upload needs a higher `versionCode` in `android/app/build.gradle`,
and its release notes go in `store/RELEASE_NOTES_<version>.txt`.

Remaining coverage includes TalkBack, large fonts, physical fold/unfold
transitions, backup behavior across Android versions and manufacturers, motion
preferences, and a deliberate PWA-data migration. Reminders are not implemented.
