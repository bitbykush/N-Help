package org.nhelp.mesh

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.bluetooth.BluetoothAdapter
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast

class MainActivity : Activity() {

    private lateinit var webView: WebView
    private val PERMISSION_REQUEST_CODE = 1001
    private var connectivityManager: ConnectivityManager? = null
    private var networkCallback: ConnectivityManager.NetworkCallback? = null
    private var isBluetoothReceiverRegistered = false

    private val bluetoothReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent?.action == BluetoothAdapter.ACTION_STATE_CHANGED) {
                val state = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE, BluetoothAdapter.ERROR)
                when (state) {
                    BluetoothAdapter.STATE_ON -> {
                        Log.i("MainActivity", "Bluetooth turned ON while app is open -> initializing radio & scanning")
                        BleMeshManager.init(applicationContext)
                        if (BleMeshManager.hasPermissions(this@MainActivity)) {
                            startMeshRadioService()
                            BleMeshManager.startScanning()
                        }
                        notifyWebRadioState()
                    }
                    BluetoothAdapter.STATE_TURNING_OFF, BluetoothAdapter.STATE_OFF -> {
                        Log.i("MainActivity", "Bluetooth turned OFF -> stopping radio")
                        BleMeshManager.stopScanning()
                        notifyWebRadioState()
                    }
                }
            }
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 1. Initialize WebView Container
        webView = WebView(this)
        setContentView(webView)

        configureWebViewSettings()

        // 2. Initialize BLE Mesh Manager with Application Context
        BleMeshManager.init(applicationContext)

        // 3. Inject Native Mesh Bridge into window.NHelpNativeMeshBridge
        val bridge = NativeMeshBridge(this, webView)
        webView.addJavascriptInterface(bridge, "NHelpNativeMeshBridge")

        // 4. Setup Real Hardware Network & Bluetooth Monitoring
        setupNetworkMonitoring()
        setupBluetoothMonitoring()

        // 5. Setup WebView Clients
        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                // Push real network status immediately on page load
                notifyWebNetworkState(isNetworkOnline())
                notifyWebRadioState()
                processSyncIntent(intent)
            }
        }

        webView.webChromeClient = WebChromeClient()

        // 6. Check permissions and conditionally start radio
        if (BleMeshManager.hasPermissions(this)) {
            startMeshRadioService()
            if (BleMeshManager.isBluetoothEnabled()) {
                BleMeshManager.startScanning()
            }
        } else {
            // Request permissions on first launch without crashing
            checkAndRequestBlePermissions()
        }

        // 7. Load N-HELP production bundle directly from offline assets
        webView.loadUrl("file:///android_asset/index.html")
    }

    override fun onNewIntent(newIntent: Intent?) {
        super.onNewIntent(newIntent)
        setIntent(newIntent)
        processSyncIntent(newIntent)
    }

    private fun processSyncIntent(intent: Intent?) {
        val data = intent?.data
        if (data?.scheme == "nhelp") {
            val payload = data.getQueryParameter("data") ?: data.encodedQuery
            if (!payload.isNullOrEmpty()) {
                val cleanPayload = payload.replace("'", "\\'")
                webView.post {
                    webView.evaluateJavascript("if (window.NHelpApplySyncPayload) { window.NHelpApplySyncPayload('$cleanPayload'); }", null)
                }
            }
        }
    }

    private fun configureWebViewSettings() {
        val settings: WebSettings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.allowFileAccessFromFileURLs = true
        settings.allowUniversalAccessFromFileURLs = true
        settings.cacheMode = WebSettings.LOAD_DEFAULT
        settings.setSupportZoom(false)
    }

    fun isNetworkOnline(): Boolean {
        return try {
            val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager ?: return false
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                val activeNetwork = cm.activeNetwork ?: return false
                val caps = cm.getNetworkCapabilities(activeNetwork) ?: return false
                caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
            } else {
                @Suppress("DEPRECATION")
                val netInfo = cm.activeNetworkInfo
                netInfo != null && netInfo.isConnected
            }
        } catch (e: Exception) {
            Log.e("MainActivity", "isNetworkOnline check error: ${e.message}")
            false
        }
    }

    private fun setupNetworkMonitoring() {
        try {
            connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager
            val request = NetworkRequest.Builder()
                .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
                .build()

            val callback = object : ConnectivityManager.NetworkCallback() {
                override fun onAvailable(network: Network) {
                    Log.d("MainActivity", "Hardware network connected -> pushing ONLINE to WebView")
                    notifyWebNetworkState(true)
                }

                override fun onLost(network: Network) {
                    Log.d("MainActivity", "Hardware network disconnected -> pushing OFFLINE (MESH) to WebView")
                    notifyWebNetworkState(false)
                }

                override fun onCapabilitiesChanged(network: Network, capabilities: NetworkCapabilities) {
                    val hasInternet = capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
                    Log.d("MainActivity", "Hardware capabilities changed: hasInternet=$hasInternet")
                    notifyWebNetworkState(hasInternet)
                }
            }

            networkCallback = callback
            connectivityManager?.registerNetworkCallback(request, callback)
            Log.d("MainActivity", "Hardware NetworkCallback registered successfully.")
        } catch (e: Exception) {
            Log.e("MainActivity", "Error setting up network monitoring: ${e.message}")
        }
    }

    private fun setupBluetoothMonitoring() {
        try {
            val filter = IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED)
            registerReceiver(bluetoothReceiver, filter)
            isBluetoothReceiverRegistered = true
            Log.d("MainActivity", "Bluetooth runtime state monitor registered.")
        } catch (e: Exception) {
            Log.e("MainActivity", "Error registering Bluetooth monitor: ${e.message}")
        }
    }

    override fun onResume() {
        super.onResume()
        if (BleMeshManager.isBluetoothEnabled() && BleMeshManager.hasPermissions(this)) {
            if (!BleMeshManager.isScanning) {
                Log.d("MainActivity", "onResume: Bluetooth is ON -> auto-starting radio scanner")
                BleMeshManager.init(applicationContext)
                startMeshRadioService()
                BleMeshManager.startScanning()
            }
        }
        notifyWebRadioState()
    }

    fun notifyWebRadioState() {
        webView.post {
            val enabled = BleMeshManager.isBluetoothEnabled()
            val scanning = BleMeshManager.isScanning
            val js = """
                (function() {
                    window.__nativeBluetoothOnline = $enabled;
                    window.dispatchEvent(new CustomEvent('nhelp_radio_changed', { detail: { bluetooth: $enabled, scanning: $scanning } }));
                    if (window.__onNHelpRadioChanged) {
                        window.__onNHelpRadioChanged($enabled, $scanning);
                    }
                })();
            """.trimIndent()
            webView.evaluateJavascript(js, null)
        }
    }

    fun notifyWebNetworkState(online: Boolean) {
        webView.post {
            val eventType = if (online) "online" else "offline"
            val js = """
                (function() {
                    window.__nativeNetworkOnline = $online;
                    window.dispatchEvent(new Event('$eventType'));
                    if (window.__onNHelpNetworkStateChanged) {
                        window.__onNHelpNetworkStateChanged($online);
                    }
                })();
            """.trimIndent()
            webView.evaluateJavascript(js, null)
        }
    }

    fun checkAndRequestBlePermissions() {
        val permissions = mutableListOf<String>()

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            // Android 12+ Bluetooth permissions
            if (checkSelfPermission(Manifest.permission.BLUETOOTH_SCAN) != PackageManager.PERMISSION_GRANTED) {
                permissions.add(Manifest.permission.BLUETOOTH_SCAN)
            }
            if (checkSelfPermission(Manifest.permission.BLUETOOTH_ADVERTISE) != PackageManager.PERMISSION_GRANTED) {
                permissions.add(Manifest.permission.BLUETOOTH_ADVERTISE)
            }
            if (checkSelfPermission(Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                permissions.add(Manifest.permission.BLUETOOTH_CONNECT)
            }
        } else {
            // Android 6 - 11 Location permissions for BLE scanning
            if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                permissions.add(Manifest.permission.ACCESS_FINE_LOCATION)
            }
            if (checkSelfPermission(Manifest.permission.BLUETOOTH) != PackageManager.PERMISSION_GRANTED) {
                permissions.add(Manifest.permission.BLUETOOTH)
            }
            if (checkSelfPermission(Manifest.permission.BLUETOOTH_ADMIN) != PackageManager.PERMISSION_GRANTED) {
                permissions.add(Manifest.permission.BLUETOOTH_ADMIN)
            }
        }

        // Notification permission for Android 13+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                permissions.add(Manifest.permission.POST_NOTIFICATIONS)
            }
        }

        if (permissions.isNotEmpty()) {
            requestPermissions(permissions.toTypedArray(), PERMISSION_REQUEST_CODE)
        }
    }

    fun startMeshRadioService() {
        if (!BleMeshManager.hasPermissions(this)) {
            Log.w("MainActivity", "Cannot start mesh radio service: Missing permissions.")
            return
        }

        try {
            val serviceIntent = Intent(this, BluetoothLeService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(serviceIntent)
            } else {
                startService(serviceIntent)
            }
        } catch (e: Exception) {
            Log.e("MainActivity", "Error starting mesh service: ${e.message}")
        }
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == PERMISSION_REQUEST_CODE) {
            val allGranted = grantResults.isNotEmpty() && grantResults.all { it == PackageManager.PERMISSION_GRANTED }
            if (allGranted) {
                Toast.makeText(this, "N-HELP: Bluetooth Mesh Radio Ready", Toast.LENGTH_SHORT).show()
                startMeshRadioService()
                BleMeshManager.startScanning()

                webView.post {
                    webView.evaluateJavascript("if (window.__onNHelpPermissionsGranted) { window.__onNHelpPermissionsGranted(); }", null)
                }
            } else {
                Toast.makeText(
                    this,
                    "N-HELP: Local offline mode active. Enable Bluetooth in Settings for peer mesh relay.",
                    Toast.LENGTH_LONG
                ).show()
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        if (isBluetoothReceiverRegistered) {
            try {
                unregisterReceiver(bluetoothReceiver)
                isBluetoothReceiverRegistered = false
            } catch (e: Exception) {
                // ignore
            }
        }
        networkCallback?.let {
            try {
                connectivityManager?.unregisterNetworkCallback(it)
            } catch (e: Exception) {
                // ignore
            }
        }
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
