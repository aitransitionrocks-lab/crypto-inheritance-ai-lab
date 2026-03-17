# Partner Integration Guide

**Generated:** 2026-03-17

---

# LegacyGuard Partner Integration Guide

Welcome to the LegacyGuard Partner Program! This guide provides a comprehensive, step-by-step walkthrough for integrating LegacyGuard's secure digital inheritance and asset protection services into your platform. By partnering with LegacyGuard, you empower your users with unparalleled control over their digital legacy, ensuring their critical information is securely passed on according to their wishes, without ever compromising their privacy.

Our non-custodial architecture is at the heart of our offering, guaranteeing that neither LegacyGuard nor our partners ever have access to user's sensitive key material. This guide will walk you through the technical and operational aspects of building a seamless, secure, and trustworthy integration.

## Architecture Overview

LegacyGuard's architecture is designed for maximum security and user control, built upon a non-custodial principle.

**Diagram description:**

```
+-----------------+       HTTPS       +-----------------+       HTTPS       +-----------------+
|   Partner App   | <---------------> | LegacyGuard API | <---------------> |  User's Device  |
| (Web/Mobile UI) |                   | (Metadata Mgmt) |                   | (Key Generation,|
|                 |                   |                 |                   |  Shard Storage) |
+-----------------+                   +-----------------+                   +-----------------+
        ^                                     ^                                     ^
        |                                     |                                     |
        |  User Interaction (Vault Setup,     |  Metadata (Vault IDs, Share IDs,    |  Sensitive Data (Master Key,
        |  Heir Mgmt, Check-ins)              |  Public Keys, Trigger Config)       |  Key Shares, Decryption)
        |                                     |                                     |
        +-------------------------------------+-------------------------------------+
```

**Non-custodial flow:**

1.  **Client-Side Key Generation:** When a user sets up a "Vault" within your Partner App, their master encryption key is *generated directly on their device* (e.g., browser, mobile app). This key never leaves the user's device in its complete form.
2.  **Shamir's Secret Sharing (SSS):** The master key is immediately split into multiple "shares" using Shamir's Secret Sharing algorithm. For example, a user might choose to split their key into 5 shares, requiring any 3 to reconstruct it (a 3-of-5 scheme).
3.  **Distributed Share Storage:** These individual shares are then distributed. Some might be stored locally on the user's device, others with designated heirs, and potentially one encrypted share sent to LegacyGuard for secure, encrypted storage (only if explicitly opted-in by the user, and even then, it's an encrypted share, not the full key).
4.  **Metadata to API:** Only *metadata* related to the vault (e.g., vault ID, public key derived from the master key, share IDs, heir details, trigger configurations, check-in timestamps) is sent to the LegacyGuard API. This metadata allows LegacyGuard to manage the inheritance logic (e.g., track inactivity, notify heirs) without ever possessing the actual decryption key.
5.  **Heir Activation:** Upon trigger (e.g., inactivity period, manual activation), LegacyGuard notifies designated heirs. Heirs then use their received shares (and potentially retrieve an encrypted share from LegacyGuard) to reconstruct the master key *on their own device*, granting them access to the user's encrypted assets.

**What data the partner sends vs what stays local:**

*   **Partner App sends to LegacyGuard API:**
    *   Vault creation requests (containing a unique Vault ID, public key, configuration for SSS, heir details, trigger conditions).
    *   Updates to heir information (names, contact details, share assignments).
    *   Check-in notifications from the user.
    *   Requests for vault status or heir notification status.
    *   User authentication tokens for API calls.
*   **User's Device keeps local:**
    *   The master encryption key (never leaves the device).
    *   Individual key shares (until securely distributed to heirs or other storage).
    *   Decrypted content of the vault.
    *   User's private authentication credentials.

## Integration Types

LegacyGuard offers flexible integration options to suit your platform's needs and desired level of control.

### Type A: API Integration (Simplest)

Integrate directly with LegacyGuard's RESTful API. Your application handles the UI/UX, key generation, and share distribution, while LegacyGuard manages the backend logic for vault metadata, heir management, and trigger activation.

*   **Effort:** Low
*   **Timeline:** 1-2 Weeks
*   **Customization Level:** High (full control over UI/UX)
*   **Example Code (Conceptual):**
    ```javascript
    // Partner App (Client-side)
    async function createLegacyGuardVault(userId, heirDetails, triggerConfig) {
        // 1. Generate master key client-side
        const masterKey = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
        const masterKeyExport = await crypto.subtle.exportKey("raw", masterKey);

        // 2. Split key using SSS (e.g., 3-of-5 scheme)
        const shares = splitSecret(masterKeyExport, 5, 3); // Pseudocode for SSS library

        // 3. Store one share locally, distribute others to heirs (off-platform or via secure channels)
        //    For simplicity, let's assume we send share metadata to LG API.
        const shareMetadata = shares.map((share, index) => ({ id: `share-${index+1}`, holder: heirDetails[index]?.id || 'local' }));

        // 4. Derive public key for vault identification
        const publicKey = await crypto.subtle.exportKey("jwk", masterKey); // Example: using JWK for public key representation

        // Partner App (Server-side or direct client-to-API)
        const response = await fetch('https://api.legacyguard.com/v1/vaults', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${LEGACYGUARD_API_KEY}`
            },
            body: JSON.stringify({
                userId: userId,
                vaultId: generateUniqueId(), // Your unique ID for this vault
                publicKey: publicKey, // Public key for vault identification
                heirs: heirDetails.map(heir => ({
                    name: heir.name,
                    email: heir.email,
                    shareId: heir.assignedShareId // Link heir to a specific share ID
                })),
                trigger: triggerConfig,
                shareScheme: { total: 5, required: 3 } // SSS configuration
            })
        });
        const data = await response.json();
        console.log('Vault created:', data.vaultId);
        return data.vaultId;
    }
    ```

### Type B: SDK Embed (Recommended)

Utilize LegacyGuard's client-side SDK (JavaScript, iOS, Android) to streamline key generation, SSS, and interaction with the LegacyGuard API. This reduces development effort and ensures best practices for security and user experience.

*   **Effort:** Medium
*   **Timeline:** 2-4 Weeks
*   **Customization Level:** Moderate (SDK provides UI components or headless functions)
*   **Example Code (Conceptual):**
    ```javascript
    // Partner App (Client-side with LegacyGuard SDK)
    import LegacyGuardSDK from '@legacyguard/sdk';

    async function setupLegacyGuardVaultWithSDK(userId, heirDetails, triggerConfig) {
        const lg = new LegacyGuardSDK({ apiKey: LEGACYGUARD_API_KEY, userId: userId });

        // SDK handles key generation, SSS, and sending metadata to API
        const vault = await lg.createVault({
            heirs: heirDetails.map(heir => ({
                name: heir.name,
                email: heir.email,
                // SDK can manage share distribution or provide share data for partner to distribute
            })),
            trigger: triggerConfig,
            shareScheme: { total: 5, required: 3 },
            // Optional: UI component for shard visualization
            uiOptions: { showShardVisualization: true, targetElementId: 'shard-viz-container' }
        });

        console.log('Vault created via SDK:', vault.id);
        return vault.id;
    }
    ```

### Type C: White-Label (Deepest)

For partners seeking the most integrated experience, LegacyGuard offers a white-label solution. This involves embedding LegacyGuard's core logic and UI components directly into your application, allowing for a fully branded and seamless user journey. This option typically requires closer collaboration with the LegacyGuard team.

*   **Effort:** High
*   **Timeline:** 1-3 Months
*   **Customization Level:** Extensive (full branding, deep UI/UX integration)
*   **Example Code (Conceptual):**
    ```html
    <!-- Partner App (HTML with White-Label Component) -->
    <div id="legacyguard-onboarding-container"></div>

    <script>
        // Partner App (JavaScript)
        import { LegacyGuardWhiteLabel } from '@legacyguard/white-label';

        const lgWhiteLabel = new LegacyGuardWhiteLabel({
            targetElement: 'legacyguard-onboarding-container',
            apiKey: LEGACYGUARD_API_KEY,
            userId: CURRENT_USER_ID,
            theme: {
                primaryColor: '#007bff',
                fontFamily: 'Inter, sans-serif'
            },
            onVaultCreated: (vaultId) => {
                console.log('White-label vault created:', vaultId);
                // Redirect user or update UI
            },
            onVaultError: (error) => {
                console.error('White-label error:', error);
                // Display error message
            }
        });

        lgWhiteLabel.renderVaultSetup(); // Renders the full setup flow within your container
    </script>
    ```

## Step-by-Step Integration

This section outlines the core steps for integrating with LegacyGuard, applicable to all integration types with varying levels of direct API interaction.

### Step 1: Register as Partner

1.  **Apply Online:** Complete the LegacyGuard Partner Application form on our website.
2.  **Agreement:** Review and sign the LegacyGuard Partner Agreement and Data Processing Agreement (DPA).
3.  **Onboarding Call:** Schedule an initial call with our Partner Success team to discuss your integration goals and receive an introduction to the LegacyGuard platform.
4.  **Access Partner Portal:** Gain access to the LegacyGuard Partner Portal for managing your applications, viewing analytics, and accessing documentation.

### Step 2: Get API Credentials

1.  **Create Application:** Within the Partner Portal, create a new application for your integration.
2.  **Generate API Keys:** The portal will provide you with:
    *   **`LEGACYGUARD_API_KEY`**: A public key for identifying your application.
    *   **`LEGACYGUARD_API_SECRET`**: A private secret key for authenticating server-side requests. Keep this secure.
    *   **Sandbox Credentials**: Separate credentials for our testing environment.
3.  **Configure Webhook Endpoint:** Provide the URL for your webhook endpoint in the Partner Portal. This is crucial for receiving real-time event notifications from LegacyGuard.

### Step 3: Implement Vault Setup Flow

This is the most critical step, establishing the user's secure digital vault.

1.  **Client-Side Key Generation:**
    *   **Requirement:** Your client-side application (web browser, mobile app) must generate a strong, cryptographically secure master key.
    *   **Recommendation:** Use browser's Web Crypto API (`crypto.subtle`) or platform-specific secure key generation (e.g., iOS Keychain, Android Keystore).
    *   **Example (Pseudocode - Web Crypto API):**
        ```javascript
        async function generateMasterKey() {
            const key = await crypto.subtle.generateKey(
                { name: "AES-GCM", length: 256 }, // Algorithm: AES-256 GCM
                true, // Exportable
                ["encrypt", "decrypt"] // Usages
            );
            return key;
        }
        ```
2.  **Split Key with SSS:**
    *   **Requirement:** Implement Shamir's Secret Sharing to split the generated master key into `N` shares, requiring `M` shares to reconstruct (`M-of-N` scheme).
    *   **Recommendation:** Use a well-vetted SSS library (e.g., `secrets.js` for JavaScript, or a native library for mobile).
    *   **Example (Pseudocode - SSS):**
        ```javascript
        import { split, combine } from 'secrets.js-grempe'; // Example library

        async function splitAndDistributeKey(masterKey, totalShares, requiredShares) {
            const exportedKey = await crypto.subtle.exportKey("raw", masterKey);
            const hexKey = Array.from(new Uint8Array(exportedKey)).map(b => b.toString(16).padStart(2, '0')).join('');

            const shares = split(hexKey, totalShares, requiredShares); // Returns an array of hex strings

            // Each share needs to be securely stored/distributed.
            // For example, one share locally, others sent to heirs via secure channels.
            // If using LegacyGuard for encrypted share storage, send the encrypted share to LG API.
            return shares;
        }
        ```
3.  **Send Metadata to API:**
    *   **Requirement:** After key generation and splitting, send *only* the vault metadata (not the key or shares) to the LegacyGuard API.
    *   **API Endpoint:** `POST /v1/vaults`
    *   **Payload:**
        *   `userId`: Your internal user ID.
        *   `vaultId`: A unique ID generated by your system for this vault.
        *   `publicKey`: A public key derived from the master key (e.g., JWK format) for vault identification and potential future encryption of metadata.
        *   `shareScheme`: `{ total: N, required: M }`
        *   `heirs`: An array of heir objects (name, email, `shareId` if you're managing share distribution).
        *   `triggerConfig`: Initial trigger settings (e.g., inactivity period).
    *   **Example (API Integration):** See Type A example code above.

### Step 4: Implement Heir Management

Allow users to add, modify, or remove designated heirs for their vault.

*   **API Endpoint:**
    *   `POST /v1/vaults/{vaultId}/heirs`: Add a new heir.
    *   `PUT /v1/vaults/{vaultId}/heirs/{heirId}`: Update an existing heir.
    *   `DELETE /v1/vaults/{vaultId}/heirs/{heirId}`: Remove an heir.
*   **Payload:** Heir details (name, email, contact info), and potentially which `shareId` they are assigned if you manage share distribution. LegacyGuard will manage the notification process.

### Step 5: Implement Trigger Configuration

Enable users to define the conditions under which their vault will be activated and heirs notified.

*   **API Endpoint:** `PUT /v1/vaults/{vaultId}/trigger`
*   **Payload:**
    *   `type`: `inactivity` or `manual`.
    *   `inactivityPeriodDays`: (If `type` is `inactivity`) e.g., 90, 180, 365.
    *   `checkinFrequencyDays`: (If `type` is `inactivity`) How often reminders are sent.
    *   `manualActivationEnabled`: Boolean.
    *   `manualActivationInstructions`: Text for manual activation.

### Step 6: Implement Check-in Flow

For vaults configured with an inactivity trigger, users need a way to "check-in" to reset their inactivity timer.

*   **API Endpoint:** `POST /v1/vaults/{vaultId}/checkin`
*   **Payload:** `userId` (for verification).
*   **UI/UX:** Provide a clear "Check-in" button or automatic check-in mechanism within your application.

### Step 7: Handle Webhooks

LegacyGuard will send real-time notifications to your configured webhook endpoint for important events.

*   **Endpoint:** Your URL provided in Step 2.
*   **Security:** Verify webhook signatures using the `LEGACYGUARD_WEBHOOK_SECRET` (provided in Partner Portal) to ensure authenticity.
*   **Events to Handle:**
    *   `vault.activated`: A user's vault has been activated (e.g., due to inactivity or manual trigger).
    *   `heir.notified`: An heir has been notified about a vault activation.
    *   `heir.claimed`: An heir has successfully claimed their share/access to a vault.
    *   `vault.checkin_reminder`: A reminder has been sent to the user to check-in.
    *   `vault.status_update`: General status changes for a vault.
*   **Response:** Your endpoint should respond with a `200 OK` to acknowledge receipt.

### Step 8: Test in Sandbox

Thoroughly test your integration in the LegacyGuard Sandbox environment.

*   **Use Sandbox Credentials:** Ensure you're using your sandbox API keys and secrets.
*   **Simulate Scenarios:**
    *   Vault creation, updates, deletion.
    *   Heir management (add, update, remove).
    *   Trigger configuration.
    *   User check-ins.
    *   Simulate inactivity and vault activation (Sandbox may have accelerated timelines for this).
    *   Verify webhook reception and processing for all relevant events.
*   **Monitor Logs:** Use the Partner Portal to review API calls and webhook deliveries.

### Step 9: Security Review Checklist

Before going live, conduct a comprehensive security review.

*   **Secure API Key Storage:** Ensure `LEGACYGUARD_API_SECRET` is stored securely on your backend, never client-side.
*   **HTTPS/TLS 1.3:** All communication with LegacyGuard APIs and webhooks must use HTTPS with TLS 1.3.
*   **Input Validation:** Validate all data sent to LegacyGuard APIs to prevent injection attacks.
*   **Rate Limiting:** Implement rate limiting on your API calls to LegacyGuard to prevent abuse.
*   **Error Handling:** Gracefully handle API errors and network failures.
*   **Audit Logs:** Maintain detailed audit logs of all interactions with LegacyGuard APIs.
*   **Client-Side Security:**
    *   Ensure client-side key generation uses cryptographically secure random number generators.
    *   Protect key shares generated client-side from unauthorized access before distribution.
    *   Avoid storing sensitive key material in browser local storage or insecure locations.
*   **Webhook Signature Verification:** Crucial for verifying the authenticity of incoming webhooks.

### Step 10: Go Live

Once testing is complete and security reviews passed:

1.  **Production Credentials:** Switch to your production `LEGACYGUARD_API_KEY` and `LEGACYGUARD_API_SECRET`.
2.  **Production Webhook:** Ensure your production webhook endpoint is configured and accessible.
3.  **Monitoring:** Implement robust monitoring for your integration, including API call success rates, webhook processing, and user feedback.
4.  **Launch Announcement:** Coordinate with LegacyGuard for any joint marketing or launch announcements.

## Trust Signals for Partner UI

Building user trust is paramount, especially with sensitive services like digital inheritance. Integrate these trust signals into your UI:

*   **'Powered by LegacyGuard' Badge:**
    *   **Purpose:** Clearly indicates that a trusted, specialized service is handling the inheritance logic.
    *   **Placement:** Near the vault setup, heir management, or check-in features.
    *   **Guidelines:** Use official LegacyGuard branding assets (available in Partner Portal).
*   **Non-custodial Proof Messaging:**
    *   **Purpose:** Reassure users that their sensitive data (master key) is never held by LegacyGuard or the partner.
    *   **Suggested Messaging:**
        *   "Your digital legacy, secured by LegacyGuard's non-custodial architecture. We never hold your master key."
        *   "LegacyGuard ensures your privacy: your encryption key is generated and split on your device, never stored by us."
        *   "You retain full control. LegacyGuard only manages the rules for your inheritance, not your sensitive data."
    *   **Placement:** During vault setup, in FAQs, or on a dedicated security page.
*   **Shard Visualization Component (Embeddable):**
    *   **Purpose:** Visually explain the Shamir's Secret Sharing process, making it tangible and understandable for users.
    *   **Description:** An interactive widget (available via SDK or white-label) that shows the user's master key being split into `N` shares, and highlights how `M` shares are needed to reconstruct it. It can visually represent where each share is designated (e.g., "Local Device," "Heir A," "Heir B").
    *   **Placement:** During the vault setup flow, especially when defining the `M-of-N` scheme and assigning heirs.

## Technical Requirements

To ensure a secure and reliable integration, your platform must meet the following technical standards:

*   **HTTPS, TLS 1.3:** All communication between your application and LegacyGuard APIs, and for webhook callbacks, must be secured using HTTPS with a minimum of TLS 1.3.
*   **Webhook Endpoint for Events:**
    *   Your system must provide a publicly accessible, highly available, and secure HTTPS endpoint capable of receiving and processing POST requests from LegacyGuard.
    *   The endpoint must be able to verify webhook signatures using the provided secret.
    *   It should respond with a `200 OK` within 5 seconds to acknowledge receipt.
*   **Client-Side Key Generation Capability:**
    *   Your client application (web browser, iOS, Android) must have the capability to generate cryptographically strong symmetric keys (e.g., AES-256) using secure, platform-native cryptographic APIs (e.g., Web Crypto API, iOS CommonCrypto, Android Keystore).
    *   The client must also be able to perform Shamir's Secret Sharing on these keys.

## Compliance Requirements

LegacyGuard is committed to the highest standards of security and privacy. Partners are expected to adhere to the following:

*   **Non-custodial Architecture Proof:**
    *   Partners must be able to demonstrate and attest that their integration adheres to the non-custodial principles, specifically that no sensitive user key material (master key or unencrypted shares) is ever stored or transmitted by the partner's servers.
    *   This may involve providing architectural diagrams and code snippets for review.
*   **Security Audit (Annual):**
    *   Partners are required to undergo an annual security audit of their systems and integration points relevant to LegacyGuard services.
    *   Audit reports must be shared with LegacyGuard upon request.
*   **Data Processing Agreement (DPA):**
    *   A signed Data Processing Agreement (DPA) is mandatory, outlining the responsibilities and obligations of both parties regarding the processing of personal data in compliance with relevant regulations (e.g., GDPR, CCPA).

We look forward to a successful partnership and empowering your users with the peace of mind that comes from a secure digital legacy. If you have any questions, please contact your LegacyGuard Partner Success Manager.