# Camera

In order to run the camera, the Raspberry Pi must have:

- Camera module connected and activated in the Raspberry Pi configuration

Then, the camera rtsp streaming can be run at boot by executing the following command:

```bash
sudo bash setup_camera.sh
```

This will create a systemd service that will run the camera streaming at boot and restart it if it fails.

In order to see if the service is running, execute the following command:

```bash
sudo systemctl status camera_rtsp
```

In order to access the real-time streaming, open VLC and access the following URL:

```bash
rtsp://<IP>:8554/camera
```
