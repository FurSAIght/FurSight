import os, sys
from utils.log import Logger
from supabase import create_client, Client
from supabase.client import ClientOptions
from postgrest import APIError
import httpx
from time import sleep

class Database:
    processor_id : str = None
    device_id : str = None
    stop_device : bool = False # Used in dry mode to stop the device from running
    not_connected : bool = False
    
    def handle_db_calls(func):
        """
        Decorator used to catch exceptions that occur when calling the database

        Args:
            func (function): Function to be decorated.
        """
        def wrapper(self, *args, **kwargs):
            res = None
            try:
                res = func(self, *args, **kwargs)
            except APIError as e:
                self.logger.error("An API error occurred: " + str(e))
                raise e
            except Exception as e:
                self.logger.error("An unidentified error occurred: " + str(e))
                raise e
            return res
        return wrapper
    
    def __init__(self, *, logger : Logger) -> None:
        self.logger : Logger = logger
        self.logger.log("Connecting to the database...")
        
        self.client: Client = create_client(
            os.getenv("SUPABASE_URL"),
            os.getenv("SUPABASE_KEY"),
            options=ClientOptions(
                postgrest_client_timeout=10,
                storage_client_timeout=10,
                schema="public",
            )
        )
        
        self.connect()  
                        
    def connect(self) -> None:
        for attemp in range(3):
            try:
                self.client.table("users") \
                    .select("*") \
                    .limit("users") \
                    .execute()
                
                # No need to validate the response - receiving a response means the connection was made
                 
                self.logger.log("Database connection established.")
                
                return # Connection successful
            
            except httpx.ConnectError as e:
                # No connection to the network OR Supabase URL is invalid
                self.logger.error(f"ConnectError - Failed connecting to the database: {e}")
                self.logger.warning("Verify connection to the network OR if the Supabase URL is correct...")
                self.logger.warning(f"Attempt {attemp + 1} of 3 to restablish the connection.")
                sleep(1)
                
            except APIError as e:
                # Result of an invalid API Key most likely
                self.logger.error(f"APIError - Failed connecting to the database: {e}")
                sys.exit(1)
                
            except Exception as e:
                self.logger.error(f"Failed connecting to the database: {e}")
                self.logger.warning(f"Attempt {attemp + 1} of 3 to restablish the connection.")
                sleep(1)
            
        self.logger.error("Failed to connect to the database after 3 attempts. Proceeding without database connection...")
        self.not_connected = True
       
    def close(self) -> None:
        """
        Close the database connection
        """
        # Since we are using PostgREST, we don't need to close the connection
        self.logger.log("Database connection closed.")
            
    # ----------------------------- Database Operations -----------------------------

    def insert_metrics(self, id, value) -> None:
        """
        Insert metrics into the database

        Args:
            id (str): The id of the metric
            value (float): The value of the metric
        """
        if self.not_connected:
            return
        
        self.client.table("sensor_data") \
            .insert({"sensor_id": id, "value": value}) \
            .execute()
            
        self.logger.info(f"Inserted metric into the database: {id} - {value}")