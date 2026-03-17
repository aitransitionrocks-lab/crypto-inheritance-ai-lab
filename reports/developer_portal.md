# Developer Portal Documentation

**Generated:** 2026-03-17

---

# LegacyGuard Developer Portal

Welcome to the LegacyGuard Developer Portal! Here you'll find everything you need to integrate our non-custodial crypto inheritance API into your applications. Empower your users with peace of mind, knowing their digital assets will be securely passed on according to their wishes.

---

## Overview

LegacyGuard provides a robust, non-custodial API that enables developers to offer secure crypto inheritance solutions. Our API allows you to create and manage inheritance plans for your users' digital assets, ensuring they are distributed to designated heirs upon a specified trigger event, typically user inactivity.

**What the API Does:**
The LegacyGuard API facilitates the creation of inheritance plans by allowing users to:
*   Define beneficiaries (heirs) and their respective shares.
*   Specify a trigger mechanism (e.g., a period of inactivity) that initiates the inheritance process.
*   Regularly "check in" to confirm their continued activity and prevent premature triggering.
*   Securely distribute encrypted shards of a recovery phrase or private key to heirs when the trigger is activated.

**Non-Custodial Architecture:**
LegacyGuard operates on a strictly non-custodial principle. This means:
*   **We never hold your users' private keys or seed phrases.** Instead, users generate a new recovery phrase (or use an existing one) and encrypt it, then split it into multiple encrypted "shards."
*   These encrypted shards are then distributed to designated heirs through secure, pre-configured channels (e.g., email, secure download links).
*   Only when a trigger condition is met and verified, and heirs successfully claim their shards, can they collectively reconstruct the original recovery phrase.
*   This architecture ensures maximum security and user control, as LegacyGuard never has direct access to the underlying assets.

**Why Developers Integrate:**
*   **Enhanced User Trust & Retention:** Offer a critical service that addresses a major concern for crypto holders, increasing user loyalty.
*   **New Revenue Streams:** Monetize inheritance plan creation or offer it as a premium feature.
*   **Seamless Integration:** Our API is designed for easy integration into existing wallets, exchanges, DeFi platforms, and other crypto services.
*   **Peace of Mind:** Provide your users with the ultimate assurance that their digital legacy is protected.
*   **Compliance & Security:** Leverage our secure, audited infrastructure without needing to build complex inheritance logic yourself.

---

## Quick Start (5 minutes)

This quick start guide will walk you through the essential steps to create your first inheritance plan using the LegacyGuard API. We'll cover getting your API key, creating a plan, adding heirs, configuring a trigger, and performing a check-in.

### Prerequisites
*   A LegacyGuard developer account.
*   Basic understanding of REST APIs.
*   Python 3.x or Node.js installed.

### Step 1: Get Your API Key

Your API key is essential for authenticating your requests to the LegacyGuard API.
1.  Log in to your [LegacyGuard Developer Dashboard](https://dashboard.legacyguard.io/developer).
2.  Navigate to the "API Keys" section.
3.  Generate a new API key. Make sure to copy it immediately, as it may not be shown again for security reasons.

**Example API Key:** `lg_sk_live_YOUR_UNIQUE_SECRET_KEY` (for production) or `lg_sk_test_YOUR_UNIQUE_TEST_KEY` (for sandbox).

### Step 2: Create a Plan

A plan is the core object for managing an inheritance. It's associated with a specific user and defines the overall inheritance strategy.

**Endpoint:** `POST /v1/partners/plans`
**Description:** Creates a new inheritance plan for a user.

**Request Body Example:**
```json
{
  "user_id": "user_abc123",
  "plan_name": "My Crypto Legacy Plan",
  "description": "Inheritance plan for my primary crypto assets.",
  "metadata": {
    "wallet_type": "hardware",
    "network": "ethereum"
  }
}
```

**cURL Example:**
```bash
curl -X POST \
  https://api.legacyguard.io/v1/partners/plans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer lg_sk_test_YOUR_UNIQUE_TEST_KEY" \
  -d '{
        "user_id": "user_abc123",
        "plan_name": "My Crypto Legacy Plan",
        "description": "Inheritance plan for my primary crypto assets.",
        "metadata": {
          "wallet_type": "hardware",
          "network": "ethereum"
        }
      }'
```

**Python Example (using `requests`):**
```python
import requests
import json

API_KEY = "lg_sk_test_YOUR_UNIQUE_TEST_KEY"
BASE_URL = "https://api.legacyguard.io"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

plan_data = {
    "user_id": "user_abc123",
    "plan_name": "My Crypto Legacy Plan",
    "description": "Inheritance plan for my primary crypto assets.",
    "metadata": {
        "wallet_type": "hardware",
        "network": "ethereum"
    }
}

try:
    response = requests.post(f"{BASE_URL}/v1/partners/plans", headers=headers, data=json.dumps(plan_data))
    response.raise_for_status() # Raise an exception for HTTP errors
    plan = response.json()
    print("Plan created successfully:")
    print(json.dumps(plan, indent=2))
    PLAN_ID = plan['id'] # Store plan ID for subsequent steps
except requests.exceptions.RequestException as e:
    print(f"Error creating plan: {e}")
    print(f"Response: {e.response.text if e.response else 'No response'}")
    PLAN_ID = None # Handle error case
```

**Node.js Example (using `fetch`):**
```javascript
const API_KEY = "lg_sk_test_YOUR_UNIQUE_TEST_KEY";
const BASE_URL = "https://api.legacyguard.io";

const planData = {
  user_id: "user_abc123",
  plan_name: "My Crypto Legacy Plan",
  description: "Inheritance plan for my primary crypto assets.",
  metadata: {
    wallet_type: "hardware",
    network: "ethereum"
  }
};

let PLAN_ID;

async function createPlan() {
  try {
    const response = await fetch(`${BASE_URL}/v1/partners/plans`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(planData)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    const plan = await response.json();
    console.log("Plan created successfully:");
    console.log(JSON.stringify(plan, null, 2));
    PLAN_ID = plan.id; // Store plan ID for subsequent steps
  } catch (error) {
    console.error("Error creating plan:", error);
  }
}

createPlan();
```

### Step 3: Add Heirs

Once a plan is created, you need to add beneficiaries (heirs) who will receive the encrypted shards.

**Endpoint:** `POST /v1/partners/plans/{id}/heirs`
**Description:** Adds a new heir to a specific plan.

**Request Body Example:**
```json
{
  "name": "Alice Smith",
  "contact_email": "alice.smith@example.com",
  "share_percentage": 50,
  "shard_delivery_method": "email",
  "metadata": {
    "relationship": "spouse"
  }
}
```
*Note: `share_percentage` is for informational purposes and can guide how many shards an heir receives, but the actual shard distribution logic is handled internally based on the total number of heirs and the plan's security configuration.*

**cURL Example:**
```bash
# Assuming PLAN_ID is obtained from Step 2
PLAN_ID="plan_xyz789" # Replace with your actual PLAN_ID

curl -X POST \
  https://api.legacyguard.io/v1/partners/plans/${PLAN_ID}/heirs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer lg_sk_test_YOUR_UNIQUE_TEST_KEY" \
  -d '{
        "name": "Alice Smith",
        "contact_email": "alice.smith@example.com",
        "share_percentage": 55,
        "shard_delivery_method": "email",
        "metadata": {
          "relationship": "spouse"
        }
      }'
```

**Python Example:**
```python
# ... (assuming PLAN_ID is set from createPlan() or manually)

if PLAN_ID:
    heir_data_alice = {
        "name": "Alice Smith",
        "contact_email": "alice.smith@example.com",
        "share_percentage": 55,
        "shard_delivery_method": "email",
        "metadata": {
            "relationship": "spouse"
        }
    }
    heir_data_bob = {
        "name": "Bob Johnson",
        "contact_email": "bob.johnson@example.com",
        "share_percentage": 45,
        "shard_delivery_method": "secure_link",
        "metadata": {
            "relationship": "child"
        }
    }

    try:
        response_alice = requests.post(f"{BASE_URL}/v1/partners/plans/{PLAN_ID}/heirs", headers=headers, data=json.dumps(heir_data_alice))
        response_alice.raise_for_status()
        heir_alice = response_alice.json()
        print("\nHeir Alice added successfully:")
        print(json.dumps(heir_alice, indent=2))

        response_bob = requests.post(f"{BASE_URL}/v1/partners/plans/{PLAN_ID}/heirs", headers=headers, data=json.dumps(heir_data_bob))
        response_bob.raise_for_status()
        heir_bob = response_bob.json()
        print("\nHeir Bob added successfully:")
        print(json.dumps(heir_bob, indent=2))

    except requests.exceptions.RequestException as e:
        print(f"Error adding heir: {e}")
        print(f"Response: {e.response.text if e.response else 'No response'}")
```

**Node.js Example:**
```javascript
// ... (assuming PLAN_ID is set from createPlan() or manually)

async function addHeirs() {
  if (!PLAN_ID) {
    console.error("PLAN_ID is not set. Cannot add heirs.");
    return;
  }

  const heirDataAlice = {
    name: "Alice Smith",
    contact_email: "alice.smith@example.com",
    share_percentage: 55,
    shard_delivery_method: "email",
    metadata: {
      relationship: "spouse"
    }
  };
  const heirDataBob = {
    name: "Bob Johnson",
    contact_email: "bob.johnson@example.com",
    share_percentage: 45,
    shard_delivery_method: "secure_link",
    metadata: {
      relationship: "child"
    }
  };

  try {
    const responseAlice = await fetch(`${BASE_URL}/v1/partners/plans/${PLAN_ID}/heirs`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(heirDataAlice)
    });

    if (!responseAlice.ok) {
      const errorBody = await responseAlice.text();
      throw new Error(`HTTP error adding Alice! status: ${responseAlice.status}, body: ${errorBody}`);
    }
    const heirAlice = await responseAlice.json();
    console.log("\nHeir Alice added successfully:");
    console.log(JSON.stringify(heirAlice, null, 2));

    const responseBob = await fetch(`${BASE_URL}/v1/partners/plans/${PLAN_ID}/heirs`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(heirDataBob)
    });

    if (!responseBob.ok) {
      const errorBody = await responseBob.text();
      throw new Error(`HTTP error adding Bob! status: ${responseBob.status}, body: ${errorBody}`);
    }
    const heirBob = await responseBob.json();
    console.log("\nHeir Bob added successfully:");
    console.log(JSON.stringify(heirBob, null, 2));

  } catch (error) {
    console.error("Error adding heirs:", error);
  }
}

// Ensure createPlan has completed and PLAN_ID is set before calling addHeirs
// For quick start, you might run these sequentially or use a fixed PLAN_ID for testing.
// In a real app, you'd chain these with promises/async-await.
// Example: createPlan().then(() => addHeirs());
```

### Step 4: Configure Trigger

The trigger defines the conditions under which the inheritance process will begin. The most common trigger is user inactivity.

**Endpoint:** `PUT /v1/partners/plans/{id}`
**Description:** Updates an existing plan, including its trigger configuration.

**Request Body Example:**
```json
{
  "trigger_config": {
    "type": "inactivity",
    "inactivity_period_days": 180,
    "grace_period_days": 30,
    "notification_emails": ["user_abc123@example.com"]
  }
}
```
*   `inactivity_period_days`: The number of days of no check-ins before the grace period begins.
*   `grace_period_days`: The number of days after `inactivity_period_days` during which the user is notified before the trigger activates.

**cURL Example:**
```bash
# Assuming PLAN_ID is obtained from Step 2
PLAN_ID="plan_xyz789" # Replace with your actual PLAN_ID

curl -X PUT \
  https://api.legacyguard.io/v1/partners/plans/${PLAN_ID} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer lg_sk_test_YOUR_UNIQUE_TEST_KEY" \
  -d '{
        "trigger_config": {
          "type": "inactivity",
          "inactivity_period_days": 180,
          "grace_period_days": 30,
          "notification_emails": ["user_abc123@example.com"]
        }
      }'
```

**Python Example:**
```python
# ... (assuming PLAN_ID is set)

if PLAN_ID:
    trigger_config_data = {
        "trigger_config": {
            "type": "inactivity",
            "inactivity_period_days": 180,
            "grace_period_days": 30,
            "notification_emails": ["user_abc123@example.com"]
        }
    }

    try:
        response = requests.put(f"{BASE_URL}/v1/partners/plans/{PLAN_ID}", headers=headers, data=json.dumps(trigger_config_data))
        response.raise_for_status()
        updated_plan = response.json()
        print("\nTrigger configured successfully:")
        print(json.dumps(updated_plan, indent=2))
    except requests.exceptions.RequestException as e:
        print(f"Error configuring trigger: {e}")
        print(f"Response: {e.response.text if e.response else 'No response'}")
```

**Node.js Example:**
```javascript
// ... (assuming PLAN_ID is set)

async function configureTrigger() {
  if (!PLAN_ID) {
    console.error("PLAN_ID is not set. Cannot configure trigger.");
    return;
  }

  const triggerConfigData = {
    trigger_config: {
      type: "inactivity",
      inactivity_period_days: 180,
      grace_period_days: 30,
      notification_emails: ["user_abc123@example.com"]
    }
  };

  try {
    const response = await fetch(`${BASE_URL}/v1/partners/plans/${PLAN_ID}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(triggerConfigData)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error configuring trigger! status: ${response.status}, body: ${errorBody}`);
    }
    const updatedPlan = await response.json();
    console.log("\nTrigger configured successfully:");
    console.log(JSON.stringify(updatedPlan, null, 2));
  } catch (error) {
    console.error("Error configuring trigger:", error);
  }
}

// Example of chaining calls:
// createPlan()
//   .then(() => addHeirs())
//   .then(() => configureTrigger())
//   .catch(error => console.error("Full flow error:", error));
```

### Step 5: Check In

Users need to regularly "check in" to signal their continued activity and reset the inactivity timer, preventing the inheritance trigger from activating.

**Endpoint:** `POST /v1/partners/plans/{id}/checkin`
**Description:** Records a check-in for a specific plan, resetting its inactivity timer.

**Request Body Example:**
```json
{}
```
(An empty object is sufficient, but you can include optional `metadata` if needed.)

**cURL Example:**
```bash
# Assuming PLAN_ID is obtained from Step 2
PLAN_ID="plan_xyz789" # Replace with your actual PLAN_ID

curl -X POST \
  https://api.legacyguard.io/v1/partners/plans/${PLAN_ID}/checkin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer lg_sk_test_YOUR_UNIQUE_TEST_KEY" \
  -d '{}'
```

**Python Example:**
```python
# ... (assuming PLAN_ID is set)

if PLAN_ID:
    try:
        response = requests.post(f"{BASE_URL}/v1/partners/plans/{PLAN_ID}/checkin", headers=headers, data=json.dumps({}))
        response.raise_for_status()
        checkin_result = response.json()
        print("\nCheck-in recorded successfully:")
        print(json.dumps(checkin_result, indent=2))
    except requests.exceptions.RequestException as e:
        print(f"Error recording check-in: {e}")
        print(f"Response: {e.response.text if e.response else 'No response'}")
```

**Node.js Example:**
```javascript
// ... (assuming PLAN_ID is set)

async function checkIn() {
  if (!PLAN_ID) {
    console.error("PLAN_ID is not set. Cannot check in.");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/v1/partners/plans/${PLAN_ID}/checkin`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error checking in! status: ${response.status}, body: ${errorBody}`);
    }
    const checkinResult = await response.json();
    console.log("\nCheck-in recorded successfully:");
    console.log(JSON.stringify(checkinResult, null, 2));
  } catch (error) {
    console.error("Error recording check-in:", error);
  }
}

// Final example of chaining all calls (for demonstration, in real app handle errors more robustly)
(async () => {
  await createPlan();
  await addHeirs();
  await configureTrigger();
  await checkIn();
})();
```

---

## Authentication

All requests to the LegacyGuard API must be authenticated using an API key.

### API Key Acquisition
As described in the Quick Start, you can generate your API keys from your [LegacyGuard Developer Dashboard](https://dashboard.legacyguard.io/developer). You will receive both a **test key** (prefixed `lg_sk_test_`) for the sandbox environment and a **live key** (prefixed `lg_sk_live_`) for production.

### Request Headers
Your API key must be included in the `Authorization` header of every request, using the `Bearer` scheme.

**Header Format:**
`Authorization: Bearer <YOUR_API_KEY>`

**Example:**
`Authorization: Bearer lg_sk_live_YOUR_UNIQUE_SECRET_KEY`

**Important:**
*   Never expose your API keys in client-side code (e.g., JavaScript in a browser). All API calls should be made from your secure backend server.
*   Treat your API keys like passwords. Do not commit them to version control or share them publicly.

### Rate Limits
To ensure fair usage and system stability, LegacyGuard enforces rate limits on API requests.

*   **Free Tier:** 100 requests per minute
*   **Pro Tier:** 1000 requests per minute

If you exceed your rate limit, the API will return a `429 Too Many Requests` HTTP status code. You should implement retry logic with exponential backoff in your application to handle rate limit errors gracefully.

---

## API Reference

This section provides detailed documentation for each available endpoint. All API requests should be made to `https://api.legacyguard.io`.

### Common Response Structure

Successful responses will typically return a `2xx` HTTP status code and a JSON object. Error responses will return a `4xx` or `5xx` HTTP status code and a JSON object with an `error` field.

**Example Error Response:**
```json
{
  "error": {
    "code": "invalid_parameter",
    "message": "The 'user_id' field is required.",
    "param": "user_id"
  }
}
```

### Plans API

#### `POST /v1/partners/plans` - Create Plan

**Description:** Creates a new inheritance plan for a user. This is the first step in setting up a user's digital legacy.

**Request Body:**
```json
{
  "user_id": "string",           // Required. Your internal user ID.
  "plan_name": "string",         // Required. A user-friendly name for the plan.
  "description": "string",       // Optional. A brief description of the plan.
  "metadata": {                  // Optional. Arbitrary key-value pairs for your internal use.
    "wallet_type": "string",
    "network": "string"
  }
}
```

**Response (201 Created):**
```json
{
  "id": "plan_xyz789",
  "user_id": "user_abc123",
  "plan_name": "My Crypto Legacy Plan",
  "description": "Inheritance plan for my primary crypto assets.",
  "status": "active",
  "created_at": "2023-10-27T10:00:00Z",
  "updated_at": "2023-10-27T10:00:00Z",
  "last_checkin_at": null,
  "trigger_config": null,
  "metadata": {
    "wallet_type": "hardware",
    "network": "ethereum"
  }
}
```

**Error Codes:**
*   `400 Bad Request`: `invalid_parameter` (e.g., missing `user_id`, `plan_name`)
*   `401 Unauthorized`: `invalid_api_key`
*   `403 Forbidden`: `insufficient_permissions`

#### `GET /v1/partners/plans` - List Plans

**Description:** Retrieves a list of all inheritance plans associated with your partner account. Supports pagination and filtering.

**Query Parameters:**
*   `limit`: `integer` (Optional, default 10, max 100). Number of plans to return.
*   `starting_after`: `string` (Optional). A plan ID to start listing after (for pagination).
*   `user_id`: `string` (Optional). Filter plans by your internal user ID.
*   `status`: `string` (Optional). Filter plans by status (e.g., `active`, `triggered`, `recovered`).

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "plan_xyz789",
      "user_id": "user_abc123",
      "plan_name": "My Crypto Legacy Plan",
      "status": "active",
      "created_at": "2023-10-27T10:00:00Z",
      "last_checkin_at": "2023-10-28T15:30:00Z",
      "trigger_config": { /* ... */ }
    },
    {
      "id": "plan_def456",
      "user_id": "user_def456",
      "plan_name": "NFT Collection Plan",
      "status": "triggered",
      "created_at": "2023-09-01T08:00:00Z",
      "last_checkin_at": "2023-09-10T12:00:00Z",
      "trigger_config": { /* ... */ }
    }
  ],
  "has_more": true,
  "total_count": 25
}
```

**Error Codes:**
*   `401 Unauthorized`: `invalid_api_key`
*   `403 Forbidden`: `insufficient_permissions`
*   `400 Bad Request`: `invalid_parameter` (e.g., invalid `limit` value)

#### `GET /v1/partners/plans/{id}` - Get Plan

**Description:** Retrieves a specific inheritance plan by its ID.

**Path Parameters:**
*   `id`: `string` (Required). The ID of the plan to retrieve (e.g., `plan_xyz789`).

**Response (200 OK):**
```json
{
  "id": "plan_xyz789",
  "user_id": "user_abc123",
  "plan_name": "My Crypto Legacy Plan",
  "description": "Inheritance plan for my primary crypto assets.",
  "status": "active",
  "created_at": "2023-10-27T10:00:00Z",
  "updated_at": "2023-10-28T15:30:00Z",
  "last_checkin_at": "2023-10-28T15:30:00Z",
  "trigger_config": {
    "type": "inactivity",
    "inactivity_period_days": 180,
    "grace_period_days": 30,
    "notification_emails": ["user_abc123@example.com"],
    "next_trigger_check": "2024-04-25T10:00:00Z"
  },
  "metadata": {
    "wallet_type": "hardware",
    "network": "ethereum"
  }
}
```

**Error Codes:**
*   `401 Unauthorized`: `invalid_api_key`
*   `403 Forbidden`: `insufficient_permissions`
*   `404 Not Found`: `plan_not_found`

#### `PUT /v1/partners/plans/{id}` - Update Plan

**Description:** Updates an existing inheritance plan. You can modify its name, description, metadata, or trigger configuration.

**Path Parameters:**
*   `id`: `string` (Required). The ID of the plan to update.

**Request Body:**
```json
{
  "plan_name": "string",         // Optional. New name for the plan.
  "description": "string",       // Optional. New description for the plan.
  "metadata": {                  // Optional. Updates or adds to existing metadata.
    "new_key": "new_value"
  },
  "trigger_config": {            // Optional. Updates the trigger configuration.
    "type": "inactivity",        // Currently only 'inactivity' is supported.
    "inactivity_period_days": "integer", // Days of inactivity before grace period.
    "grace_period_days": "integer",      // Days of notification before trigger activates.
    "notification_emails": ["string"]    // Emails to notify during grace period.
  }
}
```

**Response (200 OK):**
Returns the updated plan object, similar to `GET /v1/partners/plans/{id}`.

**Error Codes:**
*   `400 Bad Request`: `invalid_parameter` (e.g., invalid `inactivity_period_days`)
*   `401 Unauthorized`: `invalid_api_key`
*   `403 Forbidden`: `insufficient_permissions`
*   `404 Not Found`: `plan_not_found`

### Heirs API

#### `POST /v1/partners/plans/{id}/heirs` - Add Heir

**Description:** Adds a new beneficiary (heir) to a specific inheritance plan.

**Path Parameters:**
*   `id`: `string` (Required). The ID of the plan to add the heir to.

**Request Body:**
```json
{
  "name": "string",              // Required. The heir's full name.
  "contact_email": "string",     // Required. The heir's email address for shard delivery/notifications.
  "share_percentage": "integer", // Optional. A percentage indicating their intended share (0-100).
  "shard_delivery_method": "string", // Required. How the shard will be delivered ('email' or 'secure_link').
  "metadata": {                  // Optional. Arbitrary key-value pairs for your internal use.
    "relationship": "string"
  }
}
```

**Response (201 Created):**
```json
{
  "id": "heir_abc123",
  "plan_id": "plan_xyz789",
  "name": "Alice Smith",
  "contact_email": "alice.smith@example.com",
  "share_percentage": 55,
  "shard_delivery_method": "email",
  "status": "pending_shard_delivery",
  "created_at": "2023-10-27T10:05:00Z",
  "updated_at": "2023-10-27T10:05:00Z",
  "metadata": {
    "relationship": "spouse"
  }
}
```

**Error Codes:**
*   `400 Bad Request`: `invalid_parameter` (e.g., missing `name`, `contact_email`, invalid `share_percentage`)
*   `401 Unauthorized`: `invalid_api_key`
*   `403 Forbidden`: `insufficient_permissions`
*   `404 Not Found`: `plan_not_found`

#### `DELETE /v1/partners/plans/{id}/heirs/{heir_id}` - Remove Heir

**Description:** Removes a beneficiary from a specific inheritance plan.

**Path Parameters:**
*   `id`: `string` (Required). The ID of the plan.
*   `heir_id`: `string` (Required). The ID of the heir to remove.

**Response (204 No Content):**
A successful deletion will return an empty response body with a `204 No Content` status.

**Error Codes:**
*   `401 Unauthorized`: `invalid_api_key`
*   `403 Forbidden`: `insufficient_permissions`
*   `404 Not Found`: `plan_not_found` or `heir_not_found`

### Triggers API

#### `POST /v1/partners/plans/{id}/checkin` - Check In

**Description:** Records a check-in for a specific plan, resetting its inactivity timer and preventing the trigger from activating. This should be called regularly by the user's application.

**Path Parameters:**
*   `id`: `string` (Required). The ID of the plan to check in for.

**Request Body:**
```json
{} // Empty object, or include optional metadata
```

**Response (200 OK):**
```json
{
  "plan_id": "plan_xyz789",
  "last_checkin_at": "2023-10-28T15:30:00Z",
  "message": "Check-in recorded successfully."
}
```

**Error Codes:**
*   `401 Unauthorized`: `invalid_api_key`
*   `403 Forbidden`: `insufficient_permissions`
*   `404 Not Found`: `plan_not_found`

#### `GET /v1/partners/plans/{id}/trigger` - Get Status

**Description:** Retrieves the current status of a plan's trigger, including its last check-in and estimated next trigger date.

**Path Parameters:**
*   `id`: `string` (Required). The ID of the plan.

**Response (200 OK):**
```json
{
  "plan_id": "plan_xyz789",
  "status": "active", // 'active', 'in_grace_period', 'triggered', 'recovered'
  "last_checkin_at": "2023-10-28T15:30:00Z",
  "inactivity_period_ends_at": "2024-04-25T10:00:00Z", // When inactivity period ends, grace period begins
  "grace_period_ends_at": "2024-05-25T10:00:00Z",     // When grace period ends, trigger activates
  "trigger_activated_at": null, // Timestamp if trigger has activated
  "recovery_initiated_at": null // Timestamp if recovery process has started
}
```

**Error Codes:**
*   `401 Unauthorized`: `invalid_api_key`
*   `403 Forbidden`: `insufficient_permissions`
*   `404 Not Found`: `plan_not_found`

---

## Webhooks

LegacyGuard uses webhooks to notify your application of important events related to your users' inheritance plans. This allows you to react to changes in real-time without constantly polling the API.

### Webhook Events

You can configure your webhook endpoint in the [LegacyGuard Developer Dashboard](https://dashboard.legacyguard.io/developer). We will send `POST` requests to your configured URL for the following events:

*   **`plan.created`**: A new inheritance plan has been successfully created.
*   **`heir.added`**: A new heir has been added to a plan.
*   **`checkin.recorded`**: A user has successfully checked in, resetting their inactivity timer.
*   **`trigger.activated`**: The inheritance trigger condition has been met (e.g., inactivity period and grace period have passed), and the shard distribution process has begun.
*   **`recovery.initiated`**: An heir has successfully initiated the shard recovery process.
*   **`recovery.completed`**: All necessary shards have been claimed and the recovery phrase has been reconstructed by the heirs.

### Webhook Payload Format

All webhook payloads are JSON objects and include common fields, plus an event-specific `data` object.

**Example Webhook Payload:**
```json
{
  "id": "evt_webhook_12345",
  "type": "trigger.activated",
  "created_at": "2023-11-01T14:00:00Z",
  "data": {
    "object": {
      "id": "plan_xyz789",
      "user_id": "user_abc123",
      "plan_name": "My Crypto Legacy Plan",
      "status": "triggered",
      "trigger_activated_at": "2023-11-01T14:00:00Z",
      "trigger_config": {
        "type": "inactivity",
        "inactivity_period_days": 180,
        "grace_period_days": 30
      },
      "heirs": [
        {
          "id": "heir_abc123",
          "name": "Alice Smith",
          "contact_email": "alice.smith@example.com",
          "shard_delivery_method": "email",
          "status": "shard_sent"
        },
        {
          "id": "heir_def456",
          "name": "Bob Johnson",
          "contact_email": "bob.johnson@example.com",
          "shard_delivery_method": "secure_link",
          "status": "shard_sent"
        }
      ]
    }
  },
  "api_version": "v1"
}
```
The `data.object` will contain the relevant resource (e.g., a `plan` object for `plan.created` or `trigger.activated` events, or an `heir` object for `heir.added` events).

### Signature Verification

To ensure the authenticity and integrity of incoming webhooks, LegacyGuard signs each payload with a unique secret key. You **must** verify these signatures in your application.

1.  **Retrieve your Webhook Secret:** Find your webhook secret in the "Webhooks" section of your [LegacyGuard Developer Dashboard](https://dashboard.legacyguard.io/developer).
2.  **Extract the Signature Header:** Each webhook request includes an `X-LegacyGuard-Signature` header. This header contains a timestamp (`t=`) and one or more signatures (`v1=`).
    Example: `t=1677606412,v1=a1b2c3d4e5f6...`
3.  **Construct the Signed Payload:** Concatenate the timestamp (as a string), a dot (`.`), and the raw JSON payload body.
    `signed_payload = timestamp + "." + raw_payload_body`
4.  **Compute the HMAC-SHA256 Signature:** Using your webhook secret as the key, compute the HMAC-SHA256 hash of the `signed_payload`.
5.  **Compare Signatures:** Compare your computed signature with the `v1` signature provided in the `X-LegacyGuard-Signature` header. If they match, the webhook is valid.

**Example (Conceptual Python):**
```python
import hmac
import hashlib
import time

WEBHOOK_SECRET = "whsec_YOUR_WEBHOOK_SECRET" # Get this from your dashboard

def verify_webhook_signature(payload, signature_header, secret):
    try:
        t_part, v1_part = signature_header.split(',')
        timestamp = int(t_part.split('=')[1])
        signature = v1_part.split('=')[1]
    except (ValueError, IndexError):
        raise ValueError("Invalid signature header format.")

    # 1. Check timestamp to prevent replay attacks (e.g., within 5 minutes)
    if abs(time.time() - timestamp) > 300: # 5 minutes
        raise ValueError("Webhook timestamp is too old or too far in the future.")

    # 2. Construct the signed payload string
    signed_payload = f"{timestamp}.{payload}"

    # 3. Compute the HMAC-SHA256 signature
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        signed_payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

    # 4. Compare signatures
    if not hmac.compare_digest(expected_signature, signature):
        raise ValueError("Webhook signature mismatch.")

    return True

# Example usage in a Flask/Django/FastAPI route:
# @app.route('/webhook', methods=['POST'])
# def handle_webhook():
#     raw_payload = request.get_data(as_text=True)
#     signature_header = request.headers.get('X-LegacyGuard-Signature')
#
#     try:
#         verify_webhook_signature(raw_payload, signature_header, WEBHOOK_SECRET)
#         event = json.loads(raw_payload)
#         print(f"Received verified webhook of type: {event['type']}")
#         # Process event...
#         return jsonify({"status": "success"}), 200
#     except ValueError as e:
#         print(f"Webhook verification failed: {e}")
#         return jsonify({"status": "error", "message": str(e)}), 400
```

---

## SDKs

LegacyGuard provides official SDKs to simplify integration with our API in popular programming languages.

### Python SDK

The LegacyGuard Python SDK provides a convenient way to interact with our API.

**Installation:**
```bash
pip install legacyguard
```

**Example Usage:**
```python
from legacyguard import LegacyGuardClient
from legacyguard.models import CreatePlanRequest, AddHeirRequest, TriggerConfig

# Initialize the client with your API key
client = LegacyGuardClient(api_key="lg_sk_test_YOUR_UNIQUE_TEST_KEY")

# 1. Create a Plan
try:
    create_plan_req = CreatePlanRequest(
        user_id="user_sdk_python_123",
        plan_name="Python SDK Test Plan",
        description="Plan created via Python SDK",
        metadata={"source": "python_sdk"}
    )
    plan = client.plans.create_plan(create_plan_req)
    print(f"Created Plan: {plan.id} - {plan.plan_name}")

    # 2. Add Heirs
    add_heir_alice_req = AddHeirRequest(
        name="Alice Python",
        contact_email="alice.python@example.com",
        share_percentage=60,
        shard_delivery_method="email",
        metadata={"relationship": "partner"}
    )
    heir_alice = client.heirs.add_heir(plan_id=plan.id, request=add_heir_alice_req)
    print(f"Added Heir: {heir_alice.id} - {heir_alice.name}")

    add_heir_bob_req = AddHeirRequest(
        name="Bob Python",
        contact_email="bob.python@example.com",
        share_percentage=40,
        shard_delivery_method="secure_link",
        metadata={"relationship": "friend"}
    )
    heir_bob = client.heirs.add_heir(plan_id=plan.id, request=add_heir_bob_req)
    print(f"Added Heir: {heir_bob.id} - {heir_bob.name}")

    # 3. Configure Trigger
    trigger_config = TriggerConfig(
        type="inactivity",
        inactivity_period_days=90,
        grace_period_days=15,
        notification_emails=["user_sdk_python_123@example.com"]
    )
    updated_plan = client.plans.update_plan(plan_id=plan.id, trigger_config=trigger_config)
    print(f"Configured Trigger for Plan {updated_plan.id}. Inactivity: {updated_plan.trigger_config.inactivity_period_days} days.")

    # 4. Check In
    checkin_response = client.triggers.check_in(plan_id=plan.id)
    print(f"Check-in recorded for Plan {checkin_response.plan_id} at {checkin_response.last_checkin_at}")

    # 5. Get Plan Status
    plan_status = client.triggers.get_trigger_status(plan_id=plan.id)
    print(f"Plan {plan_status.plan_id} status: {plan_status.status}")

except Exception as e:
    print(f"An error occurred: {e}")
```

### Node.js SDK

The LegacyGuard Node.js SDK simplifies API interactions in your JavaScript/TypeScript applications.

**Installation:**
```bash
npm install @legacyguard/sdk