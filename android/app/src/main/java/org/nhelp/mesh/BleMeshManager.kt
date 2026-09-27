package org.nhelp.mesh

import android.Manifest
import android.annotation.SuppressLint
import android.bluetooth.*
import android.bluetooth.le.*
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.os.ParcelUuid
import android.util.Log
import java.nio.charset.StandardCharsets
import java.util.*
import java.util.concurrent.ConcurrentHashMap

/**
 * Enterprise-grade, BitChat-style Bluetooth Low Energy Mesh Manager for N-HELP.
 * Combines ultra-low-latency BLE Advertising with GATT Server & Client for reliable,
 * uncorrupted multi-hop off-grid message delivery without internet.
 */
object BleMeshManager {

    const val TAG = "BleMeshManager"
    val MESH_SERVICE_UUID: UUID = UUID.fromString("0000FE42-0000-1000-8000-00805F9B34FB")
    val PARCEL_SERVICE_UUID = ParcelUuid(MESH_SERVICE_UUID)
    val CHARACTERISTIC_UUID: UUID = UUID.fromString("0000FE43-0000-1000-8000-00805F9B34FB")

    private var appContext: Context? = null
    private var bluetoothManager: BluetoothManager? = null
    private var bluetoothAdapter: BluetoothAdapter? = null
    private var advertiser: BluetoothLeAdvertiser? = null
    private var scanner: BluetoothLeScanner? = null
    private var gattServer: BluetoothGattServer? = null

    // Message store & sequence tracking
    @Volatile private var currentPacketSeq: Int = 1
    @Volatile private var currentMeshMessagePayload: String = ""
    private val processedPeerSequences = ConcurrentHashMap<String, Int>()

    val discoveredPeers = ConcurrentHashMap<String, Long>()
    val seenMessageIds = Collections.newSetFromMap(ConcurrentHashMap<String, Boolean>())
    var packetListener: ((String) -> Unit)? = null

    var isScanning = false
        private set
    var isAdvertising = false
        private set

    fun init(context: Context) {
        appContext = context.applicationContext
        try {
            bluetoothManager = context.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager
            bluetoothAdapter = bluetoothManager?.adapter
            Log.d(TAG, "BleMeshManager initialized. Bluetooth available: ${bluetoothAdapter != null}")
            setupGattServer()
        } catch (e: Exception) {
            Log.e(TAG, "Error initializing Bluetooth adapter: ${e.message}")
        }
    }

    fun isBluetoothEnabled(): Boolean {
        try {
            val ctx = appContext
            if (ctx != null) {
                bluetoothManager = ctx.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager
                bluetoothAdapter = bluetoothManager?.adapter
            }
        } catch (e: Exception) {
            // ignore
        }
        return bluetoothAdapter?.isEnabled == true
    }

    fun hasPermissions(context: Context?): Boolean {
        val ctx = context ?: appContext ?: return false
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            ctx.checkSelfPermission(Manifest.permission.BLUETOOTH_SCAN) == PackageManager.PERMISSION_GRANTED &&
            ctx.checkSelfPermission(Manifest.permission.BLUETOOTH_ADVERTISE) == PackageManager.PERMISSION_GRANTED &&
            ctx.checkSelfPermission(Manifest.permission.BLUETOOTH_CONNECT) == PackageManager.PERMISSION_GRANTED
        } else {
            ctx.checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED ||
            ctx.checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
        }
    }

    @SuppressLint("MissingPermission")
    private fun setupGattServer() {
        val ctx = appContext ?: return
        if (!hasPermissions(ctx) || !isBluetoothEnabled() || gattServer != null) return

        try {
            val callback = object : BluetoothGattServerCallback() {
                override fun onCharacteristicReadRequest(
                    device: BluetoothDevice?,
                    requestId: Int,
                    offset: Int,
                    characteristic: BluetoothGattCharacteristic?
                ) {
                    super.onCharacteristicReadRequest(device, requestId, offset, characteristic)
                    if (characteristic?.uuid == CHARACTERISTIC_UUID) {
                        val data = currentMeshMessagePayload.toByteArray(StandardCharsets.UTF_8)
                        val slice = if (offset < data.size) data.copyOfRange(offset, data.size) else byteArrayOf()
                        gattServer?.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, offset, slice)
                    } else {
                        gattServer?.sendResponse(device, requestId, BluetoothGatt.GATT_FAILURE, 0, null)
                    }
                }
            }

            gattServer = bluetoothManager?.openGattServer(ctx, callback)
            val service = BluetoothGattService(MESH_SERVICE_UUID, BluetoothGattService.SERVICE_TYPE_PRIMARY)
            val characteristic = BluetoothGattCharacteristic(
                CHARACTERISTIC_UUID,
                BluetoothGattCharacteristic.PROPERTY_READ or BluetoothGattCharacteristic.PROPERTY_NOTIFY,
                BluetoothGattCharacteristic.PERMISSION_READ
            )
            service.addCharacteristic(characteristic)
            gattServer?.addService(service)
            Log.d(TAG, "BLE GATT Mesh Server published successfully.")
        } catch (e: Exception) {
            Log.e(TAG, "Error publishing GATT server: ${e.message}")
        }
    }

    private var presenceHandler: android.os.Handler? = null
    private var presenceRunnable: Runnable? = null
    private var presenceAdvertiseCallback: AdvertiseCallback? = null
    private var advertisingTimeoutHandler: android.os.Handler? = null
    private var advertisingTimeoutRunnable: Runnable? = null
    private var scanRecycleHandler: android.os.Handler? = null
    private var scanRecycleRunnable: Runnable? = null

    @SuppressLint("MissingPermission")
    fun startScanning() {
        val ctx = appContext ?: return
        if (!hasPermissions(ctx)) {
            Log.w(TAG, "Cannot start scanning: Bluetooth permissions not granted.")
            return
        }

        if (!isBluetoothEnabled()) {
            Log.w(TAG, "Cannot start scanning: Bluetooth adapter is turned off.")
            return
        }

        if (isScanning) return

        try {
            bluetoothManager = ctx.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager
            bluetoothAdapter = bluetoothManager?.adapter
            scanner = bluetoothAdapter?.bluetoothLeScanner

            if (scanner == null) {
                Log.e(TAG, "BluetoothLeScanner is null.")
                return
            }

            setupGattServer()

            val filter = ScanFilter.Builder()
                .setServiceUuid(PARCEL_SERVICE_UUID)
                .build()

            val settings = ScanSettings.Builder()
                .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
                .build()

            scanner?.startScan(listOf(filter), settings, scanCallback)
            isScanning = true
            Log.i(TAG, "BLE Mesh Scanner started successfully.")
            startPresenceBeacon()
            startScanRecycleWatchdog()
        } catch (e: SecurityException) {
            Log.e(TAG, "SecurityException starting BLE scanner: ${e.message}")
        } catch (e: Exception) {
            Log.e(TAG, "Exception starting BLE scanner: ${e.message}")
        }
    }

    @SuppressLint("MissingPermission")
    fun stopScanning() {
        stopPresenceBeacon()
        stopScanRecycleWatchdog()
        if (!isScanning) return
        try {
            scanner?.stopScan(scanCallback)
            isScanning = false
            Log.d(TAG, "BLE Mesh Scanner stopped.")
        } catch (e: Exception) {
            Log.e(TAG, "Error stopping scanner: ${e.message}")
        }
    }

    private fun startScanRecycleWatchdog() {
        stopScanRecycleWatchdog()
        scanRecycleHandler = android.os.Handler(android.os.Looper.getMainLooper())
        scanRecycleRunnable = object : Runnable {
            override fun run() {
                val ctx = appContext
                if (isScanning && ctx != null && hasPermissions(ctx) && isBluetoothEnabled()) {
                    Log.d(TAG, "Recycling BLE scanner to prevent Android OS scan throttling...")
                    try {
                        scanner?.stopScan(scanCallback)
                    } catch (e: Exception) {
                        // ignore
                    }
                    scanRecycleHandler?.postDelayed({
                        val c = appContext
                        if (isScanning && c != null && hasPermissions(c) && isBluetoothEnabled()) {
                            try {
                                val filter = ScanFilter.Builder()
                                    .setServiceUuid(PARCEL_SERVICE_UUID)
                                    .build()
                                val settings = ScanSettings.Builder()
                                    .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
                                    .build()
                                scanner?.startScan(listOf(filter), settings, scanCallback)
                                Log.d(TAG, "BLE Mesh scanner successfully recycled.")
                            } catch (e: Exception) {
                                Log.w(TAG, "Transient scanner recycle restart error: ${e.message}")
                            }
                        }
                    }, 400)
                }
                scanRecycleHandler?.postDelayed(this, 40000)
            }
        }
        scanRecycleHandler?.postDelayed(scanRecycleRunnable!!, 40000)
    }

    private fun stopScanRecycleWatchdog() {
        scanRecycleRunnable?.let { scanRecycleHandler?.removeCallbacks(it) }
        scanRecycleHandler = null
        scanRecycleRunnable = null
    }

    fun startPresenceBeacon() {
        if (presenceHandler != null) return
        presenceHandler = android.os.Handler(android.os.Looper.getMainLooper())
        presenceRunnable = object : Runnable {
            override fun run() {
                val ctx = appContext
                if (ctx != null && hasPermissions(ctx) && isBluetoothEnabled() && !isAdvertising) {
                    broadcastPresencePing()
                }
                presenceHandler?.postDelayed(this, 10000)
            }
        }
        presenceHandler?.postDelayed(presenceRunnable!!, 300)
    }

    fun stopPresenceBeacon() {
        presenceRunnable?.let { presenceHandler?.removeCallbacks(it) }
        presenceHandler = null
        presenceRunnable = null
        try {
            presenceAdvertiseCallback?.let {
                advertiser?.stopAdvertising(it)
                presenceAdvertiseCallback = null
            }
        } catch (e: Exception) {
            // ignore
        }
    }

    @SuppressLint("MissingPermission")
    private fun broadcastPresencePing() {
        val ctx = appContext ?: return
        if (!hasPermissions(ctx) || !isBluetoothEnabled() || isAdvertising) return

        try {
            advertiser = bluetoothAdapter?.bluetoothLeAdvertiser ?: return

            // Stop previous presence advertisement to avoid hardware slot leak
            try {
                presenceAdvertiseCallback?.let { advertiser?.stopAdvertising(it) }
            } catch (e: Exception) {
                // ignore
            }

            val presenceData = byteArrayOf(0x4E.toByte(), 0x48.toByte(), 0x00.toByte(), 0x00.toByte())
            val settings = AdvertiseSettings.Builder()
                .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_POWER)
                .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_MEDIUM)
                .setConnectable(true)
                .setTimeout(3500)
                .build()

            val data = AdvertiseData.Builder()
                .addServiceUuid(PARCEL_SERVICE_UUID)
                .addServiceData(PARCEL_SERVICE_UUID, presenceData)
                .setIncludeDeviceName(false)
                .build()

            val newCallback = object : AdvertiseCallback() {
                override fun onStartSuccess(settingsInEffect: AdvertiseSettings?) {
                    Log.d(TAG, "BLE Mesh presence beacon transmitted.")
                }
                override fun onStartFailure(errorCode: Int) {
                    Log.d(TAG, "Transient presence advertise failure: $errorCode")
                    if (errorCode == AdvertiseCallback.ADVERTISE_FAILED_ALREADY_STARTED) {
                        try { advertiser?.stopAdvertising(this) } catch (e: Exception) {}
                    }
                }
            }
            presenceAdvertiseCallback = newCallback
            advertiser?.startAdvertising(settings, data, newCallback)
        } catch (e: Exception) {
            // Ignore transient advertise exception
        }
    }

    private val scanCallback = object : ScanCallback() {
        override fun onScanResult(callbackType: Int, result: ScanResult?) {
            result?.let { handleScanResult(it) }
        }

        override fun onBatchScanResults(results: MutableList<ScanResult>?) {
            results?.forEach { handleScanResult(it) }
        }

        override fun onScanFailed(errorCode: Int) {
            Log.e(TAG, "BLE Scan failed with errorCode: $errorCode")
            isScanning = false
            if (errorCode == ScanCallback.SCAN_FAILED_ALREADY_STARTED) {
                isScanning = true
            } else {
                android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
                    val ctx = appContext
                    if (!isScanning && ctx != null && hasPermissions(ctx) && isBluetoothEnabled()) {
                        startScanning()
                    }
                }, 4000)
            }
        }
    }

    @SuppressLint("MissingPermission")
    private fun handleScanResult(result: ScanResult) {
        val record = result.scanRecord ?: return
        val rawData = record.getServiceData(PARCEL_SERVICE_UUID) ?: return
        if (rawData.isEmpty()) return

        // Verify N-HELP Mesh Protocol header [0x4E, 0x48] (ASCII 'NH')
        if (rawData.size >= 4 && rawData[0] == 0x4E.toByte() && rawData[1] == 0x48.toByte()) {
            val deviceAddress = result.device.address ?: "Unknown-Node"
            // Verified N-HELP node - track active peer
            discoveredPeers[deviceAddress] = System.currentTimeMillis()

            val peerSeq = ((rawData[2].toInt() and 0xFF) shl 8) or (rawData[3].toInt() and 0xFF)

            // peerSeq == 0 is an idle presence beacon
            if (peerSeq == 0) {
                Log.d(TAG, "Spotted N-HELP presence beacon from node $deviceAddress")
                return
            }

            val lastSeenSeq = processedPeerSequences[deviceAddress] ?: -1
            if (peerSeq != lastSeenSeq) {
                processedPeerSequences[deviceAddress] = peerSeq
                Log.d(TAG, "Spotted new mesh packet seq $peerSeq from $deviceAddress. Connecting GATT with TRANSPORT_LE...")

                // Read full intact message from peer's GATT Server
                readFromPeerGatt(result.device)
            }
        } else {
            // Direct payload format
            try {
                val payloadStr = String(rawData, StandardCharsets.UTF_8)
                if (payloadStr.startsWith("{") && payloadStr.endsWith("}")) {
                    val deviceAddress = result.device.address ?: "Unknown-Node"
                    discoveredPeers[deviceAddress] = System.currentTimeMillis()
                    packetListener?.invoke(payloadStr)
                }
            } catch (e: Exception) {
                Log.e(TAG, "Failed to parse direct BLE payload: ${e.message}")
            }
        }
    }

    @SuppressLint("MissingPermission")
    private fun readFromPeerGatt(device: BluetoothDevice) {
        val ctx = appContext ?: return
        if (!hasPermissions(ctx)) return

        try {
            var gattClient: BluetoothGatt? = null
            val gattCallback = object : BluetoothGattCallback() {
                override fun onConnectionStateChange(gatt: BluetoothGatt?, status: Int, newState: Int) {
                    if (newState == BluetoothProfile.STATE_CONNECTED) {
                        Log.d(TAG, "GATT Connected to ${device.address}. Requesting MTU 512...")
                        val mtuRequested = gatt?.requestMtu(512) ?: false
                        if (!mtuRequested) {
                            gatt?.discoverServices()
                        }
                    } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                        gattClient?.close()
                        gattClient = null
                    }
                }

                override fun onMtuChanged(gatt: BluetoothGatt?, mtu: Int, status: Int) {
                    Log.d(TAG, "GATT MTU updated: $mtu (status: $status). Discovering services...")
                    gatt?.discoverServices()
                }

                override fun onServicesDiscovered(gatt: BluetoothGatt?, status: Int) {
                    if (status == BluetoothGatt.GATT_SUCCESS) {
                        val service = gatt?.getService(MESH_SERVICE_UUID)
                        val characteristic = service?.getCharacteristic(CHARACTERISTIC_UUID)
                        if (characteristic != null) {
                            gatt.readCharacteristic(characteristic)
                        } else {
                            gatt?.disconnect()
                        }
                    } else {
                        gatt?.disconnect()
                    }
                }

                private fun processPayload(bytes: ByteArray?) {
                    if (bytes != null && bytes.isNotEmpty()) {
                        val messagePayload = String(bytes, StandardCharsets.UTF_8)
                        Log.i(TAG, "GATT Mesh Message received successfully (${bytes.size} bytes): $messagePayload")
                        packetListener?.invoke(messagePayload)
                    }
                }

                override fun onCharacteristicRead(
                    gatt: BluetoothGatt,
                    characteristic: BluetoothGattCharacteristic,
                    value: ByteArray,
                    status: Int
                ) {
                    if (status == BluetoothGatt.GATT_SUCCESS) {
                        processPayload(value)
                    }
                    gatt.disconnect()
                }

                @Deprecated("Deprecated in Java")
                override fun onCharacteristicRead(
                    gatt: BluetoothGatt?,
                    characteristic: BluetoothGattCharacteristic?,
                    status: Int
                ) {
                    if (status == BluetoothGatt.GATT_SUCCESS && characteristic != null) {
                        @Suppress("DEPRECATION")
                        processPayload(characteristic.value)
                    }
                    gatt?.disconnect()
                }
            }

            gattClient = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                device.connectGatt(ctx, false, gattCallback, BluetoothDevice.TRANSPORT_LE)
            } else {
                device.connectGatt(ctx, false, gattCallback)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error connecting GATT client to peer: ${e.message}")
        }
    }

    @SuppressLint("MissingPermission")
    fun broadcastPacket(payload: String): Boolean {
        val ctx = appContext ?: return false
        if (!hasPermissions(ctx)) {
            Log.w(TAG, "Cannot advertise: Permissions not granted.")
            return false
        }

        if (!isBluetoothEnabled()) {
            Log.w(TAG, "Cannot advertise: Bluetooth adapter is off.")
            return false
        }

        try {
            setupGattServer()
            currentPacketSeq = (currentPacketSeq + 1) % 65535
            if (currentPacketSeq == 0) currentPacketSeq = 1
            currentMeshMessagePayload = payload

            advertiser = bluetoothAdapter?.bluetoothLeAdvertiser
            if (advertiser == null) {
                Log.e(TAG, "BluetoothLeAdvertiser is unavailable on this device.")
                return false
            }

            // Beacon data: 4 bytes [0x4E, 0x48, seq_high, seq_low]
            val beaconData = byteArrayOf(
                0x4E.toByte(),
                0x48.toByte(),
                ((currentPacketSeq shr 8) and 0xFF).toByte(),
                (currentPacketSeq and 0xFF).toByte()
            )

            val settings = AdvertiseSettings.Builder()
                .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
                .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH)
                .setConnectable(true)
                .setTimeout(8000)
                .build()

            val data = AdvertiseData.Builder()
                .addServiceUuid(PARCEL_SERVICE_UUID)
                .addServiceData(PARCEL_SERVICE_UUID, beaconData)
                .setIncludeDeviceName(false)
                .build()

            advertiser?.startAdvertising(settings, data, object : AdvertiseCallback() {
                override fun onStartSuccess(settingsInEffect: AdvertiseSettings?) {
                    isAdvertising = true
                    Log.i(TAG, "BLE Mesh Beacon #$currentPacketSeq advertised successfully.")
                }

                override fun onStartFailure(errorCode: Int) {
                    isAdvertising = false
                    Log.e(TAG, "BLE Mesh Advertise failed with error: $errorCode")
                }
            })

            // Auto-reset isAdvertising after the 8-second advertisement timeout expires (+200ms grace period)
            advertisingTimeoutRunnable?.let { advertisingTimeoutHandler?.removeCallbacks(it) }
            advertisingTimeoutHandler = android.os.Handler(android.os.Looper.getMainLooper())
            advertisingTimeoutRunnable = Runnable {
                isAdvertising = false
                Log.d(TAG, "BLE Mesh packet advertise completed; resuming presence beacon.")
            }
            advertisingTimeoutHandler?.postDelayed(advertisingTimeoutRunnable!!, 8200)

            // Deliver immediately to local listener for instant responsive UI
            packetListener?.invoke(payload)
            return true
        } catch (e: SecurityException) {
            Log.e(TAG, "SecurityException in broadcastPacket: ${e.message}")
            return false
        } catch (e: Exception) {
            Log.e(TAG, "Exception in broadcastPacket: ${e.message}")
            return false
        }
    }

    fun getDiscoveredPeersJson(): String {
        val now = System.currentTimeMillis()
        // Retain peers heard within 90 seconds (tolerant of transient RF collisions)
        val activePeers = discoveredPeers.filter { (now - it.value) < 90000 }.keys.toList()

        // Clean up stale entries older than 3 minutes to keep memory clean
        discoveredPeers.entries.removeIf { (now - it.value) > 180000 }

        val peersList = mutableListOf<Map<String, Any>>()

        for (addr in activePeers) {
            peersList.add(
                mapOf(
                    "id" to addr,
                    "name" to "BLE-Peer-${addr.takeLast(4).uppercase()}",
                    "transport" to "NATIVE_MESH",
                    "hopsAway" to 1
                )
            )
        }

        val jsonBuilder = StringBuilder("[")
        peersList.forEachIndexed { index, peer ->
            jsonBuilder.append("{")
            jsonBuilder.append("\"id\":\"${peer["id"]}\",")
            jsonBuilder.append("\"name\":\"${peer["name"]}\",")
            jsonBuilder.append("\"transport\":\"${peer["transport"]}\",")
            jsonBuilder.append("\"hopsAway\":${peer["hopsAway"]}")
            jsonBuilder.append("}")
            if (index < peersList.size - 1) jsonBuilder.append(",")
        }
        jsonBuilder.append("]")
        return jsonBuilder.toString()
    }
}
