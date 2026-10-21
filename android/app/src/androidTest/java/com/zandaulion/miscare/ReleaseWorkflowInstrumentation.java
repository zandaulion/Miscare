package com.zandaulion.miscare;

import android.app.Activity;
import android.app.Instrumentation;
import android.app.UiAutomation;
import android.content.Intent;
import android.os.Bundle;
import android.os.SystemClock;
import android.view.View;
import android.view.ViewGroup;
import android.view.accessibility.AccessibilityNodeInfo;
import android.webkit.WebView;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Objects;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.function.Predicate;
import org.json.JSONArray;
import org.json.JSONObject;

/** Exercise real packaged WebView and document-picker flows with synthetic data only. */
public class ReleaseWorkflowInstrumentation extends Instrumentation {
    private Activity activity;
    private String phase;
    private WebView web;
    private String packageName;

    @Override public void onCreate(Bundle arguments) {
        super.onCreate(arguments);
        phase = arguments == null ? "first" : arguments.getString("phase", "first");
        start();
    }

    @Override public void onStart() {
        Bundle result = new Bundle();
        int code = Activity.RESULT_OK;
        try {
            launchIsolatedApp();
            if ("upgrade".equals(phase)) updateKeepsJournalAndPausedSession();
            else localWorkflowAndNativeBackupRoundTrip();
            result.putString(REPORT_KEY_STREAMRESULT, "OK (1 test)\nNative workflow passed: " + phase);
        } catch (Throwable error) {
            code = Activity.RESULT_CANCELED;
            StringWriter trace = new StringWriter();
            error.printStackTrace(new PrintWriter(trace));
            result.putString(REPORT_KEY_STREAMRESULT, "FAILED: " + trace);
        } finally {
            if (activity != null) runOnMainSync(() -> activity.finish());
            getUiAutomation().setRotation(UiAutomation.ROTATION_UNFREEZE);
        }
        finish(code, result);
    }

    private void launchIsolatedApp() {
        packageName = getTargetContext().getPackageName();
        assertEquals("Refusing to seed a regular installation", "com.zandaulion.miscare.releasecheck", packageName);
        Intent launch = new Intent().setClassName(packageName, "com.zandaulion.miscare.MainActivity")
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        activity = startActivitySync(launch);
        attach();
    }

    private static void assertTrue(String message, boolean value) {
        if (!value) throw new AssertionError(message);
    }
    private static void assertNotNull(Object value) { assertNotNull("Required value missing", value); }
    private static void assertNotNull(String message, Object value) { assertTrue(message, value != null); }
    private static void assertEquals(Object expected, Object actual) { assertEquals("Values differ", expected, actual); }
    private static void assertEquals(String message, Object expected, Object actual) {
        assertTrue(message + ": expected=" + expected + ", actual=" + actual, Objects.equals(expected, actual));
    }
    private static void fail(String message) { throw new AssertionError(message); }

    private AccessibilityNodeInfo findNode(AccessibilityNodeInfo node, Predicate<AccessibilityNodeInfo> match) {
        if (node == null) return null;
        if (match.test(node)) return node;
        for (int i = 0; i < node.getChildCount(); i++) {
            AccessibilityNodeInfo found = findNode(node.getChild(i), match);
            if (found != null) return found;
        }
        return null;
    }
    private AccessibilityNodeInfo waitNode(Predicate<AccessibilityNodeInfo> match) {
        long deadline = SystemClock.uptimeMillis() + 15000;
        do {
            AccessibilityNodeInfo node = findNode(getUiAutomation().getRootInActiveWindow(), match);
            if (node != null) return node;
            SystemClock.sleep(100);
        } while (SystemClock.uptimeMillis() < deadline);
        throw new AssertionError("Required document-picker control missing");
    }
    private void clickNode(AccessibilityNodeInfo node) {
        while (node != null && !node.isClickable()) node = node.getParent();
        assertNotNull("Clickable document-picker control missing", node);
        assertTrue("Document-picker click failed", node.performAction(AccessibilityNodeInfo.ACTION_CLICK));
    }

    private WebView findWeb(View view) {
        if (view instanceof WebView) return (WebView) view;
        if (view instanceof ViewGroup) {
            ViewGroup group = (ViewGroup) view;
            for (int i = 0; i < group.getChildCount(); i++) {
                WebView found = findWeb(group.getChildAt(i));
                if (found != null) return found;
            }
        }
        return null;
    }

    private void attach() {
        runOnMainSync(() -> web = findWeb(activity.getWindow().getDecorView()));
        assertNotNull(web);
        await("document.readyState === 'complete' && !!window.MiscareNative");
    }

    private String js(String source) {
        CountDownLatch done = new CountDownLatch(1);
        String[] result = new String[1];
        runOnMainSync(() ->
            web.evaluateJavascript("try { " + source + " } catch (__testError) { ({__releaseScriptError:String(__testError)}) }",
                value -> { result[0] = value; done.countDown(); }));
        try { assertTrue("WebView evaluation timed out", done.await(10, TimeUnit.SECONDS)); }
        catch (InterruptedException error) { throw new AssertionError(error); }
        assertTrue("WebView script failed: " + result[0], result[0] == null || !result[0].contains("__releaseScriptError"));
        return result[0];
    }

    private void await(String expression) {
        long deadline = SystemClock.uptimeMillis() + 15000;
        do {
            if ("true".equals(js("Boolean(" + expression + ")"))) return;
            SystemClock.sleep(100);
        } while (SystemClock.uptimeMillis() < deadline);
        fail("Missing WebView condition: " + expression);
    }

    private void click(String selector) {
        await("document.querySelector(" + JSONObject.quote(selector) + ") !== null");
        js("document.querySelector(" + JSONObject.quote(selector) + ").click()");
    }

    private void begin(String body) {
        js("window.__releaseCheck = null; (async () => { const api = await import(location.origin + '/client.js'); " +
            body + " })().then(value => window.__releaseCheck = {ok:true,value})" +
            ".catch(error => window.__releaseCheck = {ok:false,error:String(error)})");
    }

    private JSONObject finish() throws Exception {
        await("window.__releaseCheck !== null");
        JSONObject result = new JSONObject(js("window.__releaseCheck"));
        assertTrue(result.toString(), result.getBoolean("ok"));
        return result;
    }

    private void recreate() {
        ActivityMonitor monitor = addMonitor("com.zandaulion.miscare.MainActivity", null, false);
        runOnMainSync(() -> activity.recreate());
        activity = monitor.waitForActivityWithTimeout(15000);
        removeMonitor(monitor);
        assertNotNull("Activity recreation timed out", activity);
        attach();
    }

    private void localWorkflowAndNativeBackupRoundTrip() throws Exception {
        await("document.querySelector('#btn-start-guided') !== null");
        js("localStorage.setItem('miscare-locale','ro')");
        recreate();
        click("#btn-start-guided");
        click("#rep-plus-btn");
        String reps = js("document.querySelector('#rep-value').textContent");
        SystemClock.sleep(500);
        recreate();
        await("document.querySelector('#guided-pause-btn')?.textContent.includes('Continuă')");
        assertEquals(reps, js("document.querySelector('#rep-value').textContent"));
        getUiAutomation().setRotation(UiAutomation.ROTATION_FREEZE_90);
        SystemClock.sleep(300);
        await("document.querySelector('#guided-overlay') !== null");
        assertEquals(reps, js("document.querySelector('#rep-value').textContent"));
        getUiAutomation().setRotation(UiAutomation.ROTATION_FREEZE_0);
        SystemClock.sleep(300);

        // Deterministic synthetic record; no existing profile or workout is read.
        begin("await api.logWorkout({id:'synthetic-release-workout',routine_title:'Synthetic release validation'," +
            "duration_seconds:300,feedback:'just_right',exercises_done:[]}); return (await api.getLogs()).logs.length;");
        assertEquals(1, finish().getInt("value"));
        recreate();

        // Real ACTION_CREATE_DOCUMENT through the minified LocalData plugin.
        String filename = "miscare-synthetic-validation-" + System.currentTimeMillis() + ".json";
        begin("await window.MiscareNative.exportData(JSON.stringify(await api.exportData())); return true;");
        AccessibilityNodeInfo title = waitNode(node -> node.getClassName() != null && "android.widget.EditText".contentEquals(node.getClassName()));
        Bundle filenameArguments = new Bundle();
        filenameArguments.putCharSequence(AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE, filename);
        assertTrue("Filename entry failed", title.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT, filenameArguments));
        AccessibilityNodeInfo save = waitNode(node -> node.getText() != null &&
            node.getText().toString().matches("(?iu)save|salvează"));
        clickNode(save);
        finish();

        begin("await api.resetData(); return (await api.getLogs()).logs.length;");
        assertEquals(0, finish().getInt("value"));
        begin("const text = await window.MiscareNative.importData(); if (!text) throw Error('No backup selected');" +
            "await api.importData(JSON.parse(text)); return (await api.getLogs()).logs;");
        AccessibilityNodeInfo backup = waitNode(node -> node.getText() != null && filename.contentEquals(node.getText()));
        clickNode(backup);
        JSONArray logs = finish().getJSONArray("value");
        assertEquals(1, logs.length());
        assertEquals("synthetic-release-workout", logs.getJSONObject(0).getString("id"));

        // Leave a paused checkpoint and a marker for the separate update run.
        recreate();
        click("#btn-start-guided");
        click("#rep-plus-btn");
        await("document.querySelector('#rep-value') !== null");
        js("localStorage.setItem('miscare-validation-reps',document.querySelector('#rep-value').textContent);" +
            "localStorage.setItem('miscare-validation-marker','synthetic')");
        assertEquals("\"synthetic\"", js("localStorage.getItem('miscare-validation-marker')"));
        SystemClock.sleep(1500);
        recreate();
        await("document.querySelector('#guided-pause-btn')?.textContent.includes('Continuă')");
        assertEquals("\"synthetic\"", js("localStorage.getItem('miscare-validation-marker')"));
    }

    /** Run after force-stop and installing the next validation version with -r. */
    private void updateKeepsJournalAndPausedSession() throws Exception {
        begin("return {logs:(await api.getLogs()).logs.map(log => log.id)," +
            "hasCheckpoint:!!(await api.getActiveWorkout()),origin:location.origin," +
            "marker:localStorage.getItem('miscare-validation-marker')};");
        JSONObject diagnostic = finish().getJSONObject("value");
        assertEquals("Journal after update: " + diagnostic, 1, diagnostic.getJSONArray("logs").length());
        assertEquals("Checkpoint after update: " + diagnostic, true, diagnostic.getBoolean("hasCheckpoint"));
        assertEquals("Validation preferences after update: " + diagnostic,
            "\"synthetic\"", js("localStorage.getItem('miscare-validation-marker')"));
        await("document.querySelector('#guided-pause-btn')?.textContent.includes('Continuă')");
        assertEquals(js("localStorage.getItem('miscare-validation-reps')"),
            js("document.querySelector('#rep-value').textContent"));
        begin("return (await api.getLogs()).logs;");
        JSONArray logs = finish().getJSONArray("value");
        assertEquals(1, logs.length());
        assertEquals("synthetic-release-workout", logs.getJSONObject(0).getString("id"));
    }
}
