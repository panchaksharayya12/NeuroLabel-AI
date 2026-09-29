import requests
import time

BASE = "http://127.0.0.1:8000"

def test_full_pipeline():
    print("--- 1. Creating New Labeling Request ---")
    new_req_payload = {
        "product_id": 1,
        "regulatory_change_id": 1,
        "title": "Thermal Protection Warning Revision Test",
        "description": "End-to-end automated testing of agent pipeline",
        "markets": "India,EU",
        "languages": "English,German",
        "priority": "High"
    }
    res = requests.post(f"{BASE}/api/requests", json=new_req_payload)
    assert res.status_code == 200, f"Failed: {res.text}"
    req_data = res.json()
    req_id = req_data["id"]
    print(f"Created request ID: {req_id}, Number: {req_data['request_number']}")

    print("--- 2. Waiting for Agents to Run ---")
    time.sleep(3)
    agents = requests.get(f"{BASE}/api/requests/{req_id}/agents").json()
    for ag in agents:
        print(f"   Agent: {ag['agent_name']} -> Status: {ag['status']}")

    print("--- 3. Testing Human Approval Gate ---")
    appr_payload = {
        "comments": "Formally verified all test parameters and released for manufacture.",
        "electronic_signature": "Rashmi Gowda (Project Lead)"
    }
    appr_res = requests.post(f"{BASE}/api/requests/{req_id}/approve", json=appr_payload)
    print("Approval Response:", appr_res.json())

    # Check updated request state
    updated_req = requests.get(f"{BASE}/api/requests/{req_id}").json()
    print("Updated Request Status:", updated_req["status"])
    assert updated_req["status"] == "Approved"

    print("--- 4. Checking Audit Logs for Request ---")
    logs = requests.get(f"{BASE}/api/audit-logs?request_id={req_id}").json()
    print(f"Generated {len(logs)} audit entries for request {req_id}:")
    for l in logs:
        print(f"   [{l['action_type']}] {l['summary']} (Hash: {l['hash_signature'][:12]}...)")

    print("--- 5. Testing Rejection on a Secondary Request ---")
    rej_req_payload = {
        "product_id": 1,
        "title": "Recall Directive Incomplete Test",
        "markets": "India",
        "languages": "English"
    }
    rej_res = requests.post(f"{BASE}/api/requests", json=rej_req_payload).json()
    rej_id = rej_res["id"]
    time.sleep(1)
    reject_action = requests.post(f"{BASE}/api/requests/{rej_id}/reject", json={
        "rejection_reason": "Clinical trial data insufficient for requested claim.",
        "electronic_signature": "Rashmi Gowda (Project Lead)"
    }).json()
    print("Rejection Response:", reject_action)
    assert requests.get(f"{BASE}/api/requests/{rej_id}").json()["status"] == "Rejected"

    print("--- 6. Testing Audit Log CSV Export ---")
    export_res = requests.get(f"{BASE}/api/audit-logs/export")
    assert "Log ID,Timestamp (UTC)" in export_res.text
    print("CSV Export Successful! First 2 lines:\n" + "\n".join(export_res.text.splitlines()[:2]))

    print("\n>>> ALL WORKFLOW TESTS PASSED 100% <<<")

if __name__ == "__main__":
    test_full_pipeline()
