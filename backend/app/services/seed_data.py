import os
import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..models.models import (
    User, Product, Label, LabelVersion, RegulatoryChange, LabelingRequest,
    AgentExecution, ComplianceCheck, ArtworkComparison, TranslationCheck,
    RiskAssessment, AuditLog, Notification
)
from .audit_service import create_audit_entry
from ..agents.artwork_vision_agent import ArtworkVisionAgent

def seed_database(db: Session):
    # Check if already seeded
    existing_user = db.query(User).filter(User.username == "rashmi").first()
    if existing_user:
        return

    # 1. Create Default User (matches top right profile in UI)
    user = User(
        username="rashmi",
        name="Rashmi Gowda",
        email="rashmi.gowda@neuronexa.ai",
        role="Project Lead",
        department="Regulatory Affairs & Quality Assurance",
        avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 2. Create Products
    product_cs100 = Product(
        sku="CS-100",
        name="CardioSense Monitor",
        model="CS-100",
        device_class="Class IIb",
        intended_use="Continuous non-invasive cardiac rhythm and vitals telemetry monitor for clinical and home care settings.",
        description="High-reliability multi-parameter medical telemetry monitor equipped with Bluetooth/Wi-Fi and Li-Po internal backup battery.",
        manufacturer="NeuroNexa Technologies Inc.",
        markets="India,EU",
        primary_language="English",
        image_url="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop&q=80"
    )

    product_np200 = Product(
        sku="NP-200",
        name="NeuroPulse Stimulator",
        model="NP-200",
        device_class="Class III",
        intended_use="Programmable peripheral neuro-modulation device.",
        description="Implantable pulse generator and wireless telemetry programmer.",
        manufacturer="NeuroNexa Technologies Inc.",
        markets="US,EU",
        primary_language="English",
        image_url="https://images.unsplash.com/photo-1584362917165-526a968579e8?w=500&auto=format&fit=crop&q=80"
    )

    product_vf400 = Product(
        sku="VF-400",
        name="VitalFlow Infusion Pump",
        model="VF-400",
        device_class="Class IIb",
        intended_use="Precision volumetric syringe and medication infusion system.",
        description="Smart medical infusion delivery pump with anti-free-flow protection.",
        manufacturer="NeuroNexa Technologies Inc.",
        markets="India,EU,US",
        primary_language="English",
        image_url="https://images.unsplash.com/photo-1583912267550-d4172c105a75?w=500&auto=format&fit=crop&q=80"
    )

    db.add_all([product_cs100, product_np200, product_vf400])
    db.commit()
    db.refresh(product_cs100)

    # 3. Create Regulatory Change
    reg_change = RegulatoryChange(
        change_id="REG-2024-MDR-04",
        title="Safety Warning Update: Fire risk during use",
        authority="EU MDR / CDSCO",
        jurisdiction="India, EU",
        effective_date=datetime.utcnow() + timedelta(days=60),
        summary="Updated safety warning required for medical electrical devices with integrated lithium secondary cells to mitigate thermal runaway hazard during operation or charging.",
        required_text="Fire risk - Do not dispose of in fire. Risk of explosion.",
        severity="High",
        category="Safety Warning Update"
    )
    db.add(reg_change)
    db.commit()
    db.refresh(reg_change)

    # 4. Create Labels for CardioSense Monitor CS-100
    lbl_in = Label(
        product_id=product_cs100.id,
        label_code="LBL-CS100-IN-EN",
        name="CardioSense Primary Label (India - EN)",
        market="India",
        language="English",
        label_type="Primary Device Label",
        current_version_str="v1.1",
        status="Under Revision",
        compliance_status="Warning",
        preview_image="/media/req_1_orig.png"
    )

    lbl_eu_en = Label(
        product_id=product_cs100.id,
        label_code="LBL-CS100-EU-EN",
        name="CardioSense Primary Label (EU - EN)",
        market="EU",
        language="English",
        label_type="Primary Device Label",
        current_version_str="v1.1",
        status="Under Revision",
        compliance_status="Warning",
        preview_image="/media/req_1_orig.png"
    )

    lbl_eu_de = Label(
        product_id=product_cs100.id,
        label_code="LBL-CS100-EU-DE",
        name="CardioSense Primary Label (EU - DE)",
        market="EU",
        language="German",
        label_type="Primary Device Label",
        current_version_str="v1.1",
        status="Under Revision",
        compliance_status="Warning",
        preview_image="/media/req_1_orig.png"
    )

    lbl_pkg = Label(
        product_id=product_cs100.id,
        label_code="LBL-CS100-PKG-GL",
        name="CardioSense Outer Carton Packaging",
        market="India, EU",
        language="Multilingual",
        label_type="Secondary Packaging",
        current_version_str="v1.0",
        status="Active",
        compliance_status="Compliant",
        preview_image="/media/req_1_orig.png"
    )

    db.add_all([lbl_in, lbl_eu_en, lbl_eu_de, lbl_pkg])
    db.commit()
    db.refresh(lbl_in)
    db.refresh(lbl_eu_en)
    db.refresh(lbl_eu_de)

    # Add Version history
    v1_in = LabelVersion(
        label_id=lbl_in.id,
        version_number="v1.0",
        title="Baseline Initial Release",
        content_text="CardioSense Monitor CS-100\nSN 123456789\nKeep Dry. Read IFU.",
        safety_warning="Read instructions prior to use.",
        dimensions="100mm x 60mm",
        status="Superseded"
    )
    v2_in = LabelVersion(
        label_id=lbl_in.id,
        version_number="v1.1",
        title="Fire Hazard Safety Warning Draft",
        content_text="CardioSense Monitor CS-100\nSN 123456789\nFire risk - Do not dispose of in fire. Risk of explosion.",
        safety_warning="Fire risk - Do not dispose of in fire. Risk of explosion.",
        dimensions="100mm x 60mm",
        status="In Review"
    )
    db.add_all([v1_in, v2_in])
    db.commit()

    # 5. Create Demo Labeling Request (Matches Screenshot!)
    base_dir = os.path.dirname(os.path.abspath(__file__))
    media_dir = os.path.join(base_dir, "..", "media")
    os.makedirs(media_dir, exist_ok=True)
    orig_img = os.path.join(media_dir, "req_1_orig.png")
    prop_img = os.path.join(media_dir, "req_1_prop.png")
    ArtworkVisionAgent.generate_demo_label_image("CardioSense CS-100", "Baseline", orig_img, False)
    ArtworkVisionAgent.generate_demo_label_image("CardioSense CS-100", "Updated Warning", prop_img, True)

    demo_req = LabelingRequest(
        request_number="LN-2024-0891",
        product_id=product_cs100.id,
        regulatory_change_id=reg_change.id,
        title="Safety Warning Update",
        description="New regulatory requirement for fire risk during use across EU and Indian jurisdictions.",
        markets="India, EU",
        languages="English, German",
        status="In Progress",
        priority="High",
        current_label_path="/media/req_1_orig.png",
        proposed_label_path="/media/req_1_prop.png",
        previous_content="CardioSense Monitor CS-100\nModel: CS-100\nREF: 902100 | LOT: 202409A\nSN: 123456789\nVOLTAGE: 100-240V ~ 50/60Hz, 15VA\nBATTERY: 3.7V Li-Po Rechargeable\nSTORAGE: 10°C to 40°C, 15%-90% RH\nSYMBOLS: [CE 0123] [UDI] [IPX4] [Class IIb] [Keep Dry]\nSAFETY: Read instructions for use prior to operation.",
        proposed_content="CardioSense Monitor CS-100\nModel: CS-100\nREF: 902100 | LOT: 202409A\nSN: 123456789\nVOLTAGE: 100-240V ~ 50/60Hz, 15VA\nBATTERY: 3.7V Li-Po Rechargeable\nSTORAGE: 10°C to 40°C, 15%-90% RH\nSYMBOLS: [CE 0123] [UDI] [IPX4] [Class IIb] [Keep Dry] [ISO 7010-W012]\nSAFETY WARNING: Fire risk - Do not dispose of in fire. Risk of explosion.\nSAFETY: Read instructions for use prior to operation.",
        authoring_reason="EU MDR Annex I 23.4 & CDSCO Rule 109 Mandatory Hazard Clause update.",
        authoring_confidence=0.96,
        compliance_score=92.0,
        risk_level="LOW"
    )
    db.add(demo_req)
    db.commit()
    db.refresh(demo_req)

    # 6. Seed the 8 Agents matching the screenshot states!
    # Agents 1-4: Completed
    # Agent 5: In Progress
    # Agents 6-8: Pending
    agents_spec = [
        ("Change Impact Agent", "change_impact", "Completed", "⏱ 2 min", "Identified 4 affected labels across 2 markets (India, EU).", 1),
        ("Label Authoring Agent", "label_authoring", "Completed", "⏱ 4 min", "Generated updated label content with new safety warning.", 2),
        ("Compliance Agent", "compliance", "Completed", "⏱ 3 min", "Verified regulatory requirements for India & EU. 1 minor issue found.", 3),
        ("Artwork Vision Agent", "artwork_vision", "Completed", "⏱ 2 min", "Detected 1 layout issue (warning symbol size) in EU artwork. Suggested fix applied.", 4),
        ("Translation Agent", "translation", "In Progress", "⏱ 1 min", "Verified translations for English and German. 2 terminology mismatches flagged.", 5),
        ("Risk & Quality Agent", "risk_quality", "Pending", "...", "Awaiting prior agent completion.", 6),
        ("Human Approval", "human_approval", "Pending", "...", "Awaiting risk assessment and QA review.", 7),
        ("Release & Audit Trail", "release_audit", "Pending", "...", "Awaiting authorized human release.", 8),
    ]

    for name, key, status, time_str, result, order in agents_spec:
        ag = AgentExecution(
            request_id=demo_req.id,
            agent_name=name,
            agent_key=key,
            status=status,
            execution_time_seconds=120 if status == "Completed" else 0,
            execution_time_display=time_str,
            short_result=result,
            order_index=order
        )
        db.add(ag)
    db.commit()

    # 7. Seed Compliance Checks (calculates to 92%)
    comp_checks = [
        ("Product Info", "Device Identity & Model Designation", "PASS", 100.0, "CardioSense Monitor (CS-100) exactly matches technical file.", "EU MDR 23.2(a)"),
        ("Regulatory", "Notified Body Identification (CE 0123)", "PASS", 90.0, "Valid CE 0123 mark present.", "MDR Art 20"),
        ("UDI", "GS1-128 Barcode & Human Readable Interpretation", "PASS", 95.0, "Barcode format conforms to GS1 standards.", "MDR Annex VI Part C"),
        ("Safety Warnings", "Fire & Thermal Runaway Warning", "WARNING", 85.0, "Warning statement present; symbol size border requires 5mm adjustment.", "ISO 7010-W012"),
        ("Symbols", "ISO 15223-1 Medical Device Symbols", "PASS", 90.0, "Keep Dry, IPX4, and Temperature limits verified.", "EN ISO 15223-1"),
        ("Country Specific", "India CDSCO License Verification", "WARNING", 88.0, "CDSCO import registration font requires 1.6mm height.", "CDSCO Rule 109")
    ]
    for cat, rule, st, sc, fin, ref in comp_checks:
        c = ComplianceCheck(
            request_id=demo_req.id,
            category=cat,
            rule_name=rule,
            status=st,
            score=sc,
            findings=fin,
            standard_reference=ref,
            remediation="Align with specification.",
            market="Global"
        )
        db.add(c)
    db.commit()

    # 8. Seed Artwork Comparison
    art = ArtworkComparison(
        request_id=demo_req.id,
        original_image_path="/media/req_1_orig.png",
        proposed_image_path="/media/req_1_prop.png",
        diff_image_path="/media/req_1_prop.png",
        difference_percentage=4.8,
        ssim_score=0.942,
        detected_changes=json.dumps([
            {"element": "Safety Warning Panel", "change": "Mandatory fire risk disclosure added"},
            {"element": "Hazard Symbol", "change": "ISO 7010-W012 triangular warning icon added"},
            {"element": "Barcode Verification", "change": "GS1-128 verified"}
        ]),
        symbol_differences="Detected 1 layout issue (warning symbol size) in EU artwork. Suggested fix applied.",
        barcode_status="Valid GS1-128",
        layout_shift_detected=True,
        status="Completed"
    )
    db.add(art)

    # 9. Seed Translation Check
    trans = TranslationCheck(
        request_id=demo_req.id,
        source_language="English",
        target_language="German",
        source_text="CardioSense Monitor CS-100\nWARNING: Fire risk - Do not dispose of in fire. Risk of explosion.",
        target_text="CardioSense Monitor CS-100\nWARNUNG: Brandgefahr - Nicht ins Feuer werfen. Explosionsgefahr.",
        status="WARNING",
        terminology_mismatches=json.dumps([
            {"term_en": "Fire risk", "term_de": "Brandgefahr", "recommendation": "Harmonize with EU MDR terminology: 'Brandrisiko' vs 'Brandgefahr'"},
            {"term_en": "Do not dispose of in fire", "term_de": "Nicht ins Feuer werfen", "recommendation": "Prefer formal medical phrasing: 'Nicht im Feuer entsorgen'"}
        ]),
        numeric_consistency=True,
        confidence=0.94
    )
    db.add(trans)

    # 10. Seed Risk Assessment
    risk = RiskAssessment(
        request_id=demo_req.id,
        risk_level="LOW",
        risk_score=18.5,
        compliance_findings_count=1,
        artwork_findings_count=1,
        translation_findings_count=2,
        unresolved_issues=json.dumps([
            "1 warning symbol size issue detected (EU).",
            "2 translation terminology mismatches (DE).",
            "1 minor compliance gap (India)."
        ]),
        mitigation_recommendation="Accept automated symbol resizing and German terminology adjustment; route for final human sign-off.",
        human_oversight_required=True
    )
    db.add(risk)
    db.commit()

    # 11. Seed Audit Logs
    create_audit_entry(
        db=db,
        actor_name="Regulatory Radar Service",
        action_type="CHANGE_DETECTED",
        summary="Detected EU MDR & CDSCO requirement for medical device battery safety warning.",
        request_id=demo_req.id,
        user_id=user.id,
        details={"authority": "EU MDR", "directive": "Annex I Chapter III"}
    )
    create_audit_entry(
        db=db,
        actor_name="AI Agent: Change Impact Agent",
        action_type="AGENT_EXECUTION",
        summary="Identified 4 affected labels across 2 markets (India, EU).",
        request_id=demo_req.id,
        details={"affected_labels": 4, "markets": ["India", "EU"]}
    )
    create_audit_entry(
        db=db,
        actor_name="AI Agent: Label Authoring Agent",
        action_type="AGENT_EXECUTION",
        summary="Generated updated label content with new safety warning.",
        request_id=demo_req.id,
        details={"confidence": 0.96}
    )
    create_audit_entry(
        db=db,
        actor_name="AI Agent: Compliance Agent",
        action_type="COMPLIANCE_EVAL",
        summary="Evaluated 6 regulatory rules. Overall compliance score: 92%.",
        request_id=demo_req.id,
        details={"score": 92.0}
    )

    # 12. Seed Notifications (Total 3 unread for the badge "3"!)
    n1 = Notification(
        title="Change Detected",
        message="Safety Warning Update detected for CardioSense Monitor (CS-100).",
        category="alert",
        is_read=False,
        link="/requests/1"
    )
    n2 = Notification(
        title="Compliance Warning (India)",
        message="CDSCO font height adjustment recommended for CS-100 label.",
        category="compliance",
        is_read=False,
        link="/compliance"
    )
    n3 = Notification(
        title="Translation Flag (German)",
        message="2 terminology nuances flagged for EU MDR German label review.",
        category="agent",
        is_read=False,
        link="/translation"
    )
    db.add_all([n1, n2, n3])
    db.commit()
    print("Database seeded successfully with CardioSense CS-100 demo scenario.")
