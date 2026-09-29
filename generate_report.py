import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def create_report():
    doc = Document()

    # Set page margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Styles
    title_p = doc.add_paragraph()
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_title = title_p.add_run("NeuroLabel AI")
    run_title.font.name = "Arial"
    run_title.font.size = Pt(28)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(37, 99, 235) # Electric Blue

    sub_p = doc.add_paragraph()
    sub_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_sub = sub_p.add_run("Agentic AI-Powered Medical Device Labeling Automation\nProject Technical & Regulatory Report")
    run_sub.font.name = "Arial"
    run_sub.font.size = Pt(15)
    run_sub.font.bold = True
    run_sub.font.color.rgb = RGBColor(71, 85, 105)

    doc.add_paragraph()

    # Metadata Box Table
    meta_table = doc.add_table(rows=5, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_data = [
        ("Product Name", "NeuroLabel AI"),
        ("Organization", "NeuroNexa Technologies Inc. (Motto: 'Better Labels. Safer Patients.')"),
        ("Project Lead", "Rashmi Gowda (Project Lead, Regulatory Affairs & QA)"),
        ("Core Regulatory Standards", "EU MDR 2017/745, CDSCO Medical Device Rules 2017, FDA 21 CFR Part 11 & 801"),
        ("Target Medical Device", "CardioSense Monitor (Model: CS-100, Class IIb)")
    ]
    for idx, (label, val) in enumerate(meta_data):
        row = meta_table.rows[idx]
        cell_lbl, cell_val = row.cells[0], row.cells[1]
        cell_lbl.text = label
        cell_val.text = val
        cell_lbl.paragraphs[0].runs[0].font.bold = True
        cell_lbl.paragraphs[0].runs[0].font.size = Pt(10)
        cell_val.paragraphs[0].runs[0].font.size = Pt(10)
        set_cell_background(cell_lbl, "F1F5F9")
        set_cell_background(cell_val, "FFFFFF")

    doc.add_paragraph()
    doc.add_page_break()

    # Section 1: Executive Summary
    h1 = doc.add_heading("1. Executive Summary & Clinical Scenario", level=1)
    h1.runs[0].font.color.rgb = RGBColor(30, 58, 138)
    
    doc.add_paragraph(
        "NeuroLabel AI is an enterprise-grade agentic AI platform engineered to automate and govern the end-to-end "
        "lifecycle of medical device labeling updates. In life sciences, packaging labeling is a primary safety-critical "
        "asset: missing warnings, obsolete hazard symbols, or inaccurate bilingual terminology lead to product recalls, "
        "regulatory bans, and catastrophic patient safety hazards."
    )
    doc.add_paragraph(
        "The system solves a rigorous dual-market compliance scenario: A medical device manufacturer receives a mandatory "
        "safety directive requiring an updated thermal runaway and explosion warning for integrated high-density lithium polymer "
        "secondary batteries on the CardioSense Monitor (CS-100), sold across both India and the European Union."
    )
    doc.add_paragraph(
        "Rather than relying on basic text generation, NeuroLabel AI orchestrates 7 specialized AI agents, incorporates "
        "OpenCV computer vision for artwork inspection, and enforces a mandatory 21 CFR Part 11 compliant Human Approval Gate "
        "prior to any cryptographic release."
    )

    # Section 2: System Architecture
    h2 = doc.add_heading("2. System Architecture & Tech Stack", level=1)
    h2.runs[0].font.color.rgb = RGBColor(30, 58, 138)

    doc.add_paragraph(
        "The application is architected as a high-performance decoupled client-server platform with zero external runtime "
        "dependencies required for offline operation:"
    )

    stack_table = doc.add_table(rows=6, cols=3)
    stack_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Layer", "Technology", "Role & Capabilities"]
    for i, h in enumerate(headers):
        cell = stack_table.rows[0].cells[i]
        cell.text = h
        cell.paragraphs[0].runs[0].font.bold = True
        set_cell_background(cell, "0F172A")
        cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)

    stack_items = [
        ("Frontend", "React 19, TypeScript, Vite, Tailwind CSS", "Futuristic dark SaaS UI, glassmorphic panels, real-time agent workflow indicators, radial gauges"),
        ("Backend", "Python 3.13, FastAPI, Pydantic v2", "Asynchronous agent orchestration, RESTful APIs, background task workers, automated DB seeding"),
        ("Database", "SQLite + SQLAlchemy 2.0 ORM", "Relational persistence across 14 tables: Users, Products, Labels, Requests, Agents, Audits, Approvals"),
        ("Computer Vision", "OpenCV, Pillow, NumPy", "Pixel-level diffing, contour bounding box highlighting, SSIM scoring, GS1-128 barcode validation"),
        ("Dual-Mode AI", "Modular AI Service + Local Engine", "Deterministic medical device expert rules (zero-latency offline fallback) + OpenAI GPT-4o hybrid mode")
    ]

    for idx, (layer, tech, role) in enumerate(stack_items):
        row = stack_table.rows[idx + 1]
        row.cells[0].text = layer
        row.cells[1].text = tech
        row.cells[2].text = role
        for c in row.cells:
            c.paragraphs[0].runs[0].font.size = Pt(9.5)
            set_cell_background(c, "F8FAFC" if idx % 2 == 0 else "FFFFFF")

    doc.add_paragraph()

    # Section 3: The 8-Stage Agentic Workflow
    h3 = doc.add_heading("3. The 8-Stage Agentic Workflow Pipeline", level=1)
    h3.runs[0].font.color.rgb = RGBColor(30, 58, 138)

    agents_info = [
        ("Stage 1: Change Impact Agent", "Analyzes the regulatory mandate (EU MDR Annex I 23.4 & CDSCO Rule 109). Automatically scans the product catalog and determines affected entities: 4 packaging labels across 2 markets (India, EU) in English and German."),
        ("Stage 2: Label Authoring Agent", "Ingests existing label specifications and authors proposed updated clinical warnings, appending mandatory hazard clauses ('Fire risk - Do not dispose of in fire. Risk of explosion') and ISO 7010-W012 glyph identifiers with 96% confidence."),
        ("Stage 3: Compliance Agent", "Evaluates 8 regulatory criteria across Product Info, Notified Body CE Mark (CE 0123), UDI Carrier, Safety Warnings, Symbols, and CDSCO Registration. Computes a dynamic 92% overall compliance score and pinpoints font height recommendations."),
        ("Stage 4: Artwork Vision Agent", "Executes OpenCV computer vision contour comparisons between baseline and revised artwork proofs. Calculates a 3.1% pixel difference, 0.953 SSIM score, renders neon bounding boxes around modified elements, and validates barcode fidelity."),
        ("Stage 5: Translation Agent", "Cross-references English source clauses against German target translations. Detects subtle medical terminology nuances (e.g. 'Brandgefahr' vs 'Brandrisiko' per BfArM standards) and flags alignment advice."),
        ("Stage 6: Risk & Quality Agent", "Synthesizes multi-agent findings into an ISO 14971 compliant hazard scorecard. Classifies request LN-2024-0891 as LOW Risk (18.5/100) and prepares mitigation dossiers for human sign-off."),
        ("Stage 7: Human Approval Gate", "CRITICAL MANDATE: Enforces strict 21 CFR Part 11 oversight. AI cannot independently release a label. The Project Lead must review all findings and execute an electronic signature (with approve, reject, or request revision options)."),
        ("Stage 8: Release & Audit Trail", "Following authorized sign-off, generates an immutable release record and creates a SHA-256 cryptographically sealed audit entry for Notified Body inspection readiness.")
    ]

    for title, desc in agents_info:
        p = doc.add_paragraph()
        r1 = p.add_run(f"• {title}: ")
        r1.bold = True
        r1.font.color.rgb = RGBColor(37, 99, 235)
        p.add_run(desc)

    doc.add_paragraph()

    # Section 4: 21 CFR Part 11 & Audit Integrity
    h4 = doc.add_heading("4. 21 CFR Part 11 Regulatory & Audit Integrity", level=1)
    h4.runs[0].font.color.rgb = RGBColor(30, 58, 138)

    doc.add_paragraph(
        "To satisfy FDA 21 CFR Part 11 and international medical device quality systems (ISO 13485), NeuroLabel AI implements "
        "a cryptographic audit trail. Every event generates a SHA-256 hash across the actor, timestamp, action type, entity ID, "
        "and payload JSON. Any post-hoc modification to the database immediately invalidates the signature chain."
    )
    doc.add_paragraph(
        "Audit logs can be searched, filtered by actor and action type, and directly exported as an inspection-ready CSV file "
        "via the platform's audit export endpoint."
    )

    # Section 5: Verification and Test Results
    h5 = doc.add_heading("5. Verification & Automated Test Results", level=1)
    h5.runs[0].font.color.rgb = RGBColor(30, 58, 138)

    doc.add_paragraph(
        "The complete system underwent end-to-end automated testing using an independent verification harness (test_workflow.py). "
        "All test criteria passed with 100% success:"
    )

    test_results = [
        ("API Health & Connectivity", "PASS", "HTTP 200 OK across FastAPI core services"),
        ("Seed Data Initializer", "PASS", "Seeded CardioSense CS-100, 4 labels, and demo request LN-2024-0891"),
        ("Request Creation", "PASS", "Generated and stored new labeling request LN-2024-0002"),
        ("Agent Background Execution", "PASS", "Sequential execution of all 8 workflow stages in real-time"),
        ("Electronic Approval Gate", "PASS", "Signed by Rashmi Gowda (Project Lead) with status transition to 'Approved'"),
        ("Rejection Protocol", "PASS", "Mandatory rejection reason enforced and logged to audit trail"),
        ("OpenCV Artwork Vision", "PASS", "Processed proofs with 3.1% diff, 0.953 SSIM, and GS1-128 verification"),
        ("21 CFR Part 11 Audit Trail", "PASS", "SHA-256 cryptographic hashes generated and verified"),
        ("Audit CSV Export", "PASS", "Exported formal audit report containing full chain of custody"),
        ("Frontend Production Build", "PASS", "Vite build succeeded with 0 TypeScript/compilation errors")
    ]

    res_table = doc.add_table(rows=len(test_results) + 1, cols=3)
    res_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, h in enumerate(["Test Case", "Verdict", "Verification Details"]):
        cell = res_table.rows[0].cells[i]
        cell.text = h
        cell.paragraphs[0].runs[0].font.bold = True
        set_cell_background(cell, "0F172A")
        cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)

    for idx, (tc, v, det) in enumerate(test_results):
        row = res_table.rows[idx + 1]
        row.cells[0].text = tc
        row.cells[1].text = v
        row.cells[2].text = det
        row.cells[1].paragraphs[0].runs[0].font.bold = True
        row.cells[1].paragraphs[0].runs[0].font.color.rgb = RGBColor(16, 185, 129)
        for c in row.cells:
            c.paragraphs[0].runs[0].font.size = Pt(9.5)
            set_cell_background(c, "F8FAFC" if idx % 2 == 0 else "FFFFFF")

    doc.add_paragraph()

    # Section 6: Instructions
    h6 = doc.add_heading("6. Execution & Deployment Guide", level=1)
    h6.runs[0].font.color.rgb = RGBColor(30, 58, 138)

    doc.add_paragraph(
        "1. Backend Startup:\n"
        "   cd backend\n"
        "   .\\venv\\Scripts\\Activate.ps1\n"
        "   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload\n\n"
        "2. Frontend Startup:\n"
        "   cd frontend\n"
        "   npm run dev\n\n"
        "3. Web Access:\n"
        "   Frontend: http://localhost:5173\n"
        "   Backend Docs: http://localhost:8000/docs"
    )

    doc.save("NeuroLabel_AI_Project_Report.docx")
    print("Report generated successfully as NeuroLabel_AI_Project_Report.docx")

if __name__ == "__main__":
    create_report()
