package com.zandaulion.miscare;

import android.app.Activity;
import android.content.Intent;
import android.view.WindowManager;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

/** User-selected documents only; no storage permission or shared backup directory. */
@CapacitorPlugin(name = "LocalData")
public class LocalDataPlugin extends Plugin {
    private static final int LIMIT = 20 * 1024 * 1024;

    @PluginMethod public void keepAwake(PluginCall call) {
        boolean enabled = call.getBoolean("enabled", false);
        getActivity().runOnUiThread(() -> {
            if (enabled) getActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            else getActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            call.resolve();
        });
    }

    @PluginMethod public void exportData(PluginCall call) {
        String text = call.getString("text");
        if (text == null || text.getBytes(StandardCharsets.UTF_8).length > LIMIT) { call.reject("Backup prea mare"); return; }
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/json");
        intent.putExtra(Intent.EXTRA_TITLE, "miscare-backup.json");
        startActivityForResult(call, intent, "exportResult");
    }

    @ActivityCallback private void exportResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null || result.getData().getData() == null) {
            call.resolve(); return;
        }
        getBridge().execute(() -> {
            try (OutputStream output = getContext().getContentResolver().openOutputStream(result.getData().getData(), "wt")) {
                if (output == null) throw new java.io.IOException("Document indisponibil");
                output.write(call.getString("text").getBytes(StandardCharsets.UTF_8));
                call.resolve();
            } catch (Exception e) { call.reject("Nu am putut exporta datele", e); }
        });
    }

    @PluginMethod public void importData(PluginCall call) {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("*/*");
        startActivityForResult(call, intent, "importResult");
    }

    @ActivityCallback private void importResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null || result.getData().getData() == null) {
            call.resolve(new JSObject()); return;
        }
        getBridge().execute(() -> {
            try (InputStream input = getContext().getContentResolver().openInputStream(result.getData().getData());
                 ByteArrayOutputStream output = new ByteArrayOutputStream()) {
                if (input == null) throw new java.io.IOException("Document indisponibil");
                byte[] buffer = new byte[8192];
                int length;
                while ((length = input.read(buffer)) != -1) {
                    if (output.size() + length > LIMIT) throw new java.io.IOException("Backup prea mare");
                    output.write(buffer, 0, length);
                }
                JSObject response = new JSObject();
                response.put("text", output.toString(StandardCharsets.UTF_8.name()));
                call.resolve(response);
            } catch (Exception e) { call.reject("Fișier de backup invalid", e); }
        });
    }
}
