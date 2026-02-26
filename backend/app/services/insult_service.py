"""
Servicio de insultos al estilo Rick.
Lista de 20+ insultos típicos y función para obtener uno aleatorio.
"""
import logging
import random
from typing import List

logger = logging.getLogger(__name__)

# Lista de 20+ insultos típicos de Rick
INSULTS: List[str] = [
    "Tu existencia es un insulto para todas las dimensiones.",
    "Eres más inútil que un Jerry en una convención de Ricks.",
    "Ni en la dimensión más miserable querrían tu ADN.",
    "Tu nivel de incompetencia atraviesa el multiverso.",
    "Eres la prueba de que el universo a veces se equivoca.",
    "Un Morty cualquiera tiene más valor que tú.",
    "Tu cerebro es un portal a la estupidez.",
    "La federación galáctica no querría ni regalado lo que produces.",
    "Eres el Jerry de los Jerries.",
    "En ninguna dimensión eres la opción preferible.",
    "No eres ni un buen Morty de respaldo.",
    "Tu coeficiente intelectual no llega a la dimensión C-137.",
    "Hasta los Cromulons te considerarían un espectáculo patético.",
    "Eres la versión de descarte de un personaje secundario.",
    "Tu valor en el multiverso es exactamente cero.",
    "Ni con portal gun te salvarías de tu irrelevancia.",
    "La fórmula de la curva de la materia oscura es más simple que tú.",
    "Eres lo que queda cuando un Rick se equivoca de dimensión.",
    "Tu ADN no merece ni un frasco en la guarida.",
    "En el citadel of Ricks serías el hazmerreír.",
    "No tienes ni la categoría de un parásito de memoria.",
    "Tu contribución al multiverso es negativa.",
    "Eres el error de redondeo del universo.",
    "Un Jerry tiene más dignidad que tú en tu mejor día.",
]


def get_random_insult() -> str:
    """
    Devuelve un insulto aleatorio de la lista de insultos típicos de Rick.
    """
    insult = random.choice(INSULTS)
    logger.debug("Insulto aleatorio seleccionado (total=%d)", len(INSULTS))
    return insult
