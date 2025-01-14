import logging
import os

class Logger:
    """
    Logger class to log messages to a file.
    """
    
    def __init__(self, *, filename : str, is_dev_mode : bool = False) -> None:
        self.logger = logging.getLogger(filename)
        self.is_dev_mode : bool = is_dev_mode
        
        # Create the logs directory if it does not exist
        logs_dir : str = "logs"
        if not os.path.exists(logs_dir):
            os.makedirs(logs_dir)
                    
        filepath = os.path.join(logs_dir, f"{filename}.log")
        
        handler = logging.FileHandler(filepath)
        formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)
        self.logger.setLevel(logging.INFO)
    
    def log(self, message : str) -> None:
        """
        Log a message to the file.

        Args:
            message (str): Message to be logged.
        """
        if self.is_dev_mode:
            print(message)
        else:
            self.logger.info(message)
            
    def info(self, message : str) -> None:
        """
        Log an info message to the file.

        Args:
            message (str): Info message to be logged.
        """
        if self.is_dev_mode:
            print("[INFO]: " + message)
        else:
            self.logger.info(message)
    
    def error(self, message : str) -> None:
        """
        Log an error message to the file.

        Args:
            message (str): Error message to be logged.
        """
        if self.is_dev_mode:
            print("[ERROR]: " + message)
        else:
            self.logger.error(message)
    
    def warning(self, message : str) -> None:
        """
        Log a warning message to the file.

        Args:
            message (str): Warning message to be logged.
        """
        if self.is_dev_mode:
            print("[WARNING]: " + message)
        else:
            self.logger.warning(message)
        
        
    def close(self) -> None:
        """
        Close the logger.
        """
        
        if self.logger.hasHandlers():
            for handler in self.logger.handlers:
                handler.close()
                self.logger.removeHandler(handler)