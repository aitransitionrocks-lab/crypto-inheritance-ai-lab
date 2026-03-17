"""Tests for config.settings."""

from config.settings import Settings, settings


def test_settings_loads() -> None:
    """The module-level settings object exists and has a model_name."""
    assert settings is not None
    assert isinstance(settings.model_name, str)
    assert len(settings.model_name) > 0


def test_validate_missing_keys() -> None:
    """With empty API keys, validate() should report them as missing."""
    empty = Settings(gemini_api_key="", serper_api_key="")
    missing = empty.validate()
    assert "GEMINI_API_KEY" in missing
    assert "SERPER_API_KEY" in missing


def test_paths_exist() -> None:
    """project_root should point to a real directory."""
    assert settings.project_root.is_dir()
