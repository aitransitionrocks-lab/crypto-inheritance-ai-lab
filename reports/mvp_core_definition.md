# MVP Core Definition

## Core User (ONE segment only)
**Self-custody crypto holders with >$10K in crypto who have family/heirs. Age 30-55, technically competent enough to use a hardware wallet. They KNOW they should plan inheritance but have not because no good solution exists.**

This segment represents the ideal early adopter. They have a significant financial incentive (>$10K in crypto) to solve the inheritance problem, making the pain point acute. Their technical competence (hardware wallet users) indicates they understand the nuances of self-custody and the inherent risks of losing keys. Crucially, they are aware of the problem and actively seeking a solution, but are currently stymied by the lack of secure, private, and user-friendly options that don't compromise their self-custody principles. Targeting this group minimizes education efforts and maximizes the likelihood of finding users who will appreciate the core value proposition.

## Core Problem (1 sentence)
**If you die tomorrow, your family loses access to your crypto forever.**

This problem is stark and irreversible. Unlike traditional assets where wills and legal frameworks exist, self-custodied crypto can be permanently lost if the owner's private keys or recovery phrases are not securely passed on. This creates immense anxiety for crypto holders and potentially devastating financial and emotional consequences for their heirs, who often have no technical means to recover the assets. The core challenge is bridging the gap between digital asset security and real-world human mortality.

## Core Value Proposition (1 sentence)
**LegacyGuard ensures your crypto reaches your family — without trusting anyone with your keys.**

This value proposition directly addresses the core problem while honoring the fundamental principle of self-custody that crypto holders cherish. LegacyGuard acts as a secure, private, and automated notification system, not a custodian. It provides a mechanism for the user to define their inheritance plan and trigger its execution upon their confirmed inactivity, all without the user ever having to upload or reveal their sensitive private keys or seed phrases to LegacyGuard or any third party. The "without trusting anyone with your keys" aspect is paramount for this user segment.

## MVP Flow (5 steps ONLY)
The user journey is designed to be as streamlined and intuitive as possible, focusing solely on the core task of setting up an inheritance plan.

1.  **Step 1: Sign up (email + password, 30 seconds)**
    *   **User Action:** Enters email and chooses a password.
    *   **System Action:** Creates account, sends verification email.
    *   **Rationale:** Low-friction entry point, familiar to all users, establishes user identity.
2.  **Step 2: Create vault (name it, enter wallet addresses)**
    *   **User Action:** Names their "vault" (e.g., "Main Crypto Holdings"), optionally lists the public addresses of their crypto wallets.
    *   **System Action:** Stores vault name and addresses (for user's reference, not for interaction).
    *   **Rationale:** Provides a mental container for their assets; wallet addresses are for user's organizational purposes and do not imply any on-chain interaction by LegacyGuard.
3.  **Step 3: Add 1 heir (name + email)**
    *   **User Action:** Enters the name and email address of a single designated heir.
    *   **System Action:** Stores heir's contact information.
    *   **Rationale:** Simplifies the heir management logic to the absolute minimum required for a functional inheritance plan.
4.  **Step 4: Set dead man's switch (inactivity period: 90/180/365 days)**
    *   **User Action:** Selects a period of inactivity (e.g., 90 days) after which the system should initiate the inheritance process.
    *   **System Action:** Configures the timer for the user's account.
    *   **Rationale:** Establishes the core trigger mechanism for the "dead man's switch." Limited options simplify choice.
5.  **Step 5: First check-in (confirm you are alive)**
    *   **User Action:** Clicks a "confirm alive" button on the dashboard or in an email.
    *   **System Action:** Resets the inactivity timer.
    *   **Rationale:** Immediately engages the core functionality, reinforces the "dead man's switch" concept, and ensures the user understands how to interact with the system.

## What is IN the MVP
The included features are strictly limited to what is essential to deliver the core value proposition and validate the problem/solution fit.

*   **Email auth:** Standard, secure, and widely understood authentication method. It minimizes friction during signup and provides a reliable channel for communication.
*   **Single vault:** Simplifies the user interface and backend logic, focusing on the primary use case of a single set of assets.
*   **Single heir:** Reduces complexity in heir management, notification flows, and legal considerations for the initial release.
*   **Inactivity-based trigger (simple timer):** The most straightforward implementation of a "dead man's switch," relying purely on user engagement (or lack thereof).
*   **Email check-in reminders:** The primary mechanism for users to confirm activity and reset their timer, and for the system to notify heirs if the trigger is activated.
*   **Basic dashboard (status, next check-in):** Provides the user with immediate feedback on their setup, current status (active/pending trigger), and the date of their next required check-in. This builds trust and clarity.
*   **Encrypted instructions storage (text field):** A critical component where the user can securely store *instructions* for their heir (e.g., "My seed phrase is in the safe deposit box at XYZ Bank," or "Look for a encrypted file named 'crypto_keys.txt' on my hard drive, password is..."). LegacyGuard encrypts and stores this text, and delivers it to the heir upon trigger. It never handles actual keys or seed phrases directly.

## What is EXPLICITLY OUT
These exclusions are critical for maintaining focus, minimizing development time, and avoiding scope creep. Each represents significant complexity that is not essential for the core MVP.

*   **Multiple vaults, multiple heirs:** Adds significant complexity to UI, backend data models, notification logic, and potential legal considerations.
*   **On-chain anything:** Integrating with blockchains (e.g., smart contracts, transaction monitoring) is a massive undertaking, introduces gas fees, and is not required for a notification-based dead man's switch.
*   **Shamir key splitting (phase 2):** While a powerful feature for crypto inheritance, it's highly complex to implement securely and correctly. It would be a significant feature for a later phase, not an AMVP.
*   **Video verification:** Adds KYC-like complexity, privacy concerns, and technical overhead (video processing, storage, AI/human review) that is unnecessary for the MVP's core function.
*   **Mobile app:** Developing native mobile applications doubles the development effort. A responsive web app is sufficient for the MVP.
*   **Partner API:** Integrations with other services would be a future growth strategy, not an MVP requirement.
*   **Payments/billing:** The MVP will be free to use, removing the need for payment gateway integration, subscription management, and related complexities. This allows focus on user acquisition and validation.
*   **KYC:** Identity verification adds regulatory burden, significant development time, and privacy concerns that are outside the scope of a simple inheritance notification service.

## Success Metric
**50 users complete full setup (vault + heir + trigger) within first 30 days.**

This metric is highly focused on activation and demonstrates that users not only sign up but also understand and complete the core value-delivering flow. It validates the product's ability to solve the core problem for a small but meaningful group of early adopters. Achieving this target would indicate strong product-market fit for the specified core user segment and warrant further investment. It's a pragmatic goal for a highly niche and sensitive problem.

## Technical Stack
**Next.js + Supabase (auth + DB + edge functions). Deploy on Vercel. Zero infrastructure management.**

This stack is chosen for its developer velocity, scalability for early stages, and minimal operational overhead.
*   **Next.js:** Provides a robust framework for building fast, modern web applications with server-side rendering capabilities, improving performance and SEO.
*   **Supabase:** Offers a powerful, open-source alternative to Firebase, providing authentication, a PostgreSQL database, and edge functions in a single, integrated platform. This significantly reduces the need for separate services and simplifies development.
*   **Vercel:** Optimized for Next.js deployments, Vercel provides seamless continuous deployment, global CDN, and serverless functions without requiring any infrastructure management from the developer.
*   **Zero infrastructure management:** This is a critical advantage, allowing the small team (or single developer) to focus 100% on product features and user experience rather than server maintenance, scaling, or security patching.

## Build Timeline
**Total: 1 developer, 7 days.**

This aggressive timeline is achievable due to the absolute minimum scope, the chosen developer-friendly tech stack, and the focus of a single, experienced developer.
*   **Day 1-3: Auth + vault setup + heir:** Focus on the core user data model and the initial signup/onboarding flow. This includes email authentication, basic user profile, and the ability to create a vault and add one heir's details.
*   **Day 4-5: Trigger logic + check-in:** Implement the inactivity timer, the logic for resetting it upon check-in, and the initial notification framework for check-in reminders.
*   **Day 6-7: Dashboard + email notifications:** Build the basic user dashboard displaying status and next check-in. Integrate email services for check-in reminders and, crucially, for the heir notification if the trigger is activated. Finalize the encrypted instructions storage and retrieval mechanism for heirs.

This lean timeline emphasizes rapid iteration and getting a functional product into users' hands quickly to gather feedback.
