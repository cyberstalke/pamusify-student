import React, {useState, useEffect} from "react";
import {View, Text, StyleSheet, Button} from "react-native";
import {CameraView, useCameraPermissions} from "expo-camera";

export default function QRScanner() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [qrData, setQrData] = useState(null);

    useEffect(() => {
        if (!permission) {
            requestPermission();
        }
    }, []);

    if (!permission) {
        return <Text>Requesting camera permission...</Text>;
    }

    if (!permission.granted) {
        return (
            <View style={styles.center}>
                <Text>We need your permission to use the camera</Text>
                <Button title="Grant Permission" onPress={requestPermission}/>
            </View>
        );
    }

    const handleScan = ({data}) => {
        setScanned(true);
        setQrData(data);
    };

    return (
        <View style={styles.container}>
            {!scanned ? (
                <CameraView
                    style={StyleSheet.absoluteFillObject}
                    facing="back"
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                    }}
                    onBarcodeScanned={handleScan}
                />
            ) : (
                <View style={styles.center}>
                    <Text style={styles.result}>Status: {console.log(qrData)}</Text>
                    <Text
                        style={styles.data}>{qrData === "https://t.me/SoraKaeru" ? "Success" : "Denied"}</Text>
                    <Button title="Scan Again" onPress={() => setScanned(false)}/>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
    },
    result: {
        color: "#fff",
        fontSize: 18,
        marginBottom: 10,
    },
    data: {
        color: "#0f0",
        fontSize: 16,
        marginBottom: 20,
    },
});
