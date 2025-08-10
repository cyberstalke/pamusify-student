import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { useScanBarcodes, BarcodeFormat } from "vision-camera-code-scanner";

export default function QRScanner() {
    const [hasPermission, setHasPermission] = useState(false);
    const devices = useCameraDevices();
    const device = devices.back;
    const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE]);

    useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission();
            setHasPermission(status === "authorized");
        })();
    }, []);

    return (
        <View style={styles.container}>
            {device != null && hasPermission ? (
                <Camera
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={true}
                    frameProcessor={frameProcessor}
                    frameProcessorFps={5}
                />
            ) : (
                <Text>Requesting camera permission...</Text>
            )}

            {barcodes.map((barcode, idx) => (
                <Text key={idx} style={styles.code}>
                    {barcode.displayValue}
                </Text>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    code: {
        position: "absolute",
        bottom: 40,
        left: 20,
        color: "#fff",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 10,
        borderRadius: 8
    }
});