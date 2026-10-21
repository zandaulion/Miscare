# Mișcare Android preview

[Download the Android preview](https://github.com/zandaulion/Miscare/releases).
Version 0.1.0 is an early-access build for Android 7.0 or newer. It is not a
Google Play submission or a claim that every accessibility and device scenario
has been verified.

The APK includes the adaptive routine engine, guided sessions, equipment and
limitation filters, progression choices, a local workout journal, 45 illustrated
exercises, 12 interface languages, and JSON backup/import. It works without an
account or server and does not request Internet permission. Reminders are not
implemented.

## Install and keep your data

Download `Miscare-0.1.0.apk` and `SHA256SUMS` from the release page. Check them on
Linux with `sha256sum --check SHA256SUMS`, or on macOS with
`shasum -a 256 -c SHA256SUMS`. Open the APK and allow your browser or file manager
to install it.

GitHub releases use the public sideload signing certificate (`CN=Zandaulion`).
Updates signed with the same certificate can retain local data. A Play-signed
installation may use a different certificate; export your data before any
uninstall or channel change. Never uninstall merely to solve an update error
without first preserving the records you want to keep.

The Android app starts with a new local profile. It does not import an existing
PWA account, browser storage or server database. Its JSON importer accepts only
Mișcare's local Android backup schema. Import **replaces** the current profile
and journal after confirmation.

Backups contain exercise preferences and workout records as ordinary,
unencrypted JSON. Choose their destination deliberately. Android automatic
cloud backup and device transfer are excluded; uninstalling or clearing storage
removes local data. Exported files remain wherever you saved them.

## Build

Use Node.js 24+, JDK 21 and Android SDK platform 36. In a fresh checkout:

```sh
npm ci
npm run android:sync
npm test
npm run i18n:check
npm run test:browser
cd android
./gradlew :app:assembleRelease :app:lintRelease
```

Browser tests require a compatible Chromium installation; set `CHROMIUM_PATH`
when using an existing executable. Configure your own signing key using ignored
`android/keystore.properties` (`storeFile`, `storePassword`, `keyAlias`,
`keyPassword`). No Firebase configuration or network service is needed.
The APK is `android/app/build/outputs/apk/release/app-release.apk`.
Regenerate assets with `npm run android:sync` after changing `web/`.

## Device validation

`ReleaseWorkflowInstrumentation` refuses to run against a normal installation: use an
isolated package ending in `.releasecheck`, on a dedicated test phone. The first
method tests activity recreation, rotation, local records and a native system
file-picker backup round trip using only synthetic records. The second method
checks journal and paused-session preservation after a forced process restart
and a validation APK update. Run that method only after the first method and
an in-place update; it deliberately does not seed replacement data.

For example, create `/tmp/miscare-validation.gradle` outside the repository:

```groovy
gradle.beforeProject { p ->
    if (p.path == ':app') p.plugins.withId('com.android.application') {
        p.android.testBuildType 'release'
        p.androidComponents.finalizeDsl { dsl ->
            dsl.defaultConfig.versionCode =
                (p.findProperty('validationVersionCode') ?: '1').toInteger()
        }
        p.android.buildTypes.getByName('release') {
            applicationIdSuffix '.releasecheck'
            versionNameSuffix '-validation'
        }
    }
}
```

Use your own signing key, set `ANDROID_SERIAL` to the dedicated test device,
and run from `android/`. Confirm the test package is absent before the first
install. These commands leave the regular Mișcare installation alone:

```sh
./gradlew -I /tmp/miscare-validation.gradle \
  :app:assembleRelease :app:assembleReleaseAndroidTest
adb install app/build/outputs/apk/release/app-release.apk
adb install -t app/build/outputs/apk/androidTest/release/app-release-androidTest.apk
adb shell am instrument -w -e phase first \
  com.zandaulion.miscare.releasecheck.test/com.zandaulion.miscare.ReleaseWorkflowInstrumentation
adb shell am force-stop com.zandaulion.miscare.releasecheck
./gradlew -I /tmp/miscare-validation.gradle -PvalidationVersionCode=2 :app:assembleRelease
adb install -r app/build/outputs/apk/release/app-release.apk
adb shell am instrument -w -e phase upgrade \
  com.zandaulion.miscare.releasecheck.test/com.zandaulion.miscare.ReleaseWorkflowInstrumentation
```

The validation build uses R8, as the downloadable APK does. Restore the normal
build command without the init script to produce the distributable package.

Remaining checks include TalkBack, 200% fonts, physical fold/unfold transitions,
older Android/WebView combinations, cloud/device-transfer behavior on other
manufacturers, and a deliberate PWA-data migration. Landscape guided sessions
can compress the exercise illustration, and some guided labels still use
Romanian in other interface languages. See
[Android development](android-development.md) for implementation details and
[the Android privacy policy](../store/privacy-policy.md) for data handling.

Source is provided under GPL-3.0-or-later; see [LICENSE](../LICENSE).
