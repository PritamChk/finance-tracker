"""Configuration loader for application.properties files."""

import os
from configparser import ConfigParser
from pathlib import Path
from typing import Any


class Config:
    """Configuration manager for properties files."""

    def __init__(self, config_path: str | None = None):
        """Initialize configuration.

        Args:
            config_path: Path to properties file. If None, uses default.
        """
        self.parser = ConfigParser()
        self._load_config(config_path)

    def _load_config(self, config_path: str | None) -> None:
        """Load configuration from properties file.

        Args:
            config_path: Path to properties file.
        """
        if config_path is None:
            # Check MODULE_CONFIG env var first
            config_path = os.getenv("MODULE_CONFIG", "")
            if not config_path or not os.path.exists(config_path):
                # Default to application.properties in current working directory
                cwd = Path.cwd()
                env = os.getenv("APP_ENV", "")
                if env:
                    config_file = f"application-{env}.properties"
                else:
                    config_file = "application.properties"
                config_path = str(cwd / config_file)

        # ConfigParser requires a section header, add one if missing
        with open(config_path, "r") as f:
            content = f.read()

        if not content.startswith("["):
            content = "[default]\n" + content

        self.parser.read_string(content)

    def get(self, key: str, default: str = "") -> str:
        """Get configuration value.

        Args:
            key: Configuration key (e.g., 'auth.port')
            default: Default value if key not found.

        Returns:
            Configuration value.
        """
        section, option = self._parse_key(key)
        return self.parser.get(section, option, fallback=default)

    def get_int(self, key: str, default: int = 0) -> int:
        """Get configuration value as integer.

        Args:
            key: Configuration key.
            default: Default value if key not found.

        Returns:
            Configuration value as integer.
        """
        value = self.get(key, str(default))
        try:
            return int(value)
        except ValueError:
            return default

    def get_bool(self, key: str, default: bool = False) -> bool:
        """Get configuration value as boolean.

        Args:
            key: Configuration key.
            default: Default value if key not found.

        Returns:
            Configuration value as boolean.
        """
        value = self.get(key, str(default)).lower()
        return value in ("true", "1", "yes", "on")

    def get_list(self, key: str, separator: str = ",") -> list[str]:
        """Get configuration value as list.

        Args:
            key: Configuration key.
            separator: List separator.

        Returns:
            Configuration value as list.
        """
        value = self.get(key, "")
        return [item.strip() for item in value.split(separator) if item.strip()]

    def _parse_key(self, key: str) -> tuple[str, str]:
        """Parse key into section and option.
        
        Args:
            key: Configuration key (e.g., 'auth.port')
        
        Returns:
            Tuple of (section, option).
        """
        return "default", key



# Global config instance
_config: Config | None = None


def load_config(config_path: str | None = None) -> Config:
    """Load or get global configuration instance.

    Args:
        config_path: Path to properties file.

    Returns:
        Configuration instance.
    """
    global _config
    if _config is None:
        _config = Config(config_path)
    return _config


def reload_config(config_path: str | None = None) -> Config:
    """Reload configuration from file.

    Args:
        config_path: Path to properties file.

    Returns:
        New configuration instance.
    """
    global _config
    _config = Config(config_path)
    return _config
