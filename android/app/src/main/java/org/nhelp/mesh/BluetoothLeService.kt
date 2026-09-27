package org.nhelp.mesh

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import android.util.Log

/**
 * Background Foreground Service to maintain offline BLE mesh radio operation
 * when the app is minimized or the screen is locked during a blackout.
 */
class BluetoothLeService : Service() {

    companion object {
        const val TAG = "NHelpBleMeshService"
        const val NOTIFICATION_CHANNEL_ID = "n_help_mesh_channel"
        const val NOTIFICATION_ID = 1001
    }

    override fun onCreate() {
        super.onCreate()
        setupForegroundNotification()
        BleMeshManager.init(applicationContext)
        if (BleMeshManager.hasPermissions(this)) {
            BleMeshManager.startScanning()
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (BleMeshManager.hasPermissions(this)) {
            BleMeshManager.startScanning()
        }
        return START_STICKY
    }

    private fun setupForegroundNotification() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val channel = NotificationChannel(
                    NOTIFICATION_CHANNEL_ID,
                    "N-HELP Emergency Mesh Radio",
                    NotificationManager.IMPORTANCE_LOW
                ).apply {
                    description = "Maintains offline Bluetooth mesh relaying when grid collapses"
                }
                val manager = getSystemService(NotificationManager::class.java)
                manager?.createNotificationChannel(channel)

                val notification = Notification.Builder(this, NOTIFICATION_CHANNEL_ID)
                    .setContentTitle("N-HELP Mesh Radio Active")
                    .setContentText("Listening and relaying offline Bluetooth emergency packets")
                    .setSmallIcon(android.R.drawable.stat_notify_sync)
                    .setOngoing(true)
                    .build()

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    startForeground(
                        NOTIFICATION_ID,
                        notification,
                        ServiceInfo.FOREGROUND_SERVICE_TYPE_CONNECTED_DEVICE
                    )
                } else {
                    startForeground(NOTIFICATION_ID, notification)
                }
            }
        } catch (e: SecurityException) {
            Log.e(TAG, "SecurityException starting foreground service notification: ${e.message}")
        } catch (e: Exception) {
            Log.e(TAG, "Exception starting foreground service notification: ${e.message}")
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        BleMeshManager.stopScanning()
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }
}
