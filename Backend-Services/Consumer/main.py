import sys
from utils.client import Client
from dotenv import load_dotenv

load_dotenv(override=True)

def main(is_dev_mode: bool):
    client = Client(is_dev_mode=is_dev_mode)        
    # Execute the processor
    client.execute()
        
if __name__ == "__main__":  
    if len(sys.argv) == 1:
        # Running in production mode
        main(is_dev_mode=False)
    elif len(sys.argv) == 2 and sys.argv[1] == "--dev":
        main(is_dev_mode=True)
    else:
        print("Invalid command.")
        sys.exit(1)