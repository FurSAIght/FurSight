install_rabbitmq() {
    if rabbitmqctl status; then
        echo "RabbitMQ is already installed"        
    else
        sudo apt-get update
        echo "Installing RabbitMQ"
        sudo apt-get install -y rabbitmq-server
        sudo rabbitmq-plugins enable rabbitmq_mqtt
        sudo systemctl enable rabbitmq-server
        sudo systemctl start rabbitmq-server
        sudo rabbitmq-plugins enable rabbitmq_management

        # Raspberry user
        sudo rabbitmqctl add_user raspberry raspberry
        sudo rabbitmqctl set_user_tags raspberry administrator
        sudo rabbitmqctl set_permissions -p / raspberry ".*" ".*" ".*"

        # Arduino Client user
        sudo rabbitmqctl add_user fx9600 zebra
        sudo rabbitmqctl set_user_tags fx9600 administrator
        sudo rabbitmqctl set_permissions -p / fx9600 ".*" ".*" ".*"
    fi
}

install_rabbitmq