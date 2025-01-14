#!/bin/bash

# Setup systemd service for camera

setup_systemd_service() {
    service_name=$1
    bash_script=$2

    service_file="/etc/systemd/system/${service_name}.service"

    echo "Creating systemd service file at '$service_file'..."

    sudo bash -c "cat > $service_file" <<EOL
[Unit]
Description=Service to run a RTSP camera stream
After=network.target

[Service]
ExecStart=/bin/bash $bash_script
Restart=always
RestartSec=10
User=$USER
WorkingDirectory=$(pwd)
StandardOutput=append:/var/log/${service_name}.log
StandardError=append:/var/log/${service_name}_err.log

[Install]
WantedBy=multi-user.target
EOL

    # Set proper permissions for the service file
    sudo chmod 644 $service_file

    # Reload systemd to recognize the new service
    sudo systemctl daemon-reload

    # Enable the service to start at boot
    sudo systemctl enable $service_name.service

    # Start the service immediately
    sudo systemctl start $service_name.service

    echo "Service $service_name created, enabled, and started successfully."
    echo "Use 'sudo systemctl status $service_name.service' to check its status."

}

echo "Setting up systemd service..."

sudo apt-get install -y vlc

cp camera.sh /etc/camera.sh

echo "Do you want to add the program to the systemd service to start the program on boot & on crash? (y/n)"
read add_to_systemd

if [ "$add_to_systemd" != "y" ]; then
    echo "Systemd service not added."   
else
    setup_systemd_service "camera_rtsp" "camera.sh" 

    echo "Systemd services setup complete."
fi

echo "Systemd service setup complete."