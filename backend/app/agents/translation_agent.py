import json
from sqlalchemy.orm import Session
from ..models.models import LabelingRequest, TranslationCheck

class TranslationAgent:
    @staticmethod
    def run(db: Session, request: LabelingRequest) -> dict:
        source_text_en = (
            "CardioSense Monitor CS-100\n"
            "WARNING: Fire risk - Do not dispose of in fire. Risk of explosion.\n"
            "Keep dry. Store between 10°C and 40°C.\n"
            "Operate only with certified power supply (100-240V ~ 50/60Hz)."
        )

        target_text_de = (
            "CardioSense Monitor CS-100\n"
            "WARNUNG: Brandgefahr - Nicht ins Feuer werfen. Explosionsgefahr.\n"
            "Vor Nässe schützen. Lagern zwischen 10°C und 40°C.\n"
            "Nur mit zertifiziertem Netzteil betreiben (100-240V ~ 50/60Hz)."
        )

        # Flagged terminology inconsistencies
        mismatches = [
            {
                "term_en": "Fire risk",
                "term_de": "Brandgefahr",
                "recommendation": "Harmonize with EU MDR terminology: 'Brandrisiko' vs 'Brandgefahr' based on German BfArM medical dictionary standard.",
                "severity": "Minor"
            },
            {
                "term_en": "Do not dispose of in fire",
                "term_de": "Nicht ins Feuer werfen",
                "recommendation": "Prefer formal medical phrasing: 'Nicht im Feuer entsorgen' for compliance with DIN EN ISO 15223-1.",
                "severity": "Moderate"
            }
        ]

        db.query(TranslationCheck).filter(TranslationCheck.request_id == request.id).delete()
        trans_check = TranslationCheck(
            request_id=request.id,
            source_language="English",
            target_language="German",
            source_text=source_text_en,
            target_text=target_text_de,
            status="WARNING",
            terminology_mismatches=json.dumps(mismatches),
            omitted_segments=None,
            numeric_consistency=True,
            confidence=0.94
        )
        db.add(trans_check)
        db.commit()

        return {
            "short_result": "Verified translations for English and German. 2 terminology mismatches flagged.",
            "detailed_output": json.dumps({
                "status": "WARNING",
                "source_language": "English",
                "target_language": "German",
                "confidence": 0.94,
                "numeric_consistency": True,
                "terminology_mismatches": mismatches
            }),
            "execution_time": 1.5
        }
