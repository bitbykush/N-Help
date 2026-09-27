package org.nhelp.mesh

import android.app.Activity
import android.webkit.JavascriptInterface
import android.webkit.WebView

/**
 * JavaScript Interface binding native Android BLE mesh service to window.NHelpNativeMeshBridge
 */
class NativeMeshBridge(
    private val activity: Activity,
    private val webView: WebView
) {

    @JavascriptInterface
    fun isAvailable(): Boolean {
        return true
    }

    @JavascriptInterface
    fun isNetworkOnline(): Boolean {
        return if (activity is MainActivity) {
            activity.isNetworkOnline()
        } else {
            false
        }
    }

    @JavascriptInterface
    fun isBluetoothEnabled(): Boolean {
        return BleMeshManager.isBluetoothEnabled()
    }

    @JavascriptInterface
    fun hasPermissions(): Boolean {
        return BleMeshManager.hasPermissions(activity)
    }

    @JavascriptInterface
    fun requestPermissions() {
        activity.runOnUiThread {
            if (activity is MainActivity) {
                activity.checkAndRequestBlePermissions()
            }
        }
    }

    @JavascriptInterface
    fun sendBleMeshPacket(jsonPayload: String): Boolean {
        return BleMeshManager.broadcastPacket(jsonPayload)
    }

    @JavascriptInterface
    fun getDiscoveredBlePeers(): String {
        return BleMeshManager.getDiscoveredPeersJson()
    }

    @JavascriptInterface
    fun getRadioDiagnostics(): String {
        val bt = BleMeshManager.isBluetoothEnabled()
        val perm = BleMeshManager.hasPermissions(activity)
        val scan = BleMeshManager.isScanning
        val adv = BleMeshManager.isAdvertising
        val peers = BleMeshManager.discoveredPeers.size
        return "{\"bluetoothEnabled\":$bt,\"permissionsGranted\":$perm,\"isScanning\":$scan,\"isAdvertising\":$adv,\"peersCount\":$peers}"
    }

    @JavascriptInterface
    fun syncRadio() {
        activity.runOnUiThread {
            if (BleMeshManager.hasPermissions(activity) && BleMeshManager.isBluetoothEnabled()) {
                BleMeshManager.init(activity.applicationContext)
                if (activity is MainActivity) {
                    activity.startMeshRadioService()
                }
                BleMeshManager.startScanning()
            }
        }
    }

    @JavascriptInterface
    fun registerCallback(callbackFunctionName: String) {
        BleMeshManager.packetListener = { packetPayload ->
            webView.post {
                val escaped = packetPayload.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")
                webView.evaluateJavascript("if (window.$callbackFunctionName) { window.$callbackFunctionName('$escaped'); }", null)
            }
        }
    }
}
