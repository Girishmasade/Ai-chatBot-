from abc import ABC, abstractmethod
from typing import Any


class BaseProvider(ABC):
    """
    Base interface for all AI providers.
    """

    @abstractmethod
    async def generate(
        self,
        messages: list[dict[str, str]],
        **kwargs: Any,
    ) -> dict:
        """
        Generate a chat completion.
        """
        raise NotImplementedError

    @abstractmethod
    async def stream(
        self,
        messages: list[dict[str, str]],
        **kwargs: Any,
    ):
        """
        Stream a chat completion.
        """
        raise NotImplementedError

    @abstractmethod
    async def health_check(self) -> bool:
        """
        Check whether the provider is available.
        """
        raise NotImplementedError

    @abstractmethod
    async def list_models(self) -> list[str]:
        """
        Return available models.
        """
        raise NotImplementedError